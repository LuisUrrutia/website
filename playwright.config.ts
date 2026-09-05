import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/browser",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: 2,
	use: {
		baseURL: "http://127.0.0.1:4322",
		trace: "retain-on-failure",
	},
	projects: [
		{ name: "desktop", use: { ...devices["Desktop Chrome"] } },
		{
			name: "mobile",
			use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
		},
	],
	webServer: {
		command: "node scripts/preview-for-tests.mjs",
		url: "http://127.0.0.1:4322",
		reuseExistingServer: false,
	},
});
