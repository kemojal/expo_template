import { Platform, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { PressableScale } from "pressto";

import { ThemedText } from "@/components/themed-text";
import { Radii, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface QuickActionProps {
  icon: string;
  title: string;
  onPress: () => void;
}

export function QuickAction({ icon, title, onPress }: QuickActionProps) {
  const theme = useTheme();

  return (
    <PressableScale
      onPress={onPress}
      style={[
        styles.action,
        Shadows.sm,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}
      accessibilityRole="button"
    >
      <View style={[styles.iconWrap, { backgroundColor: `${theme.primary}14` }]}>
        {Platform.OS === "ios" ? (
          <SymbolView
            name={icon as any}
            tintColor={theme.primary}
            style={styles.icon}
            weight="semibold"
          />
        ) : (
          <ThemedText style={[styles.iconFallback, { color: theme.primary }]}>
            +
          </ThemedText>
        )}
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  action: {
    flex: 1,
    minWidth: 142,
    minHeight: 92,
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
    justifyContent: "space-between",
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 17,
    height: 17,
  },
  iconFallback: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
  },
  title: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: "700",
  },
});
