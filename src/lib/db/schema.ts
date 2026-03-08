import {
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

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
 * @property lastFetchedAt - Timestamp when the feed was last fetched; null if never fetched.
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
  lastFetchedAt: timestamp("last_fetched_at"),
});

/**
 * Drizzle schema for the `feed_follows` table.
 * Links users to feeds they follow. Many users can follow many feeds.
 *
 * @property id - UUID primary key, auto-generated.
 * @property createdAt - Timestamp when the row was created.
 * @property updatedAt - Timestamp; auto-updates on row change.
 * @property userId - Foreign key to the user; cascades on user delete.
 * @property feedId - Foreign key to the feed; cascades on feed delete.
 */
export const feedFollows = pgTable(
  "feed_follows",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => feeds.id, { onDelete: "cascade" }),
  },
  (table) => [unique().on(table.userId, table.feedId)],
);

/**
 * Drizzle schema for the `posts` table.
 * Stores individual entries from RSS feeds.
 *
 * @property id - UUID primary key, auto-generated.
 * @property createdAt - Timestamp when the row was created.
 * @property updatedAt - Timestamp; auto-updates on row change.
 * @property title - Title of the post.
 * @property url - Unique URL of the post.
 * @property description - Description or content summary; null if missing.
 * @property publishedAt - When the post was published; null if unknown.
 * @property feedId - Foreign key to the feed; cascades on feed delete.
 */
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  title: text("title").notNull(),
  url: text("url").notNull().unique(),
  description: text("description"),
  publishedAt: timestamp("published_at"),
  feedId: uuid("feed_id")
    .notNull()
    .references(() => feeds.id, { onDelete: "cascade" }),
});
