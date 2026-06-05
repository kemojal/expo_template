# Expo monorepo template

Bun workspaces monorepo with the Expo mobile app in `apps/mobile`.

## Get started

1. Install dependencies (repo root):

   ```bash
   bun install
   ```

2. Start the mobile app:

   **From the repo root**

   ```bash
   bun run dev
   ```

   Or target the mobile package directly:

   ```bash
   bun run --filter '@repo/mobile' start
   ```

   **From `apps/mobile`**

   ```bash
   cd apps/mobile
   bun run start
   # or: npx expo start
   ```

3. Open on a platform

   From the repo root:

   ```bash
   bun run --filter '@repo/mobile' ios
   bun run --filter '@repo/mobile' android
   bun run --filter '@repo/mobile' web
   ```

   From `apps/mobile`:

   ```bash
   bun run ios
   bun run android
   bun run web
   ```

   You can also use the Metro terminal shortcuts after `start` (e.g. `i` for iOS, `a` for Android).

### Clear Metro cache

If you hit stale bundle or dependency errors, restart with a clean cache:

```bash
cd apps/mobile
bun run start -- -c
```

## Apple Sign In client secret

Better Auth expects `APPLE_CLIENT_SECRET` to be a JWT you sign with your Apple `.p8` key.

### Getting your `.p8` key

1. Go to [Apple Developer → Keys](https://developer.apple.com/account/resources/authkeys/list)
2. Click **+**, name the key, enable **Sign in with Apple**, configure with your Primary App ID
3. Register and **Download** — this gives you `AuthKey_XXXXXXXXXX.p8`
4. The `XXXXXXXXXX` in the filename is your `APPLE_KEY_ID`

> **You can only download the `.p8` file once.** Store it securely.

### CLI (recommended)

1. Add to your `.env`:
   ```
   APPLE_TEAM_ID=AB12CD34EF
   APPLE_KEY_ID=86SC63GFSQ
   APPLE_CLIENT_ID=com.yourapp.template
   ```
2. Run:
   ```bash
   bun run scripts/generate-apple-secret.ts ../p8/AuthKey_86SC63GFSQ.p8
   ```
3. Copy the output JWT into `APPLE_CLIENT_SECRET` in `.env`. Valid for 180 days — regenerate before expiry.

### Browser (alternative)

1. Start the API: `bun run dev:api`
2. Open [http://localhost:3000/tools/apple-client-secret](http://localhost:3000/tools/apple-client-secret)
3. Fill in the form — the key never leaves your browser.

## Deploying the API (Dokploy / Docker)

The repo includes a `Dockerfile` at the root that builds the API server.

1. Point Dokploy at your Git repo — it auto-detects the `Dockerfile`.
2. Set the environment variables listed in `.env.example` in Dokploy's UI.
3. Expose ports **3000** (HTTP) and **3001** (WebSocket sync).
4. Health check endpoint: `GET /health`
5. Run database migrations before first deploy:
   ```bash
   bun run --cwd packages/db db:migrate
   ```

## Mobile app

- Routes: `apps/mobile/src/app/` ([Expo Router](https://docs.expo.dev/router/introduction/))
- Run `bun run lint` or `bun run typecheck` from the repo root to check all workspaces

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo SDK 56 docs](https://docs.expo.dev/versions/v56.0.0/)
run backend  npm run dev:api o