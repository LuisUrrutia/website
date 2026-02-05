# urrutia.me

<p align="center">
  <strong>Personal portfolio and blog built with Astro v5 and Tailwind CSS v4.</strong>
</p>

<p align="center">
	<a href="https://github.com/LuisUrrutia/website/releases"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/LuisUrrutia/website"></a>
	<a href="https://twitter.com/luisurrutia_dev"><img alt="Twitter" src="https://badgen.net/badge/twitter/@luisurrutia_dev/1DA1F2?icon&label" /></a>
	<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="License CC BY-NC-ND 4.0" src="https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey" /></a>
</p>

<p align="center">
  <a href="https://urrutia.me">View Live Site</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#tech-stack">Tech Stack</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#project-structure">Project Structure</a>
</p>

---

## Features

- **Multilingual** -- English (default) and Spanish with full i18n support, per-locale RSS feeds, and hreflang tags
- **Blog** -- MDX-powered blog with pagination, reading time, social sharing, and Giscus comments
- **SEO** -- Canonical URLs, Open Graph, Twitter Cards, JSON-LD structured data (Person, WebSite, ProfilePage, BlogPosting, BreadcrumbList), auto-generated OG images, sitemap with hreflang
- **Dark mode** -- Three-state theme toggle (auto/light/dark) with blocking script to prevent flash of wrong theme
- **Accessibility** -- Skip links, ARIA labels, focus-visible indicators, prefers-reduced-motion support, screen reader announcements
- **Performance** -- Zero JS by default, inlined CSS, subsetted variable font, Brotli + gzip compression, lazy-loaded images with AVIF/WebP and responsive srcset
- **View Transitions** -- Native CSS view transitions with lazy transition-name assignment for smooth page navigation

## Tech Stack

### Core

| Technology                                    | Description                                   |
| --------------------------------------------- | --------------------------------------------- |
| [Astro v5](https://astro.build/)              | Static site generator with zero JS by default |
| [Tailwind CSS v4](https://tailwindcss.com/)   | Utility-first CSS framework                   |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript                          |
| [MDX](https://mdxjs.com/)                     | Markdown with components for blog posts       |

### Development

| Tool                                                                 | Description                                    |
| -------------------------------------------------------------------- | ---------------------------------------------- |
| [Bun](https://bun.sh/)                                               | Fast JavaScript runtime and package manager    |
| [OxLint](https://oxc-project.github.io/docs/guide/usage/linter.html) | High-performance linter with type-aware rules  |
| [Prettier](https://prettier.io/)                                     | Code formatter with Astro and Tailwind plugins |
| [Husky](https://typicode.github.io/husky/)                           | Git hooks                                      |
| [Commitlint](https://commitlint.js.org/)                             | Conventional commit linting                    |
| [lint-staged](https://github.com/lint-staged/lint-staged)            | Run linters on staged files                    |

### Build Pipeline

| Step                                                           | Description                                      |
| -------------------------------------------------------------- | ------------------------------------------------ |
| [Astro](https://astro.build/)                                  | Static page generation with inlined CSS          |
| [astro-og-canvas](https://github.com/delucis/astro-og-canvas)  | Build-time OG image generation per blog post     |
| [@playform/compress](https://github.com/PlayForm/Compress)     | HTML, CSS, JS, JSON, SVG, and image minification |
| [astro-compressor](https://github.com/sondr3/astro-compressor) | Brotli and gzip pre-compression                  |
| [SVGO](https://svgo.dev/)                                      | SVG optimization via Astro experimental flag     |

### CI/CD

| Workflow   | Description                                       |
| ---------- | ------------------------------------------------- |
| Verify     | Lint, format check, and build on PRs              |
| Release    | Semantic-release with Cloudflare Pages deployment |
| CodeQL     | Security vulnerability scanning                   |
| Lighthouse | Performance and accessibility audits (>= 90%)     |
| Commitlint | Validates conventional commit format              |
| Dependabot | Weekly automated dependency updates               |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.3

### Installation

```bash
git clone https://github.com/LuisUrrutia/website.git
cd website
bun install
```

### Development

```bash
bun run dev
```

The site will be available at `http://localhost:4321` with hot module replacement.

### Commands

| Command                 | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `bun run dev`           | Start development server at `localhost:4321` with HMR |
| `bun run build`         | Build optimized production site to `dist/`            |
| `bun run preview`       | Preview the production build locally                  |
| `bun run build:preview` | Build and preview in one command                      |
| `bun run lint`          | Run OxLint with type-aware rules                      |
| `bun run fmt`           | Check code formatting with Prettier                   |
| `bun run fmt:fix`       | Auto-fix formatting issues                            |

### Testing with Docker

A `docker-compose.yml` is provided to test the production build with [Static Web Server](https://static-web-server.net/), which supports Brotli compression and proper cache headers:

```bash
bun run build
docker compose up -d
# Site available at http://localhost:8080
```

## Project Structure

```
src/
├── assets/
│   ├── blog/              # Blog post images
│   ├── icons/             # SVG icons (optimized via SVGO)
│   ├── images/            # Site images (processed by Astro)
│   └── testimonials/      # Testimonial photos
├── components/            # Reusable UI components (.astro)
│   ├── mdx/               # Custom MDX components
│   └── seo/               # JSON-LD, meta tags, Open Graph
├── content/
│   └── blog/              # MDX blog posts (en/ and es/)
├── data/                  # Static data (blog, seo, technologies, companies)
├── i18n/                  # Translations and i18n utilities
├── integrations/          # Custom Astro integrations (sitemap hreflang)
├── layouts/               # Layout.astro
├── lib/                   # Utilities (formatters, theme, social-share)
├── pages/                 # File-based routes
│   ├── blog/              # Blog listing, pagination, and post pages
│   ├── es/                # Spanish locale routes
│   ├── og/                # Auto-generated OG images
│   ├── robots.txt.ts      # Dynamic robots.txt
│   └── rss.xml.ts         # RSS feed
├── sections/              # Page sections (Hero, Stack, Testimonials, Contact)
├── styles/                # Theme tokens (oklch), global CSS, utilities
├── types/                 # TypeScript definitions
└── views/                 # Page compositions (HomePage, BlogPage, BlogPostPage)
public/
├── companies/             # Company logo SVGs (light + dark variants)
├── favicons/              # Favicon files (SVG, PNG at multiple sizes)
├── fonts/                 # Self-hosted Inter Variable (subsetted woff2)
├── images/                # Static images
└── tech/                  # Technology icon SVGs
```

### Architecture

Pages are thin routing files that delegate to **Views**, which compose **Sections** and **Components**. This avoids duplication between English and Spanish routes:

```
Page (/pages/index.astro) → View (HomePage.astro) → Sections (HeroSection, StackSection, ...)
Page (/pages/es/index.astro) → View (HomePage.astro) → same sections, different locale
```

## Configuration

### Theme

Colors use oklch for perceptual uniformity and P3 gamut support. Semantic tokens reference primitives and are defined in `src/styles/theme.css`:

- Light theme on `:root`, dark theme on `[data-theme="dark"]`
- Three-state toggle: auto (follows system), light, dark
- Persisted in `localStorage`, applied via blocking `<head>` script

### Internationalization

- Locales: English (no URL prefix) and Spanish (`/es/`)
- Translations: `src/i18n/ui.ts` with type-safe keys
- Access: `Astro.locals.t("key")` and `Astro.locals.lang`
- Blog translations linked via `translationSlug` frontmatter field

### Lighthouse Thresholds

CI enforces minimum Lighthouse scores (configurable in `lighthouserc.json`):

- Performance: 90%
- Accessibility: 90%
- Best Practices: 90%
- SEO: 90%

## Contributing

While this is a personal portfolio, bug reports and suggestions are welcome. Please open an issue to discuss any changes.

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: new feature
fix: bug fix
refactor: code refactoring
chore: maintenance tasks
perf: performance improvements
docs: documentation changes
style: formatting changes
```

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](https://creativecommons.org/licenses/by-nc-nd/4.0/).

<p align="center">
  <img src="https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png" alt="CC BY-NC-ND 4.0" />
</p>

**You are free to:**

- **Share** -- copy and redistribute the material in any medium or format

**Under the following terms:**

- **Attribution** -- You must give appropriate credit, provide a link to the license, and indicate if changes were made
- **NonCommercial** -- You may not use the material for commercial purposes
- **NoDerivatives** -- If you remix, transform, or build upon the material, you may not distribute the modified material
