# AGENTS.md

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

Personal portfolio website built with Astro, TypeScript, and Tailwind CSS v4.

- **Site**: https://urrutia.me
- **Framework**: Astro v5 (static site generator with zero JS by default)
- **Package Manager**: Bun (>= 1.3)
- **Languages**: English (default) and Spanish

## Commands

### Development

```bash
bun install          # Install dependencies
bun run dev          # Start dev server at localhost:4321
bun run build        # Build production site to dist/
bun run preview      # Preview production build locally
bun run build:preview # Build and preview in one command
```

### Quality Checks

```bash
bun run lint         # Run OxLint with type-aware rules
bun run fmt          # Check formatting with Prettier
bun run fmt:fix      # Auto-fix formatting issues
```

### CI Pipeline

Pull requests run: lint → format check → build (see `.github/workflows/verify.yml`)

## Project Structure

```
src/
├── assets/          # Processed assets (icons, images)
├── components/      # Reusable UI components (.astro files)
│   └── seo/         # SEO components (JSON-LD, meta tags)
├── data/            # Static data (technologies, socials, testimonials, seo)
├── i18n/            # Internationalization (en, es locales)
├── layouts/         # Page layouts (Layout.astro)
├── lib/             # Utility libraries (theme, formatters, dom)
├── pages/           # Page routes (index, es/, 404, rss.xml)
├── sections/        # Page sections (Hero, Stack, Contact, etc.)
├── styles/          # Global CSS (global.css, theme.css, utilities.css)
├── types/           # TypeScript type definitions
└── views/           # View components (HomePage, BlogPage, BlogPostPage)
public/
├── companies/       # Company logo SVGs
├── favicons/        # Favicon files
├── fonts/           # Self-hosted fonts (InterVariable.woff2)
├── images/          # Static images
├── patterns/        # Background patterns
└── tech/            # Technology icon SVGs
```

## Code Style Guidelines

### TypeScript

- **Strict mode**: Extends `astro/tsconfigs/strict`
- **Path aliases**: Use `@/` prefix for src imports (e.g., `@/components/Card.astro`)
- **Type imports**: Use `import type` for type-only imports
- **Interfaces over types**: Prefer `interface` for object shapes, `type` for unions/aliases

```typescript
// Good
import type { Technology } from "@/types/technology";
import Card from "@/components/Card.astro";

// Bad
import { Technology } from "@/types/technology";
import Card from "../../components/Card.astro";
```

### Astro Components

- **File extension**: `.astro`
- **Frontmatter**: TypeScript code between `---` fences
- **Props interface**: Define `Props` interface in frontmatter
- **Polymorphic components**: Use `as` prop pattern with `Polymorphic` type

```astro
---
import type { HTMLTag, Polymorphic } from "astro/types";

type Props<Tag extends HTMLTag> = Polymorphic<{ as: Tag }> & {
	class?: string;
};

const { as: Element = "div", class: className, ...props } = Astro.props;
---

<Element class:list={["base-class", className]} {...props}>
	<slot />
</Element>
```

### Formatting (Prettier + EditorConfig)

- **Indentation**: Tabs (width 2) for code, spaces for YAML/JSON
- **Line endings**: LF
- **Final newline**: Always
- **Plugins**: Uses Astro, Tailwind CSS, and package.json plugins

### CSS / Tailwind

- **Framework**: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **Class binding**: Use `class:list` directive for conditional classes
- **Theme tokens**: Defined in `src/styles/theme.css` using oklch color space
- **Dark mode**: Toggle via `[data-theme="dark"]` selector on `<html>`
- **Semantic colors**: Reference CSS variables (`--color-*`) that map to primitives (`--oklch-*`)

```astro
<!-- Good: Use class:list for conditional classes -->
<div class:list={["base-class", { active: isActive }, className]}>
	<!-- Good: Use semantic color classes -->
	<p class="text-foreground bg-card"></p>
</div>
```

### Naming Conventions

- **Components**: PascalCase (`TechItem.astro`, `FilterChip.astro`)
- **Sections**: PascalCase with `Section` suffix (`HeroSection.astro`)
- **Types**: PascalCase (`Technology`, `TechnologyCategory`)
- **Variables/functions**: camelCase (`getLangFromUrl`, `formatExperience`)
- **Constants**: SCREAMING_SNAKE_CASE for module-level constants
- **Files**: Match export name (component files match component name)

### Internationalization

- **Locales**: `en` (default), `es`
- **Translations**: `src/i18n/ui.ts`
- **Utilities**: `src/i18n/utils.ts`
- **Access**: Use `Astro.locals` for `lang` and `t` function

```astro
---
const { t, lang } = Astro.locals;
---

<h1>{t("hero.title")}</h1>
```

### Error Handling

- **Try-catch**: Wrap localStorage/cookie access that may fail
- **Fallbacks**: Provide sensible defaults when values unavailable
- **Type guards**: Use type narrowing for safer runtime behavior

```typescript
// Good: Handle localStorage not being available
export function getStoredLocale(): string | null {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) return stored;
	} catch {
		// localStorage not available
	}
	return getCookie(COOKIE_NAME);
}
```

### Scripts in Astro

- **Client scripts**: Use `<script>` tags in components (bundled by Astro)
- **Init pattern**: Create init functions, call on load and `astro:after-swap`
- **Type assertions**: Use `querySelectorAll<HTMLElement>` for typed elements

```astro
<script>
	function initComponent(): void {
		document.querySelectorAll<HTMLElement>(".my-class").forEach((el) => {
			if (el.dataset.init) return;
			el.dataset.init = "true";
			// Setup...
		});
	}

	initComponent();
	document.addEventListener("astro:after-swap", initComponent);
</script>
```

## Commit Convention

Uses Conventional Commits (enforced by commitlint):

- `feat:` - New feature
- `fix:` - Bug fix
- `chore:` - Maintenance
- `docs:` - Documentation
- `style:` - Formatting (no code change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Tests

Pre-commit hooks run Prettier and OxLint automatically.

## SEO & Structured Data

### JSON-LD Schemas

Located in `src/components/seo/`:

- **HomePageJsonLd**: Combined schema with WebSite, ProfilePage, and Person entities
- **ArticleJsonLd**: BlogPosting schema for blog posts (includes full Person entity)
- **BreadcrumbJsonLd**: Breadcrumb navigation schema
- **PersonJsonLd**: Standalone Person schema (uses shared `buildPersonEntity`)

### Shared SEO Utilities

- **`src/data/seo.ts`**: Central location for SEO constants and the `buildPersonEntity()` function
- **`src/lib/formatters.ts`**: Contains `toISOWithTimezone()` for JSON-LD dates and `getSiteUrl()` utility

### Date Formatting for JSON-LD

Always use ISO 8601 with timezone offset for structured data dates:

```typescript
import { toISOWithTimezone } from "@/lib/formatters";

// Output: "2024-12-23T12:34:00-05:00"
const date = toISOWithTimezone(new Date());
```

### Open Graph Meta

- Uses `og:logo` pointing to `/favicons/favicon.svg`
- Blog posts include `article:section` (category) and `article:tag` metadata
- Dynamic OG images generated at `/og/[locale]/[slug].png`

## Accessibility

### Skip Navigation

All pages include a skip-to-content link targeting `#main-content`. Every view must have:

```astro
<Container as="main" id="main-content" ... />
```

### External Links

Always include security and privacy attributes:

```astro
<a
	href={url}
	target="_blank"
	rel="noopener noreferrer"
	referrerpolicy="strict-origin-when-cross-origin"></a>
```

### Translations for Accessibility

Use `a11y.*` translation keys for aria-labels and screen reader text:

```astro
const {t} = Astro.locals;
<button aria-label={t("a11y.backToTop")}></button>
```

## RSS Feeds

RSS feeds are generated at:

- `/rss.xml` (English)
- `/es/rss.xml` (Spanish)

Located in `src/pages/rss.xml.ts` and `src/pages/es/rss.xml.ts`.

## Blog

### Translation Handling

When a blog post doesn't have a translation, don't generate alternate hreflang URLs that would 404:

```typescript
const alternateUrls = translatedPost
	? { [lang]: currentPostUrl, [alternateLang]: alternateUrl! }
	: undefined;
```

### Components

- **BlogEntry**: Use `headingLevel` prop to control heading hierarchy (h2 for listing pages)
- **BackToTop**: Floating button component for long blog posts
- **Giscus**: Comments loaded via Intersection Observer for performance

## Important Notes

1. **No test framework**: This project has no test suite configured
2. **Static site**: All pages are pre-rendered at build time
3. **Zero JS by default**: Astro only ships JS when components require it
4. **Performance focus**: Lighthouse thresholds set at 90% for all categories
5. **Asset optimization**: Images, CSS, JS, and SVGs are compressed in production
6. **Self-hosted fonts**: Inter Variable font is in `/public/fonts/`, not external
7. **DNS prefetch**: External domains (giscus.app, github.com, linkedin.com) are prefetched in Layout
