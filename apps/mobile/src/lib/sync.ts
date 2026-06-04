import type { MergeableStore } from "tinybase/mergeable-store";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client";

const SYNC_URL = process.env.EXPO_PUBLIC_SYNC_URL || "ws://localhost:3001";

export async function createSynchronizer(
  store: MergeableStore,
  token: string
) {
  const url = `${SYNC_URL}?token=${encodeURIComponent(token)}`;

  const synchronizer = await createWsSynchronizer(store, new WebSocket(url));

  return synchronizer;
}
