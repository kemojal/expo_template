import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import { authClient } from "./auth";

type Session = {
  user: { id: string; name: string; email: string; image?: string | null };
  session: { id: string; token: string; expiresAt: string };
};

type SessionContextValue = {
  session: Session | null;
  isPending: boolean;
  refresh: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue>({
  session: null,
  isPending: true,
  refresh: async () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isPending, setIsPending] = useState(true);
  const appState = useRef(AppState.currentState);

  const refresh = useCallback(async () => {
    try {
      const { data } = await authClient.getSession();
      setSession(data ?? null);
    } catch {
      setSession(null);
    } finally {
      setIsPending(false);
    }
  }, []);

  // Initial session fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Also subscribe to better-auth's useSession for real-time updates
  const betterAuth = authClient.useSession();
  useEffect(() => {
    if (!betterAuth.isPending) {
      setSession(betterAuth.data ?? null);
      setIsPending(false);
    }
  }, [betterAuth.data, betterAuth.isPending]);

  // Refetch when app returns to foreground
  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        refresh();
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, [refresh]);

  return (
    <SessionContext.Provider value={{ session, isPending, refresh }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
