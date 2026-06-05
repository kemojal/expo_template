import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { EaseView } from "react-native-ease";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { Radii, Shadows, Spacing } from "@/constants/theme";
import { haptics } from "@/lib/haptics";

type ToastVariant = "default" | "success" | "destructive";

interface ToastMessage {
  id: number;
  text: string;
  variant: ToastVariant;
}

let _addToast: ((text: string, variant?: ToastVariant) => void) | null = null;

export function toast(text: string, variant: ToastVariant = "default") {
  _addToast?.(text, variant);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const idRef = useRef(0);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const addToast = useCallback((text: string, variant: ToastVariant = "default") => {
    const id = ++idRef.current;
    if (variant === "success") {
      haptics.success();
    } else if (variant === "destructive") {
      haptics.error();
    }
    setMessages((prev) => [...prev, { id, text, variant }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    _addToast = addToast;
    return () => {
      _addToast = null;
    };
  }, [addToast]);

  const bgColors: Record<ToastVariant, string> = {
    default: theme.backgroundElement,
    success: theme.success,
    destructive: theme.destructive,
  };

  const textColors: Record<ToastVariant, string> = {
    default: theme.text,
    success: theme.successForeground,
    destructive: theme.destructiveForeground,
  };

  return (
    <>
      {children}
      <View
        style={[styles.container, { top: insets.top + Spacing.two }]}
        pointerEvents="none"
      >
        {messages.map((msg) => (
          <EaseView
            key={msg.id}
            initialAnimate={{ opacity: 0, translateY: -10, scale: 0.98 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
            style={[
              styles.toast,
              Shadows.md,
              { backgroundColor: bgColors[msg.variant] },
            ]}
          >
            <ThemedText
              style={[styles.text, { color: textColors[msg.variant] }]}
            >
              {msg.text}
            </ThemedText>
          </EaseView>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Spacing.four,
    right: Spacing.four,
    alignItems: "center",
    gap: Spacing.two,
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Radii.md,
    maxWidth: 400,
    width: "100%",
  },
  text: {
    fontWeight: "500",
    textAlign: "center",
  },
});
