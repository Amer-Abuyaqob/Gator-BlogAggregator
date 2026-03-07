import { db } from "../index.js";
import { feeds } from "../schema.js";

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
