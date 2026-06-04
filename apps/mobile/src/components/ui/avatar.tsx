import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { Typography } from "@/constants/theme";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string | null;
  fallback?: string;
  size?: AvatarSize;
}

const sizes: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 64,
};

const fontSizes: Record<AvatarSize, number> = {
  sm: Typography.xs.fontSize,
  md: Typography.sm.fontSize,
  lg: Typography["2xl"].fontSize,
};

export function Avatar({ src, fallback, size = "md" }: AvatarProps) {
  const theme = useTheme();
  const dim = sizes[size];

  if (src) {
    return (
      <Image
        source={{ uri: src }}
        style={[styles.image, { width: dim, height: dim, borderRadius: dim / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          backgroundColor: theme.backgroundSelected,
        },
      ]}
    >
      <ThemedText style={{ fontSize: fontSizes[size], fontWeight: "600" }}>
        {fallback?.charAt(0).toUpperCase() ?? "?"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#ccc",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
});
