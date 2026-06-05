import { useRouter } from "expo-router";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { EaseView } from "@/components/ui/ease-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsRow } from "@/components/settings";
import { ThemedText } from "@/components/themed-text";
import { Avatar } from "@/components/ui";
import { MaxContentWidth, Radii, Shadows, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { authClient } from "@/lib/auth";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const theme = useTheme();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const name = user?.name || "Workspace user";
  const initials = name.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.five,
          paddingBottom: insets.bottom + Spacing.five,
        },
      ]}
    >
      <EaseView
        initialAnimate={{ opacity: 0, translateY: 8 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 220, easing: "easeOut" }}
        style={[
          styles.hero,
          Shadows.sm,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}
      >
        <Avatar fallback={initials} size="lg" />
        <View style={styles.heroCopy}>
          <ThemedText style={styles.name} selectable>
            {name}
          </ThemedText>
          <ThemedText
            style={styles.email}
            themeColor="textSecondary"
            selectable
            numberOfLines={1}
          >
            {user?.email}
          </ThemedText>
        </View>
      </EaseView>

      <View style={styles.section}>
        <SettingsRow title="Name" value={user?.name} icon="person.text.rectangle" />
        <SettingsRow title="Email" value={user?.email} icon="envelope" />
        <SettingsRow
          title="Email verified"
          value={user?.emailVerified ? "Yes" : "No"}
          icon={user?.emailVerified ? "checkmark.seal" : "exclamationmark.triangle"}
        />
      </View>

      {Platform.OS !== "web" && (
        <SettingsRow
          title="Close"
          icon="xmark"
          onPress={() => router.back()}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  hero: {
    borderRadius: Radii.lg,
    borderWidth: 1,
    padding: Spacing.five,
    alignItems: "center",
    gap: Spacing.three,
  },
  heroCopy: {
    alignItems: "center",
    gap: Spacing.one,
    alignSelf: "stretch",
  },
  name: {
    fontSize: Typography.xl.fontSize,
    lineHeight: Typography.xl.lineHeight,
    fontWeight: "800",
    textAlign: "center",
  },
  email: {
    fontSize: Typography.sm.fontSize,
    lineHeight: Typography.sm.lineHeight,
    textAlign: "center",
    alignSelf: "stretch",
  },
  section: {
    gap: Spacing.two,
  },
});
