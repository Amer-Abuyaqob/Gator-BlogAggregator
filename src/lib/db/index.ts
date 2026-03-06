import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { readConfig } from "../../config.js";
import * as schema from "./schema.js";

const config = readConfig();
const conn = postgres(config.dbUrl);

/**
 * Drizzle ORM client for PostgreSQL. Use this to query and mutate the database.
 *
 * @example
 * import { db } from "./lib/db/index.js";
 * const allUsers = await db.select().from(schema.users);
 */
export const db = drizzle(conn, { schema });
