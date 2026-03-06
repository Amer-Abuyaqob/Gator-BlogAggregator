/**
 * RSS types and utilities for fetching and parsing feeds.
 */

/**
 * Parsed RSS feed with channel metadata and items.
 *
 * @property channel - Channel metadata (title, link, description) and item array.
 */
export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

/**
 * Single RSS feed entry.
 *
 * @property title - The entry title.
 * @property link - The entry URL.
 * @property description - The entry description or content summary.
 * @property pubDate - Publication date string (ISO 8601 or RSS format).
 */
export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

const USER_AGENT = "gator";

/**
 * Fetches the raw XML string from a URL.
 *
 * @param url - The URL to fetch.
 * @returns Promise that resolves to the response body as a string.
 * @throws {Error} When the fetch fails or the response is not ok.
 */
async function fetchRawXml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.text();
}

/**
 * Fetches and parses an RSS feed from the given URL.
 *
 * @param url - The URL of the RSS feed to fetch.
 * @returns Promise that resolves to the parsed RSS feed.
 * @throws {Error} When the fetch fails or the response cannot be parsed as RSS.
 */
export async function fetchFeed(url: string): Promise<RSSFeed> {
  const xmlString = await fetchRawXml(url);
  // TODO: Parse xmlString to RSSFeed in next step
  void xmlString;
  throw new Error("Not implemented");
}
