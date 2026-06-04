import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { Radii, Spacing, Typography } from "@/constants/theme";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "destructive";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant = "default" }: BadgeProps) {
  const theme = useTheme();

  const bgColors: Record<BadgeVariant, string> = {
    default: theme.backgroundElement,
    primary: theme.primary,
    success: theme.success,
    warning: theme.warning,
    destructive: theme.destructive,
  };

  const textColors: Record<BadgeVariant, string> = {
    default: theme.text,
    primary: theme.primaryForeground,
    success: theme.successForeground,
    warning: theme.warningForeground,
    destructive: theme.destructiveForeground,
  };

  return (
    <View style={[styles.badge, { backgroundColor: bgColors[variant] }]}>
      <ThemedText style={[styles.text, { color: textColors[variant] }]}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radii.full,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: Typography.xs.fontSize,
    fontWeight: "600",
  },
});
