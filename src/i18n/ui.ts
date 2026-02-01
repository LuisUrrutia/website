export const ui = {
	en: {
		// Meta
		"meta.title": "Luis Urrutia | Senior Software Engineer",
		"meta.description":
			"Senior Software Engineer with 12+ years of experience building scalable web applications and leading development teams.",
		"meta.jobTitle": "Senior Software Engineer",
		"meta.ogImageAlt": "Luis Urrutia - Senior Software Engineer",

		// Hero
		"hero.greeting": "Hi there!",
		"hero.intro": "I'm Luis Urrutia",
		"hero.bio.prefix": "I'm a ",
		"hero.bio.role": "Software Engineer",
		"hero.bio.middle": " with over ",
		"hero.bio.experience": "12 years of experience",
		"hero.bio.suffix":
			", specializing in building scalable, efficient digital solutions. I'm passionate about tackling complex challenges and delivering impactful results that drive business success.",
		"hero.location": "Santiago, Chile",
		"hero.companies": "Some companies I added value to:",
		"hero.photoAlt": "Photo of Luis Urrutia",

		// Stack
		"stack.title": "Stack",
		"stack.frameworks": "Frameworks",
		"stack.languages": "Languages",
		"stack.tools": "Tools",
		"stack.showing": "Showing {visible} of {total} items",

		// Contact
		"contact.heading": "We should work together",
		"contact.subheading": "I'm one click away",
		"contact.cta": "Let's Connect",

		// Testimonials
		"testimonials.title": "Testimonials",

		// Blog
		"blog.title": "Latest posts",
		"blog.pageTitle": "Blog",
		"blog.pageDescription":
			"Thoughts on software engineering, web development, and technology.",
		"blog.empty": "No posts available",
		"blog.viewMore": "View More",
		"blog.allPosts": "All Posts",
		"blog.backToBlog": "Back to Blog",
		"blog.publishedOn": "Published on",
		"blog.updatedOn": "Updated on",
		"blog.readingTime": "{minutes} min read",
		"blog.alsoAvailable": "This post is also available in:",

		// Common
		"common.viewMore": "View More",
		"common.viewLess": "View Less",
		"common.clearFilters": "Clear filters",

		// Experience
		"experience.lessThanYear": "Less than 1 year of experience",
		"experience.oneYear": "+1 year of experience",
		"experience.years": "+{count} years of experience",

		// Work Status
		"status.open": "Open to work",
		"status.busy": "Currently working",

		// Accessibility
		"a11y.opensEmailClient": "opens email client",
		"a11y.languageSwitcher": "Language switcher",
		"a11y.socialLinks": "Social links",
		"a11y.mainNavigation": "Main navigation",
		"a11y.home": "Home",
		"a11y.pagination": "Pagination",

		// Pagination
		"pagination.previous": "Previous page",
		"pagination.next": "Next page",

		// Theme
		"theme.auto": "Theme: Auto (click to switch to Light)",
		"theme.light": "Theme: Light (click to switch to Dark)",
		"theme.dark": "Theme: Dark (click to switch to Auto)",

		// 404
		"404.title": "Page Not Found",
		"404.heading": "Oops! Page not found",
		"404.description":
			"The page you're looking for doesn't exist or has been moved.",
		"404.backHome": "Back to Home",
	},
	es: {
		// Meta
		"meta.title": "Luis Urrutia | Ingeniero de Software Senior",
		"meta.description":
			"Ingeniero de Software Senior con más de 12 años de experiencia construyendo aplicaciones web escalables y liderando equipos de desarrollo.",
		"meta.jobTitle": "Ingeniero de Software Senior",
		"meta.ogImageAlt": "Luis Urrutia - Ingeniero de Software Senior",

		// Hero
		"hero.greeting": "¡Hola!",
		"hero.intro": "Soy Luis Urrutia",
		"hero.bio.prefix": "Soy ",
		"hero.bio.role": "Ingeniero de Software",
		"hero.bio.middle": " con más de ",
		"hero.bio.experience": "12 años de experiencia",
		"hero.bio.suffix":
			", especializado en construir soluciones digitales escalables y eficientes. Me apasiona enfrentar desafíos complejos y entregar resultados impactantes que impulsen el éxito del negocio.",
		"hero.location": "Santiago, Chile",
		"hero.companies": "Algunas empresas a las que aporté valor:",
		"hero.photoAlt": "Foto de Luis Urrutia",

		// Stack
		"stack.title": "Stack",
		"stack.frameworks": "Frameworks",
		"stack.languages": "Lenguajes",
		"stack.tools": "Herramientas",
		"stack.showing": "Mostrando {visible} de {total} elementos",

		// Contact
		"contact.heading": "Deberíamos trabajar juntos",
		"contact.subheading": "Estoy a un clic de distancia",
		"contact.cta": "Conectemos",

		// Testimonials
		"testimonials.title": "Testimonios",

		// Blog
		"blog.title": "Últimas publicaciones",
		"blog.pageTitle": "Blog",
		"blog.pageDescription":
			"Reflexiones sobre ingeniería de software, desarrollo web y tecnología.",
		"blog.empty": "No hay publicaciones disponibles",
		"blog.viewMore": "Ver más",
		"blog.allPosts": "Todas las publicaciones",
		"blog.backToBlog": "Volver al Blog",
		"blog.publishedOn": "Publicado el",
		"blog.updatedOn": "Actualizado el",
		"blog.readingTime": "{minutes} min de lectura",
		"blog.alsoAvailable": "Esta publicación también está disponible en:",

		// Common
		"common.viewMore": "Ver más",
		"common.viewLess": "Ver menos",
		"common.clearFilters": "Limpiar filtros",

		// Experience
		"experience.lessThanYear": "Menos de 1 año de experiencia",
		"experience.oneYear": "+1 año de experiencia",
		"experience.years": "+{count} años de experiencia",

		// Work Status
		"status.open": "Disponible para trabajar",
		"status.busy": "Actualmente trabajando",

		// Accessibility
		"a11y.opensEmailClient": "abre el cliente de correo",
		"a11y.languageSwitcher": "Selector de idioma",
		"a11y.socialLinks": "Redes sociales",
		"a11y.mainNavigation": "Navegación principal",
		"a11y.home": "Inicio",
		"a11y.pagination": "Paginación",

		// Pagination
		"pagination.previous": "Página anterior",
		"pagination.next": "Página siguiente",

		// Theme
		"theme.auto": "Tema: Auto (clic para cambiar a Claro)",
		"theme.light": "Tema: Claro (clic para cambiar a Oscuro)",
		"theme.dark": "Tema: Oscuro (clic para cambiar a Auto)",

		// 404
		"404.title": "Página no encontrada",
		"404.heading": "¡Ups! Página no encontrada",
		"404.description": "La página que buscas no existe o ha sido movida.",
		"404.backHome": "Volver al inicio",
	},
} as const;

export type TranslationKey = keyof (typeof ui)["en"];
