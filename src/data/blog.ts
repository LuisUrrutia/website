import { getCollection, type CollectionEntry } from "astro:content";
import {
	matchesLocale,
	getAlternateLocale,
	getLocalizedPath,
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
 * Localized path of a post, e.g. "/es/blog/<slug>/".
 */
export function getBlogPostPath(post: Pick<BlogPost, "id">, locale: Locale) {
	return getLocalizedPath(`/blog/${getSlugWithoutLocale(post.id)}`, locale);
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
	const { totalPages } = await getPaginatedBlogPosts(locale);

	return Promise.all(
		Array.from({ length: Math.max(totalPages - 1, 0) }, async (_, i) => {
			const page = i + 2;
			return {
				params: { page: String(page) },
				props: await getPaginatedBlogPosts(locale, page),
			};
		}),
	);
}

/**
 * Generate static paths for individual blog posts.
 * Finds published translated versions and returns them in props.
 */
export async function getBlogPostStaticPaths(locale: Locale) {
	const alternateLocale = getAlternateLocale(locale);
	const [posts, alternatePosts] = await Promise.all([
		getBlogPosts(locale),
		getBlogPosts(alternateLocale),
	]);

	return posts.map((post) => {
		const { translationSlug } = post.data;
		const translatedPost = translationSlug
			? alternatePosts.find((p) => p.data.translationSlug === translationSlug)
			: undefined;

		return {
			params: { slug: getSlugWithoutLocale(post.id) },
			props: { post, translatedPost },
		};
	});
}
