import type { Locale } from "@/i18n";

export interface Testimonial {
	name: string;
	role: Record<Locale, string>;
	photo: ImageMetadata;
	quote: Record<Locale, string>;
	linkedin?: string;
}
