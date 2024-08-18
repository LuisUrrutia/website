/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
	branches: ["main"],
	plugins: [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"@semantic-release/npm",
			{
				npmPublish: false,
			},
		],
		[
			"@semantic-release/github",
			{
				assets: [{ path: "/tmp/dist.tar.gz", label: "Static Site (tar.gz)" }],
			},
		],
		[
			"@semantic-release/exec",
			{
				verifyReleaseCmd: 'echo "next_version=${nextRelease.version}" >> $GITHUB_OUTPUT',
			},
		],
	],
};
