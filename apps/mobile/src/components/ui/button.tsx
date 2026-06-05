import { ActivityIndicator, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { PressableScale } from "pressto";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { Radii, Spacing, Typography } from "@/constants/theme";

type ButtonVariant = "primary" | "secondary" | "destructive" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  style: styleProp,
}: ButtonProps) {
  const theme = useTheme();

  const bgColors: Record<ButtonVariant, string> = {
    primary: theme.primary,
    secondary: theme.backgroundElement,
    destructive: theme.destructive,
    ghost: "transparent",
  };

  const textColors: Record<ButtonVariant, string> = {
    primary: theme.primaryForeground,
    secondary: theme.text,
    destructive: theme.destructiveForeground,
    ghost: theme.text,
  };

  const sizeStyles: Record<ButtonSize, { height: number; paddingHorizontal: number }> = {
    sm: { height: 34, paddingHorizontal: Spacing.three },
    md: { height: 48, paddingHorizontal: Spacing.four },
    lg: { height: 50, paddingHorizontal: Spacing.five },
  };

  const fontSizes: Record<ButtonSize, number> = {
    sm: Typography.sm.fontSize,
    md: Typography.base.fontSize,
    lg: Typography.base.fontSize,
  };

  return (
    <PressableScale
      onPress={onPress}
      enabled={!disabled && !loading}
      style={[
        styles.base,
        sizeStyles[size],
        {
          backgroundColor: bgColors[variant],
          borderColor: variant === "ghost" ? "transparent" : theme.border,
        },
        (disabled || loading) && styles.disabled,
        styleProp,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <ThemedText
          style={[
            styles.text,
            { color: textColors[variant], fontSize: fontSizes[size] },
          ]}
        >
          {title}
        </ThemedText>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radii.md,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.5,
  },
});
