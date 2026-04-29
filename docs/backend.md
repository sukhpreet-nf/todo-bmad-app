# Backend Module (`backend/`)

Express 4 + better-sqlite3 + TypeScript. ~150 LoC of source. Designed to be small, synchronous, and easy to test.

## Entry points

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `ts-node-dev --respawn --transpile-only src/server.ts` | Hot-reloading dev server |
| `npm run build` | `tsc` | Emit `dist/` |
| `npm start` | `node dist/server.js` | Production start (used by Dockerfile) |
| `npm test` | `vitest run` | Run unit + integration tests |
| `npm run test:coverage` | `vitest run --coverage` | Coverage (v8); thresholds 70% |

## Environment variables

| Var | Default | Used by |
|-----|---------|---------|
| `PORT` | `3001` | `server.ts` |
| `NODE_ENV` | unset | gates `app.listen` (skipped in `test`) |
| `CORS_ORIGIN` | unset | `cors({ origin })`. If unset/`*`, CORS is **disabled** (origin: `false`). |
| `DB_PATH` | `./data/todos.db` | `db.ts`. Set to `:memory:` for in-memory tests. |

## Middleware order

1. `cors({ origin: allowlist })`
2. `express.json()` (default 1MB body limit)
3. `apiLimiter` — applied **only** to `/api/todos` (300 req / 15 min, standard headers)
4. Routes (`/healthz`, `/api/todos/*`)
5. 404 handler
6. Error handler

> Health check is intentionally **outside** the rate limiter so probes never get throttled.

## Code map

```
backend/src/
├── server.ts   # express bootstrap, middleware, route mounting, listen
├── todos.ts    # CRUD router, validation, row↔DTO mapping
└── db.ts       # SQLite singleton, schema bootstrap, WAL pragma
```

## Validation rules (centralized in `todos.ts`)

| Rule | Where |
|------|-------|
| `description` required & non-empty (after trim) on `POST` | `router.post('/')` |
| `description` if present must be non-empty (after trim) on `PUT` | `router.put('/:id')` |
| `completed` if present is coerced via ternary to `0|1` | `router.put('/:id')` |
| `:id` must match an existing row | `PUT` and `DELETE` |

## Testing posture

- `tests/unit/todos.unit.test.ts` — pure logic.
- `tests/integration/todos.api.test.ts` — boots the Express app with `DB_PATH=:memory:`, exercises all routes via Supertest.
- Coverage thresholds enforced in `vitest.config.ts`.

## Known gaps / TODOs

- No structured logging (`console.error` only).
- No request id / correlation id.
- No graceful shutdown (`SIGTERM` handler) — relies on Docker stop timeout.
- No migration framework — `CREATE TABLE IF NOT EXISTS` only.
- No OpenAPI spec (contract lives in `docs/api.md` only).
