# Dokploy Deployment

## 1. Create the service

- Source: your Git repo
- Build type: **Dockerfile** (auto-detected from root `Dockerfile`)

## 2. Environment variables

Set these in the Dokploy UI under your service's environment configuration:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | A strong random secret |
| `BETTER_AUTH_URL` | `https://your-api-domain.com` |
| `BETTER_AUTH_TRUSTED_ORIGINS` | `https://your-api-domain.com` |
| `EXPO_PUBLIC_API_URL` | `https://your-api-domain.com` |
| `APPLE_CLIENT_ID` | Your Apple client ID |
| `APPLE_CLIENT_SECRET` | Your Apple client secret (see [Apple secret generation](../README.md#apple-sign-in-client-secret)) |
| `APPLE_BUNDLE_IDENTIFIER` | Your bundle ID |
| `GOOGLE_CLIENT_ID` | Your Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth secret |
| `R2_ENDPOINT` | Cloudflare R2 endpoint |
| `R2_ACCESS_KEY_ID` | R2 access key |
| `R2_SECRET_ACCESS_KEY` | R2 secret key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `CORS_ORIGINS` | Comma-separated extra origins (optional) |
| `PORT` | `3000` (default) |
| `SYNC_PORT` | `3001` (default) |

## 3. Ports

Expose **3000** (HTTP) and **3001** (WebSocket).

- Configure your domain/reverse proxy in Dokploy to route to port **3000**.
- For WebSocket sync, set up a separate domain or path routed to port **3001** with WebSocket upgrade support.

## 4. Health check

```
GET /health
```

Returns `{"status":"ok","timestamp":"..."}` — use this as your Dokploy health check endpoint.

## 5. Database migrations

Run before first deploy (or as a one-time command in Dokploy):

```bash
bun run --cwd packages/db db:migrate
```
