# QA & Security Notes

## Test Coverage
- Backend: Vitest unit + Supertest integration (11 tests, targeting ≥70% line coverage)
- Frontend: Vitest + Testing Library (14 unit tests, targeting ≥70% line coverage)
- E2E: Playwright (5 scenarios covering all CRUD flows + persistence)

## Accessibility
- All interactive elements have ARIA labels
- Form inputs use `htmlFor`/`id` pairs
- Errors use `role="alert"` for screen readers
- Loading state uses `role="status"` with `aria-label`
- Delete/toggle buttons have descriptive `aria-label` attributes
- Keyboard navigation fully supported

## Security Notes
- Rate limiting: 300 requests per 15 minutes per IP (backend)
- CORS: Restricted to configured origin (default: http://localhost:5173)
- Input validation: description must be non-empty string (trim applied)
- SQLite parameterized queries used throughout (no SQL injection risk)
- No XSS risk: React's JSX escapes all user content by default
- No secrets committed; .env files excluded from git
- Multi-stage Docker builds reduce attack surface

## Running Coverage Reports
```bash
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```
