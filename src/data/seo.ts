import { socials } from "./socials";

/** Site owner information for SEO and JSON-LD */
export const siteOwner = {
	name: "Luis Urrutia",
	email: "hello@urrutia.me",
	address: {
		locality: "Madrid",
		country: "ES",
	},
	languages: ["en", "es"],
} as const;

/** Current employer for Person schema */
export const employer = {
	name: "OpenZeppelin",
	url: "https://www.openzeppelin.com/",
} as const;

/** Site name for branding */
export const siteName = "Luis Urrutia";

/** Twitter/X handle for meta tags */
export const twitterHandle = "@luisurrutia_dev";

/** Default OG image path (relative to site root) */
export const defaultOgImage = "/og-image.png";

/** Logo path for og:logo (relative to site root) */
export const siteLogo = "/favicons/favicon.svg";

/** Profile image path for Person schema (relative to site root) */
export const profileImage = "/images/profile.jpg";

/** Extract URLs from socials for JSON-LD sameAs property */
export const socialUrls = Object.values(socials).map((social) =>
	typeof social === "string" ? social : social.url,
);

/**
 * Build a Person JSON-LD entity for use in structured data.
 * Can be used standalone or as part of a @graph.
 */
export function buildPersonEntity(
	siteUrl: string,
	options?: {
		jobTitle?: string;
		description?: string;
		/** Include @id for referencing in @graph */
		withId?: boolean;
	},
) {
	const { jobTitle, description, withId = false } = options ?? {};

	return {
		"@type": "Person" as const,
		...(withId && { "@id": `${siteUrl}/#person` }),
		name: siteOwner.name,
		url: siteUrl,
		image: `${siteUrl}${profileImage}`,
		email: `mailto:${siteOwner.email}`,
		...(jobTitle && { jobTitle }),
		...(description && { description }),
		sameAs: socialUrls,
		knowsLanguage: [...siteOwner.languages],
		worksFor: {
			"@type": "Organization" as const,
			name: employer.name,
			url: employer.url,
		},
		address: {
			"@type": "PostalAddress" as const,
			addressLocality: siteOwner.address.locality,
			addressCountry: siteOwner.address.country,
		},
	};
}
