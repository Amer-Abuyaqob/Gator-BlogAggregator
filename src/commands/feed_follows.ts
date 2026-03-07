import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed_follows.js";
import { getFeedByUrl } from "../lib/db/queries/feeds.js";
import { User } from "./feeds.js";

/**
 * Handles the follow command. Creates a feed follow for the current user by feed URL.
 *
 * @param _cmdName - The command name (unused).
 * @param user - The authenticated user following the feed.
 * @param args - Variadic list of arguments; first is the feed URL.
 * @returns Promise that resolves when the follow is created and printed.
 * @throws {Error} When feed not found or URL missing.
 */
export async function handlerFollow(
  _cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  const url = args[0]?.trim();
  if (!url) {
    throw new Error("Invalid follow: url is required.");
  }
  const feed = await getFeedByUrl(url);
  if (!feed) {
    throw new Error(`Feed not found with URL: ${url}`);
  }
  const result = await createFeedFollow(user.id, feed.id);
  console.log("Followed", result.feedName, "as", result.userName);
}

/**
 * Handles the following command. Prints all feed names the current user follows.
 *
 * @param _cmdName - The command name (unused).
 * @param user - The authenticated user whose followed feeds to list.
 * @param _args - No arguments expected.
 * @returns Promise that resolves when all followed feeds are printed.
 */
export async function handlerFollowing(
  _cmdName: string,
  user: User,
  ..._args: string[]
): Promise<void> {
  const follows = await getFeedFollowsForUser(user.id);
  for (const f of follows) {
    console.log(f.feedName);
  }
}
