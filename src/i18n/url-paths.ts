import { defaultLocale, locales, type Locale } from "./locales";

export interface SiteUrlContext {
	site?: URL;
	origin: string;
}

export interface LocalizedUrlsInput {
	siteUrl: string;
	pathWithoutLocale: string;
	locale: Locale;
	/**
	 * Explicit per-locale URLs for content whose slug differs between locales.
	 * When provided, only the listed locales are considered to exist.
	 */
	alternateUrls?: Partial<Record<Locale, string>>;
}

export interface LocalizedUrls {
	canonicalUrl: string;
	alternateUrls: Partial<Record<Locale, string>>;
	xDefaultUrl: string;
}

const localeSlugPattern = new RegExp(`^(${locales.join("|")})/`);
const absoluteUrlPattern = /^https?:\/\//i;
const pathnameSplitPattern = /^([^?#]*)(.*)$/;

function getPathFromUrlLike(value: string): string {
	if (!absoluteUrlPattern.test(value)) return value || "/";

	const url = new URL(value);
	return `${url.pathname}${url.search}${url.hash}` || "/";
}

/**
 * Pages build as `<path>/index.html`, so the host serves them at the
 * slash-terminated URL. Emitting that form everywhere keeps canonical,
 * hreflang, sitemap and internal links in agreement and avoids a redirect
 * hop. Paths that point at a file (e.g. `/rss.xml`) are left untouched.
 */
export function withTrailingSlash(path: string): string {
	const match = pathnameSplitPattern.exec(path);
	const pathname = match?.[1] ?? path;
	const suffix = match?.[2] ?? "";
	if (pathname === "" || pathname.endsWith("/")) return path;

	const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
	if (lastSegment.includes(".")) return path;

	return `${pathname}/${suffix}`;
}

export function getSiteUrl({ site, origin }: SiteUrlContext): string {
	return (site ?? origin).toString().replace(/\/$/, "");
}

export function joinSiteUrl(siteUrl: string, pathOrUrl: string): string {
	if (absoluteUrlPattern.test(pathOrUrl)) return pathOrUrl;
	return `${siteUrl}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export function getLocalizedPath(path: string, lang: Locale): string {
	const pathname = withTrailingSlash(getPathFromUrlLike(path));
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

export function getLocalizedSiteUrl(
	siteUrl: string,
	pathWithoutLocale: string,
	locale: Locale,
): string {
	return joinSiteUrl(siteUrl, getLocalizedPath(pathWithoutLocale, locale));
}

function getUrlForLocale(
	{ siteUrl, pathWithoutLocale, alternateUrls }: LocalizedUrlsInput,
	locale: Locale,
): string | undefined {
	if (alternateUrls) {
		const alternateUrl = alternateUrls[locale];
		return alternateUrl ? joinSiteUrl(siteUrl, alternateUrl) : undefined;
	}
	return getLocalizedSiteUrl(siteUrl, pathWithoutLocale, locale);
}

export function getCanonicalUrl(input: LocalizedUrlsInput): string {
	return (
		getUrlForLocale(input, input.locale) ??
		getLocalizedSiteUrl(input.siteUrl, input.pathWithoutLocale, input.locale)
	);
}

export function getLocalizedUrls(input: LocalizedUrlsInput): LocalizedUrls {
	const canonicalUrl = getCanonicalUrl(input);
	const alternateUrls: Partial<Record<Locale, string>> = {};

	for (const locale of locales) {
		const url = getUrlForLocale(input, locale);
		if (url) alternateUrls[locale] = url;
	}

	return {
		canonicalUrl,
		alternateUrls,
		xDefaultUrl: alternateUrls[defaultLocale] ?? canonicalUrl,
	};
}
