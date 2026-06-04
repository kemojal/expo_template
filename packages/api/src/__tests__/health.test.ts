import { describe, expect, it } from "bun:test";
import { Hono } from "hono";
import { health } from "../routes/health";

const app = new Hono();
app.route("/health", health);

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe("ok");
  });
});
