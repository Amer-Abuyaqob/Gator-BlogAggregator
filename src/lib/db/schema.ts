import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Drizzle schema for the `users` table.
 *
 * @property id - UUID primary key, auto-generated.
 * @property createdAt - Timestamp when the row was created.
 * @property updatedAt - Timestamp; auto-updates on row change.
 * @property name - Unique user display name.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull().unique(),
});
