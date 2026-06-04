import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (!_db) {
    const queryClient = postgres(process.env.DATABASE_URL!, { ssl: "require" });
    _db = drizzle(queryClient, { schema });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop) {
    return (getDb() as any)[prop];
  },
});

export { schema };
export { eq, and, or, desc, asc, sql } from "drizzle-orm";
export type Database = ReturnType<typeof drizzle<typeof schema>>;
