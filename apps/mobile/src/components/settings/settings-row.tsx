import { Platform, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { PressableScale } from "pressto";

import { ThemedText } from "@/components/themed-text";
import { Radii, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface SettingsRowProps {
  title: string;
  value?: string | null;
  icon?: string;
  destructive?: boolean;
  onPress?: () => void;
}

export function SettingsRow({
  title,
  value,
  icon,
  destructive = false,
  onPress,
}: SettingsRowProps) {
  const theme = useTheme();
  const content = (
    <>
      {icon ? (
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: destructive ? `${theme.destructive}14` : `${theme.primary}14`,
            },
          ]}
        >
          {Platform.OS === "ios" ? (
            <SymbolView
              name={icon as any}
              tintColor={destructive ? theme.destructive : theme.primary}
              style={styles.icon}
              weight="semibold"
            />
          ) : (
            <ThemedText
              style={[
                styles.iconFallback,
                { color: destructive ? theme.destructive : theme.primary },
              ]}
            >
              {destructive ? "!" : "i"}
            </ThemedText>
          )}
        </View>
      ) : null}
      <View style={styles.copy}>
        <ThemedText
          style={[
            styles.title,
            destructive && { color: theme.destructive },
          ]}
        >
          {title}
        </ThemedText>
        {value ? (
          <ThemedText
            style={styles.value}
            themeColor="textSecondary"
            numberOfLines={1}
            selectable
          >
            {value}
          </ThemedText>
        ) : null}
      </View>
    </>
  );

  const rowStyle = [
    styles.row,
    {
      backgroundColor: theme.backgroundElement,
      borderColor: destructive ? `${theme.destructive}30` : theme.border,
    },
  ];

  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        style={rowStyle}
        accessibilityRole="button"
      >
        {content}
      </PressableScale>
    );
  }

  return <View style={rowStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    minHeight: 58,
    borderRadius: Radii.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 17,
    height: 17,
  },
  iconFallback: {
    fontSize: 15,
    fontWeight: "800",
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
  value: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
  },
});
