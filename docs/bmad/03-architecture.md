# Architecture Design: Todo Application (BMAD)

**Persona:** Architect  
**Status:** Approved for Implementation

---

## 1. Overview

The application follows a classic three-tier architecture:

```
Browser (SPA)
    │  HTTP/JSON
    ▼
Express REST API  (Node.js / TypeScript)
    │  SQL
    ▼
SQLite database   (file on disk, Docker volume)
```

All tiers are containerised with Docker and orchestrated via Docker Compose.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend framework | React 18 + TypeScript | Industry standard; strong typing reduces bugs |
| Frontend build | Vite | Fast HMR; minimal config; native ESM |
| Styling | Tailwind CSS | Utility-first; no context switching for simple UIs |
| Frontend data fetching | TanStack Query (React Query) | Cache, loading/error states, cache invalidation out of the box |
| Backend runtime | Node.js 20 LTS | Compatible with TypeScript; large ecosystem |
| Backend framework | Express 4 | Minimal, well-understood; easy to test with Supertest |
| Database | SQLite (via `better-sqlite3`) | Zero-config persistence; suitable for single-user v1 |
| Migrations | `knex` | Reproducible schema migrations; compatible with SQLite |
| Unit/integration testing | Vitest | Native ESM; fast; compatible with Vite projects |
| E2E testing | Playwright | Cross-browser; reliable selectors; trace/screenshot support |
| Accessibility audit | axe-core / `@axe-core/playwright` | Automated WCAG checking in tests |
| Containerisation | Docker + Docker Compose | Portable; single-command local setup |
| Static file serving | Caddy or `nginx` alpine | Lightweight; zero config for SPA routing |

---

## 3. Repository Structure (Target)

```
todo-bmad-app/
├── docs/
│   └── bmad/                  # BMAD specification artifacts
├── backend/
│   ├── src/
│   │   ├── routes/            # Express route handlers
│   │   ├── services/          # Business logic (CRUD)
│   │   ├── db/                # knex config, migrations
│   │   └── server.ts          # App entry point
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # TodoForm, TodoList, TodoItem, states
│   │   ├── hooks/             # useGetTodos, useMutateTodo
│   │   ├── api/               # fetch wrappers
│   │   └── main.tsx
│   ├── tests/
│   │   ├── unit/
│   │   └── e2e/               # Playwright tests
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

---

## 4. API Contract

### Base URL
`/api`

### Data Model

```typescript
type Todo = {
  id: string;          // UUID v4, server-generated
  description: string; // required, 1–500 characters
  completed: boolean;  // default: false
  createdAt: string;   // ISO 8601, server-generated
};
```

### Endpoints

#### `GET /api/todos`

Returns all todos, ordered by `createdAt` descending.

**Response 200**
```json
[
  {
    "id": "a1b2c3d4-...",
    "description": "Buy groceries",
    "completed": false,
    "createdAt": "2026-04-29T20:00:00.000Z"
  }
]
```

**Response 500** — Internal server error
```json
{ "error": "Internal server error" }
```

---

#### `POST /api/todos`

Creates a new todo.

**Request body**
```json
{ "description": "Buy groceries" }
```

**Response 201** — Created todo
```json
{
  "id": "a1b2c3d4-...",
  "description": "Buy groceries",
  "completed": false,
  "createdAt": "2026-04-29T20:00:00.000Z"
}
```

**Response 400** — Validation failure
```json
{ "error": "description is required and must be a non-empty string" }
```

---

#### `PUT /api/todos/:id`

Updates `description` and/or `completed` for an existing todo.

**Request body** (all fields optional, at least one required)
```json
{ "description": "Buy organic groceries", "completed": true }
```

**Response 200** — Updated todo (same shape as above)

**Response 400** — No valid fields provided  
**Response 404** — Todo not found  
**Response 500** — Internal server error

---

#### `DELETE /api/todos/:id`

Permanently removes a todo.

**Response 200**
```json
{ "ok": true }
```

**Response 404** — Todo not found  
**Response 500** — Internal server error

---

#### `GET /healthz`

Liveness probe for Docker and monitoring.

**Response 200**
```json
{ "ok": true }
```

---

## 5. Database Schema

```sql
CREATE TABLE IF NOT EXISTS todos (
  id          TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  completed   INTEGER NOT NULL DEFAULT 0,  -- 0 = false, 1 = true
  created_at  TEXT NOT NULL                -- ISO 8601 string
);
```

Managed via `knex` migrations under `backend/src/db/migrations/`.

---

## 6. Frontend Component Tree

```
App
└── TodoPage
    ├── TodoForm          (input + submit button)
    ├── LoadingState      (shown during initial fetch)
    ├── ErrorState        (shown on API error; includes Retry button)
    ├── EmptyState        (shown when todos array is empty)
    └── TodoList
        └── TodoItem[]    (checkbox, description, delete button)
```

### State Management

- **Server state** managed by TanStack Query (`useQuery`, `useMutation`).
- On mutation success, invalidate the `todos` query to trigger a refetch.
- Optimistic updates optional in v1; confirmed updates acceptable.

---

## 7. Docker Compose Topology

```yaml
services:
  backend:
    build: ./backend
    ports: ["3001:3001"]
    volumes:
      - db-data:/app/data
    environment:
      - DATABASE_PATH=/app/data/todos.db
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3001/healthz"]

  frontend:
    build: ./frontend
    ports: ["3000:80"]
    depends_on:
      backend:
        condition: service_healthy

volumes:
  db-data:
```

---

## 8. Security Considerations

| Risk | Mitigation |
|---|---|
| XSS via todo description | React escapes HTML by default; never use `dangerouslySetInnerHTML` |
| SQL injection | Use parameterised queries via `knex` / `better-sqlite3` bindings |
| Oversized input | Validate description length ≤ 500 chars at API layer |
| Container as root | Dockerfiles use non-root user (`USER node`) |
| CORS | Backend restricts `Access-Control-Allow-Origin` to frontend origin in production |

---

## 9. Key Design Decisions

| Decision | Chosen Option | Rationale |
|---|---|---|
| Database | SQLite | Zero-config; file-based persistence; sufficient for single-user v1 |
| ORM/query builder | knex | Lightweight; supports migrations; no need for full ORM overhead |
| State management | TanStack Query (no Redux) | Server state is the only complex state; Redux would be over-engineering |
| Testing framework | Vitest | Shares Vite config; faster than Jest for this stack |
| E2E | Playwright | More reliable than Cypress for headless CI; built-in trace viewer |
| API versioning | None in v1 | Single-version app; path prefix `/api` allows future versioning |
