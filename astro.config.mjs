import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

const isProd = import.meta.env.PROD;

// https://astro.build/config
export default defineConfig({
	compressHTML: isProd,
	prefetch: true,
	integrations: [tailwind()],
	site: "https://urrutia.me",
	vite: {
		css: {
			devSourcemap: true,
			transformer: "lightningcss",
			lightningcss: {
				targets: browserslistToTargets(browserslist(">= 0.25%")),
			},
		},
		build: {
			cssMinify: "lightningcss",
		},
	},
});
