// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import compressor from "astro-compressor";
import sitemap from "@astrojs/sitemap";
import { createSitemapSerializer } from "./src/integrations/sitemap-hreflang";

const SITE_URL = "https://urrutia.me";
const serializeSitemapItem = createSitemapSerializer({
	blogDirectory: new URL("./src/content/blog/", import.meta.url),
	site: new URL(SITE_URL),
});

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
	// Pages build as directories, so this is the URL form the host actually serves.
	trailingSlash: "always",
	// Keep Astro 6's whitespace behavior; Astro 7 defaults to JSX-style compression.
	compressHTML: true,
	fonts: [
		{
			provider: fontProviders.local(),
			name: "Inter Variable",
			cssVariable: "--font-inter",
			fallbacks: [
				"ui-sans-serif",
				"system-ui",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji",
				"sans-serif",
			],
			options: {
				variants: [
					{
						src: ["./src/assets/fonts/InterVariable.woff2"],
						weight: "100 900",
						style: "normal",
						display: "swap",
					},
				],
			},
		},
	],

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
			// Inline assets up to 10KB (default is 4KB)
			assetsInlineLimit: 10 * 1024,
		},
	},

	build: {
		// Inline every generated stylesheet into the page HTML.
		inlineStylesheets: "always",
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
			serialize: serializeSitemapItem,
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
			gzip: true,
		}),
	],
});
