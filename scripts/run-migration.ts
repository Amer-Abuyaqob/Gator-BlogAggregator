/**
 * One-off script to run migrations 0001_feeds.sql and 0002_feed_follows.sql.
 * Run with: npx tsx scripts/run-migration.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";
import { readConfig } from "../src/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "../src/lib/db/migrations");

async function runMigration(sql: postgres.Sql, filename: string): Promise<void> {
  const migrationPath = path.join(migrationsDir, filename);
  if (!fs.existsSync(migrationPath)) return;
  let sqlContent = fs.readFileSync(migrationPath, "utf-8");
  sqlContent = sqlContent.replace(/--> statement-breakpoint\n?/g, "").trim();
  try {
    await sql.unsafe(sqlContent);
    console.log(`Migration ${filename} applied.`);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("already exists")) {
      console.log(`${filename}: table/constraint already exists; skipped.`);
    } else {
      throw e;
    }
  }
}

async function main() {
  const config = readConfig();
  const sql = postgres(config.dbUrl);
  await runMigration(sql, "0001_feeds.sql");
  await runMigration(sql, "0002_feed_follows.sql");
  await sql.end();
}

main().catch((e) => {
  console.error("Error:", e instanceof Error ? e.message : e);
  process.exit(1);
});
