import { StyleSheet, View } from "react-native";
import { EaseView } from "@/components/ui/ease-view";

import { ThemedText } from "@/components/themed-text";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface StatusStripProps {
  email?: string | null;
}

export function StatusStrip({ email }: StatusStripProps) {
  const theme = useTheme();

  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: 8 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 220, easing: "easeOut", delay: 80 }}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.status}>
        <View style={[styles.dot, { backgroundColor: theme.success }]} />
        <ThemedText style={styles.label}>Synced</ThemedText>
      </View>
      <ThemedText
        style={styles.email}
        themeColor="textSecondary"
        numberOfLines={1}
        selectable
      >
        {email ?? "Workspace ready"}
      </ThemedText>
    </EaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    borderRadius: Radii.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radii.full,
  },
  label: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: "700",
  },
  email: {
    flex: 1,
    textAlign: "right",
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
});
