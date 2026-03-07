import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { feeds, users } from "../schema.js";

/**
 * Row shape returned by getAllFeedsWithUserNames.
 *
 * @property feedName - Display name of the feed.
 * @property feedUrl - URL of the feed.
 * @property userName - Display name of the user who created the feed.
 */
export type FeedWithUserName = {
  feedName: string;
  feedUrl: string;
  userName: string;
};

/**
 * Returns all feeds with their creator's user name, ordered by feed name ascending.
 *
 * @returns Promise resolving to an array of feed rows with userName.
 * @throws {Error} When the database operation fails.
 */
export async function getAllFeedsWithUserNames(): Promise<FeedWithUserName[]> {
  const rows = await db
    .select({
      feedName: feeds.name,
      feedUrl: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.userId, users.id))
    .orderBy(asc(feeds.name));
  return rows;
}

/**
 * Inserts a new feed into the database and returns the created row.
 *
 * @param name - The display name of the feed.
 * @param url - The unique URL of the feed.
 * @param userId - The ID of the user who added this feed.
 * @returns The inserted feed object with id, createdAt, updatedAt, name, url, and userId.
 * @throws {Error} When the url violates uniqueness or other DB constraints.
 */
export async function createFeed(
  name: string,
  url: string,
  userId: string,
) {
  const [result] = await db
    .insert(feeds)
    .values({ name, url, userId })
    .returning();
  return result;
}
