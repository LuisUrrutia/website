import type { LinkItem, SitemapItem } from "@astrojs/sitemap";
import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getLocalizedPath, isValidLocale, locales, type Locale } from "@/i18n";

interface SitemapSerializerOptions {
	blogDirectory: URL;
	site: URL;
}

type TranslationUrls = Partial<Record<Locale, string>>;

async function getMdxFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await getMdxFiles(path)));
		} else if (entry.name.endsWith(".mdx")) {
			files.push(path);
		}
	}

	return files;
}

function getPostUrl(site: URL, locale: Locale, slug: string): string {
	return new URL(getLocalizedPath(`/blog/${slug}`, locale), site).href;
}

async function getTranslationLinksByUrl({
	blogDirectory,
	site,
}: SitemapSerializerOptions): Promise<Map<string, LinkItem[]>> {
	const postsByTranslationSlug = new Map<string, TranslationUrls>();
	const files = await getMdxFiles(fileURLToPath(blogDirectory));

	for (const file of files) {
		const content = await readFile(file, "utf-8");
		const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
		if (!frontmatterMatch) continue;

		const frontmatter = frontmatterMatch[1];
		// Drafts are never built, so linking to them would point at a 404.
		if (/^draft:\s*true\s*$/m.test(frontmatter)) continue;

		const langMatch = frontmatter.match(/^lang:\s*["']?([a-z]{2})["']?\s*$/m);
		const translationSlugMatch = frontmatter.match(
			/^translationSlug:\s*["']?([^"'\r\n]+?)["']?\s*$/m,
		);
		if (!langMatch || !translationSlugMatch) continue;

		const locale = langMatch[1];
		if (!isValidLocale(locale)) continue;

		const translationSlug = translationSlugMatch[1].trim();
		const fileSlug = basename(file, ".mdx");
		const translations = postsByTranslationSlug.get(translationSlug) ?? {};
		translations[locale] = getPostUrl(site, locale, fileSlug);
		postsByTranslationSlug.set(translationSlug, translations);
	}

	const linksByUrl = new Map<string, LinkItem[]>();
	for (const translations of postsByTranslationSlug.values()) {
		const links: LinkItem[] = [];
		for (const locale of locales) {
			const url = translations[locale];
			if (url) links.push({ lang: locale, url });
		}

		if (links.length < 2) continue;
		for (const { url } of links) linksByUrl.set(url, links);
	}

	return linksByUrl;
}

export function createSitemapSerializer(
	options: SitemapSerializerOptions,
): (item: SitemapItem) => Promise<SitemapItem> {
	let linksByUrlPromise: Promise<Map<string, LinkItem[]>> | undefined;

	return async (item) => {
		linksByUrlPromise ??= getTranslationLinksByUrl(options);
		const links = (await linksByUrlPromise).get(item.url);
		return links ? { ...item, links } : item;
	};
}
