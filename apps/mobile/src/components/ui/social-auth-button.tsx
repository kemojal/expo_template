import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { PressableScale } from "pressto";
import { SymbolView } from "expo-symbols";
import { Image } from "expo-image";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Fonts, Radii, Shadows, Spacing, Typography } from "@/constants/theme";

type SocialProvider = "apple" | "google";

interface SocialAuthButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const GOOGLE_LOGO_URI =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0VBNDMzNSIgZD0iTTI0IDkuNWMzLjU0IDAgNi43MSAxLjIyIDkuMjEgMy42bDYuODUtNi44NUMzNS45IDIuMzggMzAuNDcgMCAyNCAwIDE0LjYyIDAgNi41MSA1LjM4IDIuNTYgMTMuMjJsNy45OCA2LjE5QzEyLjQzIDEzLjcyIDE3Ljc0IDkuNSAyNCA5LjV6Ii8+PHBhdGggZmlsbD0iIzQ0ODVGNCIgZD0iTTQ2LjEgMjQuNWMwLTEuNTctLjE1LTMuMDktLjM4LTQuNTVIMjR2OS4wMmgxMi40NGMtLjU0IDIuOS0yLjE4IDUuMzUtNC40MiA3bDcuMDYgNS40OGM0LjEyLTMuOCA2LjAyLTkuNCA2LjAyLTE2Ljk1eiIvPjxwYXRoIGZpbGw9IiNGQkJDMDUiIGQ9Ik0xMC41MyAxNC42MUE5Ljk5IDkuOTkgMCAwIDEgMjQgMTQuMjFWOS41Yy02LjI2IDAtMTEuNTcgNC4yMi0xMy40NiA5Ljg5bC0uMDEuMDJ6TTEwLjUzIDMzLjRDMTIuNDMgMzguNSAxNy43NCA0Mi41IDI0IDQyLjVjNS4xOCAwIDkuNTMtMS43MSAxMi43LTQuNjRsLTcuMDYtNS40OGMtMS42NSAxLjEtMy43OCAxLjc1LTYuMTQgMS43NS02LjI2IDAtMTEuNTctNC4yMi0xMi45Ny0xMC43M3oiLz48cGF0aCBmaWxsPSIjMzRBODUzIiBkPSJNMTAuNTMgMjguNjFjLS44NS0yLjUtLjg1LTUuMjIgMC03Ljcydi0uMDFsLTcuOTctNi4xNmMtMy4wNCA2LjA4LTMuMDQgMTMuMjcgMCAxOS4zNWw3Ljk3LTUuNDZ6Ii8+PC9zdmc+";

function AppleIcon({ color }: { color: string }) {
  if (Platform.OS === "ios") {
    return (
      <SymbolView
        name="apple.logo"
        tintColor={color}
        style={styles.icon}
        weight="medium"
      />
    );
  }
  return (
    <ThemedText style={[styles.iconFallback, { color }]}>{"\uF8FF"}</ThemedText>
  );
}

function GoogleIcon() {
  return (
    <Image
      source={{ uri: GOOGLE_LOGO_URI }}
      style={styles.googleIcon}
      contentFit="contain"
    />
  );
}

export function SocialAuthButton({
  provider,
  onPress,
  loading = false,
  disabled = false,
}: SocialAuthButtonProps) {
  const theme = useTheme();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const isApple = provider === "apple";

  const backgroundColor = isApple
    ? isDark ? "#FFFFFF" : "#000000"
    : theme.backgroundElement;

  const foregroundColor = isApple
    ? isDark ? "#000000" : "#FFFFFF"
    : theme.text;

  const borderColor = isApple ? "transparent" : theme.border;
  const label = isApple ? "Continue with Apple" : "Continue with Google";

  return (
    <PressableScale
      onPress={onPress}
      enabled={!disabled && !loading}
      style={[
        styles.button,
        Shadows.sm,
        { backgroundColor, borderColor },
        (disabled || loading) && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={foregroundColor} />
      ) : (
        <View style={styles.content}>
          {isApple ? (
            <AppleIcon color={foregroundColor} />
          ) : (
            <GoogleIcon />
          )}
          <ThemedText style={[styles.label, { color: foregroundColor }]}>
            {label}
          </ThemedText>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: Radii.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  icon: {
    width: 17,
    height: 17,
  },
  iconFallback: {
    fontSize: 17,
    lineHeight: 19,
  },
  googleIcon: {
    width: 17,
    height: 17,
  },
  label: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: "600",
    fontFamily: Fonts?.sans,
  },
  disabled: {
    opacity: 0.5,
  },
});
