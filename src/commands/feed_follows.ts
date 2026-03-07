import { readConfig } from "../config.js";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed_follows.js";
import { getFeedByUrl } from "../lib/db/queries/feeds.js";
import { getUser } from "../lib/db/queries/users.js";

/**
 * Returns the current user from the database; throws if not logged in or user not found.
 *
 * @returns The current user from the database.
 * @throws {Error} When no user is logged in or the user does not exist in the database.
 */
async function getCurrentUserFromDb() {
  const config = readConfig();
  const userName = config.currentUserName?.trim() ?? "";
  if (userName.length === 0) {
    throw new Error("Must be logged in to follow a feed. Use 'login' or 'register' first.");
  }
  const user = await getUser(userName);
  if (user === undefined) {
    throw new Error("Current user not found in database. Use 'login' or 'register' first.");
  }
  return user;
}

/**
 * Handles the follow command. Creates a feed follow for the current user by feed URL.
 *
 * @param _cmdName - The command name (unused).
 * @param args - Variadic list of arguments; first is the feed URL.
 * @returns Promise that resolves when the follow is created and printed.
 * @throws {Error} When not logged in, feed not found, or URL missing.
 */
export async function handlerFollow(
  _cmdName: string,
  ...args: string[]
): Promise<void> {
  const url = args[0]?.trim();
  if (!url) {
    throw new Error("Invalid follow: url is required.");
  }
  const user = await getCurrentUserFromDb();
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
 * @param _args - No arguments expected.
 * @returns Promise that resolves when all followed feeds are printed.
 * @throws {Error} When not logged in or user not found.
 */
export async function handlerFollowing(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  const user = await getCurrentUserFromDb();
  const follows = await getFeedFollowsForUser(user.id);
  for (const f of follows) {
    console.log(f.feedName);
  }
}
