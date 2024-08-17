/** @type {import("prettier").Config} */
export default {
	printWidth: 100,
	semi: true,
	singleQuote: false,
	jsxSingleQuote: false,
	quoteProps: "consistent",
	trailingComma: "es5",
	arrowParens: "always",
	plugins: [
		"prettier-plugin-astro",
		"prettier-plugin-packagejson",
		"prettier-plugin-tailwindcss",
		"prettier-plugin-organize-imports",
		"prettier-plugin-astro-organize-imports",
	],
	overrides: [
		{
			files: ["*.json", "*.md", "*.toml", "*.yml", "*.webmanifest"],
			options: {
				useTabs: false,
			},
		},
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};
