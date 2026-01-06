import { defineMiddleware } from "astro:middleware";
import { getLangFromUrl, useTranslations, getPathWithoutLocale } from "@/i18n";

export const onRequest = defineMiddleware((context, next) => {
	const lang = getLangFromUrl(context.url);
	const t = useTranslations(lang);
	const pathWithoutLocale = getPathWithoutLocale(context.url.pathname);

	context.locals.lang = lang;
	context.locals.t = t;
	context.locals.pathWithoutLocale = pathWithoutLocale;

	return next();
});
