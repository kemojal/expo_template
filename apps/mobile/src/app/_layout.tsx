import { Slot, useRouter, useSegments } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PressablesConfig } from "pressto";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { ToastProvider } from "@/components/ui/toast";
import { haptics } from "@/lib/haptics";
import { SessionProvider, useSession } from "@/lib/session-context";
import { StoreProvider } from "@/lib/store-provider";

function RootNavigator() {
  const { session, isPending } = useSession();
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
    <StoreProvider sessionToken={session?.session.token}>
      <Slot />
    </StoreProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
            <SessionProvider>
              <RootNavigator />
            </SessionProvider>
          </ToastProvider>
        </ThemeProvider>
      </PressablesConfig>
    </GestureHandlerRootView>
  );
}
