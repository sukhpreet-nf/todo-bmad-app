# Test Strategy

## Overview

The test suite covers four levels: unit, integration, end-to-end, and accessibility.

## Backend Testing

### Unit Tests (`backend/tests/unit/`)
- **Framework**: Vitest
- **Target**: Individual functions, database operations
- **DB**: In-memory SQLite (`:memory:`)
- **Coverage target**: ≥ 70% lines/branches/functions

### Integration Tests (`backend/tests/integration/`)
- **Framework**: Vitest + Supertest
- **Target**: Full HTTP request/response cycle
- **DB**: In-memory SQLite, reset between tests
- **Covers**: All endpoints, error cases, edge cases

## Frontend Testing

### Component Tests (`frontend/tests/unit/`)
- **Framework**: Vitest + Testing Library
- **Environment**: jsdom
- **Target**: Individual React components
- **Covers**: Rendering, user interactions, error states

### E2E Tests (`frontend/tests/e2e/`)
- **Framework**: Playwright
- **Browser**: Chromium (Chrome)
- **Requires**: Running backend + frontend
- **Covers**: Full user workflows

## Accessibility Testing

- **Library**: axe-core (available for integration into component tests)
- **Standard**: WCAG 2.1 AA
- **Manual checks**: Keyboard navigation, screen reader announcements

## Coverage Thresholds

| Package | Lines | Branches | Functions | Statements |
|---------|-------|----------|-----------|------------|
| Backend | 70% | 70% | 70% | 70% |
| Frontend | 70% | 70% | 70% | 70% |

## Running Tests

```bash
# Backend
cd backend && npm test

# Frontend unit
cd frontend && npm test

# Frontend E2E (requires running servers)
cd frontend && npm run test:e2e

# Coverage
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```
