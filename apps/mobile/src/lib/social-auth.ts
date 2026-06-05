import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { authClient } from "./auth";
import { haptics } from "./haptics";

const appCallbackURL = "/callback";

/**
 * Sign in with Apple.
 * iOS: Uses native Apple Authentication for a seamless sheet experience.
 * Other platforms: Falls back to web-based OAuth via Better Auth.
 */
export async function signInWithApple() {
  if (Platform.OS === "ios") {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

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

  // Android / web fallback — web-based OAuth flow
  const { error } = await authClient.signIn.social({
    provider: "apple",
    callbackURL: appCallbackURL,
  });

  if (error) {
    throw new Error(error.message || "Apple sign in failed");
  }

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
