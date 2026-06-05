import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { EaseView } from "react-native-ease";
import { PressableScale } from "pressto";

import { AuthShell, BrandMark, LegalLinks } from "@/components/auth";
import { ThemedText } from "@/components/themed-text";
import { SocialAuthButton } from "@/components/ui/social-auth-button";
import { toast } from "@/components/ui/toast";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { signInWithApple, signInWithGoogle } from "@/lib/social-auth";

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
    <AuthShell>
      <View style={styles.hero}>
        <BrandMark />
        <EaseView
          initialAnimate={{ opacity: 0, translateY: 8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 260, easing: "easeOut", delay: 80 }}
          style={[
            styles.signal,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
          ]}
        >
          <ThemedText style={styles.signalText}>Encrypted sync</ThemedText>
          <View style={[styles.dot, { backgroundColor: theme.success }]} />
        </EaseView>
      </View>

      <View style={styles.actions}>
        {Platform.OS === "ios" && (
          <EaseView
            initialAnimate={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 220, easing: "easeOut" }}
          >
            <SocialAuthButton
              provider="apple"
              onPress={handleApple}
              loading={appleLoading}
              disabled={googleLoading}
            />
          </EaseView>
        )}

        <EaseView
          initialAnimate={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 220,
            easing: "easeOut",
            delay: Platform.OS === "ios" ? 60 : 0,
          }}
        >
          <SocialAuthButton
            provider="google"
            onPress={handleGoogle}
            loading={googleLoading}
            disabled={appleLoading}
          />
        </EaseView>

        <View style={styles.separator}>
          <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
          <ThemedText style={styles.separatorText} themeColor="textSecondary">
            or
          </ThemedText>
          <View style={[styles.separatorLine, { backgroundColor: theme.border }]} />
        </View>

        <PressableScale
          onPress={() => router.push("/(auth)/(email)/sign-in")}
          enabled={!anyLoading}
          style={[
            styles.emailButton,
            {
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
            },
            anyLoading && styles.disabled,
          ]}
          accessibilityRole="button"
        >
          <ThemedText style={styles.emailButtonText}>Continue with email</ThemedText>
        </PressableScale>

        <LegalLinks />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.four,
    minHeight: 280,
  },
  signal: {
    minHeight: 34,
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.full,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  signalText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: "700",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  actions: {
    gap: Spacing.three,
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  separatorLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  separatorText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emailButton: {
    height: 48,
    borderRadius: Radii.lg,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emailButtonText: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});
