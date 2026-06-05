import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useSession } from "@/lib/session-context";

export default function AuthCallbackScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { session, isPending, refresh } = useSession();

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!isPending && session) {
      router.replace("/");
    }
  }, [isPending, router, session]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator color={theme.primary} />
      <ThemedText style={styles.text} themeColor="textSecondary">
        Signing in
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
  },
});
