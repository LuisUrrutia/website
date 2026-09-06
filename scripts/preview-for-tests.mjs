import { preview } from "astro";

const server = await preview({ server: { host: "127.0.0.1", port: 4322 } });
process.on("SIGTERM", () => void server.stop());
process.on("SIGINT", () => void server.stop());
