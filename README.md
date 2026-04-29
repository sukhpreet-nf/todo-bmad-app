# Todo App

A full-stack Todo application built with Node.js/Express/TypeScript (backend) and React/Vite/TypeScript/Tailwind (frontend), using SQLite for persistence. Built following the BMAD methodology.

## Quick Start

### Prerequisites
- Node.js 20+
- npm 9+

### Development

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev         # http://localhost:3001

# Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

### Docker (Production)

```bash
cp .env.example .env
docker compose up --build
# Frontend: http://localhost:80
# Backend:  http://localhost:3001
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/todos | List all todos |
| POST | /api/todos | Create a todo |
| PUT | /api/todos/:id | Update a todo |
| DELETE | /api/todos/:id | Delete a todo |
| GET | /healthz | Health check |

### Example

```bash
# Create a todo
curl -X POST http://localhost:3001/api/todos \
  -H "Content-Type: application/json" \
  -d '{"description": "Buy milk"}'

# List todos
curl http://localhost:3001/api/todos

# Toggle complete
curl -X PUT http://localhost:3001/api/todos/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete
curl -X DELETE http://localhost:3001/api/todos/<id>
```

## Testing

```bash
# Backend tests
cd backend && npm test

# Backend coverage
cd backend && npm run test:coverage

# Frontend unit tests
cd frontend && npm test

# Frontend coverage
cd frontend && npm run test:coverage

# E2E tests (requires running dev servers)
cd frontend && npm run test:e2e
```

## Project Structure

```
todo-bmad-app/
├── backend/
│   ├── src/
│   │   ├── db.ts          # SQLite connection
│   │   ├── todos.ts       # REST router
│   │   └── server.ts      # Express app
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── App.tsx
│   │   └── types.ts
│   ├── tests/
│   │   ├── unit/
│   │   └── e2e/
│   └── Dockerfile
├── docs/bmad/             # BMAD documentation
├── docker-compose.yml
└── .env.example
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express, TypeScript, SQLite |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Tests | Vitest, Testing Library, Supertest, Playwright |
| Deploy | Docker, nginx, docker-compose |

## Environment Variables

### Backend (`.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | HTTP port |
| DB_PATH | ./data/todos.db | SQLite file path |
| CORS_ORIGIN | * | Allowed origin |
| NODE_ENV | development | Environment |

### Frontend (`.env`)
| Variable | Default | Description |
|----------|---------|-------------|
| VITE_API_URL | /api | Backend API base URL |