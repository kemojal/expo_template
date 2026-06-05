import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@repo/shared";
import type { z } from "zod";

import {
  AuthErrorBanner,
  AuthHeader,
  EmailFormShell,
  LegalLinks,
} from "@/components/auth";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { Radii, Spacing } from "@/constants/theme";
import { authClient } from "@/lib/auth";
import { haptics } from "@/lib/haptics";

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
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
      haptics.error();
      setError(error.message || "Sign up failed");
      return;
    }

    haptics.success();
    router.replace("/");
  }

  return (
    <EmailFormShell
      title="Create account"
      subtitle="Start with a clean workspace."
      header={
        <AuthHeader
          icon="chevron.left"
          actionLabel="Log in"
          onIconPress={() => router.back()}
          onActionPress={() => router.back()}
        />
      }
    >
      <AuthErrorBanner message={error} />

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
        style={{ borderRadius: Radii.lg }}
      />

      <LegalLinks verb="signing up" />
    </EmailFormShell>
  );
}

const styles = StyleSheet.create({
  fields: {
    gap: Spacing.three,
  },
});
