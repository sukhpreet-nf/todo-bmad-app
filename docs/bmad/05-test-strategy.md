# Test Strategy: Todo Application (BMAD)

**Persona:** QA Engineer  
**Status:** Ready for Implementation

---

## 1. Objectives

- Verify that all acceptance criteria in `04-stories.md` are met before release.
- Achieve ≥ 70% line and branch coverage for critical backend and frontend logic.
- Ensure zero critical or serious accessibility violations.
- Confirm Docker-based deployment works end-to-end.

---

## 2. Test Levels

### 2.1 Unit Tests

**Scope:** Individual functions, modules, and components in isolation.  
**Tools:** Vitest (backend & frontend), React Testing Library (frontend components)

#### Backend Unit Tests

| Test Case | Target | Notes |
|---|---|---|
| `createTodo` — valid input returns shaped object | `services/todo.service.ts` | Mock DB |
| `createTodo` — empty description throws validation error | `services/todo.service.ts` | Mock DB |
| `createTodo` — description > 500 chars throws validation error | `services/todo.service.ts` | Mock DB |
| `listTodos` — returns array sorted by `createdAt` desc | `services/todo.service.ts` | Mock DB |
| `listTodos` — returns empty array when no todos exist | `services/todo.service.ts` | Mock DB |
| `updateTodo` — partial update preserves other fields | `services/todo.service.ts` | Mock DB |
| `updateTodo` — throws 404 when id not found | `services/todo.service.ts` | Mock DB |
| `deleteTodo` — throws 404 when id not found | `services/todo.service.ts` | Mock DB |

#### Frontend Unit Tests

| Test Case | Target | Notes |
|---|---|---|
| `TodoForm` renders input and submit button | `components/TodoForm.tsx` | RTL render |
| `TodoForm` disables submit when input is empty | `components/TodoForm.tsx` | RTL user-event |
| `TodoForm` shows validation message on empty submit attempt | `components/TodoForm.tsx` | RTL user-event |
| `TodoItem` renders description text | `components/TodoItem.tsx` | RTL render |
| `TodoItem` renders checkbox checked when `completed: true` | `components/TodoItem.tsx` | RTL render |
| `TodoItem` calls `onToggle` when checkbox clicked | `components/TodoItem.tsx` | RTL user-event |
| `TodoItem` calls `onDelete` when delete button clicked | `components/TodoItem.tsx` | RTL user-event |
| `TodoList` renders the correct number of `TodoItem` components | `components/TodoList.tsx` | RTL render |
| `EmptyState` renders empty-state message when todos is `[]` | `components/EmptyState.tsx` | RTL render |
| `ErrorState` renders error message and Retry button | `components/ErrorState.tsx` | RTL render |

---

### 2.2 Integration Tests

**Scope:** HTTP layer end-to-end through the full Express stack with a real (in-memory or temp-file) SQLite DB.  
**Tools:** Vitest + Supertest

#### Backend Integration Tests

| Story | Test Case | Expected Outcome |
|---|---|---|
| B-1 | `POST /api/todos` with valid description | `201` + todo object |
| B-1 | `POST /api/todos` with empty description | `400` + error message |
| B-1 | `POST /api/todos` with description > 500 chars | `400` + error message |
| B-1 | `POST /api/todos` with missing body | `400` + error message |
| B-2 | `GET /api/todos` when DB is empty | `200` + `[]` |
| B-2 | `GET /api/todos` after creating two todos | `200` + array of 2 |
| B-3 | `PUT /api/todos/:id` toggle `completed` to `true` | `200` + updated todo |
| B-3 | `PUT /api/todos/:id` update `description` | `200` + updated todo |
| B-3 | `PUT /api/todos/:id` with unknown id | `404` |
| B-3 | `PUT /api/todos/:id` with empty body | `400` |
| B-4 | `DELETE /api/todos/:id` with valid id | `200` + `{ ok: true }` |
| B-4 | `DELETE /api/todos/:id` with unknown id | `404` |
| B-5 | `GET /healthz` | `200` + `{ ok: true }` |

---

### 2.3 End-to-End (E2E) Tests

**Scope:** Full browser flow against a running stack (backend + frontend).  
**Tools:** Playwright  
**Browsers:** Chromium (primary); Firefox and WebKit in CI

#### E2E Test Scenarios

| ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| E2E-1 | Add a todo | Open app → type description → submit | Todo appears in list; input clears |
| E2E-2 | Add todo — empty input blocked | Open app → click submit without typing | Validation message shown; no todo added |
| E2E-3 | Add multiple todos | Add two todos in sequence | Both appear in the list |
| E2E-4 | Complete a todo | Add todo → check its checkbox | Todo shows completion style (strikethrough); checkbox checked |
| E2E-5 | Uncomplete a todo | Complete a todo → uncheck its checkbox | Todo reverts to incomplete style |
| E2E-6 | Delete a todo | Add todo → click delete button | Todo removed from list |
| E2E-7 | Delete last todo shows empty state | Have one todo → delete it | Empty-state message displayed |
| E2E-8 | Persistence across reload | Add + complete a todo → reload page | Same todo exists with same completion state |
| E2E-9 | Empty state on first load | Empty DB → open app | Empty-state message displayed |
| E2E-10 | Responsive — mobile viewport | Resize to 375 px → use app | No overflow; all controls usable |
| E2E-11 | Keyboard navigation | Tab through all controls; operate without mouse | All actions completable by keyboard |

---

### 2.4 Accessibility Tests

**Tools:** `@axe-core/playwright` integrated into E2E tests; Lighthouse CLI in CI

| Check | Method | Pass Criteria |
|---|---|---|
| No critical/serious axe violations | `@axe-core/playwright` on all page states | 0 critical or serious findings |
| Colour contrast ≥ 4.5:1 (normal text) | Lighthouse accessibility audit | Score ≥ 90 |
| All interactive elements focusable | Keyboard walkthrough in E2E-11 | No inaccessible elements |
| Form labels present | axe `label` rule | No violations |
| Live region for list updates | Manual + screen reader check | Updates announced |

---

## 3. Coverage Targets

| Area | Tool | Target |
|---|---|---|
| Backend service + route logic | `vitest --coverage` | ≥ 70% lines & branches |
| Frontend component logic | `vitest --coverage` (with RTL) | ≥ 70% lines & branches |
| E2E happy paths | Playwright test count | All scenarios in §2.3 passing |

---

## 4. CI Pipeline Integration

```
PR Opened / Push to branch
    │
    ├─ Backend unit + integration tests (Vitest + Supertest)
    │       └─ Fail build if any test fails or coverage < 70%
    │
    ├─ Frontend unit tests (Vitest + RTL)
    │       └─ Fail build if any test fails or coverage < 70%
    │
    ├─ E2E tests (Playwright, headless Chromium)
    │       └─ Fail build if any scenario fails
    │
    └─ Accessibility audit (axe-core in E2E run)
            └─ Fail build if critical/serious violations found
```

---

## 5. Test Data & Environment

- Backend integration tests use an **in-memory or temp-file SQLite DB** (created fresh for each test file / suite).
- E2E tests start against the **Docker Compose stack** or a locally-started dev server; DB is reset between runs via a test-only `DELETE /api/todos` endpoint or direct DB file deletion.
- No production data is used in tests.

---

## 6. Out-of-Scope for v1 Testing

- Performance / load testing
- Security penetration testing
- Multi-browser matrix beyond Chromium, Firefox, WebKit
- Visual regression testing
