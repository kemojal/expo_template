import { StyleSheet, View, type ViewProps } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { Radii, Shadows, Spacing } from "@/constants/theme";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
}

export function Card({ children, style, ...props }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        Shadows.md,
        { backgroundColor: theme.backgroundElement },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({ title, subtitle }: CardHeaderProps) {
  return (
    <View style={styles.header}>
      <ThemedText type="subtitle">{title}</ThemedText>
      {subtitle && (
        <ThemedText type="small" themeColor="textSecondary">
          {subtitle}
        </ThemedText>
      )}
    </View>
  );
}

export function CardContent({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    overflow: "hidden",
  },
  header: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
});
