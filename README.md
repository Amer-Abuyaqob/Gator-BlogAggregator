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

When you run `npm start`, the CLI will:

1. Set the current user name in the config file (using `setUser`).
2. Read the configuration from `~/.gatorconfig.json` (using `readConfig`).
3. Log the normalized config object to the console.

### Environment

You may need a `.env` file with `DATABASE_URL` once the database chapter is implemented. See [PROJECT_DESC.md](PROJECT_DESC.md) for details.

---

## Documentation

For full project description, architecture, and requirements, see **[PROJECT_DESC.md](PROJECT_DESC.md)**.
