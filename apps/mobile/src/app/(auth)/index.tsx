import { useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PressableScale } from "pressto";
import { SymbolView } from "expo-symbols";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { SocialAuthButton } from "@/components/ui/social-auth-button";
import { useTheme } from "@/hooks/use-theme";
import { Spacing } from "@/constants/theme";
import { signInWithApple, signInWithGoogle } from "@/lib/social-auth";
import { toast } from "@/components/ui/toast";

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const anyLoading = appleLoading || googleLoading;

  async function handleApple() {
    setAppleLoading(true);
    try {
      await signInWithApple();
      router.replace("/");
    } catch (e: any) {
      toast(e.message || "Apple sign in failed", "destructive");
    } finally {
      setAppleLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/");
    } catch (e: any) {
      toast(e.message || "Google sign in failed", "destructive");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Animated.View entering={FadeIn.duration(600)}>
          {Platform.OS === "ios" ? (
            <SymbolView
              name="bolt.fill"
              tintColor={theme.primary}
              style={styles.heroIcon}
              weight="bold"
            />
          ) : (
            <ThemedText
              style={[styles.heroIconFallback, { color: theme.primary }]}
            >
              ⚡
            </ThemedText>
          )}
        </Animated.View>

        <Animated.View entering={FadeIn.delay(100).duration(600)}>
          <ThemedText style={styles.appName}>Template</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200).duration(600)}>
          <ThemedText style={styles.tagline} themeColor="textSecondary">
            Your productivity, supercharged.
          </ThemedText>
        </Animated.View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {Platform.OS === "ios" && (
          <Animated.View entering={FadeInDown.delay(350).springify()}>
            <SocialAuthButton
              provider="apple"
              onPress={handleApple}
              loading={appleLoading}
              disabled={googleLoading}
            />
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInDown.delay(
            Platform.OS === "ios" ? 420 : 350
          ).springify()}
        >
          <SocialAuthButton
            provider="google"
            onPress={handleGoogle}
            loading={googleLoading}
            disabled={appleLoading}
          />
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(
            Platform.OS === "ios" ? 520 : 450
          ).duration(400)}
        >
          <View style={styles.separator}>
            <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
            <ThemedText style={styles.separatorText} themeColor="textSecondary">
              or
            </ThemedText>
            <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(
            Platform.OS === "ios" ? 560 : 490
          ).duration(400)}
        >
          <PressableScale
            onPress={() => router.push("/(auth)/(email)/sign-in")}
            enabled={!anyLoading}
            style={styles.emailButton}
          >
            <ThemedText style={styles.emailButtonText} themeColor="textSecondary">
              Continue with email
            </ThemedText>
          </PressableScale>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(
            Platform.OS === "ios" ? 620 : 550
          ).duration(400)}
        >
          <ThemedText style={styles.legalText} themeColor="textSecondary">
            By continuing, you agree to our{" "}
            <ThemedText
              style={styles.legalLink}
              themeColor="textSecondary"
              onPress={() => Linking.openURL("https://example.com/terms")}
            >
              Terms
            </ThemedText>
            {" and "}
            <ThemedText
              style={styles.legalLink}
              themeColor="textSecondary"
              onPress={() => Linking.openURL("https://example.com/privacy")}
            >
              Privacy Policy
            </ThemedText>
          </ThemedText>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Hero
  hero: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  heroIcon: {
    width: 48,
    height: 48,
  },
  heroIconFallback: {
    fontSize: 44,
  },
  appName: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  tagline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "400",
    textAlign: "center",
    paddingHorizontal: Spacing.five,
  },

  // Actions
  actions: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.one,
    gap: 10,
  },

  // Separator
  separator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 2,
  },
  separatorLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  separatorText: {
    fontSize: 13,
    fontWeight: "400",
  },

  // Email
  emailButton: {
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  emailButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Legal
  legalText: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    paddingHorizontal: Spacing.two,
  },
  legalLink: {
    fontSize: 12,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
