import { useEffect, useRef, useState } from "react";
import { Provider } from "tinybase/ui-react";
import type { MergeableStore } from "tinybase/mergeable-store";
import type { Persister } from "tinybase/persisters";

import { createAppStore } from "./store";
import { createPersister } from "./persistence";
import { createSynchronizer } from "./sync";

type StoreProviderProps = {
  sessionToken?: string;
  children: React.ReactNode;
};

export function StoreProvider({ sessionToken, children }: StoreProviderProps) {
  const storeRef = useRef<MergeableStore | null>(null);
  const [ready, setReady] = useState(false);

  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }

  const store = storeRef.current;

  useEffect(() => {
    let persister: Persister | null = null;
    let synchronizer: Awaited<ReturnType<typeof createSynchronizer>> | null =
      null;
    let mounted = true;

    async function init() {
      // Set up persistence
      persister = await createPersister(store);
      await persister.startAutoLoad();
      await persister.startAutoSave();

      if (!mounted) return;

      // Set up sync if authenticated
      if (sessionToken) {
        try {
          synchronizer = await createSynchronizer(store, sessionToken);
          await synchronizer.startSync();
        } catch {
          // Sync failure is non-fatal — app works offline
        }
      }

      if (mounted) setReady(true);
    }

    init();

    return () => {
      mounted = false;
      synchronizer?.destroy();
      persister?.destroy();
    };
  }, [store, sessionToken]);

  if (!ready) return null;

  return <Provider store={store}>{children}</Provider>;
}
