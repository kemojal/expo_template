import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { authClient } from "./auth";
import { haptics } from "./haptics";

const appCallbackURL = "/callback";

async function signInWithAppleWeb() {
  const { error } = await authClient.signIn.social({
    provider: "apple",
    callbackURL: appCallbackURL,
  });

  if (error) {
    throw new Error(error.message || "Apple sign in failed");
  }
}

async function canUseNativeAppleAuth() {
  if (Platform.OS !== "ios") {
    return false;
  }

  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

function isAppleAuthUnavailableError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("expo-apple-authentication.signInAsync") ||
    error.message.includes("not available on ios")
  );
}

/**
 * Sign in with Apple.
 * iOS: Uses native Apple Authentication for a seamless sheet experience.
 * Other platforms: Falls back to web-based OAuth via Better Auth.
 */
export async function signInWithApple() {
  if (await canUseNativeAppleAuth()) {
    let credential: AppleAuthentication.AppleAuthenticationCredential;

    try {
      credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
    } catch (error) {
      if (isAppleAuthUnavailableError(error)) {
        await signInWithAppleWeb();
        haptics.success();
        return;
      }

      throw error;
    }

    if (!credential.identityToken) {
      throw new Error("No identity token received from Apple");
    }

    const { error } = await authClient.signIn.social({
      provider: "apple",
      idToken: {
        token: credential.identityToken,
        nonce: undefined,
      },
    });

    if (error) {
      throw new Error(error.message || "Apple sign in failed");
    }

    haptics.success();
    return;
  }

  await signInWithAppleWeb();
  haptics.success();
}

/**
 * Sign in with Google.
 * Uses Better Auth's social provider which, combined with @better-auth/expo,
 * handles the expo-web-browser redirect flow automatically.
 */
export async function signInWithGoogle() {
  const { error } = await authClient.signIn.social({
    provider: "google",
    callbackURL: appCallbackURL,
  });

  if (error) {
    throw new Error(error.message || "Google sign in failed");
  }

  haptics.success();
}
