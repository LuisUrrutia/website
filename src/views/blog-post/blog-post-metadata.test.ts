import { describe, expect, it } from "vitest";

import { useTranslations } from "@/i18n";
import {
	prepareBlogPostPageMetadata,
	type BlogPostLike,
} from "@/views/blog-post/blog-post-metadata";

const englishPost: BlogPostLike = {
	id: "en/your-repo-should-own-the-setup",
	body: "One two three four five.",
	data: {
		title: "Your Repo Should Own the Setup",
		description: "A post about repository-owned setup.",
		date: new Date("2026-05-17T00:00:00.000Z"),
		category: "Developer Tools",
		tags: ["Mise", "Developer Tools"],
	},
};

const spanishPost: BlogPostLike = {
	id: "es/tu-repo-deberia-hacerse-cargo-del-setup",
	body: "Uno dos tres cuatro cinco.",
	data: {
		title: "Tu repo debería hacerse cargo del setup",
		description: "Un post sobre setup en el repositorio.",
		date: new Date("2026-05-17T00:00:00.000Z"),
		updatedDate: new Date("2026-05-18T00:00:00.000Z"),
		category: "Developer Tools",
		tags: ["Mise", "Developer Tools"],
	},
};

describe("prepareBlogPostPageMetadata", () => {
	it("prepares English URLs, SEO metadata, reading time, and transitions", () => {
		const metadata = prepareBlogPostPageMetadata({
			post: englishPost,
			translatedPost: spanishPost,
			lang: "en",
			t: useTranslations("en"),
			siteUrl: "https://urrutia.me",
		});

		expect(metadata.slug).toBe("your-repo-should-own-the-setup");
		expect(metadata.readingTime).toBe(1);
		expect(metadata.formattedReadingTime).toBe("1 min read");
		expect(metadata.formattedDate).toBe("May 17, 2026");
		expect(metadata.isoDate).toBe("2026-05-17");
		expect(metadata.formattedUpdatedDate).toBeNull();
		expect(metadata.alternateLang).toBe("es");
		expect(metadata.alternateUrl).toBe(
			"/es/blog/tu-repo-deberia-hacerse-cargo-del-setup/",
		);
		expect(metadata.alternateUrls).toEqual({
			en: "/blog/your-repo-should-own-the-setup/",
			es: "/es/blog/tu-repo-deberia-hacerse-cargo-del-setup/",
		});
		expect(metadata.postUrl).toBe(
			"https://urrutia.me/blog/your-repo-should-own-the-setup/",
		);
		expect(metadata.ogImage).toBe("/og/en/your-repo-should-own-the-setup.png");
		expect(metadata.absoluteOgImage).toBe(
			"https://urrutia.me/og/en/your-repo-should-own-the-setup.png",
		);
		expect(metadata.titleTransitionName).toBe(
			"post-title-your-repo-should-own-the-setup",
		);
		expect(metadata.pillTransitionName).toBe(
			"post-pill-your-repo-should-own-the-setup",
		);
		expect(metadata.breadcrumbItems).toEqual([
			{ name: "Home", url: "https://urrutia.me/" },
			{ name: "Engineering Notes", url: "https://urrutia.me/blog/" },
			{
				name: "Your Repo Should Own the Setup",
				url: "https://urrutia.me/blog/your-repo-should-own-the-setup/",
			},
		]);
	});

	it("prepares Spanish locale URLs and updated date", () => {
		const metadata = prepareBlogPostPageMetadata({
			post: spanishPost,
			translatedPost: englishPost,
			lang: "es",
			t: useTranslations("es"),
			siteUrl: "https://urrutia.me",
		});

		expect(metadata.formattedReadingTime).toBe("1 min de lectura");
		expect(metadata.formattedDate).toBe("17 de mayo de 2026");
		expect(metadata.formattedUpdatedDate).toBe("18 de mayo de 2026");
		expect(metadata.alternateLang).toBe("en");
		expect(metadata.alternateUrl).toBe("/blog/your-repo-should-own-the-setup/");
		expect(metadata.currentPostUrl).toBe(
			"/es/blog/tu-repo-deberia-hacerse-cargo-del-setup/",
		);
		expect(metadata.postUrl).toBe(
			"https://urrutia.me/es/blog/tu-repo-deberia-hacerse-cargo-del-setup/",
		);
		expect(metadata.breadcrumbItems[0]).toEqual({
			name: "Inicio",
			url: "https://urrutia.me/es/",
		});
	});

	it("lists only the current locale when no translation exists", () => {
		const metadata = prepareBlogPostPageMetadata({
			post: englishPost,
			lang: "en",
			t: useTranslations("en"),
			siteUrl: "https://urrutia.me",
		});

		expect(metadata.alternateUrl).toBeNull();
		expect(metadata.alternateUrls).toEqual({
			en: "/blog/your-repo-should-own-the-setup/",
		});
	});
});
