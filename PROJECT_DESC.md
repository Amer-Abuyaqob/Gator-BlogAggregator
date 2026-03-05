# Build a Blog Aggregator in TypeScript

> Single source of truth for this project's description, architecture, and requirements.

---

## 1. Overview

A **blog aggregator microservice** in TypeScript. You'll build a CLI tool and a long-running background service that:

- Polls RSS feeds from the internet
- Stores and retrieves posts in a database
- Lets users follow feeds and read aggregated content

This project practices: API integration, database work, and web scraping.

---

## 2. Domain & Architecture

### Two main components

1. **Background service** – Runs continuously and polls RSS feeds.
2. **CLI** – Lets users manage feeds, config, and read content.

### Core concepts

- **Config** – Get/set configuration (e.g. database URL, current user).
- **Database** – PostgreSQL + Drizzle ORM for persistent storage.
- **RSS** – Download and parse feed data from URLs.
- **Following** – Users can follow RSS feeds; multiplayer-style features.
- **Aggregate** – Continuous polling of feeds to collect new posts.

---

## 3. Chapter / Requirements Summary

The Boot.dev course is split into 5 chapters:

| Chapter       | Focus                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------ |
| **Config**    | CLI system for getting and setting configuration values                                    |
| **Database**  | Set up PostgreSQL and Drizzle; store and retrieve data in the CLI                          |
| **RSS**       | Functions to download and parse data from RSS feeds                                        |
| **Following** | Add multiplayer features: users can follow other RSS feeds                                 |
| **Aggregate** | Turn the CLI into a long-running service that continuously aggregates posts from RSS feeds |

---

## 4. Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** Drizzle
- **Other:** RSS parsing, CLI design, long-running service workers

---

## 5. Workspace File Map

| Path              | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `PROJECT_DESC.md` | This file – project description, architecture, spec |
| `README.md`       | GitHub-facing overview, setup, and how to run       |
| `.cursorrules`    | Cursor AI rules for this workspace                  |
| `src/`            | TypeScript source code                              |
| `src/index.ts`    | Entry point                                         |
| `src/config.ts`   | Config types and helpers                            |
| `package.json`    | Dependencies and scripts                            |
| `tsconfig.json`   | TypeScript compiler options                         |
