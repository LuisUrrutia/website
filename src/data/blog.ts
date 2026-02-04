import { getCollection, type CollectionEntry } from "astro:content";
import {
	matchesLocale,
	getAlternateLocale,
	getSlugWithoutLocale,
	type Locale,
} from "@/i18n";

/** Number of blog posts to display per page */
export const POSTS_PER_PAGE = 10;

/** Blog post type from content collection */
export type BlogPost = CollectionEntry<"blog">;

/**
 * Get all published blog posts for a locale, sorted by date (newest first).
 */
export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
	const posts = await getCollection("blog", ({ data }) =>
		matchesLocale(locale)(data),
	);
	return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Paginate blog posts for a given locale.
 * Returns paginated posts, current page info, and total pages.
 */
export async function getPaginatedBlogPosts(
	locale: Locale,
	page: number = 1,
): Promise<{
	posts: BlogPost[];
	currentPage: number;
	totalPages: number;
}> {
	const allPosts = await getBlogPosts(locale);
	const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
	const start = (page - 1) * POSTS_PER_PAGE;
	const posts = allPosts.slice(start, start + POSTS_PER_PAGE);

	return { posts, currentPage: page, totalPages };
}

/**
 * Generate static paths for paginated blog pages (page 2+).
 */
export async function getBlogPageStaticPaths(locale: Locale) {
	const allPosts = await getBlogPosts(locale);
	const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

	return Array.from({ length: totalPages - 1 }, (_, i) => {
		const page = i + 2;
		const start = (page - 1) * POSTS_PER_PAGE;

		return {
			params: { page: String(page) },
			props: {
				posts: allPosts.slice(start, start + POSTS_PER_PAGE),
				currentPage: page,
				totalPages,
			},
		};
	});
}

/**
 * Generate static paths for individual blog posts.
 * Finds translated versions and returns them in props.
 */
export async function getBlogPostStaticPaths(locale: Locale) {
	const alternateLocale = getAlternateLocale(locale);

	const posts = await getCollection("blog", ({ data }) =>
		matchesLocale(locale)(data),
	);

	const allPosts = await getCollection("blog");

	return posts.map((post) => {
		const slug = getSlugWithoutLocale(post.id);

		// Find the translated version
		const translatedPost = allPosts.find(
			(p) =>
				p.data.lang === alternateLocale &&
				p.data.translationSlug === post.data.translationSlug &&
				p.id !== post.id,
		);

		return {
			params: { slug },
			props: { post, translatedPost },
		};
	});
}
