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

/**
 * Drizzle schema for the `feeds` table.
 *
 * @property id - UUID primary key, auto-generated.
 * @property createdAt - Timestamp when the row was created.
 * @property updatedAt - Timestamp; auto-updates on row change.
 * @property name - Display name of the feed.
 * @property url - Unique URL of the feed.
 * @property userId - Foreign key to the user who added this feed; cascades on user delete.
 */
export const feeds = pgTable("feeds", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  name: text("name").notNull(),
  url: text("url").notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
