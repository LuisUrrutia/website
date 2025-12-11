# urrutia.me

<p align="center">
  <strong>My personal portfolio website built with Astro and Tailwind CSS v4.</strong>
</p>

<p align="center">
	<a href="https://github.com/LuisUrrutia/website/releases"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/LuisUrrutia/website"></a>
	<a href="https://twitter.com/luisurrutia_dev"><img alt="Twitter" src="https://badgen.net/badge/twitter/@luisurrutia_dev/1DA1F2?icon&label" /></a>
	<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="License CC BY-NC-ND 4.0" src="https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey" /></a>
</p>

<p align="center">
  <a href="https://urrutia.me">View Live Site</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a>
</p>

---

## Tech Stack

### Core

| Technology                                    | Description                                   |
| --------------------------------------------- | --------------------------------------------- |
| [Astro](https://astro.build/)                 | Static site generator with zero JS by default |
| [Tailwind CSS v4](https://tailwindcss.com/)   | Utility-first CSS framework                   |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript                          |

### Development

| Tool                                                                 | Description                                 |
| -------------------------------------------------------------------- | ------------------------------------------- |
| [Bun](https://bun.sh/)                                               | Fast JavaScript runtime and package manager |
| [OxLint](https://oxc-project.github.io/docs/guide/usage/linter.html) | High-performance linter                     |
| [Prettier](https://prettier.io/)                                     | Code formatter                              |
| [Husky](https://typicode.github.io/husky/)                           | Git hooks                                   |
| [Commitlint](https://commitlint.js.org/)                             | Conventional commit linting                 |
| [lint-staged](https://github.com/lint-staged/lint-staged)            | Run linters on staged files                 |

### CI/CD

| Workflow   | Description                               |
| ---------- | ----------------------------------------- |
| Verify     | Runs lint, format check, and build on PRs |
| Release    | Automated releases with semantic-release  |
| CodeQL     | Security vulnerability scanning           |
| Lighthouse | Performance and accessibility audits      |
| Commitlint | Validates commit message format           |
| Dependabot | Automated dependency updates              |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.3

### Installation

```bash
# Clone the repository
git clone https://github.com/LuisUrrutia/website.git
cd web

# Install dependencies
bun install
```

### Development

Start the development server to begin working on the site. The server includes hot module replacement, so changes are reflected immediately in the browser:

```bash
bun run dev
```

The site will be available at `http://localhost:4321`.

Before committing, ensure your code passes linting and formatting checks:

```bash
bun run lint    # Check for code issues
bun run fmt     # Verify formatting
```

To build the production version:

```bash
bun run build
```

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

A `docker-compose.yml` is provided to test the production build with a lightweight server ([Static Web Server](https://static-web-server.net/)) that supports Brotli compression and proper cache headers. This allows you to run Lighthouse or other performance tools against a realistic production environment:

```bash
# Build the site first
bun run build

# Start the container
docker compose up -d

# Site available at http://localhost:8080
```

Run Lighthouse against the Docker server to get accurate performance metrics that reflect production behavior, including compression and caching benefits.

## Project Structure

```
.
├── .github/
│   ├── workflows/            # GitHub Actions
├── public/
│   ├── companies/            # Company logo SVGs
│   ├── favicons/             # Favicon files
│   ├── patterns/             # Background patterns
│   └── tech/                 # Technology icon SVGs
├── src/
│   ├── assets/
│   │   ├── icons/            # Icon components (Astro)
│   │   └── images/           # Images (processed by Astro)
│   ├── components/           # Reusable components
│   ├── layouts/              # Page layouts
│   ├── pages/                # Pages
│   ├── sections/             # Page sections
│   └── styles/               # Global styles
```

## Configuration

### Theme Colors

The site uses oklch color space for better color manipulation. Theme colors are defined in `src/styles/theme.css`:

```css
:root {
	--oklch-primary: 54.6% 0.215 264;
	--oklch-secondary: 49.6% 0.222 264;
	--oklch-accent: 76.5% 0.108 264;
	/* ... */
}
```

### Lighthouse Thresholds

The CI enforces minimum Lighthouse scores (configurable in `lighthouserc.json`):

- Performance: 90%
- Accessibility: 90%
- Best Practices: 90%
- SEO: 90%

## Contributing

While this is a personal portfolio, bug reports and suggestions are welcome! Please open an issue to discuss any changes.

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
chore: maintenance tasks
docs: documentation changes
style: formatting changes
refactor: code refactoring
perf: performance improvements
test: adding tests
```

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License](https://creativecommons.org/licenses/by-nc-nd/4.0/).

<p align="center">
  <img src="https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png" alt="CC BY-NC-ND 4.0" />
</p>

**You are free to:**

- **Share** — copy and redistribute the material in any medium or format

**Under the following terms:**

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made
- **NonCommercial** — You may not use the material for commercial purposes
- **NoDerivatives** — If you remix, transform, or build upon the material, you may not distribute the modified material
