import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { EaseView } from "@/components/ui/ease-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsRow } from "@/components/settings";
import { ThemedText } from "@/components/themed-text";
import { BottomTabInset, MaxContentWidth, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { authClient } from "@/lib/auth";
import { haptics } from "@/lib/haptics";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { data: session } = authClient.useSession();

  async function handleSignOut() {
    await authClient.signOut();
    haptics.success();
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: insets.top + Spacing.five,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.five,
        },
      ]}
    >
      <EaseView
        initialAnimate={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 220, easing: "easeOut" }}
        style={styles.header}
      >
        <ThemedText style={styles.title}>Settings</ThemedText>
        <ThemedText style={styles.subtitle} themeColor="textSecondary">
          Account and app controls.
        </ThemedText>
      </EaseView>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle} themeColor="textSecondary">
          Account
        </ThemedText>
        <SettingsRow
          title="Profile"
          value={session?.user.email}
          icon="person.crop.circle"
          onPress={() => router.push("/(app)/profile")}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle} themeColor="textSecondary">
          App
        </ThemedText>
        <SettingsRow title="Version" value="1.0.0" icon="square.stack.3d.up" />
        <SettingsRow title="Sync" value="Healthy" icon="checkmark.icloud" />
      </View>

      <SettingsRow
        title="Sign out"
        icon="rectangle.portrait.and.arrow.right"
        destructive
        onPress={handleSignOut}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  header: {
    gap: Spacing.one,
  },
  title: {
    fontSize: Typography["2xl"].fontSize,
    lineHeight: Typography["2xl"].lineHeight,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
