/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
	branches: ["main"],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/github",
			{
				assets: [{ path: "/tmp/dist.tar.gz", label: "Static Site" }],
			},
		],
		[
			"@semantic-release/npm",
			{
				npmPublish: false,
			},
		],
	],
};
