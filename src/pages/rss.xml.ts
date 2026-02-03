import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { matchesLocale, getSlugWithoutLocale, useTranslations } from "@/i18n";

export async function GET(context: APIContext) {
	const t = useTranslations("en");

	const posts = await getCollection("blog", ({ data }) =>
		matchesLocale("en")(data),
	);

	posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

	return rss({
		title: t("rss.title"),
		description: t("rss.description"),
		site: context.site!,
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: post.data.description,
			link: `/blog/${getSlugWithoutLocale(post.id)}/`,
			categories: post.data.tags,
		})),
		customData: `<language>en</language>`,
	});
}
