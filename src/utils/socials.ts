import type { SocialNetwork } from "~/common/types";

export const generateSocialLink = (network: SocialNetwork, url: string, text?: string): string => {
	if (!url) {
		throw new Error("URL is required");
	}

	if (network === "facebook") {
		return `https://www.facebook.com/sharer.php?u=${url}`;
	} else if (network === "twitter") {
		return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
	} else if (network === "linkedin") {
		return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
	} else if (network === "whatsapp") {
		return `https://wa.me/?text=${text}%20${url}`;
	} else if (network === "mail") {
		return `mailto:?subject=%22${text}%22&body=${text}%20${url}`;
	} else {
		throw new Error("Invalid social network");
	}
};
