import { Platform, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { EaseView } from "@/components/ui/ease-view";

import { ThemedText } from "@/components/themed-text";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export function BrandMark() {
  const theme = useTheme();

  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 8, scale: 0.98 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 210 }}
      style={styles.container}
    >
      <View
        style={[
          styles.mark,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
      >
        {Platform.OS === "ios" ? (
          <SymbolView
            name="sparkles"
            tintColor={theme.primary}
            style={styles.symbol}
            weight="semibold"
          />
        ) : (
          <ThemedText style={[styles.symbolFallback, { color: theme.primary }]}>
            *
          </ThemedText>
        )}
      </View>
      <View style={styles.copy}>
        <ThemedText style={styles.title}>Template OS</ThemedText>
        <ThemedText style={styles.subtitle} themeColor="textSecondary">
          Focused work, synced cleanly.
        </ThemedText>
      </View>
    </EaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing.three,
  },
  mark: {
    width: 58,
    height: 58,
    borderRadius: Radii.xl,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 30px rgba(10, 132, 255, 0.16)",
  },
  symbol: {
    width: 26,
    height: 26,
  },
  symbolFallback: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "700",
  },
  copy: {
    alignItems: "center",
    gap: Spacing.one,
  },
  title: {
    fontSize: Typography["2xl"].fontSize,
    lineHeight: Typography["2xl"].lineHeight,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    textAlign: "center",
  },
});
