import { ui, type TranslationKey } from "./ui";
import { locales, defaultLocale, type Locale } from "./locales";

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
	if (lang === defaultLocale) return path;
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
