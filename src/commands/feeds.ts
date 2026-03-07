import { createFeedFollow } from "../lib/db/queries/feed_follows.js";
import {
  createFeed,
  getAllFeedsWithUserNames,
  type FeedWithUserName,
} from "../lib/db/queries/feeds.js";
import { feeds, users } from "../lib/db/schema.js";

/** Inferred select type for the feeds table. */
export type Feed = typeof feeds.$inferSelect;

/** Inferred select type for the users table. */
export type User = typeof users.$inferSelect;

/**
 * Prints a single feed row (name, URL, creator) to the console.
 *
 * @param row - The feed row with user name.
 * @returns void
 */
function printFeedRow(row: FeedWithUserName): void {
  console.log("Feed:", row.feedName, "| URL:", row.feedUrl, "| User:", row.userName);
}

/**
 * Handles the feeds command. Prints all feeds in the database with name, URL, and creator.
 *
 * @param _cmdName - The command name (unused).
 * @param _args - No arguments expected.
 * @returns Promise that resolves when all feeds are printed.
 */
export async function handlerListFeeds(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  const rows = await getAllFeedsWithUserNames();
  for (const row of rows) {
    printFeedRow(row);
  }
}

/**
 * Logs the feed and user fields to the console.
 *
 * @param feed - The feed to print.
 * @param user - The user who owns the feed.
 * @returns void
 */
export function printFeed(feed: Feed, user: User): void {
  console.log("Feed:", feed.name, "| URL:", feed.url);
  console.log("User:", user.name, "(id:", user.id + ")");
}

/**
 * Parses name and url from addfeed args; throws if either is missing.
 *
 * @param args - Raw command arguments.
 * @returns Object with name and url.
 * @throws {Error} When name or url is missing.
 */
function parseAddFeedArgs(args: string[]): { name: string; url: string } {
  if (args.length < 1 || !args[0]?.trim()) {
    throw new Error("Invalid addfeed: name is required.");
  }
  if (args.length < 2 || !args[1]?.trim()) {
    throw new Error("Invalid addfeed: url is required.");
  }
  return { name: args[0].trim(), url: args[1].trim() };
}

/**
 * Handles the addfeed command. Creates a feed for the current user.
 *
 * @param _cmdName - The command name (unused).
 * @param user - The authenticated user creating the feed.
 * @param args - Variadic list of arguments; first is name, second is url.
 * @returns Promise that resolves when the feed is created and printed.
 * @throws {Error} When name or url is missing.
 */
export async function handlerAddFeed(
  _cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  const { name, url } = parseAddFeedArgs(args);
  const feed = await createFeed(name, url, user.id);
  await createFeedFollow(user.id, feed.id);
  printFeed(feed, user);
}
