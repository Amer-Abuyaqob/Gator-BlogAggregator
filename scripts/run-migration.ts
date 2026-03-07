/**
 * One-off script to run migration 0001_feeds.sql.
 * Run with: npx tsx scripts/run-migration.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { readConfig } from "../src/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const config = readConfig();
  const sql = postgres(config.dbUrl);
  const migrationPath = path.join(
    __dirname,
    "../src/lib/db/migrations/0001_feeds.sql",
  );
  const sqlContent = fs.readFileSync(migrationPath, "utf-8");
  try {
    await sql.unsafe(sqlContent);
    console.log("Migration 0001_feeds applied.");
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("already exists")) {
      console.log("Feeds table already exists; migration skipped.");
    } else {
      throw e;
    }
  }
  await sql.end();
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
