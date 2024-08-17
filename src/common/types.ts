import type { SupportedLanguage } from "../i18n/types";

export type Alternate = {
	lang: SupportedLanguage;
	href: string;
};

export type PageHeader = {
	title: string;
	description: string;
	keywords: string | string[];
	alternates?: Alternate[];
	canonical?: string;
	image?: string;
	siteName?: string;
};
