import { Platform, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { PressableScale } from "pressto";

import { ThemedText } from "@/components/themed-text";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface AuthHeaderProps {
  icon: "xmark" | "chevron.left";
  actionLabel: string;
  onIconPress: () => void;
  onActionPress: () => void;
}

export function AuthHeader({
  icon,
  actionLabel,
  onIconPress,
  onActionPress,
}: AuthHeaderProps) {
  const theme = useTheme();
  const fallback = icon === "xmark" ? "x" : "<";

  return (
    <View style={styles.container}>
      <PressableScale
        onPress={onIconPress}
        style={[
          styles.iconButton,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
        accessibilityRole="button"
        accessibilityLabel={icon === "xmark" ? "Close" : "Back"}
      >
        {Platform.OS === "ios" ? (
          <SymbolView
            name={icon}
            tintColor={theme.text}
            style={styles.icon}
            weight="semibold"
          />
        ) : (
          <ThemedText style={styles.fallback}>{fallback}</ThemedText>
        )}
      </PressableScale>

      <PressableScale
        onPress={onActionPress}
        style={[
          styles.action,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
        accessibilityRole="button"
      >
        <ThemedText style={styles.actionLabel}>{actionLabel}</ThemedText>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 14,
    height: 14,
  },
  fallback: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
  },
  action: {
    height: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: Radii.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: Typography.sm.fontSize,
    fontWeight: "700",
  },
});
