// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
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
	],
});
