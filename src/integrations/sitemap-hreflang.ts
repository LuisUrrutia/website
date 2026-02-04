import type { AstroIntegration } from "astro";
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Recursively get all files matching an extension in a directory.
 */
async function getFiles(dir: string, ext: string): Promise<string[]> {
	const entries = await readdir(dir, { withFileTypes: true });
	const files: string[] = [];

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await getFiles(fullPath, ext)));
		} else if (entry.name.endsWith(ext)) {
			files.push(fullPath);
		}
	}

	return files;
}

/**
 * Custom Astro integration to add hreflang links to blog posts in the sitemap.
 * Runs after the sitemap is generated and patches it with translation links.
 */
export function sitemapHreflang(): AstroIntegration {
	return {
		name: "sitemap-hreflang",
		hooks: {
			"astro:build:done": async ({ dir, logger }) => {
				const distPath = dir.pathname;

				// Find all blog MDX files and extract translation mappings
				const blogDir = join(process.cwd(), "src/content/blog");
				const translationMap = new Map<string, { en?: string; es?: string }>();

				// Read all MDX files
				const mdxFiles = await getFiles(blogDir, ".mdx");

				// Parse frontmatter and build translation groups
				const postsBySlug = new Map<
					string,
					Array<{ lang: "en" | "es"; fileSlug: string }>
				>();

				for (const filePath of mdxFiles) {
					const content = await readFile(filePath, "utf-8");
					const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
					if (!frontmatterMatch) continue;

					const frontmatter = frontmatterMatch[1];
					const langMatch = frontmatter.match(/lang:\s*["']?(en|es)["']?/);
					const translationSlugMatch = frontmatter.match(
						/translationSlug:\s*["']?([^"'\n]+)["']?/,
					);

					if (!langMatch || !translationSlugMatch) continue;

					const lang = langMatch[1] as "en" | "es";
					const translationSlug = translationSlugMatch[1].trim();
					// Extract just the filename without the lang directory prefix
					// e.g., /en/git-worktree.mdx -> git-worktree
					const fileSlug = filePath
						.split("/")
						.pop()!
						.replace(/\.mdx$/, "");

					const group = postsBySlug.get(translationSlug) || [];
					group.push({ lang, fileSlug });
					postsBySlug.set(translationSlug, group);
				}

				// Build URL translation map
				for (const group of postsBySlug.values()) {
					if (group.length < 2) continue;

					const urls: { en?: string; es?: string } = {};
					for (const { lang, fileSlug } of group) {
						urls[lang] =
							lang === "en"
								? `https://urrutia.me/blog/${fileSlug}/`
								: `https://urrutia.me/es/blog/${fileSlug}/`;
					}

					for (const { lang, fileSlug } of group) {
						const url =
							lang === "en"
								? `https://urrutia.me/blog/${fileSlug}/`
								: `https://urrutia.me/es/blog/${fileSlug}/`;
						translationMap.set(url, urls);
					}
				}

				if (translationMap.size === 0) {
					logger.info("No blog translations found for hreflang");
					return;
				}

				// Find and patch sitemap files
				const files = await readdir(distPath);
				const sitemapFiles = files.filter(
					(f) => f.startsWith("sitemap") && f.endsWith(".xml"),
				);

				for (const filename of sitemapFiles) {
					const filepath = join(distPath, filename);
					let content = await readFile(filepath, "utf-8");
					let modified = false;

					for (const [url, translations] of translationMap) {
						// Find the URL entry without hreflang links
						const urlPattern = new RegExp(
							`<url><loc>${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc></url>`,
						);

						if (urlPattern.test(content)) {
							const hreflangLinks = [
								translations.en
									? `<xhtml:link rel="alternate" hreflang="en" href="${translations.en}"/>`
									: "",
								translations.es
									? `<xhtml:link rel="alternate" hreflang="es" href="${translations.es}"/>`
									: "",
							]
								.filter(Boolean)
								.join("");

							content = content.replace(
								urlPattern,
								`<url><loc>${url}</loc>${hreflangLinks}</url>`,
							);
							modified = true;
						}
					}

					if (modified) {
						await writeFile(filepath, content, "utf-8");
						logger.info(`Added hreflang links to ${filename}`);
					}
				}
			},
		},
	};
}
