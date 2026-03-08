import { getPostsForUser } from "../lib/db/queries/posts.js";
import type { PostWithFeedName } from "../lib/db/queries/posts.js";
import type { User } from "./feeds.js";

const DEFAULT_LIMIT = 2;

/**
 * Parses the limit argument for browse. Returns default if missing or invalid.
 *
 * @param args - Raw command arguments.
 * @returns Parsed limit (>= 1).
 */
function parseBrowseLimit(args: string[]): number {
  const raw = args[0]?.trim();
  if (!raw) return DEFAULT_LIMIT;
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) return DEFAULT_LIMIT;
  return n;
}

/**
 * Formats a post for console output.
 *
 * @param post - Post with feed name.
 * @returns Formatted string.
 */
function formatPost(post: PostWithFeedName): string {
  const dateStr = post.publishedAt
    ? post.publishedAt.toISOString().slice(0, 10)
    : "unknown";
  return `${post.title} | ${post.url} | ${post.feedName} | ${dateStr}`;
}

/**
 * Handles the browse command. Prints the latest posts from feeds the user follows.
 *
 * @param _cmdName - The command name (unused).
 * @param user - The authenticated user.
 * @param args - Optional first arg is limit (default 2).
 * @returns Promise that resolves when posts are printed.
 */
export async function handlerBrowse(
  _cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> {
  const limit = parseBrowseLimit(args);
  const posts = await getPostsForUser(user.id, limit);
  for (const post of posts) {
    console.log(formatPost(post));
  }
}
