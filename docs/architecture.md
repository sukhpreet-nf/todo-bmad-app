# Architecture (As Built)

```
                ┌───────────────────────────┐
                │           User            │
                │   (browser @ :80 / :5173) │
                └─────────────┬─────────────┘
                              │ HTML / JS / CSS
                              ▼
        ┌─────────────────────────────────────────────┐
        │  Frontend container (prod)  /  Vite (dev)   │
        │  - Nginx 80 → /usr/share/nginx/html         │
        │  - Vite dev server :5173 with /api proxy    │
        │  - React 18 SPA (App.tsx + components)      │
        └─────────────────────┬───────────────────────┘
                              │ fetch /api/todos
                              ▼
        ┌─────────────────────────────────────────────┐
        │  Backend container :3001                    │
        │  - Express 4 router + middleware            │
        │     • cors (origin allowlist)               │
        │     • express.json()                        │
        │     • express-rate-limit (300/15min)        │
        │  - Routes:                                  │
        │     GET    /healthz                         │
        │     GET    /api/todos                       │
        │     POST   /api/todos                       │
        │     PUT    /api/todos/:id                   │
        │     DELETE /api/todos/:id                   │
        └─────────────────────┬───────────────────────┘
                              │ prepared statements
                              ▼
        ┌─────────────────────────────────────────────┐
        │  SQLite (better-sqlite3, WAL mode)          │
        │  Volume: todo-data → /app/data/todos.db     │
        │  Table: todos(id PK, description, completed,│
        │               created_at)                   │
        └─────────────────────────────────────────────┘
```

## Component responsibilities

### Backend (`backend/`)

| File | Role |
|------|------|
| `src/server.ts` | Express bootstrap: CORS, JSON, rate limiter, health route, mounts `todosRouter`, error/404 handlers. |
| `src/todos.ts` | Router for `/api/todos` CRUD; uses `getDb()`; validates inputs; converts DB rows → API DTOs. |
| `src/db.ts` | Lazy SQLite singleton. Creates `todos` table if missing. WAL mode. Honors `DB_PATH` env (`:memory:` for tests). |
| `tests/unit/` | Pure unit tests for handlers / row mapping. |
| `tests/integration/todos.api.test.ts` | Full Express app via Supertest against in-memory SQLite. |

### Frontend (`frontend/`)

| File | Role |
|------|------|
| `src/main.tsx` | React root mount. |
| `src/App.tsx` | Top-level state, fetch lifecycle, error/loading/optimistic patterns. |
| `src/api/todos.ts` | Thin `fetch` wrapper for the 5 REST calls. |
| `src/components/TodoForm.tsx` | Add-todo form with validation/disable while submitting. |
| `src/components/TodoList.tsx` | Renders list, empty/error/loading states, retry. |
| `src/components/TodoItem.tsx` | Single row: toggle, edit, delete. |
| `src/types.ts` | Shared `Todo` DTO. |
| `tests/unit/*.test.tsx` | Component unit tests (Vitest + Testing Library). |
| `tests/e2e/todos.spec.ts` | Playwright end-to-end happy path. |

### Infrastructure

| File | Role |
|------|------|
| `docker-compose.yml` | Two services (`backend`, `frontend`) + named volume `todo-data`. Frontend depends on backend health. |
| `backend/Dockerfile` | Multi-stage build → small Node image; runs `node dist/server.js`. |
| `frontend/Dockerfile` | Multi-stage: Vite build → Nginx static serve. `VITE_API_URL=/api` baked at build. |
| `frontend/nginx.conf` | Proxies `/api/*` and `/healthz` to `backend:3001`; serves SPA with HTML5 history fallback. |
| `frontend/vite.config.ts` | Dev proxy mirrors prod Nginx (`/api` → `localhost:3001`) so dev/prod parity holds. |

## Cross-cutting concerns

- **Configuration via env vars:** `PORT`, `NODE_ENV`, `DB_PATH`, `CORS_ORIGIN` (backend); `VITE_API_URL` (frontend build arg).
- **Data flow:** All writes go through prepared statements with positional parameters (no string interpolation). Booleans are stored as `INTEGER 0/1` and translated in `rowToTodo`.
- **Error model:** Backend returns `{ error: string }` with 4xx for validation/not-found and 500 for unexpected. Frontend surfaces a single error banner with retry.
- **Time:** `created_at` stored as ISO 8601 string set at insert time on the server.

## Deviation log (intent vs. reality)

| Topic | Intent (PRD/arch) | Reality | Action |
|-------|------|---------|--------|
| (none currently flagged) | — | — | Re-run scan after next story implemented and update this section. |
