/**
 * Generate Apple Client Secret JWT for Sign in with Apple.
 *
 * Usage:
 *   bun run scripts/generate-apple-secret.ts ../p8/AuthKey_86SC63GFSQ.p8
 *
 * Reads from .env:
 *   APPLE_TEAM_ID      — 10-char team ID from Apple Developer membership
 *   APPLE_KEY_ID       — Key ID from the Sign in with Apple key
 *   APPLE_CLIENT_ID    — Services ID or bundle identifier
 *
 * Outputs the JWT to stdout. Paste it into APPLE_CLIENT_SECRET in your .env.
 */

import { readFileSync } from "node:fs";
import { SignJWT, importPKCS8 } from "jose";
import { config } from "dotenv";

config({ path: ".env" });

const teamId = process.env.APPLE_TEAM_ID;
const keyId = process.env.APPLE_KEY_ID;
const clientId = process.env.APPLE_CLIENT_ID;
const p8Path = process.argv[2];

if (!teamId || !keyId || !clientId) {
  console.error(
    "Missing env vars. Set APPLE_TEAM_ID, APPLE_KEY_ID, and APPLE_CLIENT_ID in .env"
  );
  process.exit(1);
}

if (!p8Path) {
  console.error("Usage: bun run scripts/generate-apple-secret.ts <path-to-.p8-file>");
  process.exit(1);
}

const privateKeyPem = readFileSync(p8Path, "utf-8");
const privateKey = await importPKCS8(privateKeyPem, "ES256");

const now = Math.floor(Date.now() / 1000);
const exp = now + 180 * 86400; // 180 days (Apple maximum)

const jwt = await new SignJWT({})
  .setProtectedHeader({ alg: "ES256", kid: keyId })
  .setIssuer(teamId)
  .setSubject(clientId)
  .setAudience("https://appleid.apple.com")
  .setIssuedAt(now)
  .setExpirationTime(exp)
  .sign(privateKey);

console.log("\nAPPLE_CLIENT_SECRET:\n");
console.log(jwt);
console.log(`\nExpires: ${new Date(exp * 1000).toISOString()}`);
console.log("Regenerate before expiry.\n");
