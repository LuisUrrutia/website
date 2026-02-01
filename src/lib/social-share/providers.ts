import { SocialProvider, type ProviderConfig, type SocialProviderType } from "./types";

/**
 * Provider configurations for social sharing.
 *
 * Each provider defines how to construct a share URL for that platform.
 * Using Record<SocialProviderType, ...> ensures compile-time exhaustiveness:
 * adding a new provider to SocialProvider will cause a type error here
 * until its configuration is added.
 */
export const providers: Record<SocialProviderType, ProviderConfig> = {
	[SocialProvider.Facebook]: {
		buildShareUrl: ({ url }) => {
			const params = new URLSearchParams({ u: url });
			return `https://www.facebook.com/sharer.php?${params}`;
		},
	},

	[SocialProvider.Twitter]: {
		buildShareUrl: ({ url, text }) => {
			const params = new URLSearchParams({ url });
			if (text) params.set("text", text);
			return `https://twitter.com/intent/tweet?${params}`;
		},
	},

	[SocialProvider.LinkedIn]: {
		buildShareUrl: ({ url, text }) => {
			const params = new URLSearchParams({ mini: "true", url });
			if (text) params.set("title", text);
			return `https://www.linkedin.com/shareArticle?${params}`;
		},
	},

	[SocialProvider.WhatsApp]: {
		buildShareUrl: ({ url, text }) => {
			const message = text ? `${text} ${url}` : url;
			const params = new URLSearchParams({ text: message });
			return `https://wa.me/?${params}`;
		},
	},

	[SocialProvider.Email]: {
		buildShareUrl: ({ url, text }) => {
			const params = new URLSearchParams({
				subject: text ?? "",
				body: text ? `${text} ${url}` : url,
			});
			return `mailto:?${params}`;
		},
	},
};
