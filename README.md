<p align="center">
    <h1 align="center">My Personal Website</h1>
</p>

<p align="center">
	<a href="https://github.com/LuisUrrutia/website/releases"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/LuisUrrutia/website"></a>
	<a href="https://twitter.com/luisurrutia_dev"><img alt="Twitter" src="https://badgen.net/badge/twitter/@luisurrutia_dev/1DA1F2?icon&label" /></a>
	<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="License CC BY-NC-ND 4.0" src="https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey" /></a>
</p>

## 🚀 Project Structure

Inside of this project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run check`           | Runs astro diagnostics                           |
| `npm run lint`            | Runs code linting                                |
| `npm run prettier`        | Runs prettier checking                           |
| `npm run prettier:fix`    | Runs prettier and fix issues                     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🛠️ Tools

Check out the documentation on the different tools I'm using in this project:

- [Astro](https://docs.astro.build)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Prettier](https://prettier.io/docs/en/) - Checks the formatting on almost evey file of this project.
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) - Faster alternative to `eslint`
- [LintStaged](https://github.com/lint-staged/lint-staged) - Allows to run checks only on modified files.
- [EditorConfig](https://editorconfig.org/) - Related to `.editorconfig` file.
- [Tailwind](https://tailwindcss.com/docs/installation) - CSS Framework.
- [Semantic Release](https://semantic-release.gitbook.io/semantic-release) - Related to Github Actions to automaticaly create new releases in Github.
- [Github Actions](https://docs.github.com/es/actions)
- [asdf](https://asdf-vm.com/) / [mise](https://mise.jdx.dev/getting-started.html) - My prefered runtime version manger over `nvm`.
- [CommitLint](https://commitlint.js.org/) - I like to stick to conventional commits and it's also a way to easily generate a changelog with `semantic-release`.
- [PNPM](https://pnpm.io/) - Faster Package Manager than `npm`.
- [Husky](https://typicode.github.io/husky/) - Related to git pre-commit and commit hooks.
- [Visual Studio Code](https://code.visualstudio.com/) - My prefered code editor.
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Lightning CSS](https://lightningcss.dev/)
- [PostCSS](https://postcss.org/)

## 👀 References

Projects I did take a look to guide me on how to do things better.

- [onwidget/astrowind](https://github.com/onwidget/astrowind)
- [withastro/docs](https://github.com/withastro/docs)
- [ccbikai/BroadcastChannel](https://github.com/ccbikai/BroadcastChannel)
- [midudev/la-velada-web-oficial](https://github.com/midudev/la-velada-web-oficial)

## License

This work is licensed under a
[Creative Commons Attribution-NonCommercial-NoDerivs 4.0 International License][cc-by-nc-nd].

[![CC BY-NC-ND 4.0][cc-by-nc-nd-image]][cc-by-nc-nd]

[cc-by-nc-nd]: http://creativecommons.org/licenses/by-nc-nd/4.0/
[cc-by-nc-nd-image]: https://licensebuttons.net/l/by-nc-nd/4.0/88x31.png
[cc-by-nc-nd-shield]: https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg
