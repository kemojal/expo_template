import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PressableScale } from "pressto";
import { SymbolView } from "expo-symbols";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@repo/shared";
import type { z } from "zod";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useTheme } from "@/hooks/use-theme";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { authClient } from "@/lib/auth";

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: SignInForm) {
    setError("");
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Sign in failed");
      return;
    }

    router.replace("/");
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header bar */}
      <View style={styles.header}>
        <PressableScale
          onPress={() => router.back()}
          style={[
            styles.headerCircle,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          {Platform.OS === "ios" ? (
            <SymbolView
              name="xmark"
              tintColor={theme.text}
              style={styles.headerCircleIcon}
              weight="semibold"
            />
          ) : (
            <ThemedText style={styles.headerCircleText}>✕</ThemedText>
          )}
        </PressableScale>

        <PressableScale
          onPress={() => router.push("/(auth)/(email)/sign-up")}
          style={[
            styles.headerPill,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <ThemedText style={styles.headerPillLabel}>Sign up</ThemedText>
        </PressableScale>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(300)} style={styles.form}>
            <View style={styles.titleGroup}>
              <ThemedText style={styles.title}>Welcome back</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Sign in to your account
              </ThemedText>
            </View>

            {error ? (
              <View
                style={[
                  styles.errorBox,
                  { backgroundColor: `${theme.destructive}12` },
                ]}
              >
                <ThemedText style={styles.errorText} themeColor="destructive">
                  {error}
                </ThemedText>
              </View>
            ) : null}

            <View style={styles.fields}>
              <FormInput
                control={control}
                name="email"
                label="Email"
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
              />

              <FormInput
                control={control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="password"
                textContentType="password"
              />
            </View>

            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="lg"
              loading={loading}
              style={{ borderRadius: Radii.full }}
            />

            <PressableScale
              onPress={() => router.push("/(auth)/(email)/sign-up")}
              style={styles.footerLink}
            >
              <ThemedText
                style={styles.footerLinkText}
                themeColor="textSecondary"
              >
                Don't have an account?{" "}
                <ThemedText style={styles.footerLinkBold} themeColor="primary">
                  Sign up
                </ThemedText>
              </ThemedText>
            </PressableScale>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
  },
  headerCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCircleIcon: {
    width: 13,
    height: 13,
  },
  headerCircleText: {
    fontSize: 13,
    fontWeight: "700",
  },
  headerPill: {
    height: 34,
    paddingHorizontal: Spacing.three,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  headerPillLabel: {
    fontSize: Typography.sm.fontSize,
    fontWeight: "600",
  },

  // Content
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: Spacing.six,
  },
  form: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  titleGroup: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    letterSpacing: -0.2,
  },
  errorBox: {
    borderRadius: Radii.md,
    padding: 14,
  },
  errorText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  fields: {
    gap: Spacing.three,
  },

  // Footer
  footerLink: {
    alignItems: "center",
    paddingVertical: Spacing.one,
  },
  footerLinkText: {
    fontSize: Typography.sm.fontSize,
  },
  footerLinkBold: {
    fontSize: Typography.sm.fontSize,
    fontWeight: "600",
  },
});
