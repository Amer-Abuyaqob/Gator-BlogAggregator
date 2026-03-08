import { desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../index.js";
import { feeds, posts } from "../schema.js";
import { getFeedFollowsForUser } from "./feed_follows.js";

/** Post row with feed name for display in the browse command. */
export type PostWithFeedName = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  url: string;
  description: string | null;
  publishedAt: Date | null;
  feedId: string;
  feedName: string;
};

/**
 * Inserts a new post into the database. Skips insertion if URL already exists.
 *
 * @param title - The title of the post.
 * @param url - The unique URL of the post.
 * @param feedId - The ID of the feed the post belongs to.
 * @param description - Optional description or content summary.
 * @param publishedAt - Optional publication timestamp.
 * @returns The inserted post, or undefined if skipped due to duplicate URL.
 */
export async function createPost(
  title: string,
  url: string,
  feedId: string,
  description?: string | null,
  publishedAt?: Date | null,
) {
  const [result] = await db
    .insert(posts)
    .values({
      title,
      url,
      feedId,
      description: description ?? null,
      publishedAt: publishedAt ?? null,
    })
    .onConflictDoNothing({ target: posts.url })
    .returning();
  return result;
}

/**
 * Returns the most recent posts from feeds the user follows, with feed names.
 *
 * @param userId - The ID of the user whose posts to fetch.
 * @param limit - Maximum number of posts to return (default 10).
 * @returns Array of post rows with feedName, ordered by published_at desc, then created_at desc.
 */
export async function getPostsForUser(
  userId: string,
  limit: number = 10,
): Promise<PostWithFeedName[]> {
  const follows = await getFeedFollowsForUser(userId);
  const feedIds = follows.map((f) => f.feedId);
  if (feedIds.length === 0) {
    return [];
  }
  const rows = await db
    .select({
      id: posts.id,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      title: posts.title,
      url: posts.url,
      description: posts.description,
      publishedAt: posts.publishedAt,
      feedId: posts.feedId,
      feedName: feeds.name,
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .where(inArray(posts.feedId, feedIds))
    .orderBy(
      sql`${posts.publishedAt} DESC NULLS LAST`,
      desc(posts.createdAt),
    )
    .limit(limit);
  return rows;
}
