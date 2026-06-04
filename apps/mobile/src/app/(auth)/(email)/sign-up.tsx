import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
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
import { signUpSchema } from "@repo/shared";
import type { z } from "zod";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { useTheme } from "@/hooks/use-theme";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { authClient } from "@/lib/auth";

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(data: SignUpForm) {
    setError("");
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Sign up failed");
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
              name="chevron.left"
              tintColor={theme.text}
              style={styles.headerCircleIcon}
              weight="semibold"
            />
          ) : (
            <ThemedText style={styles.headerCircleText}>‹</ThemedText>
          )}
        </PressableScale>

        <PressableScale
          onPress={() => router.back()}
          style={[
            styles.headerPill,
            { backgroundColor: theme.backgroundElement },
          ]}
        >
          <ThemedText style={styles.headerPillLabel}>Log in</ThemedText>
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
              <ThemedText style={styles.title}>Create account</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                Sign up to get started
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
                name="name"
                label="Name"
                placeholder="Your name"
                autoComplete="name"
                textContentType="name"
              />

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
                placeholder="At least 8 characters"
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
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

            <View style={styles.legalContainer}>
              <ThemedText style={styles.legalText} themeColor="textSecondary">
                By signing up, you agree to our{" "}
                <ThemedText
                  style={styles.legalLink}
                  themeColor="textSecondary"
                  onPress={() =>
                    Linking.openURL("https://example.com/terms")
                  }
                >
                  Terms of Service
                </ThemedText>{" "}
                and{" "}
                <ThemedText
                  style={styles.legalLink}
                  themeColor="textSecondary"
                  onPress={() =>
                    Linking.openURL("https://example.com/privacy")
                  }
                >
                  Privacy Policy
                </ThemedText>
              </ThemedText>
            </View>
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
    fontSize: 17,
    fontWeight: "600",
    marginLeft: -1,
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

  // Footer legal
  legalContainer: {
    paddingHorizontal: Spacing.two,
  },
  legalText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  legalLink: {
    fontSize: 12,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
