/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { Locale, TranslationKey } from "@/i18n";

declare global {
	namespace App {
		interface Locals {
			lang: Locale;
			t: (key: TranslationKey) => string;
			pathWithoutLocale: string;
		}
	}
}
