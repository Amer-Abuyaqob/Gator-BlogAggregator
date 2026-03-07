import { fetchFeed } from "../lib/rss.js";

const DEFAULT_FEED_URL = "https://www.wagslane.dev/index.xml";

/**
 * Handles the agg command. Fetches the default RSS feed and prints the entire feed object.
 *
 * @param _cmdName - The command name (unused).
 * @param _args - Variadic list of arguments (unused for agg).
 * @returns Promise that resolves when the feed is fetched and printed.
 * @throws {Error} When the fetch or parse fails (propagates to main for exit code 1).
 */
export async function handlerAgg(
  _cmdName: string,
  ..._args: string[]
): Promise<void> {
  const feed = await fetchFeed(DEFAULT_FEED_URL);
  console.log(JSON.stringify(feed, null, 2));
}
