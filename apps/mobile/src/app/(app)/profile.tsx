import { Platform, Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { authClient } from "@/lib/auth";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { data: session } = authClient.useSession();

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingBottom: insets.bottom + Spacing.four },
      ]}
    >
      <ThemedView style={styles.avatarSection}>
        <ThemedView type="backgroundElement" style={styles.avatarPlaceholder}>
          <ThemedText type="title">
            {session?.user.name?.charAt(0).toUpperCase() ?? "?"}
          </ThemedText>
        </ThemedView>
        <ThemedText type="subtitle">{session?.user.name}</ThemedText>
        <ThemedText themeColor="textSecondary">{session?.user.email}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedView type="backgroundElement" style={styles.infoRow}>
          <ThemedText themeColor="textSecondary">Name</ThemedText>
          <ThemedText>{session?.user.name}</ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.infoRow}>
          <ThemedText themeColor="textSecondary">Email</ThemedText>
          <ThemedText>{session?.user.email}</ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.infoRow}>
          <ThemedText themeColor="textSecondary">Email verified</ThemedText>
          <ThemedText>{session?.user.emailVerified ? "Yes" : "No"}</ThemedText>
        </ThemedView>
      </ThemedView>

      {Platform.OS !== "web" && (
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.closeButton,
            { backgroundColor: theme.backgroundElement },
            pressed && styles.pressed,
          ]}
        >
          <ThemedText>Close</ThemedText>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    gap: Spacing.five,
  },
  avatarSection: {
    alignItems: "center",
    gap: Spacing.two,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    gap: Spacing.two,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
  },
  closeButton: {
    alignItems: "center",
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
