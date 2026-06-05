import "../env";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { expo } from "@better-auth/expo";
import { db, schema } from "@repo/db";

const appScheme = "template";

function envList(value?: string) {
  return value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];
}

function trustedOrigins() {
  const apiURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
  const baseOrigins = [
    `${appScheme}://`,
    `${appScheme}://*`,
    "http://localhost:8081",
    "http://localhost:19006",
    apiURL,
    ...envList(process.env.BETTER_AUTH_TRUSTED_ORIGINS),
  ];

  // Expo Go uses exp:// scheme — needed in all environments when
  // testing with Expo Go against a production API
  const expoOrigins = [
    "exp://",
    "exp://**",
    "exp://localhost:8081",
    "exp://127.0.0.1:8081",
    "exp://192.168.*.*:*/**",
    "exp://10.*.*.*:*/**",
    "exp://172.16.*.*:*/**",
  ];

  return Array.from(new Set([...baseOrigins, ...expoOrigins]));
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
      appBundleIdentifier: process.env.APPLE_BUNDLE_IDENTIFIER,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [expo()],
  trustedOrigins: trustedOrigins(),
});
