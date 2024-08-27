import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import path from "path";

const isProd = import.meta.env.PROD;

// https://astro.build/config
export default defineConfig({
	output: "static",
	compressHTML: isProd,
	prefetch: true,
	integrations: [
		tailwind(),
		icon({
			include: {
				// Icons to include in the bundling
				hugeicons: ["instagram", "new-twitter-rectangle", "linkedin-01", "github-01", "mail-01"],
			},
		}),
		// TODO: Research on https://www.npmjs.com/package/astro-compress
	],
	site: "https://urrutia.me",
	vite: {
		build: {
			cssMinify: "lightningcss",
		},
		resolve: {
			alias: {
				"~": path.resolve(import.meta.dirname, "./src"),
			},
		},
	},
});
