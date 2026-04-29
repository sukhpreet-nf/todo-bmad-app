# Project Overview

## What it does

A minimal **Todo application** that lets a single user create, list, complete, and delete tasks. The UI is a single-page React app; the backend exposes a small REST API backed by an embedded SQLite database. Everything runs locally via `docker compose up` or split `npm run dev` processes.

## Why it exists

A reference / teaching project for the **BMAD-METHOD** AI-driven development workflow. Each phase (brief → PRD → architecture → stories → tests → QA) has a corresponding artifact under `docs/bmad/`, demonstrating the full agentic SDLC on a small, real codebase.

## Users & use cases

- **Primary user:** developer using the app to track personal tasks (no auth, no multi-user).
- **Secondary user:** AI agents and learners studying BMAD workflow outputs side-by-side with working code.

## Functional scope (as built)

| Feature | Status | Notes |
|---------|--------|-------|
| Create todo | ✅ | `POST /api/todos`, non-empty description required |
| List todos | ✅ | `GET /api/todos`, ordered by `created_at ASC` |
| Toggle complete | ✅ | `PUT /api/todos/:id` with `completed` boolean |
| Edit description | ✅ | `PUT /api/todos/:id` with `description` string |
| Delete todo | ✅ | `DELETE /api/todos/:id` |
| Persistence | ✅ | better-sqlite3, file mounted at `/app/data/todos.db` |
| Health check | ✅ | `GET /healthz` returns `{ ok, timestamp }` |
| Rate limiting | ✅ | 300 req / 15 min on `/api/todos` |
| CORS | ✅ | Origin allowlist via `CORS_ORIGIN` env |
| Multi-user / auth | ❌ | Out of scope per PRD |
| Due dates / tags / priority | ❌ | Out of scope per PRD |

## Non-functional posture

- **Security:** CORS allowlist, JSON-only input, parameterized SQL via better-sqlite3 prepared statements, rate limiter, no secrets in repo.
- **Reliability:** Stateless API; SQLite WAL mode; healthcheck + `restart: unless-stopped` in compose.
- **Testability:** Backend unit + integration (Vitest/Supertest), frontend unit (RTL/Vitest), e2e (Playwright). Coverage threshold 70% configured in both.
- **Operability:** Single command bring-up; volume-backed data; Nginx serves built SPA in production container.
