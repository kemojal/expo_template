import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: ["http://localhost:8081", "http://localhost:19006"],
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
