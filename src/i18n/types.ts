import type { PageHeader } from "../common/types";
import type { SUPPORTED_LANGUAGES } from "./constants";

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export type PageTranslations<T = object> = {
	[key in SupportedLanguage]: {
		header: PageHeader;
		content: T;
	};
};
