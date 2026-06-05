import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface ActivityRowProps {
  title: string;
  time: string;
  tone?: "primary" | "success" | "warning";
}

export function ActivityRow({ title, time, tone = "primary" }: ActivityRowProps) {
  const theme = useTheme();
  const color = theme[tone];

  return (
    <View style={styles.row}>
      <View style={[styles.marker, { backgroundColor: color }]} />
      <View style={styles.copy}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.time} themeColor="textSecondary">
          {time}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: 42,
  },
  marker: {
    width: 9,
    height: 9,
    borderRadius: Radii.full,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  title: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontWeight: "700",
  },
  time: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
});
