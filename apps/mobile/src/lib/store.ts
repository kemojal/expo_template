import { createMergeableStore } from "tinybase/mergeable-store";

export function createAppStore() {
  const store = createMergeableStore();

  store.setTablesSchema({
    todos: {
      title: { type: "string" },
      completed: { type: "boolean", default: false },
      createdAt: { type: "string" },
    },
  });

  return store;
}

export type AppStore = ReturnType<typeof createAppStore>;
