import { describe, expect, it } from "vitest";
import {
	aggregateLighthouseScores,
	renderLighthouseBadges,
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

describe("renderLighthouseBadges", () => {
	it("renders an accessible Shields-style badge for every category", () => {
		const badges = renderLighthouseBadges({
			performance: 93,
			accessibility: 96,
			"best-practices": 100,
			seo: 92,
		});

		expect(Object.keys(badges)).toEqual([
			"lighthouse-performance.svg",
			"lighthouse-accessibility.svg",
			"lighthouse-best-practices.svg",
			"lighthouse-seo.svg",
		]);
		expect(badges["lighthouse-performance.svg"]).toContain(
			'aria-label="lighthouse performance: 93%"',
		);
		expect(badges["lighthouse-accessibility.svg"]).toContain("96%");
		expect(badges["lighthouse-best-practices.svg"]).toContain("100%");
		expect(badges["lighthouse-seo.svg"]).toContain("92%");
	});
});
