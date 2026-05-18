import { describe, expect, it } from "vitest";

import {
	getAlternateLocale,
	getCanonicalPath,
	getCanonicalUrl,
	getLocalizedPath,
	getLocalizedSiteUrl,
	getLocalizedUrls,
	getLocaleRedirectPath,
	getPathWithoutLocale,
	getSiteUrl,
	getSlugWithoutLocale,
	joinSiteUrl,
	isDefaultLocale,
} from "@/i18n/utils";

describe("i18n utils", () => {
	it("detects the default locale", () => {
		expect(isDefaultLocale("en")).toBe(true);
		expect(isDefaultLocale("es")).toBe(false);
	});

	it("returns the alternate locale", () => {
		expect(getAlternateLocale("en")).toBe("es");
		expect(getAlternateLocale("es")).toBe("en");
	});

	it("builds localized paths", () => {
		expect(getLocalizedPath("/", "en")).toBe("/");
		expect(getLocalizedPath("/", "es")).toBe("/es/");
		expect(getLocalizedPath("/blog", "en")).toBe("/blog");
		expect(getLocalizedPath("/blog", "es")).toBe("/es/blog");
		expect(getLocalizedPath("/blog/your-repo-should-own-the-setup", "es")).toBe(
			"/es/blog/your-repo-should-own-the-setup",
		);
	});

	it("removes locale prefixes from paths", () => {
		expect(getPathWithoutLocale("/")).toBe("/");
		expect(getPathWithoutLocale("/blog")).toBe("/blog");
		expect(getPathWithoutLocale("/es/blog")).toBe("/blog");
		expect(getPathWithoutLocale("/es")).toBe("/");
		expect(getPathWithoutLocale("/en/blog")).toBe("/blog");
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

	it("builds canonical paths without introducing an English prefix", () => {
		expect(getCanonicalPath("/", "en")).toBe("/");
		expect(getCanonicalPath("/", "es")).toBe("/es/");
		expect(getCanonicalPath("/blog", "en")).toBe("/blog");
		expect(getCanonicalPath("/blog", "es")).toBe("/es/blog");
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
		expect(joinSiteUrl("https://urrutia.me", "/blog")).toBe(
			"https://urrutia.me/blog",
		);
		expect(joinSiteUrl("https://urrutia.me", "og/en/post.png")).toBe(
			"https://urrutia.me/og/en/post.png",
		);
		expect(
			joinSiteUrl("https://urrutia.me", "https://urrutia.me/es/blog"),
		).toBe("https://urrutia.me/es/blog");
	});

	it("builds localized site URLs", () => {
		expect(getLocalizedSiteUrl("https://urrutia.me", "/", "en")).toBe(
			"https://urrutia.me/",
		);
		expect(getLocalizedSiteUrl("https://urrutia.me", "/", "es")).toBe(
			"https://urrutia.me/es/",
		);
		expect(getLocalizedSiteUrl("https://urrutia.me", "/blog", "en")).toBe(
			"https://urrutia.me/blog",
		);
		expect(getLocalizedSiteUrl("https://urrutia.me", "/blog", "es")).toBe(
			"https://urrutia.me/es/blog",
		);
	});

	it("builds canonical and hreflang URLs with translated slug overrides", () => {
		const input = {
			siteUrl: "https://urrutia.me",
			pathWithoutLocale: "/blog/your-repo-should-own-the-setup",
			locale: "en" as const,
			alternateUrls: {
				en: "/blog/your-repo-should-own-the-setup",
				es: "/es/blog/tu-repo-deberia-hacerse-cargo-del-setup",
			},
		};
		const urls = getLocalizedUrls(input);

		expect(getCanonicalUrl(input)).toBe(
			"https://urrutia.me/blog/your-repo-should-own-the-setup",
		);
		expect(
			getCanonicalUrl({
				...input,
				locale: "es",
			}),
		).toBe(
			"https://urrutia.me/es/blog/tu-repo-deberia-hacerse-cargo-del-setup",
		);
		expect(urls.canonicalUrl).toBe(
			"https://urrutia.me/blog/your-repo-should-own-the-setup",
		);
		expect(urls.alternateUrls.en).toBe(
			"https://urrutia.me/blog/your-repo-should-own-the-setup",
		);
		expect(urls.alternateUrls.es).toBe(
			"https://urrutia.me/es/blog/tu-repo-deberia-hacerse-cargo-del-setup",
		);
		expect(urls.xDefaultUrl).toBe(
			"https://urrutia.me/blog/your-repo-should-own-the-setup",
		);
	});

	it("preserves absolute alternate URLs", () => {
		expect(
			getCanonicalUrl({
				siteUrl: "https://urrutia.me",
				pathWithoutLocale: "/blog",
				locale: "es",
				alternateUrls: { es: "https://urrutia.me/es/blog" },
			}),
		).toBe("https://urrutia.me/es/blog");
	});

	it("computes first-visit locale redirect paths", () => {
		expect(
			getLocaleRedirectPath({
				pathname: "/",
				currentLocale: "en",
				browserLocale: "es",
			}),
		).toBe("/es/");
		expect(
			getLocaleRedirectPath({
				pathname: "/blog",
				search: "?page=2",
				currentLocale: "en",
				browserLocale: "es",
			}),
		).toBe("/es/blog?page=2");
		expect(
			getLocaleRedirectPath({
				pathname: "/es/blog",
				currentLocale: "es",
				browserLocale: "en",
			}),
		).toBe("/blog");
		expect(
			getLocaleRedirectPath({
				pathname: "/es/blog/tu-repo-deberia-hacerse-cargo-del-setup",
				currentLocale: "es",
				browserLocale: "en",
			}),
		).toBe("/blog/tu-repo-deberia-hacerse-cargo-del-setup");
		expect(
			getLocaleRedirectPath({
				pathname: "/es/blog",
				currentLocale: "es",
				browserLocale: "es",
			}),
		).toBeNull();
		expect(
			getLocaleRedirectPath({
				pathname: "/blog",
				currentLocale: "en",
				browserLocale: "fr",
			}),
		).toBeNull();
	});
});
