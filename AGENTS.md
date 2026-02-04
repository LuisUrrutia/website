# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Quick Reference

| Item            | Value                      |
| --------------- | -------------------------- |
| Site            | https://urrutia.me         |
| Framework       | Astro v5                   |
| Package Manager | Bun (>= 1.3)               |
| Languages       | English (default), Spanish |
| Styling         | Tailwind CSS v4            |

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Dev server at localhost:4321
bun run build        # Production build to dist/
bun run lint         # OxLint with type-aware rules
bun run fmt:fix      # Auto-fix formatting
```

## Project Structure

```
src/
├── components/      # UI components (.astro)
│   └── seo/         # JSON-LD, meta tags
├── data/            # Static data (blog.ts, seo.ts, technologies.ts)
├── i18n/            # Translations (ui.ts, utils.ts)
├── layouts/         # Layout.astro
├── lib/             # Utilities (formatters.ts, theme.ts)
├── pages/           # Routes (/, /es/, /blog/, /404)
├── sections/        # Page sections (HeroSection, etc.)
├── styles/          # CSS (theme.css with oklch tokens)
├── types/           # TypeScript definitions
└── views/           # Page views (HomePage, BlogPage, BlogPostPage)
public/
├── fonts/           # Self-hosted InterVariable.woff2
└── tech/            # Technology SVG icons
```

## Code Patterns

### Imports

```typescript
// Always use path aliases and type imports
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
const { t, lang } = Astro.locals; // i18n access
---

<div class:list={["base-class", className]}>
	<h1>{title}</h1>
</div>
```

### Translations

- File: `src/i18n/ui.ts`
- Access: `Astro.locals.t("key")` and `Astro.locals.lang`
- Add keys to both `en` and `es` objects
- Use `a11y.*` prefix for accessibility labels

```astro
---
const { t } = Astro.locals;
---

<button aria-label={t("a11y.backToTop")}>{t("common.back")}</button>
```

### Blog Utilities

```typescript
// src/data/blog.ts - shared blog utilities
import {
	getBlogPosts,
	getPaginatedBlogPosts,
	POSTS_PER_PAGE,
} from "@/data/blog";

const posts = await getBlogPosts("en"); // or "es"
const { posts, currentPage, totalPages } = await getPaginatedBlogPosts("en", 1);
```

### CSS / Theme

- Colors use oklch in `src/styles/theme.css`
- Semantic tokens: `--color-*` reference primitives `--oklch-*`
- Dark mode: `[data-theme="dark"]` selector
- Use Tailwind classes: `text-foreground`, `bg-card`, `text-title`

### External Links

```astro
<a
	href={url}
	target="_blank"
	rel="noopener noreferrer"
	referrerpolicy="strict-origin-when-cross-origin"></a>
```

### Client Scripts

```astro
<script>
	function init(): void {
		document.querySelectorAll<HTMLElement>(".my-class").forEach((el) => {
			if (el.dataset.init) return;
			el.dataset.init = "true";
			// Setup...
		});
	}
	init();
	document.addEventListener("astro:after-swap", init);
</script>
```

## Commit Convention

Conventional Commits enforced by commitlint:

- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `chore:` Maintenance
- `perf:` Performance

Pre-commit hooks run Prettier and OxLint automatically.

## Key Files

| Purpose             | File                       |
| ------------------- | -------------------------- |
| SEO constants       | `src/data/seo.ts`          |
| Blog utilities      | `src/data/blog.ts`         |
| Translations        | `src/i18n/ui.ts`           |
| Theme tokens        | `src/styles/theme.css`     |
| Date/URL formatters | `src/lib/formatters.ts`    |
| Main layout         | `src/layouts/Layout.astro` |

## Important Rules

1. **No tests** - No test suite configured
2. **Static site** - All pages pre-rendered at build
3. **Zero JS default** - Astro only ships JS when needed
4. **Always add translations** - Both `en` and `es` in ui.ts
5. **Skip link required** - Views must have `id="main-content"` on main element
6. **Type imports** - Use `import type` for types
7. **Path aliases** - Always use `@/` prefix, never relative paths
8. **Semantic colors** - Use `text-foreground`, `bg-card`, not raw colors
