import { StyleSheet, View } from "react-native";
import { EaseView } from "react-native-ease";

import { ThemedText } from "@/components/themed-text";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export function AuthErrorBanner({ message }: { message?: string }) {
  const theme = useTheme();

  if (!message) {
    return null;
  }

  return (
    <EaseView
      initialAnimate={{ opacity: 0, translateY: -6 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 180, easing: "easeOut" }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: `${theme.destructive}14`,
            borderColor: `${theme.destructive}30`,
          },
        ]}
      >
        <ThemedText style={styles.text} themeColor="destructive" selectable>
          {message}
        </ThemedText>
      </View>
    </EaseView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  text: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    fontWeight: "600",
  },
});
