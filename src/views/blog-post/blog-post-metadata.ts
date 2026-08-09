import { calculateReadingTime, formatReadingTime } from "@/lib/formatters";
import {
	getAlternateLocale,
	getLocalizedPath,
	getLocalizedSiteUrl,
	getSlugWithoutLocale,
	intlLocales,
	joinSiteUrl,
	type Locale,
	type TranslationKey,
} from "@/i18n";

export interface BlogPostData {
	title: string;
	description: string;
	date: Date;
	updatedDate?: Date;
	category: string;
	tags: string[];
}

export interface BlogPostLike {
	id: string;
	body?: string;
	data: BlogPostData;
}

export interface BreadcrumbItem {
	name: string;
	url: string;
}

export interface BlogPostPageMetadata {
	readingTime: number;
	formattedReadingTime: string;
	formattedDate: string;
	isoDate: string;
	formattedUpdatedDate: string | null;
	slug: string;
	alternateLang: Locale;
	alternateUrl: string | null;
	currentPostUrl: string;
	alternateUrls: Partial<Record<Locale, string>> | undefined;
	titleTransitionName: string;
	pillTransitionName: string;
	siteUrl: string;
	postUrl: string;
	ogImage: string;
	absoluteOgImage: string;
	breadcrumbItems: BreadcrumbItem[];
}

interface PrepareBlogPostPageMetadataOptions {
	post: BlogPostLike;
	translatedPost?: BlogPostLike;
	lang: Locale;
	t: (key: TranslationKey) => string;
	siteUrl: string;
}

const dateFormat: Intl.DateTimeFormatOptions = {
	day: "numeric",
	month: "long",
	year: "numeric",
};

export function prepareBlogPostPageMetadata({
	post,
	translatedPost,
	lang,
	t,
	siteUrl,
}: PrepareBlogPostPageMetadataOptions): BlogPostPageMetadata {
	const readingTime = calculateReadingTime(post.body ?? "");
	const formattedReadingTime = formatReadingTime(readingTime, t);
	const formattedDate = post.data.date.toLocaleDateString(
		intlLocales[lang],
		dateFormat,
	);
	const isoDate = post.data.date.toISOString().split("T")[0];
	const formattedUpdatedDate = post.data.updatedDate
		? post.data.updatedDate.toLocaleDateString(intlLocales[lang], dateFormat)
		: null;

	const slug = getSlugWithoutLocale(post.id);
	const alternateLang = getAlternateLocale(lang);
	const alternateUrl = translatedPost
		? getLocalizedPath(
				`/blog/${getSlugWithoutLocale(translatedPost.id)}`,
				alternateLang,
			)
		: null;
	const currentPostUrl = getLocalizedPath(`/blog/${slug}`, lang);
	const alternateUrls = alternateUrl
		? {
				[lang]: currentPostUrl,
				[alternateLang]: alternateUrl,
			}
		: undefined;
	const postUrl = getLocalizedSiteUrl(siteUrl, `/blog/${slug}`, lang);
	const ogImage = `/og/${post.id}.png`;

	return {
		readingTime,
		formattedReadingTime,
		formattedDate,
		isoDate,
		formattedUpdatedDate,
		slug,
		alternateLang,
		alternateUrl,
		currentPostUrl,
		alternateUrls,
		titleTransitionName: `post-title-${slug}`,
		pillTransitionName: `post-pill-${slug}`,
		siteUrl,
		postUrl,
		ogImage,
		absoluteOgImage: joinSiteUrl(siteUrl, ogImage),
		breadcrumbItems: [
			{
				name: t("breadcrumb.home"),
				url: getLocalizedSiteUrl(siteUrl, "/", lang),
			},
			{
				name: t("breadcrumb.blog"),
				url: getLocalizedSiteUrl(siteUrl, "/blog", lang),
			},
			{ name: post.data.title, url: postUrl },
		],
	};
}
