import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration for schema location, migrations output, and database connection.
 *
 * @property schema - Path to the Drizzle schema file.
 * @property out - Directory where migration files are generated.
 * @property dialect - Database dialect (PostgreSQL).
 * @property dbCredentials - Connection URL for the database.
 */
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://postgres:%40meR0595@localhost:5432/gator?sslmode=disable",
  },
});
