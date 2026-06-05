import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EaseView } from "react-native-ease";

import { ThemedText } from "@/components/themed-text";
import { Card, CardContent, CardHeader } from "@/components/ui";
import {
  ActivityRow,
  MetricCard,
  QuickAction,
  StatusStrip,
} from "@/components/dashboard";
import { BottomTabInset, MaxContentWidth, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { authClient } from "@/lib/auth";

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { data: session } = authClient.useSession();
  const name = session?.user.name?.split(" ")[0] || "there";

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
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
        <View style={styles.titleGroup}>
          <ThemedText style={styles.eyebrow} themeColor="textSecondary">
            Template OS
          </ThemedText>
          <ThemedText style={styles.title}>Good to see you, {name}</ThemedText>
        </View>
        <StatusStrip email={session?.user.email} />
      </EaseView>

      <View style={styles.metrics}>
        <MetricCard label="Focus" value="3" detail="active streams" delay={40} />
        <MetricCard label="Sync" value="98%" detail="healthy" delay={80} />
      </View>

      <View style={styles.actions}>
        <QuickAction
          icon="plus"
          title="New task"
          onPress={() => router.push("/(app)/(tabs)/explore")}
        />
        <QuickAction
          icon="person.crop.circle"
          title="Profile"
          onPress={() => router.push("/(app)/profile")}
        />
      </View>

      <Card>
        <CardHeader title="Today" subtitle="Workspace activity" />
        <CardContent>
          <View style={styles.activityList}>
            <ActivityRow title="Session restored" time="Just now" tone="success" />
            <ActivityRow title="Local data synced" time="2 min ago" />
            <ActivityRow title="API health checked" time="Today" tone="warning" />
          </View>
        </CardContent>
      </Card>
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
    gap: Spacing.four,
  },
  header: {
    gap: Spacing.four,
  },
  titleGroup: {
    gap: Spacing.one,
  },
  eyebrow: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    fontSize: Typography["2xl"].fontSize,
    lineHeight: Typography["2xl"].lineHeight,
    fontWeight: "800",
  },
  metrics: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  activityList: {
    gap: Spacing.three,
  },
});
