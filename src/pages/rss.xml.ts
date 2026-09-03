import type { APIContext } from "astro";
import { buildRssFeed } from "@/data/rss";

export function GET(context: APIContext) {
	return buildRssFeed("en", context);
}
