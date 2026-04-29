# Development Stories

## Sprint 1: Foundation

### Story 1.1: Project Setup
Set up monorepo structure with backend and frontend directories, configure TypeScript, and establish development tooling.

**Tasks:**
- [x] Initialize backend with Express + TypeScript
- [x] Initialize frontend with Vite + React + TypeScript
- [x] Configure Tailwind CSS
- [x] Set up Vitest for both packages
- [x] Configure Docker + docker-compose

### Story 1.2: Backend API
Implement the REST API for todo CRUD operations.

**Tasks:**
- [x] SQLite database module with schema
- [x] GET /api/todos endpoint
- [x] POST /api/todos endpoint with validation
- [x] PUT /api/todos/:id endpoint
- [x] DELETE /api/todos/:id endpoint
- [x] GET /healthz endpoint

### Story 1.3: Frontend UI
Implement the React frontend with full CRUD functionality.

**Tasks:**
- [x] TodoForm component with validation
- [x] TodoItem component with toggle/delete
- [x] TodoList component with sections
- [x] App component with state management
- [x] API client functions

## Sprint 2: Quality

### Story 2.1: Backend Tests
Write comprehensive tests for the backend.

**Tasks:**
- [x] Unit tests for DB module
- [x] Integration tests for all API endpoints
- [x] Coverage ≥ 70%

### Story 2.2: Frontend Tests
Write comprehensive tests for frontend components.

**Tasks:**
- [x] TodoForm unit tests
- [x] TodoItem unit tests
- [x] TodoList unit tests
- [x] E2E tests with Playwright

### Story 2.3: Docker Deployment
Containerize the application for production deployment.

**Tasks:**
- [x] Backend multi-stage Dockerfile
- [x] Frontend multi-stage Dockerfile with nginx
- [x] docker-compose.yml with healthchecks
- [x] nginx.conf for SPA routing + API proxy
