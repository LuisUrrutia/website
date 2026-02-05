// Main SEO component
export { default as SEO } from "./SEO.astro";
export type { Props as SEOProps, ArticleMeta } from "./SEO.astro";

// JSON-LD components
export { default as ArticleJsonLd } from "./ArticleJsonLd.astro";
export { default as BreadcrumbJsonLd } from "./BreadcrumbJsonLd.astro";
export { default as HomePageJsonLd } from "./HomePageJsonLd.astro";

// Meta components
export { default as CanonicalMeta } from "./CanonicalMeta.astro";
export { default as OpenGraphMeta } from "./OpenGraphMeta.astro";
export { default as TwitterCardMeta } from "./TwitterCardMeta.astro";

// Re-export types
export type { Props as OpenGraphMetaProps } from "./OpenGraphMeta.astro";
export type { Props as TwitterCardMetaProps } from "./TwitterCardMeta.astro";
export type { Props as CanonicalMetaProps } from "./CanonicalMeta.astro";
