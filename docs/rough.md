# Full-Stack Expo Starter Template

A production-ready, local-first monorepo template for building cross-platform apps with Expo, Hono, and TinyBase.

## 1. Overview

### Philosophy

- **Local-first**: Data lives on the device. Reads and writes are instant, offline by default. Sync happens in the background when connectivity is available.
- **Type-safe end-to-end**: Shared Zod validators and TypeScript types flow from database schema through API to client. No mismatches.
- **Monorepo**: One repo, multiple packages. Shared code stays shared. Independent deployment for app and API.
- **Opinionated but not rigid**: Sensible defaults for auth, data, and UI — swap any layer without rewriting everything.

### What you get

- Expo SDK 56 mobile app with file-based routing, theming, and native tabs
- Hono API server with Better Auth, Drizzle ORM, and PostgreSQL
- TinyBase reactive data store with expo-sqlite persistence and CRDT sync
- Cloudflare R2 file storage via pre-signed URLs
- Design system with light/dark mode, platform-specific fonts, and 8-point spacing grid
- Testing setup (unit, component, E2E)
- CI/CD with EAS Build and EAS Update

---

## 2. Tech Stack

| Layer | Tool | Role |
|-------|------|------|
| **Runtime** | Bun | Package manager, workspace runner, script execution |
| **Framework** | Expo SDK 56 | React Native cross-platform framework |
| **Routing** | Expo Router | File-based routing with typed routes |
| **UI** | React Native + `@expo/ui` + pressto | Core UI layer with native pressable feedback |
| **Animations** | Reanimated + react-native-ease | Layout/gesture animations + easing curves |
| **Haptics** | react-native-pulsar | Haptic feedback patterns |
| **Graphics** | `@shopify/react-native-skia` | Canvas/GPU rendering |
| **Keyboard** | react-native-keyboard-controller | Keyboard-aware input handling |
| **Date/Time** | Luxon | Immutable date manipulation |
| **State/Data** | TinyBase | Reactive local-first data store (6.2 kB gzipped) |
| **Persistence** | expo-sqlite (native) / localStorage (web) | TinyBase persistence layer |
| **Sync** | TinyBase MergeableStore + WebSocket | CRDT-based bi-directional sync |
| **Backend** | Hono | Lightweight, multi-runtime API server |
| **ORM** | Drizzle | Type-safe SQL queries and migrations |
| **Database** | PostgreSQL | Server-side relational database |
| **Auth** | Better Auth | Plugin-based authentication framework |
| **Storage** | Cloudflare R2 | S3-compatible object storage |
| **Testing** | Jest + RNTL + Maestro | Unit, component, and E2E testing |
| **CI/CD** | EAS Build + EAS Update | Native builds and OTA updates |

---

## 3. Monorepo Structure

Bun workspaces. Each package has its own `package.json` and `tsconfig.json`.

```
template/
├── apps/
│   └── mobile/                    # Expo React Native app
│       ├── src/
│       │   ├── app/               # Expo Router file-based routes
│       │   │   ├── _layout.tsx    # Root layout (providers, auth guard)
│       │   │   ├── (auth)/        # Unauthenticated routes
│       │   │   │   ├── _layout.tsx
│       │   │   │   ├── sign-in.tsx
│       │   │   │   └── sign-up.tsx
│       │   │   ├── (app)/         # Authenticated routes
│       │   │   │   ├── _layout.tsx
│       │   │   │   ├── (tabs)/    # Bottom tab navigator
│       │   │   │   │   ├── _layout.tsx
│       │   │   │   │   ├── index.tsx
│       │   │   │   │   ├── explore.tsx
│       │   │   │   │   └── profile.tsx
│       │   │   │   └── settings.tsx
│       │   │   └── +not-found.tsx
│       │   ├── components/        # Reusable UI components
│       │   ├── constants/         # Theme tokens (colors, fonts, spacing)
│       │   ├── hooks/             # Custom React hooks
│       │   ├── lib/               # TinyBase stores, auth client, API client
│       │   └── global.css         # Web font definitions
│       ├── assets/                # Images, icons, fonts
│       ├── app.json               # Expo config
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── api/                       # Hono API server
│   │   ├── src/
│   │   │   ├── routes/            # Route handlers (resource-per-file)
│   │   │   ├── middleware/        # Auth, CORS, logging, rate limiting
│   │   │   ├── lib/               # Better Auth instance, R2 client, sync server
│   │   │   └── index.ts           # Hono app entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── db/                        # Drizzle schema and migrations
│   │   ├── src/
│   │   │   ├── schema/            # Table definitions (one file per domain)
│   │   │   ├── migrations/        # Generated SQL migration files
│   │   │   ├── seed.ts            # Development seed data
│   │   │   └── index.ts           # DB client + schema exports
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                    # Shared types and validators
│       ├── src/
│       │   ├── types/             # TypeScript type definitions
│       │   └── validators/        # Zod schemas (used by both client and server)
│       ├── package.json
│       └── tsconfig.json
│
├── tooling/
│   ├── eslint/                    # Shared ESLint configuration
│   └── typescript/                # Base tsconfig
│
├── bunfig.toml                    # Bun configuration
├── package.json                   # Root workspace definition
├── turbo.json                     # Task pipeline (build, lint, typecheck)
└── .github/
    └── workflows/                 # CI/CD pipelines
```

### Workspace aliases

```jsonc
// Root package.json
{
  "workspaces": ["apps/*", "packages/*", "tooling/*"]
}
```

| Alias | Resolves to |
|-------|-------------|
| `@repo/api` | `packages/api/src` |
| `@repo/db` | `packages/db/src` |
| `@repo/shared` | `packages/shared/src` |
| `@/` | `apps/mobile/src/` |
| `@/assets/` | `apps/mobile/assets/` |

---

## 4. Frontend Architecture

### Routing

Expo Router with layout groups for auth gating:

```
src/app/
├── _layout.tsx          # Root: ThemeProvider → AuthGuard → StoreProvider
├── (auth)/              # Shown when signed out
│   ├── _layout.tsx      # Stack navigator
│   ├── sign-in.tsx
│   └── sign-up.tsx
├── (app)/               # Shown when signed in
│   ├── _layout.tsx      # Stack with nested tabs
│   ├── (tabs)/          # Bottom tab navigator
│   │   ├── _layout.tsx  # NativeTabs (native) / Tabs (web)
│   │   ├── index.tsx    # Home
│   │   ├── explore.tsx  # Explore
│   │   └── profile.tsx  # Profile
│   └── settings.tsx     # Full-screen stack route
└── +not-found.tsx
```

### Provider stack

```tsx
// _layout.tsx
<ThemeProvider>
  <KeyboardProvider>
    <AuthProvider>
      <StoreProvider>        {/* TinyBase */}
        <Slot />
      </StoreProvider>
    </AuthProvider>
  </KeyboardProvider>
</ThemeProvider>
```

### State management

**TinyBase** handles all reactive state. No Zustand/Redux/Jotai needed.

- **Tables**: Structured data that syncs with the server (todos, items, user data)
- **Values**: Key-value pairs for app-level state (preferences, UI state, feature flags)
- **Reactive hooks**: `useCell`, `useRow`, `useTable`, `useValue` — components re-render only when their subscribed data changes
- **Persistence**: expo-sqlite on native, localStorage on web — data survives app restarts

### Forms

React Hook Form for complex forms, or Expo's built-in form primitives (`@expo/ui`) for simple inputs. Validation via shared Zod schemas from `@repo/shared`.

### Error boundaries

Expo Router's built-in error boundary (`+error.tsx`) at route level. Custom `ErrorBoundary` component for critical sections within screens.

---

## 5. Backend Architecture

### Hono server

Hono runs on Bun (local dev), deployable to Cloudflare Workers, AWS Lambda, or any Node/Bun runtime.

```
packages/api/src/
├── index.ts              # App entry — mount routes, global middleware
├── routes/
│   ├── auth.ts           # Better Auth handler (mounted at /api/auth/*)
│   ├── users.ts          # User CRUD
│   ├── sync.ts           # TinyBase sync endpoint (WebSocket upgrade)
│   └── upload.ts         # R2 pre-signed URL generation
├── middleware/
│   ├── auth.ts           # Session verification middleware
│   ├── cors.ts           # CORS configuration
│   └── logger.ts         # Request logging
└── lib/
    ├── auth.ts           # Better Auth server instance
    ├── db.ts             # Drizzle client import from @repo/db
    ├── r2.ts             # Cloudflare R2 client (S3-compatible SDK)
    └── sync.ts           # TinyBase WsServer for CRDT sync
```

### API patterns

- RESTful resource routes: `GET /users`, `POST /users`, `GET /users/:id`
- Request validation with Zod (imported from `@repo/shared`)
- Consistent error responses: `{ error: string, code: string }`
- Auth middleware on protected routes

### Sync endpoint

TinyBase provides a `WsServer` that handles CRDT sync over WebSocket. Mount it in Hono:

```ts
// routes/sync.ts
import { WsServer } from 'tinybase/synchronizers/synchronizer-ws-server';

// Hono WebSocket upgrade → TinyBase WsServer handles sync protocol
```

---

## 6. Data Layer — Local-First with TinyBase

### Core concept

All reads and writes go to the **local TinyBase store** first. The store is persisted to **expo-sqlite** (native) or **localStorage** (web). A **MergeableStore** syncs changes to the server via WebSocket using TinyBase's built-in CRDT merge logic.

```
┌──────────────┐     persist      ┌──────────────┐
│  TinyBase     │ ◄──────────────► │  expo-sqlite  │
│  MergeableStore                  │  (on device)  │
└──────┬───────┘                   └──────────────┘
       │ sync (WebSocket)
       ▼
┌──────────────┐     Drizzle      ┌──────────────┐
│  Hono API    │ ◄──────────────► │  PostgreSQL   │
│  WsServer    │                   │  (server)     │
└──────────────┘                   └──────────────┘
```

### Store setup

```ts
// apps/mobile/src/lib/store.ts
import { createMergeableStore } from 'tinybase';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import { createWsSynchronizer } from 'tinybase/synchronizers/synchronizer-ws-client';

const store = createMergeableStore();

// Persist to SQLite
const persister = createExpoSqlitePersister(store, db);
await persister.startAutoSave();
await persister.startAutoLoad();

// Sync with server
const synchronizer = createWsSynchronizer(store, new WebSocket(SYNC_URL));
await synchronizer.startSync();
```

### Table definitions

Define tables in TinyBase that mirror the server schema where bi-directional sync is needed:

```ts
// Example: todos table
store.setTablesSchema({
  todos: {
    id: { type: 'string' },
    title: { type: 'string' },
    completed: { type: 'boolean', default: false },
    createdAt: { type: 'string' },
  },
});
```

Use TinyBase's schema validation or integrate Zod schemas from `@repo/shared` via TinyBase's schematizer support.

### Offline behavior

1. **Write**: User creates/updates data → TinyBase store updates instantly → persisted to SQLite → UI re-renders
2. **Sync**: When online, MergeableStore syncs via WebSocket → server merges using CRDT → broadcasts to other clients
3. **Conflict resolution**: TinyBase CRDT uses last-write-wins per cell with Hybrid Logical Clocks — deterministic merge across all clients
4. **Reconnect**: On network recovery, synchronizer reconnects and reconciles diverged state automatically

---

## 7. Authentication — Better Auth

### Server setup

Better Auth instance in `packages/api/src/lib/auth.ts`:

```ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@repo/db';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: { clientId: '...', clientSecret: '...' },
    apple: { clientId: '...', clientSecret: '...' },
  },
});
```

Better Auth manages its own tables (users, sessions, accounts, verifications) — generated into the Drizzle schema via `npx @better-auth/cli generate`.

### Client setup

```ts
// apps/mobile/src/lib/auth.ts
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Usage in components:
const { data: session } = authClient.useSession();
await authClient.signIn.email({ email, password });
await authClient.signUp.email({ email, password, name });
await authClient.signOut();
```

### Auth guard

In the root `_layout.tsx`, redirect based on session state:

```tsx
const { data: session, isPending } = authClient.useSession();

if (isPending) return <SplashScreen />;
if (!session) return <Redirect href="/(auth)/sign-in" />;
return <Redirect href="/(app)" />;
```

### Auth flow

1. **Sign up**: Client → `POST /api/auth/sign-up/email` → Better Auth creates user + session → returns session token
2. **Sign in**: Client → `POST /api/auth/sign-in/email` → Better Auth verifies credentials → returns session token
3. **OAuth**: Client opens browser → OAuth provider → callback to API → Better Auth creates/links account → returns session token
4. **Session**: Token stored in secure storage on device. Attached to API requests and WebSocket connections for sync auth.

---

## 8. File Storage — Cloudflare R2

### Pre-signed URL pattern

Client never talks to R2 directly. The API generates pre-signed URLs.

```
┌──────────┐  1. Request upload URL   ┌──────────┐
│  Client   │ ────────────────────────► │  Hono    │
│           │ ◄──────────────────────── │  API     │
│           │  2. Pre-signed PUT URL    │          │
│           │                           └────┬─────┘
│           │  3. PUT file directly           │ generates URL
│           │ ─────────────────────────►┌─────▼─────┐
│           │                           │  R2       │
│           │  4. Confirm upload        │  Bucket   │
│           │ ────────────────────────► └───────────┘
└──────────┘
```

### API routes

```ts
// POST /upload/request  — returns pre-signed PUT URL + file key
// POST /upload/confirm  — marks file as uploaded in DB, returns public URL
// GET  /upload/:key     — returns pre-signed GET URL for private files
```

### Client usage

```ts
// 1. Get upload URL from API
const { uploadUrl, fileKey } = await api.post('/upload/request', {
  filename: 'photo.jpg',
  contentType: 'image/jpeg'
});

// 2. Upload directly to R2
await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': 'image/jpeg' } });

// 3. Confirm upload
await api.post('/upload/confirm', { fileKey });
```

---

## 9. Design System

### Existing foundation (preserved from current template)

Located in `apps/mobile/src/constants/theme.ts`:

**Colors** — light and dark schemes:
```ts
Colors.light: { text, background, backgroundElement, backgroundSelected, textSecondary }
Colors.dark:  { text, background, backgroundElement, backgroundSelected, textSecondary }
```

**Fonts** — platform-specific font families:
- iOS: system-ui, ui-serif, ui-rounded, ui-monospace
- Android: normal, serif, monospace
- Web: CSS custom properties

**Spacing** — 8-point grid:
```ts
Spacing: { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 64 }
```

### UI packages

| Package | Purpose |
|---------|---------|
| `pressto` | Pressable components with built-in haptics and animations |
| `react-native-ease` | Easing curve presets for Reanimated animations |
| `react-native-pulsar` | Haptic feedback patterns (tap, impact, notification) |
| `react-native-keyboard-controller` | Keyboard-aware layouts and input management |
| `@shopify/react-native-skia` | GPU-accelerated canvas for graphics and custom drawing |
| `@expo/ui` | Native platform UI components |
| `expo-image` | Performant image component with caching |

### Platform-specific patterns

Use file extensions for platform code:
- `component.tsx` — native (iOS + Android)
- `component.web.tsx` — web override

Example: `app-tabs.tsx` uses `NativeTabs` on native, `Tabs`/`TabList` on web.

### Skills reference

For building UI, refer to:
- `.claude/skills/building-native-ui`
- `.agents/skills/building-native-ui`

---

## 10. Testing

### Strategy

| Level | Tool | Scope |
|-------|------|-------|
| Unit | Jest | Pure functions, validators, utils, Zod schemas |
| Component | React Native Testing Library | UI components, hooks, screen rendering |
| API | Hono test client (`app.request()`) | Route handlers, middleware, auth flows |
| E2E | Maestro | Full user flows on real devices/simulators |

### File conventions

- Tests live next to source: `component.tsx` → `component.test.tsx`
- E2E flows in `apps/mobile/e2e/` as Maestro YAML files
- API tests in `packages/api/src/routes/__tests__/`

### TinyBase testing

TinyBase stores can be created in-memory for tests — no SQLite or WebSocket needed:

```ts
const store = createStore();
store.setRow('todos', 'todo-1', { title: 'Test', completed: false });
// assert against store state
```

---

## 11. CI/CD & Deployment

### EAS Build

- **Development builds**: For testing on physical devices via `eas build --profile development`
- **Preview builds**: Internal distribution for QA via `eas build --profile preview`
- **Production builds**: App Store / Play Store submission via `eas build --profile production`

### EAS Update (OTA)

Push JS/asset updates without a new binary build:

```bash
eas update --branch production --message "fix: resolve sync issue"
```

### API deployment

Hono server deploys to one of:
- **Cloudflare Workers** (recommended — pairs with R2)
- **Bun on a VPS** (fly.io, Railway)
- **AWS Lambda** via Hono adapter

### GitHub Actions pipeline

```yaml
# .github/workflows/ci.yml
# Triggers: push to main, PR
# Steps:
#   1. Install (bun install)
#   2. Typecheck (bun run typecheck)
#   3. Lint (bun run lint)
#   4. Test (bun run test)
#   5. Build API (bun run build --filter=@repo/api)
#   6. EAS Update (on main push only)
```

### Environment management

| Environment | API | Database | Branch |
|-------------|-----|----------|--------|
| Development | `localhost:3000` | Local Postgres | any |
| Staging | `staging-api.example.com` | Staging Postgres | `main` |
| Production | `api.example.com` | Production Postgres | tagged releases |

---

## 12. Conventions

### File naming

- **kebab-case** for all files: `sign-in.tsx`, `auth-guard.tsx`, `use-theme.ts`
- **Directories**: lowercase, kebab-case
- **Platform overrides**: `file.tsx` (native), `file.web.tsx` (web)

### Import aliases

```ts
import { Colors } from '@/constants/theme';        // apps/mobile/src/
import { db } from '@repo/db';                       // packages/db/src/
import { userSchema } from '@repo/shared/validators'; // packages/shared/src/
```

### Code patterns

- Functional components only — no class components
- Named exports for components, default export only for route files (Expo Router requirement)
- Hooks prefixed with `use`: `useTheme`, `useAuth`, `useStore`
- Co-locate related files: component + test + styles in same directory
- Zod schemas in `@repo/shared` — single source of truth for validation on client and server

### Git workflow

- **Trunk-based**: Short-lived feature branches off `main`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **PRs**: Squash merge into `main`

---

## 13. Implementation Roadmap

Build order — each phase depends on the previous.

### Phase 1: Monorepo restructure

- Convert to Bun workspaces
- Move current app into `apps/mobile/`
- Create `packages/shared/`, `packages/db/`, `packages/api/` scaffolds
- Set up shared `tsconfig` base in `tooling/typescript/`
- Set up shared ESLint config in `tooling/eslint/`
- Add `turbo.json` for task pipeline
- Verify `bun install` and `bun run build` work across all packages

### Phase 2: Database (`packages/db`)

- Install Drizzle + `drizzle-kit` + `postgres` driver
- Define initial schema: users table, auth tables (Better Auth), todos (example domain)
- Generate and run initial migration
- Create seed script for development data
- Export typed DB client and schema

### Phase 3: API server (`packages/api`)

- Install Hono
- Set up app entry with global middleware (CORS, logger)
- Create health check route (`GET /health`)
- Wire up Drizzle client from `@repo/db`
- Add example resource route (CRUD for todos)
- Verify with `bun run dev` — API serves on `localhost:3000`

### Phase 4: Authentication (Better Auth)

- Install `better-auth` in `packages/api`
- Create Better Auth server instance with Drizzle adapter
- Generate auth tables into Drizzle schema, run migration
- Mount Better Auth handler at `/api/auth/*`
- Add auth middleware for protected routes
- Install `better-auth` client in `apps/mobile`
- Create auth client in `apps/mobile/src/lib/auth.ts`
- Build sign-in and sign-up screens in `(auth)/` route group
- Add auth guard in root `_layout.tsx`
- Test: sign up → sign in → access protected route → sign out → redirected

### Phase 5: Local-first data layer (TinyBase)

- Install `tinybase` in `apps/mobile`
- Create MergeableStore with table schemas
- Set up expo-sqlite persister (native) and localStorage persister (web)
- Create React Provider and hooks for store access
- Add TinyBase WsServer sync endpoint in `packages/api`
- Wire up WsSynchronizer on client to connect to sync endpoint
- Authenticate WebSocket connections with session token
- Test: create data offline → go online → verify sync → check other client receives data

### Phase 6: File storage (Cloudflare R2)

- Set up R2 bucket in Cloudflare dashboard
- Install S3-compatible SDK in `packages/api`
- Create upload routes: request pre-signed URL, confirm upload
- Create client upload helper in `apps/mobile/src/lib/upload.ts`
- Test: upload image → confirm → retrieve via pre-signed GET URL

### Phase 7: Navigation and screens

- Expand route structure: `(auth)`, `(app)/(tabs)`, settings, profile
- Implement NativeTabs for `(tabs)` layout (extend existing `app-tabs.tsx` pattern)
- Add modal routes
- Set up deep linking scheme
- Add `+not-found.tsx` catch-all

### Phase 8: UI and design system

- Expand theme tokens (add semantic colors, typography scale, border radii, shadows)
- Build reusable components: Button, Input, Card, Avatar, Badge, Toast
- Integrate pressto for all pressable surfaces
- Add form components with React Hook Form + Zod validation
- Build example screens demonstrating all components

### Phase 9: Testing

- Set up Jest + React Native Testing Library
- Add unit tests for Zod validators and utility functions
- Add component tests for key UI components
- Set up Hono test client for API route tests
- Set up Maestro for E2E flows (sign up, create item, sync)

### Phase 10: CI/CD and production readiness

- Set up EAS Build profiles (development, preview, production)
- Set up EAS Update for OTA
- Create GitHub Actions CI pipeline (typecheck, lint, test, build)
- Add environment variable management (`.env.development`, `.env.production`)
- Configure error tracking (Sentry or EAS Observe)
- Document deployment steps for API (Cloudflare Workers)
