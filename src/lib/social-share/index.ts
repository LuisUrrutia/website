import { providers } from "./providers";
import type { ShareParams, SocialProviderType } from "./types";

export { SocialProvider } from "./types";
export type { ShareParams, SocialProviderType } from "./types";

/**
 * Generates a share URL for the specified social provider.
 *
 * @param provider - The social platform to share to
 * @param params - Share parameters (url required, text optional)
 * @returns The constructed share URL
 *
 * @example
 * ```ts
 * import { createShareUrl, SocialProvider } from "@/lib/services/social-share";
 *
 * const twitterUrl = createShareUrl(SocialProvider.Twitter, {
 *   url: "https://example.com/article",
 *   text: "Check out this article!",
 * });
 * ```
 */
export function createShareUrl(
	provider: SocialProviderType,
	params: ShareParams,
): string {
	if (!params.url) {
		throw new Error("Share URL is required");
	}

	return providers[provider].buildShareUrl(params);
}
