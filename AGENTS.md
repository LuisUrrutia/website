# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Quick Reference

| Item            | Value                                  |
| --------------- | -------------------------------------- |
| Site            | https://urrutia.me                     |
| Framework       | Astro v5 (static output)               |
| Package Manager | Bun (>= 1.3)                           |
| Languages       | English (default), Spanish (`/es/`)    |
| Styling         | Tailwind CSS v4 (Vite plugin)          |
| Deployment      | Cloudflare Pages                       |
| TypeScript      | Strict mode (`astro/tsconfigs/strict`) |

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Dev server at localhost:4321
bun run build        # Production build to dist/
bun run lint         # OxLint with type-aware rules
bun run fmt:fix      # Auto-fix formatting
bun run fmt          # Check formatting (CI)
```

## Project Structure

```
src/
├── assets/
│   ├── blog/            # Blog post images (processed by Astro)
│   ├── icons/           # SVG icons (optimized via experimental SVGO)
│   ├── images/          # Site images (profile photos, OG background)
│   └── testimonials/    # Testimonial photos
├── components/          # UI components (.astro)
│   ├── mdx/             # MDX component overrides (A.astro for links)
│   └── seo/             # JSON-LD, meta tags, Open Graph, canonical
├── content/
│   └── blog/            # MDX blog posts (en/ and es/ subdirectories)
├── data/                # Static data (blog, seo, companies, socials, technologies, testimonials)
├── i18n/                # Translations (ui.ts), locale config, utilities
├── integrations/        # Custom Astro integrations (sitemap-hreflang.ts)
├── layouts/             # Layout.astro (single layout for all pages)
├── lib/
│   ├── social-share/    # Social sharing URL builders
│   ├── theme/           # Theme management (auto/light/dark)
│   └── formatters.ts    # Date, experience, reading time, URL formatters
├── pages/               # Routes (/, /es/, /blog/, /og/, /rss.xml, /robots.txt, /404)
├── sections/            # Page sections (Hero, Stack, LatestPosts, Testimonials, Contact)
├── styles/              # CSS (global.css, theme.css with oklch tokens, utilities.css)
├── types/               # TypeScript definitions
├── views/               # Page compositions (HomePage, BlogPage, BlogPostPage)
├── content.config.ts    # Content collection schema (blog frontmatter)
├── env.d.ts             # Astro.locals type declarations
└── middleware.ts         # Injects lang, t(), pathWithoutLocale into Astro.locals
public/
├── companies/           # Company logo SVGs (light + dark variants)
├── favicons/            # Favicon files (SVG, PNG at 16/32/180/512)
├── fonts/               # Self-hosted Inter Variable (subsetted woff2)
├── images/              # Static images (brush SVG, profile photo)
└── tech/                # Technology icon SVGs (some with light/dark variants)
```

## Architecture

Pages are thin routing files that delegate to **Views**, which compose **Sections** and **Components**. This avoids duplication between English and Spanish routes:

```
Page (/pages/index.astro)    -> View (HomePage.astro)     -> Sections -> Components
Page (/pages/es/index.astro) -> View (HomePage.astro)     -> same sections, different locale
Page (/pages/blog/[slug])    -> View (BlogPostPage.astro) -> article layout with MDX content
```

## Code Patterns

### Imports

```typescript
// Always use path aliases (@/) and type imports
import type { Technology } from "@/types/technology";
import Card from "@/components/Card.astro";
```

### Astro Components

```astro
---
interface Props {
	title: string;
	class?: string;
}
const { title, class: className } = Astro.props;
const { t, lang } = Astro.locals; // i18n from middleware
---

<div class:list={["base-class", className]}>
	<h1>{title}</h1>
</div>
```

**Polymorphic components** (Card, Container) use Astro's `Polymorphic` type to accept an `as` prop:

```astro
---
import type { HTMLTag, Polymorphic } from "astro/types";
type Props<Tag extends HTMLTag> = Polymorphic<{ as: Tag }> & { class?: string };
const { as: Tag = "div", class: className, ...attrs } = Astro.props;
---

<Tag class:list={["base-class", className]} {...attrs}><slot /></Tag>
```

### Translations

- File: `src/i18n/ui.ts`
- Access: `Astro.locals.t("key")` and `Astro.locals.lang`
- Always add keys to **both** `en` and `es` objects
- Key prefixes: `meta.*`, `hero.*`, `stack.*`, `contact.*`, `testimonials.*`, `blog.*`, `common.*`, `experience.*`, `status.*`, `a11y.*`, `breadcrumb.*`, `pagination.*`, `theme.*`, `404.*`, `rss.*`, `share.*`
- Some keys use interpolation: `{minutes}`, `{count}`, `{visible}`, `{total}`, `{name}`
- Use `a11y.*` prefix for accessibility labels

```astro
---
const { t } = Astro.locals;
---

<button aria-label={t("a11y.backToTop")}>{t("common.back")}</button>
```

### Blog

Content collection with MDX posts in `src/content/blog/en/` and `src/content/blog/es/`.

**Frontmatter schema** (defined in `src/content.config.ts`):

```yaml
title: "Post Title"
description: "Post description"
date: 2026-02-02
updatedDate: 2026-02-03 # optional
category: "Git"
tags: ["Git", "Productivity"]
draft: false # optional, default false
lang: "en" # "en" | "es"
translationSlug: "post-slug" # optional, links translations across locales
```

**Blog utilities** (`src/data/blog.ts`):

```typescript
import {
	getBlogPosts,
	getPaginatedBlogPosts,
	getBlogPostStaticPaths,
	POSTS_PER_PAGE,
} from "@/data/blog";

const posts = await getBlogPosts("en");
const { posts, currentPage, totalPages } = await getPaginatedBlogPosts("en", 1);
```

**MDX component overrides**: Blog posts use `<Content components={{ a: A }} />` to auto-add `target="_blank"` and screen reader text to external links.

### CSS / Theme

- Colors use **oklch** in `src/styles/theme.css`
- Two-tier token system: semantic `--color-*` reference primitive `--oklch-*`
- Light theme on `:root`, dark theme on `[data-theme="dark"]`
- Use Tailwind semantic classes, not raw colors

**Available semantic color classes**:

```
text-foreground   text-title       text-subtitle     text-accent
bg-background     bg-card          bg-button         bg-available
text-card-foreground               text-pill-foreground
text-button-foreground             text-available-foreground
text-code-foreground               bg-code-background
border-border     bg-pill
text-highlight-sky                 text-highlight-orange
text-primary      text-secondary
```

**Dark mode**: Never use Tailwind's `dark:` prefix. Use `[data-theme="dark"]` or `:global([data-theme="dark"])` in scoped styles.

**Custom CSS properties**: `--spin-duration`, `--shadow-soft`

**Custom Tailwind utility**: `scrollbar-gutter-stable` (defined in `src/styles/utilities.css`)

### External Links

All external links must include all three attributes:

```astro
<a
	href={url}
	target="_blank"
	rel="noopener noreferrer"
	referrerpolicy="strict-origin-when-cross-origin"
>
	Link text
	<span class="sr-only">{t("a11y.opensInNewTab")}</span>
</a>
```

### Client Scripts

Three script patterns used in this project:

**1. Module scripts** (default, for interactive components):

```astro
<script>
	function init(): void {
		document.querySelectorAll<HTMLElement>(".my-class").forEach((el) => {
			if (el.dataset.init) return; // Guard against double init
			el.dataset.init = "true";
			// Setup...
		});
	}
	init();
	document.addEventListener("astro:after-swap", init); // Re-init after view transition
</script>
```

**2. Blocking inline scripts** (for critical path, e.g., theme, locale):

```astro
<script is:inline>
	// Runs before render, not bundled, not deduped
	// Pass data via data-* attributes on the script tag
</script>
```

**3. Event delegation** (for components with many interactive children):

```typescript
// Delegate on a container instead of each child
container.addEventListener("click", (e) => {
	const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".my-btn");
	if (!btn) return;
	// Handle click
});
```

### View Transitions

- Native CSS: `@view-transition { navigation: auto }` in `global.css`
- Astro directive: `transition:animate="fade"` (homepage) or `"slide"` (blog pages)
- Named transitions: `view-transition-name: post-card`, `post-title-${slug}`, `post-pill-${slug}`
- **Lazy transition pattern**: BlogEntry sets `view-transition-name` via JS on click only (avoids tracking all names in the list)
- All component scripts must reinitialize on `astro:after-swap`
- `interpolate-size: allow-keywords` on `:root` for smooth CSS size transitions

### Accessibility

Required patterns for all new components:

- **Skip link**: Views must have `id="main-content"` on their main element
- **Section headings**: Use `aria-labelledby` pointing to the section heading ID
- **Focus indicators**: All interactive elements need `focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`
- **Decorative icons**: `aria-hidden="true"` on icons inside buttons/links that have labels
- **New tab links**: Add `<span class="sr-only">{t("a11y.opensInNewTab")}</span>` to all `target="_blank"` links
- **Reduced motion**: Use `motion-reduce:transition-none` on animated elements; check `prefers-reduced-motion` for JS animations
- **Dynamic content**: Use `aria-live="polite"` for status updates visible to screen readers
- **Toggle buttons**: Use `aria-pressed` for filter chips, `aria-expanded` for expand/collapse
- **Hidden elements**: Sync `aria-hidden` and `tabindex` when toggling visibility

### SEO Components

Located in `src/components/seo/`. Barrel export from `src/components/seo/index.ts`.

| Component          | Usage                                                    |
| ------------------ | -------------------------------------------------------- |
| `SEO`              | Orchestrator: title, description, OG, Twitter, canonical |
| `CanonicalMeta`    | Canonical URL + hreflang links for all locales           |
| `OpenGraphMeta`    | og:\* tags, supports article metadata                    |
| `TwitterCardMeta`  | twitter:\* tags (summary_large_image)                    |
| `HomePageJsonLd`   | @graph: WebSite + ProfilePage + Person schemas           |
| `ArticleJsonLd`    | BlogPosting schema with mainEntityOfPage, inLanguage     |
| `BreadcrumbJsonLd` | BreadcrumbList schema                                    |

New blog posts automatically get:

- Per-post OG images generated at build time (`/og/[slug].png`)
- ArticleJsonLd + BreadcrumbJsonLd structured data
- Hreflang tags (if a translation exists via `translationSlug`)

### Image Handling

- **Processed images** (`src/assets/`): Use `<Image>` from `astro:assets` or `getImage()` for responsive srcset
- **Static assets** (`public/`): Tech/company SVGs served as-is, referenced by path string
- **Themed images**: Light/dark variants toggled via `:global([data-theme="dark"])` scoped CSS (not Tailwind `dark:`)
- **Loading hints**: Use `loading="eager"` + `fetchpriority="high"` for above-fold LCP images; `loading="lazy"` for everything else

## Key Files

| Purpose                | File                                   |
| ---------------------- | -------------------------------------- |
| SEO constants & Person | `src/data/seo.ts`                      |
| Blog utilities         | `src/data/blog.ts`                     |
| Translations           | `src/i18n/ui.ts`                       |
| i18n utilities         | `src/i18n/utils.ts`                    |
| Theme tokens           | `src/styles/theme.css`                 |
| Date/URL formatters    | `src/lib/formatters.ts`                |
| Theme logic            | `src/lib/theme/theme.ts`               |
| Main layout            | `src/layouts/Layout.astro`             |
| Middleware (locals)    | `src/middleware.ts`                    |
| Content schema         | `src/content.config.ts`                |
| Sitemap hreflang       | `src/integrations/sitemap-hreflang.ts` |
| Social sharing         | `src/lib/social-share/index.ts`        |
| Technologies data      | `src/data/technologies.ts`             |
| Companies data         | `src/data/companies.ts`                |
| Testimonials data      | `src/data/testimonials.ts`             |
| Socials data           | `src/data/socials.ts`                  |

## Type Definitions

All in `src/types/`:

| Type                 | Key fields                                                                            |
| -------------------- | ------------------------------------------------------------------------------------- |
| `Technology`         | `name, icon: string \| ThemedIcon, colorMode?, experience, category`                  |
| `TechnologyCategory` | `"frameworks" \| "languages" \| "tools"`                                              |
| `ThemedIcon`         | `{ light: string; dark: string }`                                                     |
| `ColorMode`          | `"keep" \| "auto"`                                                                    |
| `Company`            | `name, logo, logoDark, url, width`                                                    |
| `SocialLink`         | `{ url: string; label?: string } \| string`                                           |
| `SocialLinksProps`   | `{ github?, linkedin?, instagram?, x? }`                                              |
| `Testimonial`        | `name, role: Record<Locale, string>, photo, quote: Record<Locale, string>, linkedin?` |
| `Post`               | `title, category, date, href, slug?`                                                  |
| `Locale`             | `"en" \| "es"`                                                                        |
| `TranslationKey`     | Union of all keys in `ui.en`                                                          |

## Commit Convention

Conventional Commits enforced by commitlint:

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `chore:` Maintenance
- `perf:` Performance
- `docs:` Documentation

Pre-commit hooks run Prettier and OxLint automatically via lint-staged.

## Important Rules

1. **No tests** -- No test suite configured
2. **Static site** -- All pages pre-rendered at build time, no SSR
3. **Zero JS default** -- Astro only ships JS when explicitly needed via `<script>` tags
4. **Always add translations** -- Both `en` and `es` in `src/i18n/ui.ts`
5. **Skip link required** -- Views must have `id="main-content"` on main element
6. **Type imports** -- Use `import type` for type-only imports
7. **Path aliases** -- Always use `@/` prefix, never relative paths
8. **Semantic colors** -- Use `text-foreground`, `bg-card`, etc., not raw colors or oklch values
9. **No `dark:` prefix** -- Use `[data-theme="dark"]` selector or `:global()` in scoped styles
10. **Focus indicators required** -- All interactive elements need visible `focus-visible` styles
11. **Screen reader text for new tabs** -- All `target="_blank"` links must include `(opens in new tab)` sr-only text
12. **Respect reduced motion** -- Use `motion-reduce:` Tailwind variants and check `prefers-reduced-motion` in JS
13. **Reinit on view transitions** -- All client scripts must handle `astro:after-swap` event
14. **Guard double init** -- Use `dataset.init` flag in component scripts to prevent duplicate setup
15. **External link attributes** -- Always include `target="_blank"`, `rel="noopener noreferrer"`, and `referrerpolicy="strict-origin-when-cross-origin"`
