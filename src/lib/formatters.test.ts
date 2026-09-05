import { describe, expect, it } from "vitest";

import { useTranslations } from "@/i18n";
import {
	calculateReadingTime,
	formatExperience,
	formatPostDate,
	formatReadingTime,
} from "@/lib/formatters";

const t = useTranslations("en");

describe("formatPostDate", () => {
	const date = new Date("2026-05-17T00:00:00.000Z");

	it("formats UTC midnight dates on the same calendar day in every zone", () => {
		expect(formatPostDate(date, "en")).toBe("May 17, 2026");
		expect(formatPostDate(date, "en", "short")).toBe("May 17, 2026");
		expect(formatPostDate(date, "es")).toBe("17 de mayo de 2026");
		expect(formatPostDate(date, "es", "short")).toBe("17 may 2026");
	});
});

describe("formatExperience", () => {
	it("covers the three experience branches", () => {
		expect(formatExperience(0.5, t)).toBe("Less than 1 year of experience");
		expect(formatExperience(1, t)).toBe("+1 year of experience");
		expect(formatExperience(3, t)).toBe("+3 years of experience");
	});
});

describe("calculateReadingTime", () => {
	it("never reports less than one minute", () => {
		expect(calculateReadingTime("")).toBe(1);
		expect(calculateReadingTime("A few words.")).toBe(1);
	});

	it("rounds up at 200 words per minute", () => {
		const words = Array.from({ length: 401 }, (_, i) => `word${i}`).join(" ");

		expect(calculateReadingTime(words)).toBe(3);
	});

	it("ignores code, imports, JSX expressions and markup", () => {
		const body = [
			'import { Image } from "astro:assets";',
			"import {",
			"\tCallout,",
			"\tDisclosure,",
			'} from "@/components/blog";',
			"export const meta = { draft: false };",
			"",
			"# Heading",
			"",
			"```ts",
			"const ignored = words.that.should.not.count();",
			"```",
			"",
			"Inline `code` is dropped. {frontmatter.title}",
			"",
			'<Callout icon="rocket">Only these words count.</Callout>',
		].join("\n");
		const countedWords = "Heading Inline is dropped. Only these words count.";

		expect(calculateReadingTime(body)).toBe(1);
		expect(calculateReadingTime(`${body}\n`.repeat(50))).toBe(
			calculateReadingTime(`${countedWords}\n`.repeat(50)),
		);
	});
});

describe("formatReadingTime", () => {
	it("interpolates the minute count", () => {
		expect(formatReadingTime(4, t)).toBe("4 min read");
		expect(formatReadingTime(4, useTranslations("es"))).toBe(
			"4 min de lectura",
		);
	});
});
