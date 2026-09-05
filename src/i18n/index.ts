// Locales
export {
	locales,
	defaultLocale,
	localeNames,
	ogLocales,
	intlLocales,
	type Locale,
} from "./locales";

// Translations
export { ui, type TranslationKey } from "./ui";

// Utilities
export {
	getLangFromUrl,
	useTranslations,
	getLocalizedPath,
	getLocalizedSiteUrl,
	getLocalizedUrls,
	getPathWithoutLocale,
	getCanonicalUrl,
	getSiteUrl,
	getSlugWithoutLocale,
	joinSiteUrl,
	withTrailingSlash,
	isValidLocale,
	getAlternateLocale,
	matchesLocale,
} from "./utils";
