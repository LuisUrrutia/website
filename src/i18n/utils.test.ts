import { describe, expect, it } from "vitest";

import {
	getAlternateLocale,
	getCanonicalUrl,
	getLangFromUrl,
	getLocalizedPath,
	getLocalizedSiteUrl,
	getLocalizedUrls,
	getPathWithoutLocale,
	getSiteUrl,
	getSlugWithoutLocale,
	joinSiteUrl,
	matchesLocale,
	useTranslations,
	withTrailingSlash,
} from "@/i18n/utils";

describe("i18n utils", () => {
	it("returns the alternate locale", () => {
		expect(getAlternateLocale("en")).toBe("es");
		expect(getAlternateLocale("es")).toBe("en");
	});

	it("detects the locale from a URL", () => {
		expect(getLangFromUrl(new URL("https://urrutia.me/"))).toBe("en");
		expect(getLangFromUrl(new URL("https://urrutia.me/blog/"))).toBe("en");
		expect(getLangFromUrl(new URL("https://urrutia.me/es"))).toBe("es");
		expect(getLangFromUrl(new URL("https://urrutia.me/es/blog/"))).toBe("es");
		expect(getLangFromUrl(new URL("https://urrutia.me/estonia/"))).toBe("en");
	});

	it("filters content by locale and excludes drafts", () => {
		const isSpanish = matchesLocale("es");

		expect(isSpanish({ lang: "es" })).toBe(true);
		expect(isSpanish({ lang: "es", draft: false })).toBe(true);
		expect(isSpanish({ lang: "es", draft: true })).toBe(false);
		expect(isSpanish({ lang: "en" })).toBe(false);
	});

	it("translates with a fallback to the default locale", () => {
		expect(useTranslations("es")("blog.title")).not.toBe(
			useTranslations("en")("blog.title"),
		);
		expect(useTranslations("es")("stack.title")).toBe("Stack");
	});

	it("appends a trailing slash to page paths only", () => {
		expect(withTrailingSlash("/")).toBe("/");
		expect(withTrailingSlash("/blog")).toBe("/blog/");
		expect(withTrailingSlash("/blog/")).toBe("/blog/");
		expect(withTrailingSlash("/blog?page=2")).toBe("/blog/?page=2");
		expect(withTrailingSlash("/blog#latest")).toBe("/blog/#latest");
		expect(withTrailingSlash("/blog/release-v1.0")).toBe("/blog/release-v1.0/");
		expect(withTrailingSlash("/blog/release-v1.0?source=rss#changes")).toBe(
			"/blog/release-v1.0/?source=rss#changes",
		);
	});

	it("localizes explicit file paths without adding a trailing slash", () => {
		expect(getLocalizedPath("/rss.xml", "en", { kind: "file" })).toBe(
			"/rss.xml",
		);
		expect(getLocalizedPath("/rss.xml", "es", { kind: "file" })).toBe(
			"/es/rss.xml",
		);
		expect(
			getLocalizedPath("/og/en/post.png?v=2", "en", { kind: "file" }),
		).toBe("/og/en/post.png?v=2");
		expect(getLocalizedPath("/blog/release-v1.0", "es")).toBe(
			"/es/blog/release-v1.0/",
		);
	});

	it("builds localized paths with a trailing slash", () => {
		expect(getLocalizedPath("/", "en")).toBe("/");
		expect(getLocalizedPath("/", "es")).toBe("/es/");
		expect(getLocalizedPath("/blog", "en")).toBe("/blog/");
		expect(getLocalizedPath("/blog", "es")).toBe("/es/blog/");
		expect(getLocalizedPath("/blog/", "es")).toBe("/es/blog/");
		expect(getLocalizedPath("/blog/your-repo-should-own-the-setup", "es")).toBe(
			"/es/blog/your-repo-should-own-the-setup/",
		);
		expect(getLocalizedPath("https://urrutia.me/blog?page=2", "es")).toBe(
			"/es/blog/?page=2",
		);
	});

	it("removes locale prefixes from paths", () => {
		expect(getPathWithoutLocale("/")).toBe("/");
		expect(getPathWithoutLocale("/blog")).toBe("/blog");
		expect(getPathWithoutLocale("/es/blog")).toBe("/blog");
		expect(getPathWithoutLocale("/es")).toBe("/");
		expect(getPathWithoutLocale("/en/blog")).toBe("/blog");
		expect(getPathWithoutLocale("https://urrutia.me/es/blog/")).toBe("/blog/");
		expect(getPathWithoutLocale("/blog/your-repo-should-own-the-setup")).toBe(
			"/blog/your-repo-should-own-the-setup",
		);
	});

	it("removes locale prefixes from slugs", () => {
		expect(getSlugWithoutLocale("en/your-repo-should-own-the-setup")).toBe(
			"your-repo-should-own-the-setup",
		);
		expect(
			getSlugWithoutLocale("es/tu-repo-deberia-hacerse-cargo-del-setup"),
		).toBe("tu-repo-deberia-hacerse-cargo-del-setup");
	});

	it("normalizes and joins site URLs", () => {
		expect(
			getSiteUrl({
				site: new URL("https://urrutia.me/"),
				origin: "http://dev",
			}),
		).toBe("https://urrutia.me");
		expect(getSiteUrl({ origin: "http://localhost:4321" })).toBe(
			"http://localhost:4321",
		);
		expect(joinSiteUrl("https://urrutia.me", "/blog/")).toBe(
			"https://urrutia.me/blog/",
		);
		expect(joinSiteUrl("https://urrutia.me", "og/en/post.png")).toBe(
			"https://urrutia.me/og/en/post.png",
		);
		expect(
			joinSiteUrl("https://urrutia.me", "https://urrutia.me/es/blog/"),
		).toBe("https://urrutia.me/es/blog/");
	});

	it("builds localized site URLs", () => {
		expect(getLocalizedSiteUrl("https://urrutia.me", "/", "en")).toBe(
			"https://urrutia.me/",
		);
		expect(getLocalizedSiteUrl("https://urrutia.me", "/", "es")).toBe(
			"https://urrutia.me/es/",
		);
		expect(getLocalizedSiteUrl("https://urrutia.me", "/blog", "en")).toBe(
			"https://urrutia.me/blog/",
		);
		expect(getLocalizedSiteUrl("https://urrutia.me", "/blog", "es")).toBe(
			"https://urrutia.me/es/blog/",
		);
	});

	it("derives every locale for shared-slug pages", () => {
		const urls = getLocalizedUrls({
			siteUrl: "https://urrutia.me",
			pathWithoutLocale: "/blog/",
			locale: "es",
		});

		expect(urls).toEqual({
			canonicalUrl: "https://urrutia.me/es/blog/",
			alternateUrls: {
				en: "https://urrutia.me/blog/",
				es: "https://urrutia.me/es/blog/",
			},
			xDefaultUrl: "https://urrutia.me/blog/",
		});
	});

	it("builds canonical and hreflang URLs with translated slug overrides", () => {
		const input = {
			siteUrl: "https://urrutia.me",
			pathWithoutLocale: "/blog/your-repo-should-own-the-setup/",
			locale: "en" as const,
			alternateUrls: {
				en: "/blog/your-repo-should-own-the-setup/",
				es: "/es/blog/tu-repo-deberia-hacerse-cargo-del-setup/",
			},
		};
		const urls = getLocalizedUrls(input);

		expect(getCanonicalUrl(input)).toBe(
			"https://urrutia.me/blog/your-repo-should-own-the-setup/",
		);
		expect(getCanonicalUrl({ ...input, locale: "es" })).toBe(
			"https://urrutia.me/es/blog/tu-repo-deberia-hacerse-cargo-del-setup/",
		);
		expect(urls.canonicalUrl).toBe(
			"https://urrutia.me/blog/your-repo-should-own-the-setup/",
		);
		expect(urls.alternateUrls.en).toBe(
			"https://urrutia.me/blog/your-repo-should-own-the-setup/",
		);
		expect(urls.alternateUrls.es).toBe(
			"https://urrutia.me/es/blog/tu-repo-deberia-hacerse-cargo-del-setup/",
		);
		expect(urls.xDefaultUrl).toBe(
			"https://urrutia.me/blog/your-repo-should-own-the-setup/",
		);
	});

	it("omits locales that have no translation and points x-default at the canonical", () => {
		const urls = getLocalizedUrls({
			siteUrl: "https://urrutia.me",
			pathWithoutLocale: "/blog/solo-en-espanol/",
			locale: "es",
			alternateUrls: { es: "/es/blog/solo-en-espanol/" },
		});

		expect(urls).toEqual({
			canonicalUrl: "https://urrutia.me/es/blog/solo-en-espanol/",
			alternateUrls: { es: "https://urrutia.me/es/blog/solo-en-espanol/" },
			xDefaultUrl: "https://urrutia.me/es/blog/solo-en-espanol/",
		});
	});

	it("preserves absolute alternate URLs", () => {
		expect(
			getCanonicalUrl({
				siteUrl: "https://urrutia.me",
				pathWithoutLocale: "/blog/",
				locale: "es",
				alternateUrls: { es: "https://urrutia.me/es/blog/" },
			}),
		).toBe("https://urrutia.me/es/blog/");
	});

	it("normalizes path-like alternate URLs without duplicating locale prefixes", () => {
		const urls = getLocalizedUrls({
			siteUrl: "https://urrutia.me",
			pathWithoutLocale: "/blog/release-v1.0",
			locale: "es",
			alternateUrls: {
				en: "blog/release-v1.0?source=rss#changes",
				es: "/es/blog/version-v1.0",
			},
		});

		expect(urls).toEqual({
			canonicalUrl: "https://urrutia.me/es/blog/version-v1.0/",
			alternateUrls: {
				en: "https://urrutia.me/blog/release-v1.0/?source=rss#changes",
				es: "https://urrutia.me/es/blog/version-v1.0/",
			},
			xDefaultUrl: "https://urrutia.me/blog/release-v1.0/?source=rss#changes",
		});
	});

	it("keeps absolute alternate URLs unchanged and omits missing locales", () => {
		const url = "https://example.com/translated-post?source=rss#changes";
		const urls = getLocalizedUrls({
			siteUrl: "https://urrutia.me",
			pathWithoutLocale: "/blog/post",
			locale: "es",
			alternateUrls: { es: url },
		});

		expect(urls).toEqual({
			canonicalUrl: url,
			alternateUrls: { es: url },
			xDefaultUrl: url,
		});
	});
});
