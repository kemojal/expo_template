import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PressableScale } from "pressto";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "@repo/shared";
import type { z } from "zod";

import { AuthErrorBanner, AuthHeader, EmailFormShell } from "@/components/auth";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { authClient } from "@/lib/auth";
import { haptics } from "@/lib/haptics";

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInScreen() {
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
      haptics.error();
      setError(error.message || "Sign in failed");
      return;
    }

    haptics.success();
    router.replace("/");
  }

  return (
    <EmailFormShell
      title="Welcome back"
      subtitle="Use your workspace account."
      header={
        <AuthHeader
          icon="xmark"
          actionLabel="Sign up"
          onIconPress={() => router.back()}
          onActionPress={() => router.push("/(auth)/(email)/sign-up")}
        />
      }
    >
      <AuthErrorBanner message={error} />

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
        style={{ borderRadius: Radii.lg }}
      />

      <PressableScale
        onPress={() => router.push("/(auth)/(email)/sign-up")}
        style={styles.footerLink}
        accessibilityRole="button"
      >
        <ThemedText style={styles.footerText} themeColor="textSecondary">
          New here?{" "}
          <ThemedText style={styles.footerStrong} themeColor="primary">
            Create account
          </ThemedText>
        </ThemedText>
      </PressableScale>
    </EmailFormShell>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: Spacing.three,
  },
  footerLink: {
    alignItems: "center",
    paddingVertical: Spacing.one,
  },
  footerText: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
  footerStrong: {
    fontSize: Typography.sm.fontSize,
    fontWeight: "700",
  },
});
