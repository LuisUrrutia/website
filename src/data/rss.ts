import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBlogPostPath, getBlogPosts } from "@/data/blog";
import { useTranslations, type Locale } from "@/i18n";

/**
 * Build the RSS feed for one locale. Shared by every `rss.xml` route.
 */
export async function buildRssFeed(
	locale: Locale,
	context: APIContext,
): Promise<Response> {
	if (!context.site) throw new Error("The RSS feed requires Astro's site URL");

	const t = useTranslations(locale);
	const posts = await getBlogPosts(locale);

	return rss({
		title: t("rss.title"),
		description: t("rss.description"),
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.description,
			link: getBlogPostPath(post, locale),
			categories: post.data.tags,
		})),
		customData: `<language>${locale}</language>`,
	});
}
