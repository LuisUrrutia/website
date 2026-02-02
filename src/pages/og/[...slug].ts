import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

// Get all blog entries
const entries = await getCollection("blog");

// Map entries to an object with the page ID as key
// The ID format is like "en/git-worktree-interruption-proof-workflow"
const pages = Object.fromEntries(entries.map(({ data, id }) => [id, { data }]));

export const { getStaticPaths, GET } = await OGImageRoute({
	pages,
	param: "slug",
	getImageOptions: (_id, page: (typeof pages)[string]) => ({
		title: page.data.title,
		description: page.data.description,
		logo: {
			path: "./public/favicons/favicon-180x180.png",
			size: [80],
		},
		bgGradient: [[24, 24, 39]],
		border: {
			color: [99, 102, 241],
			width: 20,
			side: "inline-start",
		},
		padding: 60,
		fonts: [
			"https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff2",
			"https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff2",
		],
		font: {
			title: {
				size: 64,
				lineHeight: 1.2,
				families: ["Inter"],
				weight: "Bold",
				color: [255, 255, 255],
			},
			description: {
				size: 32,
				lineHeight: 1.4,
				families: ["Inter"],
				weight: "Normal",
				color: [156, 163, 175],
			},
		},
	}),
});
