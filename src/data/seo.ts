import { socials } from "./socials";

/** Site owner information for SEO and JSON-LD */
export const siteOwner = {
	name: "Luis Urrutia",
	email: "hello@urrutia.me",
	address: {
		locality: "Santiago",
		country: "CL",
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

/** Profile image path for Person schema (relative to site root) */
export const profileImage = "/images/profile.jpg";

/** Extract URLs from socials for JSON-LD sameAs property */
export const socialUrls = Object.values(socials).map((social) =>
	typeof social === "string" ? social : social.url,
);
