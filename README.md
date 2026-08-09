# urrutia.me

<p align="center">
  <strong>Personal portfolio and blog built with Astro v7 and Tailwind CSS v4.</strong>
</p>

<p align="center">
	<a href="https://github.com/LuisUrrutia/website/releases"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/LuisUrrutia/website"></a>
	<a href="https://github.com/LuisUrrutia/website/releases/latest"><img alt="Latest release Lighthouse performance score" src="https://raw.githubusercontent.com/LuisUrrutia/website/badges/lighthouse-performance.svg"></a>
	<a href="https://github.com/LuisUrrutia/website/releases/latest"><img alt="Latest release Lighthouse accessibility score" src="https://raw.githubusercontent.com/LuisUrrutia/website/badges/lighthouse-accessibility.svg"></a>
	<a href="https://github.com/LuisUrrutia/website/releases/latest"><img alt="Latest release Lighthouse best practices score" src="https://raw.githubusercontent.com/LuisUrrutia/website/badges/lighthouse-best-practices.svg"></a>
	<a href="https://github.com/LuisUrrutia/website/releases/latest"><img alt="Latest release Lighthouse SEO score" src="https://raw.githubusercontent.com/LuisUrrutia/website/badges/lighthouse-seo.svg"></a>
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

- **Multilingual:** English is the default language, with Spanish available under `/es/`. Each locale has its own RSS feed and hreflang tags.
- **Blog:** MDX posts with pagination, reading time, social sharing, and Giscus comments.
- **SEO:** Canonical URLs, Open Graph, Twitter Cards, generated OG images, and a sitemap with hreflang support. JSON-LD covers Person, WebSite, ProfilePage, BlogPosting, and BreadcrumbList schemas.
- **Dark mode:** A three-state theme toggle for auto, light, and dark modes. A blocking script prevents the wrong theme from flashing during page load.
- **Accessibility:** Skip links, ARIA labels, visible focus indicators, `prefers-reduced-motion` support, and screen reader announcements.
- **Performance:** Zero JavaScript by default, inlined CSS, a subsetted variable font, Brotli and gzip compression, and lazy-loaded AVIF/WebP images with responsive `srcset` values.
- **View Transitions:** Native CSS transitions with lazy `view-transition-name` assignment for smooth page navigation.

## Tech Stack

### Core

| Technology                                    | Description                                   |
| --------------------------------------------- | --------------------------------------------- |
| [Astro v7](https://astro.build/)              | Static site generator with zero JS by default |
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
| [SVGO](https://svgo.dev/)                                      | SVG optimization through `@playform/compress`    |

### CI/CD

| Workflow   | Description                                       |
| ---------- | ------------------------------------------------- |
| Verify     | Lint, format check, tests, and build on PRs       |
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
| `bun run test`          | Run the Vitest suite                                  |

### Testing with Docker

Use the included `docker-compose.yml` to test the production build with [Static Web Server](https://static-web-server.net/). It supports Brotli compression and appropriate cache headers:

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
│   ├── fonts/             # Fonts processed by Astro's native Fonts API
│   ├── icons/             # SVG icons optimized during production builds
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
├── fonts/                 # Inter 400/700 files used for OG image generation
├── images/                # Static images
└── tech/                  # Technology icon SVGs
scripts/
└── lighthouse-badge.ts    # Release score aggregation and SVG badge generation
```

### Architecture

Routing files stay small by delegating page composition to **Views**. Those views reuse the same **Sections** and **Components** across the English and Spanish routes:

```
Page (/pages/index.astro) → View (HomePage.astro) → Sections (HeroSection, StackSection, ...)
Page (/pages/es/index.astro) → View (HomePage.astro) → same sections, different locale
```

## Configuration

### Theme

The color palette uses oklch for perceptual uniformity and P3 gamut support. Semantic tokens reference the primitives defined in `src/styles/theme.css`:

- Light theme on `:root`, dark theme on `[data-theme="dark"]`
- Three-state toggle: auto (follows system), light, dark
- Persisted in `localStorage`, applied via blocking `<head>` script

### Internationalization

- Locales: English (no URL prefix) and Spanish (`/es/`)
- Translations: `src/i18n/ui.ts` with type-safe keys
- Access: `Astro.locals.t("key")` and `Astro.locals.lang`
- Blog translations linked via `translationSlug` frontmatter field

### Lighthouse Thresholds

CI reads the Lighthouse thresholds from `lighthouserc.json` and requires these minimum scores:

- Performance: 90%
- Accessibility: 90%
- Best Practices: 90%
- SEO: 90%

Each page is audited three times, and CI evaluates the median result. After a release is deployed, it audits both locales, adds the lowest page score for each category to the release assets, and updates the four Lighthouse badges at the top of this README.

## Contributing

This is a personal portfolio, but bug reports and suggestions are welcome. Open an issue if you would like to discuss a change.

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

- **Share:** Copy and redistribute the material in any medium or format.

**Under the following terms:**

- **Attribution:** Give appropriate credit, link to the license, and indicate whether you made changes.
- **NonCommercial:** You may not use the material for commercial purposes.
- **NoDerivatives:** If you remix, transform, or build upon the material, you may not distribute the modified material.
