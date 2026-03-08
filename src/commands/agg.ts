import {
  getNextFeedToFetch,
  markFeedFetched,
} from "../lib/db/queries/feeds.js";
import { createPost } from "../lib/db/queries/posts.js";
import { fetchFeed, parsePublishedAt } from "../lib/rss.js";

/**
 * Parses a duration string (e.g. 1s, 1m, 1h) into milliseconds.
 *
 * @param durationStr - Duration string like "1s", "5m", "1h", "100ms".
 * @returns Duration in milliseconds.
 * @throws {Error} When the format is invalid.
 */
function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);
  if (!match) {
    throw new Error(
      `Invalid duration: "${durationStr}". Use format like 1s, 5m, 1h.`,
    );
  }
  const value = parseInt(match[1] ?? "0", 10);
  const unit = match[2] ?? "s";
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
  };
  return value * (multipliers[unit] ?? 1000);
}

/**
 * Formats a duration in ms to a human-readable string (e.g. 1m0s).
 *
 * @param ms - Duration in milliseconds.
 * @returns Formatted string.
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (60 * 1000)) % 60;
  const hours = Math.floor(ms / (60 * 60 * 1000));
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join("");
}

/**
 * Scrapes one feed: gets next to fetch, marks it fetched, fetches, prints post titles.
 *
 * @returns Promise that resolves when the scrape cycle completes (or when no feeds).
 */
async function scrapeFeeds(): Promise<void> {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    return;
  }
  await markFeedFetched(feed.id);
  const rssFeed = await fetchFeed(feed.url);
  const items = rssFeed.channel.item ?? [];
  for (const item of items) {
    if (!item.link?.trim()) continue;
    await createPost(
      item.title || "(no title)",
      item.link.trim(),
      feed.id,
      item.description || null,
      parsePublishedAt(item.pubDate),
    );
  }
}

/**
 * Handles errors by logging to stderr.
 *
 * @param e - The caught error.
 */
function handleError(e: unknown): void {
  const message = e instanceof Error ? e.message : String(e);
  console.error("Error:", message);
}

/**
 * Parses time_between_reqs from args; throws if missing or invalid.
 *
 * @param args - Raw command arguments.
 * @returns Duration in milliseconds.
 */
function parseTimeBetweenReqs(args: string[]): number {
  if (args.length < 1 || !args[0]?.trim()) {
    throw new Error("agg requires time_between_reqs (e.g. 1s, 1m, 1h).");
  }
  return parseDuration(args[0].trim());
}

/**
 * Handles the agg command. Long-running loop that fetches feeds and prints post titles.
 *
 * @param _cmdName - The command name (unused).
 * @param args - First arg is time_between_reqs duration string (e.g. 1s, 1m).
 * @returns Promise that resolves when the user stops the program (SIGINT).
 * @throws {Error} When time_between_reqs is missing or invalid.
 */
export async function handlerAgg(
  _cmdName: string,
  ...args: string[]
): Promise<void> {
  const timeBetweenReqs = parseTimeBetweenReqs(args);
  console.log(`Collecting feeds every ${formatDuration(timeBetweenReqs)}`);

  scrapeFeeds().catch(handleError);
  const interval = setInterval(() => {
    scrapeFeeds().catch(handleError);
  }, timeBetweenReqs);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
}
