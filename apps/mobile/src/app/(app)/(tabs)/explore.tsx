import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  CardContent,
  FormInput,
  toast,
} from "@/components/ui";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

const feedbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export default function ExploreScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = (data: FeedbackForm) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Feedback submitted!", "success");
      reset();
    }, 1000);
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: safeAreaInsets.top + Spacing.four,
      paddingBottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
    },
    ios: {
      paddingBottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={{
        ...safeAreaInsets,
        bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
      }}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
    >
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Studio
      </ThemedText>

      <Card>
        <CardHeader title="Actions" subtitle="Fast workspace controls" />
        <CardContent>
          <View style={styles.row}>
            <Button title="Capture" onPress={() => toast("Captured")} />
            <Button
              title="Review"
              variant="secondary"
              onPress={() => toast("Review queued")}
            />
          </View>
          <View style={[styles.row, { marginTop: Spacing.two }]}>
            <Button
              title="Archive"
              variant="destructive"
              onPress={() => toast("Archived", "destructive")}
            />
            <Button
              title="Draft"
              variant="ghost"
              onPress={() => toast("Draft saved")}
            />
          </View>
          <View style={[styles.row, { marginTop: Spacing.two }]}>
            <Button title="Compact" size="sm" onPress={() => toast("Compact")} />
            <Button title="Syncing" loading onPress={() => {}} />
            <Button title="Locked" disabled onPress={() => {}} />
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Status" />
        <CardContent>
          <View style={styles.row}>
            <Badge label="Ready" />
            <Badge label="Focus" variant="primary" />
            <Badge label="Synced" variant="success" />
            <Badge label="Review" variant="warning" />
            <Badge label="Blocked" variant="destructive" />
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Team" />
        <CardContent>
          <View style={styles.row}>
            <Avatar fallback="A" size="sm" />
            <Avatar fallback="B" size="md" />
            <Avatar fallback="C" size="lg" />
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Feedback"
          subtitle="Send a workspace note"
        />
        <CardContent>
          <View style={styles.formFields}>
            <FormInput
              control={control}
              name="name"
              label="Name"
              placeholder="Your name"
            />
            <FormInput
              control={control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormInput
              control={control}
              name="message"
              label="Message"
              placeholder="What should change?"
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: "top", paddingTop: 12 }}
            />
            <Button
              title="Submit"
              loading={loading}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Signals" />
        <CardContent>
          <View style={styles.row}>
            <Button
              title="Note"
              variant="secondary"
              size="sm"
              onPress={() => toast("Hello!")}
            />
            <Button
              title="Saved"
              variant="secondary"
              size="sm"
              onPress={() => toast("Saved!", "success")}
            />
            <Button
              title="Error"
              variant="secondary"
              size="sm"
              onPress={() => toast("Something went wrong", "destructive")}
            />
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
  contentContainer: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  sectionTitle: {
    marginBottom: Spacing.one,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    alignItems: "center",
  },
  formFields: {
    gap: Spacing.three,
  },
});
