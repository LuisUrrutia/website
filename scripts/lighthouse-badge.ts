import { appendFile, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const categoryDefinitions = [
	{ key: "performance", output: "performance", label: "P" },
	{ key: "accessibility", output: "accessibility", label: "A11y" },
	{ key: "best-practices", output: "best_practices", label: "BP" },
	{ key: "seo", output: "seo", label: "SEO" },
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
	if (score >= 90) return "#0cce6b";
	if (score >= 50) return "#ffa400";
	return "#ff4e42";
}

function scoreTextColor(score: number): string {
	return score >= 50 ? "#172117" : "#ffffff";
}

function validatePercentage(value: string | undefined, name: string): number {
	if (!value || !/^\d{1,3}$/.test(value))
		throw new Error(`${name} must be an integer`);

	const score = Number(value);
	if (score < 0 || score > 100)
		throw new Error(`${name} must be between 0 and 100`);
	return score;
}

export function renderLighthouseBadge(scores: LighthouseScores): string {
	const labelWidth = 132;
	const segmentWidths = [55, 65, 62, 65];
	const width =
		labelWidth + segmentWidths.reduce((total, segment) => total + segment, 0);
	let offset = labelWidth;
	const segments = categoryDefinitions
		.map(({ key, label }, index) => {
			const segmentWidth = segmentWidths[index];
			const center = offset + segmentWidth / 2;
			const score = scores[key];
			const segment = `<rect x="${offset}" width="${segmentWidth}" height="28" fill="${scoreColor(score)}"/><text x="${center}" y="18" fill="${scoreTextColor(score)}" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11" font-weight="600">${label} ${score}</text>`;
			offset += segmentWidth;
			return segment;
		})
		.join("");
	const description = categoryDefinitions
		.map(({ key, label }) => `${label} ${scores[key]}`)
		.join(", ");

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="28" role="img" aria-label="Lighthouse latest release: ${description}">
	<title>Lighthouse latest release: ${description}</title>
	<clipPath id="badge"><rect width="${width}" height="28" rx="5"/></clipPath>
	<g clip-path="url(#badge)">
		<rect width="${labelWidth}" height="28" fill="#3c4043"/>
		${segments}
	</g>
	<g fill="#ffffff" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11" font-weight="600">
		<text x="${labelWidth / 2}" y="18">Lighthouse · release</text>
	</g>
</svg>
`;
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
	const outputPath = process.env.LIGHTHOUSE_BADGE_OUTPUT;
	if (!outputPath) throw new Error("LIGHTHOUSE_BADGE_OUTPUT is required");

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
	await writeFile(outputPath, renderLighthouseBadge(scores), "utf8");
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
