import { Slot, useRouter, useSegments } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PressablesConfig } from "pressto";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { ToastProvider } from "@/components/ui/toast";
import { authClient } from "@/lib/auth";
import { haptics } from "@/lib/haptics";
import { StoreProvider } from "@/lib/store-provider";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { data: session, isPending } = authClient.useSession();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      router.replace("/(auth)");
    } else if (session && inAuthGroup) {
      router.replace("/");
    }
  }, [session, isPending, segments]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PressablesConfig
        animationType="spring"
        animationConfig={{ damping: 32, stiffness: 260, mass: 0.9 }}
        config={{ baseScale: 1, minScale: 0.975, activeOpacity: 0.72 }}
        defaultProps={{ rippleColor: "transparent", touchSoundDisabled: true }}
        globalHandlers={{ onPress: haptics.press }}
      >
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <AnimatedSplashOverlay />
          <ToastProvider>
            <StoreProvider sessionToken={session?.session.token}>
              <Slot />
            </StoreProvider>
          </ToastProvider>
        </ThemeProvider>
      </PressablesConfig>
    </GestureHandlerRootView>
  );
}
