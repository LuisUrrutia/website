import * as prettierPluginOxc from "@prettier/plugin-oxc";

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	plugins: [
		prettierPluginOxc,
		"prettier-plugin-astro",
		"prettier-plugin-packagejson",
	],
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};

export default config;
