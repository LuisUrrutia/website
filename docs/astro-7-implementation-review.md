# Revisión de la implementación con Astro 7

Fecha de revisión: 2026-08-09

Versión revisada en el repositorio: Astro `7.1.6`

## Alcance y conclusión

Se comparó la implementación actual con la guía oficial de migración a Astro 7, la documentación vigente y los anuncios oficiales de Astro 7 y 7.1. No se encontraron cambios obligatorios pendientes para que este sitio estático funcione con Astro 7: el `build` genera correctamente las nueve páginas, los endpoints RSS, las imágenes Open Graph y el sitemap; `astro check` no informa errores ni advertencias; y los 26 tests pasan.

Astro 7 cambió el compilador de componentes por una implementación en Rust, actualizó Vite a la versión 8 con Rolldown, cambió la compresión HTML predeterminada a semántica JSX y actualizó el pipeline de Markdown/MDX. La guía oficial explica cuáles de esos cambios requieren intervención y cuáles tienen compatibilidad automática; el proyecto ya está adaptado o no usa las APIs afectadas ([guía oficial v6 → v7](https://docs.astro.build/en/guides/upgrade-to/v7/), [anuncio de Astro 7](https://astro.build/blog/astro-7/)).

Los tres cambios principales recomendados eran de mantenimiento, no bloqueantes, y quedaron aplicados en el seguimiento de esta revisión:

1. La navegación permanece como MPA nativa y los scripts ya no escuchan eventos exclusivos de `<ClientRouter />`.
2. `astro-font` fue sustituido por la API nativa y estable de fuentes de Astro.
3. El parche de XML del sitemap fue sustituido por la API pública `serialize()`/`links` de `@astrojs/sitemap`.

## Prioridades

| Prioridad | Clasificación | Acción                                                                                   | Motivo                                                                                     |
| --------- | ------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| P0        | Obligatorio   | Ninguna                                                                                  | Compilación, comprobación de tipos y tests pasan; no se detectaron APIs eliminadas en uso. |
| P1        | Aplicado      | Alinear los scripts con la estrategia real de View Transitions                           | Se retiraron los listeners `astro:after-swap` y las animaciones ahora son CSS nativo.      |
| P1        | Aplicado      | Migrar `astro-font` a la API nativa de fuentes                                           | Astro gestiona ahora preload, CSS y fallbacks; se eliminó la dependencia externa.          |
| P2        | Aplicado      | Refactorizar `sitemap-hreflang.ts` hacia `serialize()` y `SitemapItem.links`             | Ya no se modifica el XML generado ni se duplica el dominio en la integración.              |
| P2        | Aplicado      | Corregir la documentación que afirmaba que el optimizador SVG experimental estaba activo | README y AGENTS describen ahora la optimización real de `@playform/compress`.              |
| P2        | Opcional      | Evaluar la eliminación futura de `compressHTML: true`                                    | Solo después de una auditoría visual/HTML que haga explícitos los espacios necesarios.     |
| P3        | Aplicado      | Limpiar metadatos, comentarios y tipos redundantes                                       | `Astro.generator`, el comentario CSS y los tipos reflejan ahora el comportamiento real.    |
| —         | No aplicable  | `deferRender`, almacenamiento de colecciones, caché de rutas y adaptador Cloudflare      | El contenido es MDX, la colección es pequeña y todo el sitio se prerenderiza.              |

## 1. Compilador Rust y compresión HTML

### Estado actual

- `astro.config.mjs:18-19` conserva de forma deliberada `compressHTML: true`.
- No se encontraron componentes con errores de cierre de etiquetas: el compilador Rust procesó todas las páginas durante la validación.

### Impacto de Astro 7

El compilador Rust de Astro 7 es más estricto con las etiquetas de cierre y ya no corrige HTML mal formado como lo hacía el parser anterior. La migración oficial recomienda corregir el marcado que ahora falle, no desactivar el compilador ([migración: nuevo compilador](https://docs.astro.build/en/guides/upgrade-to/v7/#changed-new-rust-based-astro-compiler)). El `build` exitoso demuestra que el marcado fuente es aceptado por el nuevo compilador, aunque sigue siendo recomendable que una revisión visual cubra posibles diferencias semánticas que no sean errores de compilación.

Astro 7 cambió el valor predeterminado de `compressHTML` a `'jsx'`, que elimina el espacio entre elementos de manera similar a JSX. `compressHTML: true` es la opción documentada para conservar el comportamiento de Astro 6, por lo que la línea actual es válida y no debe sustituirse por un cast, workaround o integración adicional ([migración: espacios HTML](https://docs.astro.build/en/guides/upgrade-to/v7/#changed-default-value-of-compresshtml), [referencia de `compressHTML`](https://docs.astro.build/en/reference/configuration-reference/#compresshtml)).

### Recomendación

Mantener `compressHTML: true` por ahora. Migrar al valor predeterminado `'jsx'` sería una optimización opcional: primero habría que inspeccionar texto formado por elementos inline —por ejemplo, enlaces o énfasis separados— y añadir espacios explícitos como `{" "}` donde sean semánticamente necesarios, tal como indica la guía de migración ([ejemplo oficial de espacios explícitos](https://docs.astro.build/en/guides/upgrade-to/v7/#changed-default-value-of-compresshtml)).

## 2. Content Layer, colecciones, IDs y MDX 7

### Estado actual

- `src/content.config.ts:6-20` define la colección con el loader oficial `glob()` y un esquema de contenido.
- `src/data/blog.ts:19,74,78` consulta mediante `getCollection()`.
- `src/data/blog.ts:81`, `src/views/HomePage.astro:23-31`, los endpoints RSS y la ruta OG usan `post.id` para derivar el slug público.
- `src/views/BlogPostPage.astro:2,21` usa `render(post)` y después renderiza `<Content components={{ a: A }} />` en la línea 56.
- La colección contiene cuatro entradas MDX y no configura plugins remark, rehype o recma propios.

### Evaluación

La implementación coincide con la API vigente de Content Layer: `CollectionEntry.id` es el identificador único generado por el loader y `render(entry)` devuelve el componente `Content` junto con los metadatos de renderizado ([referencia de `CollectionEntry.id`](https://docs.astro.build/en/reference/modules/astro-content/#collectionentryid), [referencia de `render()`](https://docs.astro.build/en/reference/modules/astro-content/#render), [loader `glob()`](https://docs.astro.build/en/reference/content-loader-reference/#glob-loader)). Eliminar el prefijo `en/` o `es/` de `post.id` con `getSlugWithoutLocale()` es una decisión de URL del proyecto, no una API obsoleta de Astro.

MDX 7 actualiza el pipeline Markdown subyacente, pero mantiene el uso de componentes importados dentro de `.mdx`, los componentes personalizados enviados a `<Content components={...} />` y la integración `mdx()` ([documentación oficial de MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/), [cambios de Markdown/MDX en Astro 7](https://docs.astro.build/en/guides/upgrade-to/v7/#changed-markdown-processing)). Como el repositorio no tiene plugins personalizados que dependan del AST anterior y todas las entradas se renderizan en el build, no hay una migración de MDX pendiente.

### Funciones nuevas no aplicables

- `deferRender` retrasa el renderizado de contenido Markdown, pero la documentación lo limita a Markdown y excluye MDX; no beneficia a esta colección ([referencia de `deferRender`](https://docs.astro.build/en/reference/content-loader-reference/#deferrender)).
- `retainBody: false` y el almacenamiento de colecciones pueden reducir memoria en colecciones grandes. Con solo cuatro entradas no compensan la complejidad y el almacenamiento de colecciones sigue documentado como experimental ([`retainBody`](https://docs.astro.build/en/reference/content-loader-reference/#retainbody), [almacenamiento experimental](https://docs.astro.build/en/reference/experimental-flags/collection-storage/), [Astro 7.1](https://astro.build/blog/astro-710/)).

## 3. Tipado de `Astro.props`

`src/views/blog-post/BlogPostArticle.astro:13-20` sigue el patrón oficial: declara `interface Props` y desestructura `Astro.props` sin `as Props`. Astro reconoce automáticamente una interfaz `Props` en el frontmatter del componente; añadir `const { ... } = Astro.props as Props` sería redundante y ocultaría discrepancias que el chequeo automático debería detectar ([TypeScript en componentes Astro](https://docs.astro.build/en/guides/typescript/#component-props)).

`bun run astro check` produce únicamente un _hint_ TS6196 que dice que `Props` no se usa, pero no un error o warning. Dado que la implementación reproduce la convención oficial, no se recomienda introducir el cast como solución a ese hint.

`tsconfig.json:8` incluye `.astro/types.d.ts` como recomienda la configuración oficial, y el import directo redundante ya fue retirado ([configuración TypeScript oficial](https://docs.astro.build/en/guides/typescript/#setup)). El `declare global` de `src/env.d.ts:5-17` mantiene disponibles `App.Locals` y el evento personalizado aunque el archivo contenga imports de tipos.

## 4. Rutas, endpoints estáticos, middleware e i18n

### Rutas y endpoints

- Las rutas dinámicas inglesas y españolas implementan `getStaticPaths()`; por ejemplo, `src/pages/blog/[slug].astro:5-9` obtiene las props generadas.
- `src/pages/og/[...slug].ts:5-11` usa las entradas de la colección para exportar `getStaticPaths` y `GET` mediante `OGImageRoute`.
- No existe `output: "server"` ni adaptador en `astro.config.mjs`; se usa el output estático predeterminado.

En modo estático, las rutas dinámicas necesitan `getStaticPaths()` y los endpoints se ejecutan durante el build para producir archivos, que es exactamente el patrón actual ([referencia oficial de routing](https://docs.astro.build/en/reference/routing-reference/#getstaticpaths), [endpoints estáticos](https://docs.astro.build/en/guides/endpoints/#static-file-endpoints)). Astro 7 reserva `src/fetch.ts` para _advanced routing_, pero el repositorio no tiene ese archivo, de modo que no existe colisión ni hace falta configurar `fetchFile: null` ([migración: `src/fetch.ts`](https://docs.astro.build/en/guides/upgrade-to/v7/#changed-srcfetchtstsjstsxjsx-is-now-reserved)).

### Middleware y locales

`src/middleware.ts:4-13` calcula idioma, traducciones y path, los asigna a `context.locals` y devuelve `next()`. Astro ejecuta el middleware también para páginas prerenderizadas durante la compilación, y `context.locals` es la API pública para compartir datos con páginas y componentes ([middleware oficial](https://docs.astro.build/en/guides/middleware/), [`context.locals`](https://docs.astro.build/en/reference/api-reference/#locals)). `src/env.d.ts:11-17` tipa esos tres valores, por lo que no se requiere un cambio por Astro 7.

La configuración en `astro.config.mjs:53-59` declara `en`, `es`, `en` como locale predeterminado y `prefixDefaultLocale: false`; las carpetas `/` y `/es/` coinciden con ese esquema. Astro también ofrece helpers en `astro:i18n`, pero adoptarlos es opcional mientras las utilidades del proyecto produzcan las rutas correctas ([API oficial `astro:i18n`](https://docs.astro.build/en/reference/modules/astro-i18n/), [guía de routing i18n](https://docs.astro.build/en/guides/internationalization/#routing)).

La paginación manual de `src/pages/blog/page/[page].astro` y su equivalente español no necesita la nueva función `paginate.format()` de Astro 7.1, destinada a personalizar el formato de URL generado por el helper `paginate()` ([Astro 7.1: formato de paginación](https://astro.build/blog/astro-710/#custom-pagination-url-formats)).

## 5. View Transitions, scripts y ciclo de vida

### Estado aplicado

`src/styles/global.css` mantiene `@view-transition { navigation: auto; }`, la API nativa del navegador para transiciones entre documentos. No hay `<ClientRouter />` ni imports desde `astro:transitions`, por lo que la navegación conserva el comportamiento MPA y cada página ejecuta sus scripts en un documento nuevo ([transiciones nativas](https://docs.astro.build/en/guides/view-transitions/#native-cross-document-view-transitions)).

Se eliminaron los diez listeners `astro:after-swap`, porque ese evento pertenece al ciclo de `<ClientRouter />` ([eventos del router](https://docs.astro.build/en/guides/view-transitions/#astroafter-swap)). Los inicializadores continúan ejecutándose directamente y conservan guards locales donde pueden encontrar más de una instancia.

Las antiguas directivas `transition:animate` se sustituyeron por `data-page-transition="fade|slide"`, `view-transition-name` y pseudoelementos CSS nativos. La hoja global también desactiva todas las animaciones de transición bajo `prefers-reduced-motion`. Las transiciones compartidas `post-card`, `post-title-*` y `post-pill-*` se conservan.

## 6. Fuentes, assets, Sharp y SVG

### Fuentes

Astro dispone desde la versión 6 de una API estable y tipada para fuentes, con `fontProviders.local()`, fuentes variables, preload mediante `<Font />` y fallbacks optimizados ([guía oficial de fuentes](https://docs.astro.build/en/guides/fonts/), [API de proveedores](https://docs.astro.build/en/reference/font-provider-reference/)).

La fuente variable se movió a `src/assets/fonts/InterVariable.woff2`, está registrada en `astro.config.mjs` con peso `"100 900"` y se inserta desde `Layout.astro` mediante `<Font cssVariable="--font-inter" preload />`. `astro-font` ya no forma parte de `package.json` ni del lockfile. Los archivos públicos `Inter-400.woff2` y `Inter-700.woff2` permanecen disponibles para `astro-og-canvas`.

### Imágenes

El repositorio usa `Image`/`getImage()` con assets importados —por ejemplo, `src/components/ProfilePicture.astro:2,31-57`, `src/components/TestimonialCard.astro:17,54` y `src/components/mdx/ThemedImage.astro:2-26`— y declara `sharp` en `package.json:33`. Sharp es el servicio de imágenes predeterminado usado por `astro:assets`; en un build estático procesa las imágenes durante la compilación, por lo que mantener la dependencia directa es correcto ([servicio de imágenes](https://docs.astro.build/en/reference/image-service-reference/), [error oficial cuando falta Sharp](https://docs.astro.build/en/reference/errors/missing-sharp/)).

### SVG

Astro 7 sustituyó el flag experimental SVG anterior por `experimental.svgOptimizer: svgoOptimizer()`. El optimizador afecta a componentes SVG importados y se ejecuta en producción; además, Astro advierte que las APIs experimentales pueden cambiar incluso en versiones _patch_ ([migración del optimizador SVG](https://docs.astro.build/en/guides/upgrade-to/v7/#changed-experimental-svg-optimization), [referencia del optimizador SVG](https://docs.astro.build/en/reference/experimental-flags/svg-optimization/), [estabilidad de flags experimentales](https://docs.astro.build/en/reference/experimental-flags/)).

`astro.config.mjs` no habilita `experimental.svgOptimizer`. La optimización SVG está configurada en `@playform/compress` mediante `SVG: true`, y README/AGENTS ya describen ese comportamiento. Habilitar además el optimizador experimental sería una evaluación separada con comparación de tamaño, fidelidad visual y tiempo de build, no una exigencia de Astro 7.

## 7. Vite 8, Rolldown, Node y Bun

Astro 7 usa Vite 8 y Rolldown. La capa de compatibilidad de Vite traduce muchas opciones existentes de esbuild/Rollup, y la guía indica que la mayoría de proyectos no necesitan cambios; las incompatibilidades probables están en plugins que acceden a APIs internas o a transformaciones no compatibles ([migración a Vite 8](https://docs.astro.build/en/guides/upgrade-to/v7/#changed-vite-8), [anuncio Astro 7](https://astro.build/blog/astro-7/)).

La configuración local solo añade el plugin oficial de Tailwind y `build.assetsInlineLimit` en `astro.config.mjs:61-67`; no modifica internals de Vite. El build también valida que las integraciones instaladas cargan bajo esta versión. No se requiere conversión manual a opciones Rolldown.

Astro requiere una versión compatible y mantenida de Node; la instalación oficial actual indica Node `22.12.0` o superior ([requisitos oficiales](https://docs.astro.build/en/install-and-setup/#prerequisites)). `package.json:53-55` ya exige `node >=22.12.0` y `bun >=1.3`; `.github/workflows/release.yml:32-40` instala Node 22 y la versión definida en `.bun-version`. No hay cambio obligatorio en runtime.

## 8. Build estático y Cloudflare Pages

Al no definir `output`, Astro usa generación estática; el deploy sube `dist/` directamente mediante `wrangler pages deploy` en `.github/workflows/release.yml:92-97`. Los sitios completamente estáticos no necesitan el adaptador de Cloudflare: el adaptador se utiliza para renderizado bajo demanda/SSR en Workers ([despliegue estático](https://docs.astro.build/en/guides/deploy/), [integración Cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)). Añadir `@astrojs/cloudflare` ahora aumentaría superficie y complejidad sin habilitar una necesidad del sitio.

Las novedades de caché de rutas y `routeCacheProvider` de Astro 7.1 están orientadas al contenido renderizado bajo demanda; no aportan nada a archivos ya producidos en `dist/` y cacheables por Cloudflare Pages ([Astro 7.1: route caching](https://astro.build/blog/astro-710/#route-caching)).

## 9. Sitemap y RSS

### Sitemap

`@astrojs/sitemap` recibe `site`, i18n y una función `serialize` en `astro.config.mjs`. `src/integrations/sitemap-hreflang.ts` construye una única tabla de traducciones desde el frontmatter y asigna `SitemapItem.links` a posts con slugs distintos ([API `serialize()`](https://docs.astro.build/en/guides/integrations-guide/sitemap/#serialize), [`SitemapItem.links`](https://docs.astro.build/en/guides/integrations-guide/sitemap/#sitemapitemlinks)). Ya no existen el hook `astro:build:done`, la escritura posterior ni las regex sobre XML.

### RSS

`src/pages/rss.xml.ts:10-24` y `src/pages/es/rss.xml.ts:10-24` pasan `context.site`, consultan la colección y devuelven `rss({ items })`. Es el patrón oficial para feeds generados estáticamente, y `site` ya está configurado, por lo que no hay cambios pendientes ([receta oficial de RSS](https://docs.astro.build/en/recipes/rss/), [referencia de `@astrojs/rss`](https://docs.astro.build/en/guides/rss/)).

## 10. Configuración eliminada, deprecada o experimental

No se encontraron referencias a las opciones experimentales eliminadas o renombradas en Astro 7 (`rustCompiler`, `queuedRendering`, `logger`, el antiguo optimizador SVG), ni a APIs eliminadas como `getContainerRenderer()` o constantes internas de View Transitions. Tampoco existe `experimental` en `astro.config.mjs`. Por tanto, esas secciones de la migración no exigen código local ([opciones experimentales cambiadas](https://docs.astro.build/en/guides/upgrade-to/v7/#changed-experimental-flags), [APIs eliminadas](https://docs.astro.build/en/guides/upgrade-to/v7/#removed-deprecated-apis)).

La recomendación general es no habilitar funciones experimentales sin un caso medible: Astro especifica que no están sujetas a su estabilidad semántica normal y pueden cambiar en versiones _minor_ o _patch_ ([política de flags experimentales](https://docs.astro.build/en/reference/experimental-flags/)).

También se aplicaron tres limpiezas menores, independientes de la migración:

- `Layout.astro` usa `content={Astro.generator}` y expone la versión real de Astro ([referencia de `Astro.generator`](https://docs.astro.build/en/reference/api-reference/#generator)).
- El comentario de `inlineStylesheets: "always"` describe ahora que todas las hojas de estilo se insertan en el HTML.
- Se retiró el import redundante de `.astro/types.d.ts`; `tsconfig.json` continúa incluyéndolo.

## Resultado de la aplicación

Se aplicaron los cambios de transiciones, fuentes, sitemap, documentación y limpieza. Se conserva `compressHTML: true`, Content Layer, MDX, rutas, middleware, Sharp y despliegue tal como estaban. La posible adopción futura de `compressHTML: "jsx"` sigue siendo una evaluación visual separada.

## Validación ejecutada

| Comando               | Resultado                                                                               |
| --------------------- | --------------------------------------------------------------------------------------- |
| `bun run build`       | Correcto; 9 páginas estáticas, feeds RSS, imágenes OG y sitemap generados.              |
| `bun run astro check` | 0 errores, 0 warnings, 1 hint TS6196 en la interfaz `Props` de `BlogPostArticle.astro`. |
| `bun run test`        | Correcto; 4 archivos y 26 tests.                                                        |
| Playwright            | Fuente cargada, transiciones `fade`/`slide`, navegación y Giscus EN/ES verificados.     |

La investigación inicial no modificó producción; los cambios descritos se aplicaron posteriormente por solicitud del usuario.
