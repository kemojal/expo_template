import { config } from "dotenv";
config({ path: "../../.env" });

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./lib/auth";
import { startSyncServer } from "./lib/sync";
import { health } from "./routes/health";
import { todos } from "./routes/todos";
import { uploads } from "./routes/uploads";
import { tools } from "./routes/tools";

const app = new Hono();

// Global middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:19006",
      process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Better Auth routes
app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// Routes
app.route("/health", health);
app.route("/todos", todos);
app.route("/uploads", uploads);
app.route("/tools", tools);

// Start TinyBase sync server
startSyncServer();

export default {
  port: Number(process.env.PORT) || 3000,
  fetch: app.fetch,
};

export { auth };
export type AppType = typeof app;
