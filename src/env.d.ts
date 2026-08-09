/// <reference types="astro/client" />

import type { Locale, TranslationKey } from "@/i18n";

declare global {
	interface HTMLElementEventMap {
		"expand-toggle": CustomEvent<{ expanded: boolean }>;
	}

	namespace App {
		interface Locals {
			lang: Locale;
			t: (key: TranslationKey) => string;
			pathWithoutLocale: string;
		}
	}
}
