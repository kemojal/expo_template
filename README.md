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

Better Auth expects `APPLE_CLIENT_SECRET` to be a JWT you sign with your Apple `.p8` key. Generate it locally (key never leaves your browser):

1. Start the API: `bun run dev:api`
2. Open [http://localhost:3000/tools/apple-client-secret](http://localhost:3000/tools/apple-client-secret)
3. Paste the JWT into `APPLE_CLIENT_SECRET` in `.env` (regenerate before it expires, up to 180 days)

## Mobile app

- Routes: `apps/mobile/src/app/` ([Expo Router](https://docs.expo.dev/router/introduction/))
- Run `bun run lint` or `bun run typecheck` from the repo root to check all workspaces

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo SDK 56 docs](https://docs.expo.dev/versions/v56.0.0/)
