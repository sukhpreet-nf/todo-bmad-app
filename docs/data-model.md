# Data Model

Single SQLite database, single table.

## Engine

- **Driver:** `better-sqlite3` (synchronous, prepared statements).
- **Mode:** WAL (`PRAGMA journal_mode = WAL`) — enables concurrent readers.
- **Location:** `process.env.DB_PATH` (Docker: `/app/data/todos.db`, dev: `./backend/data/todos.db`, tests: `:memory:`).
- **Schema management:** `CREATE TABLE IF NOT EXISTS` on first connection — no migration tool yet.

## `todos` table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `TEXT` | `PRIMARY KEY` | UUID v4, generated server-side. |
| `description` | `TEXT` | `NOT NULL` | Trimmed before insert/update. |
| `completed` | `INTEGER` | `NOT NULL DEFAULT 0` | `0` = false, `1` = true. |
| `created_at` | `TEXT` | `NOT NULL` | ISO 8601 UTC string from `new Date().toISOString()`. |

### DTO mapping (`rowToTodo` in `backend/src/todos.ts`)

```
DB row                       →  API DTO
id (TEXT)                    →  id (string)
description (TEXT)           →  description (string)
completed (0|1 INTEGER)      →  completed (boolean)
created_at (TEXT)            →  createdAt (string, ISO)
```

## Indexes

None defined explicitly. Primary key on `id` provides O(log n) lookup. Listing uses `ORDER BY created_at ASC` — acceptable while datasets are small (single-user).

## Future considerations (not implemented)

- Add `updated_at` column + trigger or app-level write.
- Add index on `created_at` if list scales.
- Introduce a migration tool (e.g., `node-pg-migrate`-style for sqlite, or `drizzle-kit`) before adding more columns.
- Add `user_id` foreign key when auth lands.
