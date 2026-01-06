import type { TranslationKey } from "@/i18n";

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
