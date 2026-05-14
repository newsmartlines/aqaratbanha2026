import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

export let pool: pg.Pool | undefined;
export let db: ReturnType<typeof drizzle> | undefined;

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not set. Database features will be unavailable.",
  );
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}

export * from "./schema";
