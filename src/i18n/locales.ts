export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export function isValidLocale(value: string): value is Locale {
	return locales.some((locale) => locale === value);
}

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
	en: "English",
	es: "Español",
};

/** Open Graph locale format (e.g., "en_US", "es_ES") */
export const ogLocales: Record<Locale, string> = {
	en: "en_US",
	es: "es_ES",
};

/** Intl API locale format for date/number formatting */
export const intlLocales: Record<Locale, string> = {
	en: "en-US",
	es: "es-ES",
};
