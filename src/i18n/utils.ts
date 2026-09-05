import { ui, type TranslationKey } from "./ui";
import { defaultLocale, isValidLocale, type Locale } from "./locales";
export { isValidLocale } from "./locales";
export {
	getCanonicalUrl,
	getLocalizedPath,
	getLocalizedSiteUrl,
	getLocalizedUrls,
	getPathWithoutLocale,
	getSiteUrl,
	getSlugWithoutLocale,
	joinSiteUrl,
	withTrailingSlash,
} from "./url-paths";

/**
 * Get the alternate locale (for language toggle).
 * Useful for switching between locales.
 */
export function getAlternateLocale(locale: Locale): Locale {
	return locale === "en" ? "es" : "en";
}

/**
 * Create a filter predicate for content by locale.
 * Filters out drafts by default.
 */
export function matchesLocale(locale: Locale) {
	return (data: { lang: Locale; draft?: boolean }): boolean =>
		data.lang === locale && !data.draft;
}

/**
 * Extract locale from URL path.
 * /es/about → "es"
 * /about → "en" (default)
 */
export function getLangFromUrl(url: URL): Locale {
	const [, lang] = url.pathname.split("/");
	if (lang && isValidLocale(lang)) {
		return lang;
	}
	return defaultLocale;
}

/**
 * Returns a translation function for the given locale.
 * Falls back to default locale if key is missing.
 */
export function useTranslations(lang: Locale) {
	return function t(key: TranslationKey): string {
		return ui[lang][key] ?? ui[defaultLocale][key];
	};
}
