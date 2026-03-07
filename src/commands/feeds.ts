import { createFeed } from "../lib/db/queries/feeds.js";
import { getUser } from "../lib/db/queries/users.js";
import { feeds, users } from "../lib/db/schema.js";
import { readConfig } from "../config.js";

/** Inferred select type for the feeds table. */
export type Feed = typeof feeds.$inferSelect;

/** Inferred select type for the users table. */
export type User = typeof users.$inferSelect;

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
 * Returns the current user from the database; throws if not logged in or user not found.
 *
 * @returns The current user from the database.
 * @throws {Error} When no user is logged in or the user does not exist in the database.
 */
async function getCurrentUserFromDb(): Promise<User> {
  const config = readConfig();
  const userName = config.currentUserName?.trim() ?? "";
  if (userName.length === 0) {
    throw new Error("Must be logged in to add a feed. Use 'login' or 'register' first.");
  }
  const user = await getUser(userName);
  if (user === undefined) {
    throw new Error("Current user not found in database. Use 'login' or 'register' first.");
  }
  return user;
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
 * @param args - Variadic list of arguments; first is name, second is url.
 * @returns Promise that resolves when the feed is created and printed.
 * @throws {Error} When not logged in, user not found, or name/url missing.
 */
export async function handlerAddFeed(
  _cmdName: string,
  ...args: string[]
): Promise<void> {
  const user = await getCurrentUserFromDb();
  const { name, url } = parseAddFeedArgs(args);
  const feed = await createFeed(name, url, user.id);
  printFeed(feed, user);
}
