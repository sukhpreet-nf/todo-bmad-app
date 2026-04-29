# Development Guide

## Prerequisites

- **Node.js ≥ 20** (current dev machine: v22.21.0 via nvm)
- **npm ≥ 10**
- (Optional) **Docker Desktop** for the one-command stack
- macOS / Linux. On macOS, ensure Xcode CLT is installed so `better-sqlite3` can build.

## One-time setup

```bash
# from repo root
( cd backend  && npm install )
( cd frontend && npm install )
```

If `node` is not on `PATH` (nvm-only setup), prefix commands with:
```bash
export PATH="$HOME/.nvm/versions/node/v22.21.0/bin:$PATH"
```

## Running locally — split terminals (recommended for dev)

```bash
# Terminal 1 — backend
cd backend
PORT=3001 \
CORS_ORIGIN=http://localhost:5173 \
DB_PATH=./data/todos.db \
npm run dev
# → "Backend listening on port 3001"

# Terminal 2 — frontend
cd frontend
npm run dev
# → http://localhost:5173/
```

Vite proxies `/api/*` and `/healthz` to the backend, so the SPA "just works" with same-origin requests.

## Running locally — Docker (parity with prod)

```bash
docker compose up --build
# Frontend (Nginx)  → http://localhost/
# Backend (direct)  → http://localhost:3001/healthz
```

Stop with `Ctrl-C` then `docker compose down` (add `-v` to wipe the SQLite volume).

## Tests

```bash
# backend: unit + integration
( cd backend && npm test )
( cd backend && npm run test:coverage )

# frontend: component unit
( cd frontend && npm test )

# frontend: end-to-end (requires backend + frontend dev servers running)
( cd frontend && npm run test:e2e )
```

Coverage thresholds (70% lines/branches/functions/statements) are enforced in both Vitest configs and will fail CI if regressed.

## Useful one-liners

```bash
# Health check
curl -s http://localhost:3001/healthz

# Create a todo
curl -s -X POST http://localhost:3001/api/todos \
  -H 'Content-Type: application/json' \
  -d '{"description":"Try BMAD"}'

# List todos
curl -s http://localhost:3001/api/todos | jq

# Stop anything bound to dev ports
lsof -ti:3001,5173 | xargs kill
```

## BMAD workflow shortcuts

| Goal | Skill |
|------|-------|
| Where am I in the workflow? | `bmad-help` |
| Re-scan the project after big changes | `bmad-document-project` (rerun) |
| Split PRD/architecture into per-epic shards | `bmad-shard-doc` |
| Draft the next story | `bmad-create-story` |
| Implement a story | `bmad-dev-story` |
| Code review pass | `bmad-code-review` |
| Generate E2E tests | `bmad-qa-generate-e2e-tests` |

In Copilot Chat, just say e.g. *"Run `bmad-create-story`"* and the agent will read `.agents/skills/bmad-create-story/SKILL.md` and follow it.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| `EADDRINUSE :3001` | old dev server still running | `lsof -ti:3001 | xargs kill` |
| Frontend gets `Network error` | backend not running, or `CORS_ORIGIN` misconfigured | start backend; ensure `CORS_ORIGIN=http://localhost:5173` for dev |
| `better-sqlite3` install fails | missing native build toolchain | `xcode-select --install` (macOS) and reinstall |
| Empty list always returned | new `:memory:` DB per restart in tests; or volume not mounted in Docker | confirm `DB_PATH` and `volumes:` in compose |
| Playwright "browser not found" | first-time install | `npx playwright install` inside `frontend/` |
