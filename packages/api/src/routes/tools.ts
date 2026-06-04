import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Hono } from "hono";

const pagePath = join(import.meta.dir, "../static/apple-client-secret.html");

export const tools = new Hono();

tools.get("/apple-client-secret", (c) => {
  const html = readFileSync(pagePath, "utf-8");
  return c.html(html);
});
