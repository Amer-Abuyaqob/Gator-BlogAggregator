# Gator Blog Aggregator

An RSS feed aggregator CLI and long-running service built in TypeScript. This project is part of the [Boot.dev "Build a Blog Aggregator in TypeScript"](https://www.boot.dev/courses/build-blog-aggregator-typescript) course.

---

## Tech Stack

- **TypeScript** – Type-safe JavaScript
- **Node.js** – Runtime
- **PostgreSQL** – Database
- **Drizzle ORM** – Type-safe database access
- **RSS** – Feed fetching and parsing

---

## Features

- **Config** – Get and set CLI configuration values
- **Database** – PostgreSQL + Drizzle for storing feeds and posts
- **RSS** – Download and parse RSS feed data
- **Following** – Multi-user: follow other RSS feeds
- **Aggregate** – Long-running service that continuously polls and aggregates posts

---

## Getting Started

### Prerequisites

- Node.js (see [.nvmrc](.nvmrc) for recommended version)
- PostgreSQL (for later chapters)

### Install & run

```bash
# Clone the repo
git clone <repo-url>
cd Gator-BlogAggregator

# Install dependencies
npm install

# Build
npm run build

# Run
npm start
```

The CLI uses a command-based interface. Run with a command and optional args:

```bash
node dist/main.js <command> [args]
```

**Commands:**

| Command    | Args                    | Description                                                                 |
| ---------- | ----------------------- | --------------------------------------------------------------------------- |
| `addfeed`  | `<name>` `<url>`        | Adds an RSS feed for the current user. Requires login/register first.       |
| `agg`      | —                       | Fetches the default RSS feed and prints the full feed object as JSON.       |
| `login`    | `<username>`            | Verifies user exists in DB, then sets the current user in config.           |
| `register` | `<username>`            | Creates a new user in the DB and sets them as the current user in config.   |
| `reset`    | —                       | Deletes all users from the DB; useful for dev/testing. Exit 0 on success.   |
| `users`    | —                       | Lists all users from the DB; shows who is currently logged in as (current). |

**Examples:**

- `node dist/main.js` → Usage message, exit code 1
- `node dist/main.js agg` → Fetches and prints the default RSS feed as JSON
- `node dist/main.js login alice` → If `alice` exists in DB, sets user to `alice`, exit code 0
- `node dist/main.js register bob` → Creates user `bob` in DB and sets as current user, exit code 0
- `node dist/main.js reset` → Wipes all users from the DB and reports how many were deleted, exit code 0
- `node dist/main.js users` → Lists all users; the current user is shown with `(current)`
- `node dist/main.js addfeed "Hacker News RSS" "https://hnrss.org/newest"` → Adds a feed for the current user

### Database

Drizzle ORM is configured with:

- **Schema:** `src/lib/db/schema.ts` (defines `users` and `feeds` tables)
- **Migrations:** `src/lib/db/migrations/`
- **Config:** `drizzle.config.ts` (schema path, output dir, dialect, credentials)

Apply migrations:

```bash
npx drizzle-kit push
```

Generate new migrations after schema changes:

```bash
npx drizzle-kit generate
```

### Environment

Configure database connection in `drizzle.config.ts` (`dbCredentials.url`) or via `DATABASE_URL` when wired up. See [PROJECT_DESC.md](PROJECT_DESC.md) for details.

---

## Documentation

For full project description, architecture, and requirements, see **[PROJECT_DESC.md](PROJECT_DESC.md)**.

---

_Last updated: March 2026 — Config, database (users, reset), RSS feed fetching, `agg` command; exit codes 0/1._
