export const SITE_ORIGIN = "https://urrutia.me";

export const newTabLinkAttributes = {
	target: "_blank",
	rel: "noopener noreferrer",
	referrerpolicy: "strict-origin-when-cross-origin",
} as const;

export interface LinkPolicy {
	href: string | undefined;
	isExternal: boolean;
	newTabAttributes: typeof newTabLinkAttributes | Record<string, never>;
}

function getHrefString(href: unknown): string | undefined {
	if (typeof href === "string") return href;
	if (href instanceof URL) return href.toString();
	return undefined;
}

export function isExternalLink(href: unknown): boolean {
	const hrefString = getHrefString(href);
	if (!hrefString) return false;

	let url: URL;
	try {
		url = new URL(hrefString, SITE_ORIGIN);
	} catch {
		return false;
	}

	return (
		(url.protocol === "http:" || url.protocol === "https:") &&
		url.origin !== SITE_ORIGIN
	);
}

export function getLinkPolicy(
	href: unknown,
	options: { openInNewTab?: boolean } = {},
): LinkPolicy {
	const isExternal = isExternalLink(href);
	const shouldOpenInNewTab = options.openInNewTab ?? isExternal;

	return {
		href: getHrefString(href),
		isExternal,
		newTabAttributes: shouldOpenInNewTab ? newTabLinkAttributes : {},
	};
}

export function getNewTabLinkAttributes(): typeof newTabLinkAttributes {
	return newTabLinkAttributes;
}
