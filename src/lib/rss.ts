/**
 * RSS types and utilities for fetching and parsing feeds.
 */

import { XMLParser } from "fast-xml-parser";

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
 * @property pubDate - Publication date string (ISO 8601, RFC 2822, or other format).
 */
export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

/**
 * Parses a publication date string from RSS feeds into a Date.
 * Handles ISO 8601, RFC 2822, and common variants.
 *
 * @param pubDateStr - Raw date string from feed (e.g. pubDate, updated).
 * @returns Parsed Date or null if invalid or empty.
 */
export function parsePublishedAt(pubDateStr: string | null | undefined): Date | null {
  const s = typeof pubDateStr === "string" ? pubDateStr.trim() : "";
  if (s.length === 0) return null;
  const parsed = Date.parse(s);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed);
}

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
 * Parses a raw XML string into an RSSFeed object.
 *
 * @param xmlString - Raw XML string from an RSS feed.
 * @returns The parsed RSS feed.
 * @throws {Error} When the XML is invalid or missing required RSS structure.
 */
function parseXmlToRssFeed(xmlString: string): RSSFeed {
  const parser = new XMLParser();
  const parsedData = parser.parse(xmlString);
  const channel = parsedData?.rss?.channel;
  if (!channel) {
    throw new Error("Invalid RSS: missing rss.channel");
  }
  return {
    channel: {
      title: extractText(channel.title),
      link: extractText(channel.link),
      description: extractText(channel.description),
      item: toItemArray(channel.item).map(extractRssItem),
    },
  };
}

/**
 * Extracts a string from a parsed XML value (plain string or CDATA wrapped as { "#text": string }).
 *
 * @param val - Raw value from fast-xml-parser (string, { "#text": string }, or nullish).
 * @returns Normalized string, or empty string if missing.
 */
function extractText(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  const obj = val as Record<string, unknown>;
  if (typeof obj["#text"] === "string") return obj["#text"];
  return String(val);
}

/**
 * Extracts a publication date string from an item, trying common field names.
 *
 * @param item - Raw item object from parsed XML.
 * @returns First non-empty date string, or empty string if none found.
 */
function extractPubDateString(item: Record<string, unknown>): string {
  const keys = ["pubDate", "published", "updated", "dc:date"];
  for (const key of keys) {
    const val = extractText(item[key]);
    if (val.length > 0) return val;
  }
  return "";
}

/**
 * Converts a raw parsed item into a normalized RSSItem.
 *
 * @param raw - Raw item object from parsed XML.
 * @returns Normalized RSSItem with extracted fields.
 */
function extractRssItem(raw: unknown): RSSItem {
  const item = (raw ?? {}) as Record<string, unknown>;
  return {
    title: extractText(item.title),
    link: extractText(item.link),
    description: extractText(item.description),
    pubDate: extractPubDateString(item),
  };
}

/**
 * Ensures items are always an array (fast-xml-parser returns a single object when there is only one item).
 *
 * @param item - Raw item or items from parsed channel.
 * @returns Array of raw items to be passed to extractRssItem.
 */
function toItemArray(item: unknown): unknown[] {
  return item == null ? [] : Array.isArray(item) ? item : [item];
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
  return parseXmlToRssFeed(xmlString);
}
