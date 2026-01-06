import { socials } from "./socials";

/** Site owner information for SEO and JSON-LD */
export const siteOwner = {
	name: "Luis Urrutia",
	address: {
		locality: "Santiago",
		country: "CL",
	},
	languages: ["en", "es"],
} as const;

/** Twitter/X handle for meta tags */
export const twitterHandle = "@luisurrutia_dev";

/** Default OG image path (relative to site root) */
export const defaultOgImage = "/og-image.png";

/** Extract URLs from socials for JSON-LD sameAs property */
export const socialUrls = Object.values(socials).map((social) =>
	typeof social === "string" ? social : social.url,
);
