import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

declare const Bun: {
	JSONC: {
		parse(value: string): unknown;
	};
};

type DependencyRelationship = "direct" | "indirect";
type DependencyScope = "development" | "runtime";

interface SnapshotMetadata {
	sha: string;
	ref: string;
	jobId: string;
	jobCorrelator: string;
	jobUrl: string;
	detectorUrl: string;
	scanned: string;
}

interface ResolvedDependency {
	package_url: string;
	relationship: DependencyRelationship;
	scope: DependencyScope;
	dependencies: string[];
}

interface DependencySnapshot {
	version: 0;
	sha: string;
	ref: string;
	job: {
		id: string;
		correlator: string;
		html_url: string;
	};
	detector: {
		name: string;
		version: string;
		url: string;
	};
	scanned: string;
	manifests: {
		"bun.lock": {
			name: string;
			file: {
				source_location: string;
			};
			resolved: Record<string, ResolvedDependency>;
		};
	};
}

interface BunPackage {
	name: string;
	version: string;
	dependencyNames: string[];
	requiredPeerDependencyNames: string[];
	optionalPeerDependencyNames: string[];
}

interface BunLock {
	runtimeDependencyNames: string[];
	developmentDependencyNames: string[];
	packages: Map<string, BunPackage>;
}

interface MutableResolvedDependency {
	packageUrl: string;
	relationship: DependencyRelationship;
	scope: DependencyScope;
	dependencies: Set<string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireRecord(value: unknown, path: string): Record<string, unknown> {
	if (!isRecord(value)) throw new Error(`${path} must be an object`);
	return value;
}

function parseStringRecord(
	value: unknown,
	path: string,
): Record<string, string> {
	if (value === undefined) return {};

	const record = requireRecord(value, path);
	const entries: Array<[string, string]> = [];
	for (const [name, requirement] of Object.entries(record)) {
		if (typeof requirement !== "string" || requirement.length === 0) {
			throw new Error(`${path}.${name} must be a non-empty string`);
		}
		entries.push([name, requirement]);
	}
	return Object.fromEntries(entries);
}

function parseStringArray(value: unknown, path: string): string[] {
	if (value === undefined) return [];
	if (!Array.isArray(value)) throw new Error(`${path} must be an array`);

	const entries = value.map((entry, index) => {
		if (typeof entry !== "string" || entry.length === 0) {
			throw new Error(`${path}[${index}] must be a non-empty string`);
		}
		return entry;
	});
	return [...new Set(entries)].sort();
}

function parseNpmResolution(
	resolution: string,
	packageKey: string,
): {
	name: string;
	version: string;
} {
	const separator = resolution.lastIndexOf("@");
	if (separator <= 0 || separator === resolution.length - 1) {
		throw new Error(`bun.lock package ${packageKey} is not an npm resolution`);
	}

	const name = resolution.slice(0, separator);
	const version = resolution.slice(separator + 1);
	if (
		version.startsWith("file:") ||
		version.startsWith("git+") ||
		version.startsWith("github:") ||
		version.startsWith("link:") ||
		version.startsWith("root:") ||
		version.startsWith("workspace:")
	) {
		throw new Error(`bun.lock package ${packageKey} is not from npm`);
	}
	return { name, version };
}

function parseBunLock(value: unknown): BunLock {
	const lock = requireRecord(value, "bun.lock");
	const workspaces = requireRecord(lock.workspaces, "bun.lock.workspaces");
	const rootWorkspace = requireRecord(
		workspaces[""],
		'bun.lock.workspaces[""]',
	);
	const dependencies = parseStringRecord(
		rootWorkspace.dependencies,
		'bun.lock.workspaces[""].dependencies',
	);
	const optionalDependencies = parseStringRecord(
		rootWorkspace.optionalDependencies,
		'bun.lock.workspaces[""].optionalDependencies',
	);
	const peerDependencies = parseStringRecord(
		rootWorkspace.peerDependencies,
		'bun.lock.workspaces[""].peerDependencies',
	);
	const devDependencies = parseStringRecord(
		rootWorkspace.devDependencies,
		'bun.lock.workspaces[""].devDependencies',
	);
	const packageValues = requireRecord(lock.packages, "bun.lock.packages");
	const packages = new Map<string, BunPackage>();

	for (const [key, value] of Object.entries(packageValues)) {
		if (!Array.isArray(value) || typeof value[0] !== "string") {
			throw new Error(`bun.lock package ${key} has no resolution`);
		}

		const { name, version } = parseNpmResolution(value[0], key);
		const packageMetadata =
			value[2] === undefined
				? {}
				: requireRecord(value[2], `bun.lock.packages.${key}[2]`);
		const packageDependencies = parseStringRecord(
			packageMetadata.dependencies,
			`bun.lock.packages.${key}[2].dependencies`,
		);
		const packageOptionalDependencies = parseStringRecord(
			packageMetadata.optionalDependencies,
			`bun.lock.packages.${key}[2].optionalDependencies`,
		);
		const packagePeerDependencies = parseStringRecord(
			packageMetadata.peerDependencies,
			`bun.lock.packages.${key}[2].peerDependencies`,
		);
		const optionalPeerDependencyNames = parseStringArray(
			packageMetadata.optionalPeers,
			`bun.lock.packages.${key}[2].optionalPeers`,
		);
		const optionalPeerDependencies = new Set(optionalPeerDependencyNames);

		packages.set(key, {
			name,
			version,
			dependencyNames: [
				...new Set([
					...Object.keys(packageDependencies),
					...Object.keys(packageOptionalDependencies),
				]),
			].sort(),
			requiredPeerDependencyNames: Object.keys(packagePeerDependencies)
				.filter(
					(dependencyName) => !optionalPeerDependencies.has(dependencyName),
				)
				.sort(),
			optionalPeerDependencyNames,
		});
	}

	return {
		runtimeDependencyNames: [
			...new Set([
				...Object.keys(dependencies),
				...Object.keys(optionalDependencies),
				...Object.keys(peerDependencies),
			]),
		].sort(),
		developmentDependencyNames: Object.keys(devDependencies).sort(),
		packages,
	};
}

function getParentPackageKey(
	packages: Map<string, BunPackage>,
	packageKey: string,
): string | undefined {
	const packageRecord = packages.get(packageKey);
	if (!packageRecord) throw new Error(`missing package ${packageKey}`);
	if (packageKey === packageRecord.name) return undefined;

	const suffix = `/${packageRecord.name}`;
	if (!packageKey.endsWith(suffix)) {
		throw new Error(
			`bun.lock package key ${packageKey} does not match ${packageRecord.name}`,
		);
	}
	const parentKey = packageKey.slice(0, -suffix.length);
	if (!packages.has(parentKey)) {
		throw new Error(
			`bun.lock package ${packageKey} has missing parent ${parentKey}`,
		);
	}
	return parentKey;
}

function resolveDependencyKey(
	packages: Map<string, BunPackage>,
	parentKey: string,
	dependencyName: string,
): string {
	let packageKey: string | undefined = parentKey;
	while (packageKey !== undefined) {
		const nestedKey = `${packageKey}/${dependencyName}`;
		if (packages.get(nestedKey)?.name === dependencyName) return nestedKey;
		packageKey = getParentPackageKey(packages, packageKey);
	}

	if (packages.get(dependencyName)?.name === dependencyName) {
		return dependencyName;
	}
	throw new Error(`${parentKey} depends on missing package ${dependencyName}`);
}

function findPeerDependencyKey(
	packages: Map<string, BunPackage>,
	packageKey: string,
	dependencyName: string,
): string | undefined {
	let ancestorKey = getParentPackageKey(packages, packageKey);
	while (ancestorKey !== undefined) {
		const peerKey = `${ancestorKey}/${dependencyName}`;
		if (packages.get(peerKey)?.name === dependencyName) return peerKey;
		ancestorKey = getParentPackageKey(packages, ancestorKey);
	}

	if (packages.get(dependencyName)?.name === dependencyName) {
		return dependencyName;
	}
	return undefined;
}

function resolveRootDependencyKey(
	packages: Map<string, BunPackage>,
	dependencyName: string,
): string {
	if (packages.get(dependencyName)?.name === dependencyName) {
		return dependencyName;
	}
	throw new Error(
		`root workspace depends on missing package ${dependencyName}`,
	);
}

function resolvePackageDependencyKeys(
	lock: BunLock,
	packageKey: string,
): string[] {
	const packageRecord = lock.packages.get(packageKey);
	if (!packageRecord) throw new Error(`missing package ${packageKey}`);

	const dependencyKeys = packageRecord.dependencyNames.map((dependencyName) =>
		resolveDependencyKey(lock.packages, packageKey, dependencyName),
	);
	for (const dependencyName of packageRecord.requiredPeerDependencyNames) {
		const peerKey = findPeerDependencyKey(
			lock.packages,
			packageKey,
			dependencyName,
		);
		if (!peerKey) {
			throw new Error(
				`${packageKey} depends on missing peer package ${dependencyName}`,
			);
		}
		dependencyKeys.push(peerKey);
	}
	for (const dependencyName of packageRecord.optionalPeerDependencyNames) {
		const peerKey = findPeerDependencyKey(
			lock.packages,
			packageKey,
			dependencyName,
		);
		if (peerKey) dependencyKeys.push(peerKey);
	}
	return [...new Set(dependencyKeys)];
}

function collectReachablePackages(
	lock: BunLock,
	rootDependencyNames: string[],
): Set<string> {
	const pending = rootDependencyNames.map((name) =>
		resolveRootDependencyKey(lock.packages, name),
	);
	const reachable = new Set<string>();

	while (pending.length > 0) {
		const packageKey = pending.pop();
		if (packageKey === undefined || reachable.has(packageKey)) continue;

		reachable.add(packageKey);
		pending.push(...resolvePackageDependencyKeys(lock, packageKey));
	}
	return reachable;
}

function npmPackageUrl(name: string, version: string): string {
	if (name.startsWith("@")) {
		const separator = name.indexOf("/");
		if (separator <= 1 || separator === name.length - 1) {
			throw new Error(`invalid scoped npm package name ${name}`);
		}
		const scope = encodeURIComponent(name.slice(1, separator));
		const packageName = encodeURIComponent(name.slice(separator + 1));
		return `pkg:npm/%40${scope}/${packageName}@${encodeURIComponent(version)}`;
	}
	if (name.includes("/")) throw new Error(`invalid npm package name ${name}`);
	return `pkg:npm/${encodeURIComponent(name)}@${encodeURIComponent(version)}`;
}

function mergeResolvedDependency(
	resolved: Map<string, MutableResolvedDependency>,
	dependency: MutableResolvedDependency,
): void {
	const current = resolved.get(dependency.packageUrl);
	if (!current) {
		resolved.set(dependency.packageUrl, dependency);
		return;
	}

	if (dependency.relationship === "direct") current.relationship = "direct";
	if (dependency.scope === "runtime") current.scope = "runtime";
	for (const child of dependency.dependencies) current.dependencies.add(child);
}

function buildResolvedDependencies(
	lock: BunLock,
): Record<string, ResolvedDependency> {
	const runtimePackages = collectReachablePackages(
		lock,
		lock.runtimeDependencyNames,
	);
	const developmentPackages = collectReachablePackages(lock, [
		...lock.runtimeDependencyNames,
		...lock.developmentDependencyNames,
	]);
	const directPackages = new Set(
		[...lock.runtimeDependencyNames, ...lock.developmentDependencyNames].map(
			(name) => resolveRootDependencyKey(lock.packages, name),
		),
	);
	const resolved = new Map<string, MutableResolvedDependency>();

	for (const packageKey of developmentPackages) {
		const packageRecord = lock.packages.get(packageKey);
		if (!packageRecord) throw new Error(`missing package ${packageKey}`);
		const packageUrl = npmPackageUrl(packageRecord.name, packageRecord.version);
		const childPackageUrls = resolvePackageDependencyKeys(lock, packageKey).map(
			(childKey) => {
				const child = lock.packages.get(childKey);
				if (!child) throw new Error(`missing package ${childKey}`);
				return npmPackageUrl(child.name, child.version);
			},
		);

		mergeResolvedDependency(resolved, {
			packageUrl,
			relationship: directPackages.has(packageKey) ? "direct" : "indirect",
			scope: runtimePackages.has(packageKey) ? "runtime" : "development",
			dependencies: new Set(childPackageUrls),
		});
	}

	return Object.fromEntries(
		[...resolved.entries()]
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([packageUrl, dependency]) => [
				packageUrl,
				{
					package_url: packageUrl,
					relationship: dependency.relationship,
					scope: dependency.scope,
					dependencies: [...dependency.dependencies].sort(),
				},
			]),
	);
}

export function createBunDependencySnapshot(
	lockValue: unknown,
	metadata: SnapshotMetadata,
): DependencySnapshot {
	return {
		version: 0,
		sha: metadata.sha,
		ref: metadata.ref,
		job: {
			id: metadata.jobId,
			correlator: metadata.jobCorrelator,
			html_url: metadata.jobUrl,
		},
		detector: {
			name: "bun-lockfile",
			version: "1.0.0",
			url: metadata.detectorUrl,
		},
		scanned: metadata.scanned,
		manifests: {
			"bun.lock": {
				name: "bun.lock",
				file: {
					source_location: "bun.lock",
				},
				resolved: buildResolvedDependencies(parseBunLock(lockValue)),
			},
		},
	};
}

function requireEnvironmentVariable(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`${name} is required`);
	return value;
}

function validateEnvironment(): SnapshotMetadata {
	const sha = requireEnvironmentVariable("GITHUB_SHA");
	if (!/^[0-9a-f]{40,64}$/.test(sha)) throw new Error("GITHUB_SHA is invalid");

	const ref = requireEnvironmentVariable("GITHUB_REF");
	if (!ref.startsWith("refs/")) throw new Error("GITHUB_REF is invalid");

	const repository = requireEnvironmentVariable("GITHUB_REPOSITORY");
	if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
		throw new Error("GITHUB_REPOSITORY is invalid");
	}
	const serverUrl = requireEnvironmentVariable("GITHUB_SERVER_URL");
	const runId = requireEnvironmentVariable("GITHUB_RUN_ID");
	const runAttempt = requireEnvironmentVariable("GITHUB_RUN_ATTEMPT");
	if (!/^\d+$/.test(runId) || !/^\d+$/.test(runAttempt)) {
		throw new Error("GitHub run identity is invalid");
	}

	const workflow = requireEnvironmentVariable("GITHUB_WORKFLOW");
	const job = requireEnvironmentVariable("GITHUB_JOB");
	return {
		sha,
		ref,
		jobId: `${runId}.${runAttempt}`,
		jobCorrelator: `${workflow}_${job}`,
		jobUrl: new URL(`/${repository}/actions/runs/${runId}`, serverUrl).href,
		detectorUrl: new URL(
			`/${repository}/blob/${sha}/scripts/bun-dependency-snapshot.ts`,
			serverUrl,
		).href,
		scanned: new Date().toISOString(),
	};
}

async function main(): Promise<void> {
	const outputPath = process.argv[2];
	if (!outputPath) throw new Error("snapshot output path is required");

	const lockText = await readFile(resolve("bun.lock"), "utf8");
	const snapshot = createBunDependencySnapshot(
		Bun.JSONC.parse(lockText),
		validateEnvironment(),
	);
	await writeFile(resolve(outputPath), `${JSON.stringify(snapshot)}\n`, "utf8");
	console.log(
		`Prepared ${Object.keys(snapshot.manifests["bun.lock"].resolved).length} dependencies`,
	);
}

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(resolve(entrypoint)).href) {
	main().catch((error: unknown) => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
}
