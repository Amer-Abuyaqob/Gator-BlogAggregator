import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { feedFollows, feeds, users } from "../schema.js";

/**
 * Row shape returned by createFeedFollow and getFeedFollowsForUser.
 *
 * @property id - The feed follow record ID.
 * @property createdAt - When the follow was created.
 * @property updatedAt - When the follow was last updated.
 * @property userId - The user's ID.
 * @property feedId - The feed's ID.
 * @property userName - Display name of the user.
 * @property feedName - Display name of the feed.
 */
export type FeedFollowWithNames = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  feedId: string;
  userName: string;
  feedName: string;
};

/**
 * Inserts a feed follow record and returns it with linked user and feed names.
 *
 * @param userId - The ID of the user following the feed.
 * @param feedId - The ID of the feed being followed.
 * @returns The created feed follow with userName and feedName.
 * @throws {Error} When the insert violates uniqueness or other DB constraints.
 */
export async function createFeedFollow(
  userId: string,
  feedId: string,
): Promise<FeedFollowWithNames> {
  const [inserted] = await db
    .insert(feedFollows)
    .values({ userId, feedId })
    .returning();
  if (!inserted) {
    throw new Error("Failed to create feed follow");
  }
  const [row] = await db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.id, inserted.id));
  if (!row) {
    throw new Error("Failed to fetch created feed follow with names");
  }
  return row;
}

/**
 * Returns all feed follows for a given user, including feed and user names.
 *
 * @param userId - The ID of the user whose follows to fetch.
 * @returns Array of feed follow rows with userName and feedName.
 */
export async function getFeedFollowsForUser(
  userId: string,
): Promise<FeedFollowWithNames[]> {
  return db
    .select({
      id: feedFollows.id,
      createdAt: feedFollows.createdAt,
      updatedAt: feedFollows.updatedAt,
      userId: feedFollows.userId,
      feedId: feedFollows.feedId,
      userName: users.name,
      feedName: feeds.name,
    })
    .from(feedFollows)
    .innerJoin(users, eq(feedFollows.userId, users.id))
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));
}
