import {
	appendFile,
	mkdir,
	readdir,
	readFile,
	writeFile,
} from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { makeBadge } from "badge-maker";

const categoryDefinitions = [
	{
		key: "performance",
		output: "performance",
		label: "lighthouse performance",
		filename: "lighthouse-performance.svg",
	},
	{
		key: "accessibility",
		output: "accessibility",
		label: "lighthouse accessibility",
		filename: "lighthouse-accessibility.svg",
	},
	{
		key: "best-practices",
		output: "best_practices",
		label: "lighthouse best practices",
		filename: "lighthouse-best-practices.svg",
	},
	{
		key: "seo",
		output: "seo",
		label: "lighthouse seo",
		filename: "lighthouse-seo.svg",
	},
] as const;

type CategoryKey = (typeof categoryDefinitions)[number]["key"];
type LighthouseScores = Record<CategoryKey, number>;
type ScoreSamples = Record<CategoryKey, number[]>;

interface LighthouseReport {
	requestedUrl: string;
	categories: Record<CategoryKey, { score: number }>;
}

function createScoreSamples(): ScoreSamples {
	return {
		performance: [],
		accessibility: [],
		"best-practices": [],
		seo: [],
	};
}

function median(values: number[]): number {
	if (values.length === 0) throw new Error("Cannot calculate an empty median");

	const sortedValues = [...values].sort((left, right) => left - right);
	const middle = Math.floor(sortedValues.length / 2);
	if (sortedValues.length % 2 === 1) return sortedValues[middle];

	return (sortedValues[middle - 1] + sortedValues[middle]) / 2;
}

function parseReport(value: unknown, filename: string): LighthouseReport {
	if (!value || typeof value !== "object") {
		throw new Error(`${filename} is not a Lighthouse report object`);
	}

	const report = value as Partial<LighthouseReport>;
	if (
		typeof report.requestedUrl !== "string" ||
		report.requestedUrl.length === 0
	) {
		throw new Error(`${filename} has no requestedUrl`);
	}
	if (!report.categories || typeof report.categories !== "object") {
		throw new Error(`${filename} has no categories`);
	}

	for (const { key } of categoryDefinitions) {
		const score = report.categories[key]?.score;
		if (
			typeof score !== "number" ||
			!Number.isFinite(score) ||
			score < 0 ||
			score > 1
		) {
			throw new Error(`${filename} has an invalid ${key} score`);
		}
	}

	return report as LighthouseReport;
}

export function aggregateLighthouseScores(
	reports: Array<{ filename: string; value: unknown }>,
): LighthouseScores {
	if (reports.length === 0) throw new Error("No Lighthouse reports found");

	const samplesByUrl = new Map<string, ScoreSamples>();
	for (const { filename, value } of reports) {
		const report = parseReport(value, filename);
		const samples =
			samplesByUrl.get(report.requestedUrl) ?? createScoreSamples();
		for (const { key } of categoryDefinitions) {
			samples[key].push(report.categories[key].score);
		}
		samplesByUrl.set(report.requestedUrl, samples);
	}

	const result = {} as LighthouseScores;
	for (const { key } of categoryDefinitions) {
		const pageMedians = [...samplesByUrl.values()].map((samples) =>
			median(samples[key]),
		);
		result[key] = Math.round(Math.min(...pageMedians) * 100);
	}

	return result;
}

export async function extractLighthouseScores(
	resultsPath: string,
): Promise<LighthouseScores> {
	const entries = await readdir(resultsPath, { withFileTypes: true });
	const reportFilenames = entries
		.filter((entry) => entry.isFile() && /^lhr-.*\.json$/.test(entry.name))
		.map((entry) => entry.name)
		.sort();

	const reports = await Promise.all(
		reportFilenames.map(async (filename) => ({
			filename,
			value: JSON.parse(
				await readFile(resolve(resultsPath, filename), "utf8"),
			) as unknown,
		})),
	);

	return aggregateLighthouseScores(reports);
}

function scoreColor(score: number): string {
	if (score >= 95) return "brightgreen";
	if (score >= 90) return "green";
	if (score >= 75) return "yellowgreen";
	if (score >= 60) return "yellow";
	if (score >= 40) return "orange";
	return "red";
}

function validatePercentage(value: string | undefined, name: string): number {
	if (!value || !/^\d{1,3}$/.test(value))
		throw new Error(`${name} must be an integer`);

	const score = Number(value);
	if (score < 0 || score > 100)
		throw new Error(`${name} must be between 0 and 100`);
	return score;
}

export function renderLighthouseBadges(
	scores: LighthouseScores,
): Record<string, string> {
	return Object.fromEntries(
		categoryDefinitions.map(({ key, label, filename }) => [
			filename,
			makeBadge({
				label,
				message: `${scores[key]}%`,
				color: scoreColor(scores[key]),
				style: "flat",
			}),
		]),
	);
}

async function extractCommand(): Promise<void> {
	const resultsPath = process.env.LIGHTHOUSE_RESULTS_PATH;
	const githubOutput = process.env.GITHUB_OUTPUT;
	if (!resultsPath) throw new Error("LIGHTHOUSE_RESULTS_PATH is required");
	if (!githubOutput) throw new Error("GITHUB_OUTPUT is required");

	const scores = await extractLighthouseScores(resultsPath);
	const output = categoryDefinitions
		.map(({ key, output: outputName }) => `${outputName}=${scores[key]}`)
		.join("\n");
	await appendFile(githubOutput, `${output}\n`, "utf8");
}

async function renderCommand(): Promise<void> {
	const outputDirectory = process.env.LIGHTHOUSE_BADGE_OUTPUT_DIR;
	if (!outputDirectory)
		throw new Error("LIGHTHOUSE_BADGE_OUTPUT_DIR is required");

	const scores: LighthouseScores = {
		performance: validatePercentage(
			process.env.LIGHTHOUSE_PERFORMANCE,
			"performance",
		),
		accessibility: validatePercentage(
			process.env.LIGHTHOUSE_ACCESSIBILITY,
			"accessibility",
		),
		"best-practices": validatePercentage(
			process.env.LIGHTHOUSE_BEST_PRACTICES,
			"best practices",
		),
		seo: validatePercentage(process.env.LIGHTHOUSE_SEO, "SEO"),
	};
	await mkdir(outputDirectory, { recursive: true });
	await Promise.all(
		Object.entries(renderLighthouseBadges(scores)).map(([filename, svg]) =>
			writeFile(resolve(outputDirectory, filename), svg, "utf8"),
		),
	);
}

async function main(): Promise<void> {
	const command = process.argv[2];
	if (command === "extract") return extractCommand();
	if (command === "render") return renderCommand();
	throw new Error('Expected command "extract" or "render"');
}

const entrypoint = process.argv[1];
if (entrypoint && import.meta.url === pathToFileURL(resolve(entrypoint)).href) {
	main().catch((error: unknown) => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
}
