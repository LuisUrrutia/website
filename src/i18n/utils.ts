import { ui, type TranslationKey } from "./ui";
import { locales, defaultLocale, type Locale } from "./locales";

/**
 * Check if the given locale is the default locale.
 */
export function isDefaultLocale(locale: Locale): boolean {
	return locale === defaultLocale;
}

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
 * Type guard to check if a string is a valid locale.
 */
export function isValidLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
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

/**
 * Generate a localized path.
 * getLocalizedPath("/about", "es") → "/es/about"
 * getLocalizedPath("/about", "en") → "/about"
 */
export function getLocalizedPath(path: string, lang: Locale): string {
	if (isDefaultLocale(lang)) return path;
	return `/${lang}${path}`;
}

/**
 * Get the path without locale prefix.
 * /es/about → /about
 * /about → /about
 */
export function getPathWithoutLocale(pathname: string): string {
	for (const locale of locales) {
		if (pathname.startsWith(`/${locale}/`)) {
			return pathname.slice(locale.length + 1);
		}
		if (pathname === `/${locale}`) {
			return "/";
		}
	}
	return pathname;
}

/** Regex pattern to match locale prefix in content slugs */
const localeSlugPattern = new RegExp(`^(${locales.join("|")})/`);

/**
 * Remove locale prefix from a content collection slug/id.
 * "en/my-post" → "my-post"
 * "es/mi-post" → "mi-post"
 */
export function getSlugWithoutLocale(slug: string): string {
	return slug.replace(localeSlugPattern, "");
}
