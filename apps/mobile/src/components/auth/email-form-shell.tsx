import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { EaseView } from "@/components/ui/ease-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { MaxContentWidth, Spacing, Typography } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

interface EmailFormShellProps {
  title: string;
  subtitle: string;
  header: React.ReactNode;
  children: React.ReactNode;
}

export function EmailFormShell({
  title,
  subtitle,
  header,
  children,
}: EmailFormShellProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.three }]}>
        {header}
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + Spacing.six },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <EaseView
            initialAnimate={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 220, easing: "easeOut" }}
            style={styles.form}
          >
            <View style={styles.titleGroup}>
              <ThemedText style={styles.title}>{title}</ThemedText>
              <ThemedText style={styles.subtitle} themeColor="textSecondary">
                {subtitle}
              </ThemedText>
            </View>
            {children}
          </EaseView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
  },
  form: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    gap: Spacing.four,
  },
  titleGroup: {
    gap: Spacing.one,
  },
  title: {
    fontSize: Typography["2xl"].fontSize,
    lineHeight: Typography["2xl"].lineHeight,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
  },
});
