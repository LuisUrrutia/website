import type { APIRoute } from "astro";

// Generated OG images stay crawlable: Article rich results and Twitter cards
// only render an image the crawler is allowed to fetch.
const getRobotsTxt = (sitemapURL: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
	const sitemapURL = new URL("sitemap-index.xml", site);
	return new Response(getRobotsTxt(sitemapURL));
};
