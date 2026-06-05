import type { MergeableStore } from "tinybase/mergeable-store";
import type { Persister } from "tinybase/persisters";
import { createLocalPersister } from "tinybase/persisters/persister-browser";

export async function createPersister(
  store: MergeableStore
): Promise<Persister> {
  return createLocalPersister(store, "app-store");
}
