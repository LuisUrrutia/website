import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.mdx", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.date(),
		updatedDate: z.date().optional(),
		category: z.string(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		lang: z.enum(["en", "es"]),
		/** Slug for the alternate language version (without locale prefix) */
		translationSlug: z.string().optional(),
	}),
});

export const collections = { blog };
