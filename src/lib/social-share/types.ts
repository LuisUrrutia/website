/**
 * Supported social share providers.
 *
 * Using a const object + type derivation pattern instead of enum because:
 * 1. Enums compile to runtime objects with reverse mappings (bloat)
 * 2. Const objects are tree-shakeable
 * 3. Type derivation ensures single source of truth
 */
export const SocialProvider = {
	Facebook: "facebook",
	Twitter: "twitter",
	LinkedIn: "linkedin",
	WhatsApp: "whatsapp",
	Email: "email",
} as const;

export type SocialProviderType =
	(typeof SocialProvider)[keyof typeof SocialProvider];

export interface ShareParams {
	url: string;
	text?: string;
}

export interface ProviderConfig {
	buildShareUrl: (params: ShareParams) => string;
}
