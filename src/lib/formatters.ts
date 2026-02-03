import type { TranslationKey } from "@/i18n";

/**
 * Format a Date to ISO 8601 with timezone offset.
 * Example: "2024-12-23T12:34:00-05:00"
 */
export function toISOWithTimezone(date: Date): string {
	const offset = -date.getTimezoneOffset();
	const sign = offset >= 0 ? "+" : "-";
	const absOffset = Math.abs(offset);
	const hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
	const minutes = String(absOffset % 60).padStart(2, "0");

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hour = String(date.getHours()).padStart(2, "0");
	const minute = String(date.getMinutes()).padStart(2, "0");
	const second = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day}T${hour}:${minute}:${second}${sign}${hours}:${minutes}`;
}

/**
 * Format years of experience using localized strings.
 * formatExperience(0.5, t) → "Less than a year"
 * formatExperience(1, t) → "1 year"
 * formatExperience(3, t) → "3 years"
 */
export function formatExperience(
	years: number,
	t: (key: TranslationKey) => string,
): string {
	if (years < 1) return t("experience.lessThanYear");
	if (years === 1) return t("experience.oneYear");
	return t("experience.years").replace("{count}", String(years));
}

const WORDS_PER_MINUTE = 200;

/**
 * Remove all HTML/JSX tags by repeatedly applying the pattern
 * until no more matches are found (prevents nested tag bypass).
 */
function stripHtmlTags(input: string): string {
	const pattern = /<[^>]+>/g;
	let result = input;
	let previous: string;
	do {
		previous = result;
		result = result.replace(pattern, "");
	} while (result !== previous);
	return result;
}

/**
 * Calculate reading time in minutes from text content.
 * Strips MDX/HTML and counts words.
 */
export function calculateReadingTime(content: string): number {
	// Remove MDX/JSX components, HTML tags, and code blocks
	const cleanText = stripHtmlTags(
		content
			.replace(/```[\s\S]*?```/g, "") // Remove fenced code blocks
			.replace(/`[^`]+`/g, "") // Remove inline code
			.replace(/import\s+.*?;?\n/g, "") // Remove imports
			.replace(/export\s+.*?;?\n/g, "") // Remove exports
			.replace(/\{[^}]*\}/g, ""), // Remove JSX expressions
	)
		.replace(/[#*`~[\]]/g, "") // Remove markdown formatting
		.trim();

	const wordCount = cleanText
		.split(/\s+/)
		.filter((word) => word.length > 0).length;

	return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

/**
 * Format reading time using localized string.
 */
export function formatReadingTime(
	minutes: number,
	t: (key: TranslationKey) => string,
): string {
	return t("blog.readingTime").replace("{minutes}", String(minutes));
}

/**
 * Get the site URL from Astro context, removing trailing slash.
 * Falls back to request origin in development.
 */
export function getSiteUrl(astro: {
	site?: URL;
	url: { origin: string };
}): string {
	return (astro.site ?? astro.url.origin).toString().replace(/\/$/, "");
}
