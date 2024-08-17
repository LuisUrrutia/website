import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "./constants";
import type { SupportedLanguage } from "./types";

export function getLangFromUrl(url: URL): SupportedLanguage | undefined {
	const [, lang] = url.pathname.split("/");
	if (!lang || !(lang in SUPPORTED_LANGUAGES)) {
		return DEFAULT_LANGUAGE;
	}

	return lang as SupportedLanguage;
}

export function getLangFromStorage(): SupportedLanguage | undefined {
	const lang = localStorage.getItem("lang");
	if (!lang || !(lang in SUPPORTED_LANGUAGES)) {
		return undefined;
	}

	return lang as SupportedLanguage;
}
