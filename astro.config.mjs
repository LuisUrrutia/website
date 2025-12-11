// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
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
