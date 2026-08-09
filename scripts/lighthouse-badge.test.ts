import { describe, expect, it } from "vitest";
import {
	aggregateLighthouseScores,
	renderLighthouseBadge,
} from "./lighthouse-badge";

function report(
	requestedUrl: string,
	performance: number,
	accessibility: number,
	bestPractices: number,
	seo: number,
): unknown {
	return {
		requestedUrl,
		categories: {
			performance: { score: performance },
			accessibility: { score: accessibility },
			"best-practices": { score: bestPractices },
			seo: { score: seo },
		},
	};
}

describe("aggregateLighthouseScores", () => {
	it("uses each page median and reports the lowest category score", () => {
		const scores = aggregateLighthouseScores([
			{ filename: "home-1.json", value: report("/", 0.91, 0.96, 1, 0.92) },
			{ filename: "home-2.json", value: report("/", 0.94, 0.96, 1, 0.92) },
			{ filename: "home-3.json", value: report("/", 0.93, 0.96, 1, 0.92) },
			{ filename: "blog-1.json", value: report("/blog/", 0.99, 1, 1, 0.95) },
			{ filename: "blog-2.json", value: report("/blog/", 0.98, 1, 1, 0.95) },
			{ filename: "blog-3.json", value: report("/blog/", 0.99, 1, 1, 0.95) },
		]);

		expect(scores).toEqual({
			performance: 93,
			accessibility: 96,
			"best-practices": 100,
			seo: 92,
		});
	});

	it("rejects malformed scores", () => {
		expect(() =>
			aggregateLighthouseScores([
				{ filename: "invalid.json", value: report("/", 1.1, 1, 1, 1) },
			]),
		).toThrow("invalid performance score");
	});
});

describe("renderLighthouseBadge", () => {
	it("renders every category into an accessible SVG", () => {
		const svg = renderLighthouseBadge({
			performance: 93,
			accessibility: 96,
			"best-practices": 100,
			seo: 92,
		});

		expect(svg).toContain("<svg");
		expect(svg).toContain("P 93");
		expect(svg).toContain("A11y 96");
		expect(svg).toContain("BP 100");
		expect(svg).toContain("SEO 92");
		expect(svg).toContain("aria-label");
	});
});
