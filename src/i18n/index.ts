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
	getPathWithoutLocale,
	getSlugWithoutLocale,
	isValidLocale,
	isDefaultLocale,
	getAlternateLocale,
	matchesLocale,
} from "./utils";
