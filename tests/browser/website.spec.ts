import { expect, test } from "@playwright/test";

test("first Spanish visit resolves the translated article", async ({
	browser,
	baseURL,
}) => {
	const context = await browser.newContext({ locale: "es-ES" });
	// Keep canonical production URLs on the local build under test.
	await context.route("https://urrutia.me/**", async (route) => {
		const target = new URL(route.request().url());
		await route.fulfill({
			response: await route.fetch({
				url: `${baseURL}${target.pathname}${target.search}`,
			}),
		});
	});
	const page = await context.newPage();
	await page.goto(
		`${baseURL}/blog/git-worktree-interruption-proof-workflow/?source=test`,
	);
	await expect(page).toHaveURL(
		/\/es\/blog\/git-worktree-workflow-a-prueba-de-interrupciones\/\?source=test$/,
	);
	await expect(page.locator("html")).toHaveAttribute("lang", "es");
	await expect(page.locator("h1")).not.toContainText("404");
	await context.close();
});

test("system theme survives denied storage", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "dark" });
	await page.addInitScript(() => {
		Object.defineProperty(Storage.prototype, "getItem", {
			value() {
				throw new DOMException("Storage blocked", "SecurityError");
			},
		});
	});
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await page.goto("/");
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
	await expect(page.locator("html")).toHaveAttribute("data-theme-mode", "auto");
	expect(errors).toEqual([]);
});

test("first Spanish visit preserves an explicit article section", async ({
	page,
}) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, "language", { get: () => "es-ES" });
	});
	await page.goto(
		"/blog/git-worktree-interruption-proof-workflow/#why-worktrees-are-suddenly-everywhere",
	);
	await expect(page).toHaveURL(
		/\/blog\/git-worktree-interruption-proof-workflow\/#why-worktrees-are-suddenly-everywhere$/,
	);
	await expect(page.locator("html")).toHaveAttribute("lang", "en");
	await expect(
		page.locator("#why-worktrees-are-suddenly-everywhere"),
	).toBeInViewport();
});

test("hero reserves its intended image height", async ({ page }) => {
	await page.goto("/");
	const photo = page.locator("#hero picture img");
	await expect(photo).toHaveCSS("height", "252px");
	const sourceHeight = await photo.evaluate(async (image: HTMLImageElement) => {
		await image.decode();
		return image.naturalHeight;
	});
	expect(sourceHeight).toBeGreaterThanOrEqual(252);
});

test("company links expose visible keyboard focus", async ({ page }) => {
	await page.goto("/");
	const company = page.getByRole("link", {
		name: "Rappi (opens in new tab)",
		exact: true,
	});
	await company.focus();
	await expect(company).toBeFocused();
	await expect(company).toBeInViewport();
	await expect(company.locator("xpath=ancestor::ul")).toHaveCSS(
		"clip-path",
		"none",
	);
});

test("company animation can be paused", async ({ page }) => {
	await page.goto("/");
	const pause = page.getByRole("button", { name: "Pause company animation" });
	await pause.click();
	await expect(pause).toHaveAttribute("aria-pressed", "true");
	await expect(page.locator(".marquee-track")).toHaveCSS(
		"animation-play-state",
		"paused",
	);
	await pause.click();
	await expect(pause).toHaveAttribute("aria-pressed", "false");
});

test("reduced motion exposes every company without animation", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/");
	await expect(page.locator(".marquee-track")).toBeHidden();
	await expect(page.locator(".company-list")).toHaveCSS("clip-path", "none");
	await expect(page.locator(".company-list a")).toHaveCount(6);
});

test("Spanish routes render without overflow", async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem("has-visited", "true"));
	for (const path of [
		"/es/",
		"/es/blog/",
		"/es/blog/git-worktree-workflow-a-prueba-de-interrupciones/",
	]) {
		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page.locator("html")).toHaveAttribute("lang", "es");
		await expect(page.locator("#main-content")).toBeVisible();
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= window.innerWidth,
			),
		).toBe(true);
	}
});

test("article links and screenshots work on the built page", async ({
	page,
}) => {
	await page.goto("/blog/git-worktree-interruption-proof-workflow/");
	const link = page.getByRole("link", {
		name: "Worktrunk (opens in new tab)",
		exact: true,
	});
	await expect(link).toHaveCSS("text-decoration-line", "underline");
	const screenshot = page.getByAltText(
		"Split terminal showing two branches open simultaneously in separate directories",
	);
	await screenshot.scrollIntoViewIfNeeded();
	await expect(screenshot).toHaveAttribute("srcset", /640w/);
	await expect(screenshot).toHaveAttribute("sizes", /100vw/);
	const disclosure = page.locator("details").first();
	await disclosure.locator("summary").click();
	await expect(disclosure).toHaveAttribute("open", "");
});
