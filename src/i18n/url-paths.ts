import { defaultLocale, locales, type Locale } from "./locales";

export interface SiteUrlContext {
	site?: URL;
	origin: string;
}

export interface LocalizedUrlsInput {
	siteUrl: string;
	pathWithoutLocale: string;
	locale: Locale;
	alternateUrls?: Partial<Record<Locale, string>>;
}

export interface LocalizedUrls {
	canonicalUrl: string;
	alternateUrls: Record<Locale, string>;
	xDefaultUrl: string;
}

export interface LocaleRedirectInput {
	pathname: string;
	search?: string;
	currentLocale: Locale;
	browserLocale: string | null;
}

const localeSlugPattern = new RegExp(`^(${locales.join("|")})/`);
const absoluteUrlPattern = /^https?:\/\//i;

function getPathFromUrlLike(value: string): string {
	if (!absoluteUrlPattern.test(value)) return value || "/";

	const url = new URL(value);
	return `${url.pathname}${url.search}${url.hash}` || "/";
}

export function getSiteUrl({ site, origin }: SiteUrlContext): string {
	return (site ?? origin).toString().replace(/\/$/, "");
}

export function joinSiteUrl(siteUrl: string, pathOrUrl: string): string {
	if (absoluteUrlPattern.test(pathOrUrl)) return pathOrUrl;
	return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function getLocalizedPath(path: string, lang: Locale): string {
	const pathname = getPathFromUrlLike(path);
	if (lang === defaultLocale) return pathname;
	return `/${lang}${pathname}`;
}

export function getPathWithoutLocale(pathname: string): string {
	const path = getPathFromUrlLike(pathname);

	for (const locale of locales) {
		if (path.startsWith(`/${locale}/`)) {
			return path.slice(locale.length + 1);
		}
		if (path === `/${locale}`) {
			return "/";
		}
	}
	return path;
}

export function getSlugWithoutLocale(slug: string): string {
	return slug.replace(localeSlugPattern, "");
}

export function getCanonicalPath(
	pathWithoutLocale: string,
	locale: Locale,
): string {
	return getLocalizedPath(pathWithoutLocale, locale);
}

export function getLocalizedSiteUrl(
	siteUrl: string,
	pathWithoutLocale: string,
	locale: Locale,
): string {
	return joinSiteUrl(siteUrl, getCanonicalPath(pathWithoutLocale, locale));
}

export function getCanonicalUrl(input: LocalizedUrlsInput): string {
	return getUrlForLocale(input, input.locale);
}

export function getUrlForLocale(
	{ siteUrl, pathWithoutLocale, alternateUrls }: LocalizedUrlsInput,
	locale: Locale,
): string {
	const alternateUrl = alternateUrls?.[locale];
	if (alternateUrl) return joinSiteUrl(siteUrl, alternateUrl);
	return getLocalizedSiteUrl(siteUrl, pathWithoutLocale, locale);
}

export function getXDefaultUrl({
	siteUrl,
	pathWithoutLocale,
	alternateUrls,
}: LocalizedUrlsInput): string {
	return joinSiteUrl(siteUrl, alternateUrls?.en ?? pathWithoutLocale);
}

export function getLocalizedUrls(input: LocalizedUrlsInput): LocalizedUrls {
	return {
		canonicalUrl: getCanonicalUrl(input),
		alternateUrls: Object.fromEntries(
			locales.map((locale) => [locale, getUrlForLocale(input, locale)]),
		) as Record<Locale, string>,
		xDefaultUrl: getXDefaultUrl(input),
	};
}

export function getLocaleRedirectPath({
	pathname,
	search = "",
	currentLocale,
	browserLocale,
}: LocaleRedirectInput): string | null {
	if (!browserLocale || !locales.includes(browserLocale as Locale)) return null;
	if (browserLocale === currentLocale) return null;

	const pathWithoutLocale = getPathWithoutLocale(pathname);
	return `${getLocalizedPath(pathWithoutLocale, browserLocale as Locale)}${search}`;
}
