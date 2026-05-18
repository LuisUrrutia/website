import { describe, expect, it } from "vitest";

import {
	getLinkPolicy,
	getNewTabLinkAttributes,
	isExternalLink,
} from "@/lib/link-policy";

describe("link policy", () => {
	it("classifies external http URLs", () => {
		expect(isExternalLink("https://example.com")).toBe(true);
		expect(getLinkPolicy("https://example.com")).toMatchObject({
			isExternal: true,
			newTabAttributes: getNewTabLinkAttributes(),
		});
	});

	it("classifies same-origin absolute URLs as internal", () => {
		expect(isExternalLink("https://urrutia.me/about")).toBe(false);
		expect(getLinkPolicy("https://urrutia.me/about")).toMatchObject({
			isExternal: false,
			newTabAttributes: {},
		});
	});

	it("classifies relative URLs as internal", () => {
		expect(isExternalLink("/blog/")).toBe(false);
		expect(getLinkPolicy("/blog/")).toMatchObject({
			isExternal: false,
			newTabAttributes: {},
		});
	});

	it("classifies hash links as internal", () => {
		expect(isExternalLink("#stack")).toBe(false);
		expect(getLinkPolicy("#stack")).toMatchObject({
			isExternal: false,
			newTabAttributes: {},
		});
	});

	it("keeps mailto links non-external but can preserve existing new-tab behavior", () => {
		expect(isExternalLink("mailto:test@example.com")).toBe(false);
		expect(
			getLinkPolicy("mailto:test@example.com", { openInNewTab: true }),
		).toMatchObject({
			isExternal: false,
			newTabAttributes: getNewTabLinkAttributes(),
		});
	});

	it("keeps tel links non-external but can preserve existing new-tab behavior", () => {
		expect(isExternalLink("tel:+123456789")).toBe(false);
		expect(
			getLinkPolicy("tel:+123456789", { openInNewTab: true }),
		).toMatchObject({
			isExternal: false,
			newTabAttributes: getNewTabLinkAttributes(),
		});
	});
});
