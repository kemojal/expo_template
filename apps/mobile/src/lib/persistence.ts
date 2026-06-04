import { Platform } from "react-native";
import type { MergeableStore } from "tinybase/mergeable-store";
import type { Persister } from "tinybase/persisters";

export async function createPersister(
  store: MergeableStore
): Promise<Persister> {
  if (Platform.OS === "web") {
    const { createLocalPersister } = await import(
      "tinybase/persisters/persister-browser"
    );
    return createLocalPersister(store, "app-store");
  }

  const { createExpoSqlitePersister } = await import(
    "tinybase/persisters/persister-expo-sqlite"
  );
  const { openDatabaseSync } = await import("expo-sqlite");
  const db = openDatabaseSync("app-store.db");

  return createExpoSqlitePersister(store, db);
}
