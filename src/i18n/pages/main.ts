import type { PageTranslations } from "../types";

const translations: PageTranslations<{
	hi: string;
}> = {
	en: {
		header: {
			title: "Home",
			description: "This is the home page",
			keywords: ["home", "main"],
		},
		content: {
			hi: "Hi There! I'm Luis Urrutia",
		},
	},
	es: {
		header: {
			title: "Inicio",
			description: "Esta es la página de inicio",
			keywords: ["inicio", "principal"],
		},
		content: {
			hi: "Hola! Soy Luis Urrutia",
		},
	},
} as const;

export default translations;
