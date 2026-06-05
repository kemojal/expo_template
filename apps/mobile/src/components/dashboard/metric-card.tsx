import { StyleSheet, View } from "react-native";
import { EaseView } from "@/components/ui/ease-view";

import { ThemedText } from "@/components/themed-text";
import { Radii, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface MetricCardProps {
  label: string;
  value: string;
  detail: string;
  delay?: number;
}

export function MetricCard({ label, value, detail, delay = 0 }: MetricCardProps) {
  const theme = useTheme();

  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 220, easing: "easeOut", delay }}
      style={[
        styles.card,
        Shadows.sm,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}
    >
      <ThemedText style={styles.label} themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.valueRow}>
        <ThemedText style={styles.value}>{value}</ThemedText>
      </View>
      <ThemedText style={styles.detail} themeColor="textSecondary">
        {detail}
      </ThemedText>
    </EaseView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 142,
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.one,
  },
  label: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  value: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  detail: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
});
