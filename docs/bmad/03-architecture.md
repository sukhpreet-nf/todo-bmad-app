# Architecture Document

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  React 18 + Vite + TypeScript + Tailwind CSS       │
│  Port: 5173 (dev) / 80 (prod)                      │
└────────────────────┬────────────────────────────────┘
                     │ HTTP / REST
┌────────────────────▼────────────────────────────────┐
│                   Backend                           │
│  Node.js + Express + TypeScript                     │
│  Port: 3001                                         │
└────────────────────┬────────────────────────────────┘
                     │ better-sqlite3
┌────────────────────▼────────────────────────────────┐
│                   SQLite DB                         │
│  File: /app/data/todos.db                           │
└─────────────────────────────────────────────────────┘
```

## Technology Choices

### Backend
- **Node.js + Express**: Lightweight, well-understood HTTP server
- **TypeScript**: Type safety, better DX
- **better-sqlite3**: Synchronous SQLite driver, simple setup, no external DB needed
- **uuid**: RFC-compliant UUID generation
- **cors**: Cross-origin resource sharing middleware

### Frontend
- **React 18**: Industry-standard UI library
- **Vite**: Fast bundler with HMR
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling, responsive by default

### Testing
- **Vitest**: Fast, Vite-native test runner
- **Testing Library**: Component testing best practices
- **Supertest**: HTTP integration testing
- **Playwright**: Browser E2E automation
- **axe-core**: Accessibility testing

### Deployment
- **Docker**: Multi-stage builds for minimal images
- **nginx**: Static file serving + reverse proxy for frontend
- **docker-compose**: Local orchestration

## Directory Structure

```
todo-bmad-app/
├── backend/          # Express API server
│   ├── src/
│   │   ├── db.ts     # SQLite connection + schema
│   │   ├── todos.ts  # REST router
│   │   └── server.ts # App entry point
│   └── tests/
├── frontend/         # React SPA
│   ├── src/
│   │   ├── api/      # API client functions
│   │   ├── components/
│   │   └── App.tsx
│   └── tests/
├── docs/bmad/        # BMAD documentation
└── docker-compose.yml
```

## Security Considerations

- CORS restricted to configured origin in production
- No secrets in source code
- Non-root user in Docker containers
- Input validation on all API endpoints
