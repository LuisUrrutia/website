// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import compressor from "astro-compressor";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	site: "https://urrutia.me",

	markdown: {
		shikiConfig: {
			theme: "material-theme-ocean",
		},
	},

	i18n: {
		locales: ["en", "es"],
		defaultLocale: "en",
		routing: {
			prefixDefaultLocale: false,
		},
	},

	vite: {
		plugins: [tailwindcss()],
		build: {
			// Inline assets up to 7KB (default is 4KB)
			assetsInlineLimit: 10 * 1024,
		},
	},

	build: {
		// Auto-inline CSS based on assetsInlineLimit threshold
		inlineStylesheets: "always",
	},

	experimental: {
		svgo: true,
	},

	integrations: [
		mdx(),
		sitemap({
			i18n: {
				defaultLocale: "en",
				locales: {
					en: "en",
					es: "es",
				},
			},
		}),
		(await import("@playform/compress")).default({
			CSS: true,
			HTML: {
				"html-minifier-terser": {
					removeAttributeQuotes: false,
					conservativeCollapse: true,
				},
			},
			Image: true,
			JavaScript: true,
			JSON: true,
			SVG: true,
		}),
		compressor({
			brotli: true,
			gzip: false,
		}),
	],
});
