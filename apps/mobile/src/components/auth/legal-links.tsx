import { Linking, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";

interface LegalLinksProps {
  verb?: "continuing" | "signing up";
}

export function LegalLinks({ verb = "continuing" }: LegalLinksProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text} themeColor="textSecondary">
        By {verb}, you agree to our{" "}
        <ThemedText
          style={styles.link}
          themeColor="textSecondary"
          onPress={() => Linking.openURL("https://example.com/terms")}
        >
          Terms
        </ThemedText>
        {" and "}
        <ThemedText
          style={styles.link}
          themeColor="textSecondary"
          onPress={() => Linking.openURL("https://example.com/privacy")}
        >
          Privacy
        </ThemedText>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.two,
  },
  text: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },
  link: {
    fontSize: 12,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
