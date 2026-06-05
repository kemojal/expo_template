import { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  type TextInputProps,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { Fonts, Radii, Spacing, Typography } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <ThemedText
          style={styles.label}
          themeColor="textSecondary"
          type="small"
        >
          {label}
        </ThemedText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor: error
              ? theme.destructive
              : focused
                ? theme.primary
                : theme.border,
            boxShadow: focused
              ? `0 0 0 3px ${theme.primary}20`
              : "0 1px 2px rgba(16, 17, 20, 0.04)",
          },
          style,
        ]}
        placeholderTextColor={theme.textSecondary}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <ThemedText style={[styles.error, { color: theme.destructive }]} selectable>
          {error}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  label: {
    marginLeft: 1,
    fontWeight: "700",
  },
  input: {
    height: 48,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.three,
    fontSize: Typography.base.fontSize,
    lineHeight: Typography.base.lineHeight,
    fontFamily: Fonts?.sans,
    borderWidth: 1,
  },
  error: {
    fontSize: Typography.xs.fontSize,
    lineHeight: Typography.xs.lineHeight,
    marginLeft: 1,
  },
});
