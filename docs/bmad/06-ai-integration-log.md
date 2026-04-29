# AI Integration Log: Todo Application (BMAD)

**Purpose:** Track how AI tools (GitHub Copilot, Copilot Chat, coding agents, etc.) assist during specification, development, and QA. Log prompts, outcomes, and any limitations observed. This log is a living document — all contributors (PM, Dev, QA, DevOps) should append entries as they work.

---

## How to Add an Entry

Copy and complete one row in the relevant section table below:

| Date | Role | Activity | Tool / Agent | Prompt or Action | Outcome | Limitations / Notes |
|---|---|---|---|---|---|---|
| YYYY-MM-DD | PM / Dev / QA / DevOps | Short description | Copilot Chat / Agent / etc. | The prompt or action you used | What was produced / happened | Any gaps, corrections needed, or things AI got wrong |

---

## Phase 1 — Specification

| Date | Role | Activity | Tool / Agent | Prompt or Action | Outcome | Limitations / Notes |
|---|---|---|---|---|---|---|
| 2026-04-29 | PM | Generate project brief | Copilot Agent | "Generate BMAD specification artifacts for a minimal Todo app including project brief, PRD, architecture, stories, test strategy, and AI log" | Created all 6 docs in `docs/bmad/` | Required multiple retries due to empty-repo bootstrap issue; agent succeeded once README was in place |

---

## Phase 2 — Backend Implementation

| Date | Role | Activity | Tool / Agent | Prompt or Action | Outcome | Limitations / Notes |
|---|---|---|---|---|---|---|
| _Pending_ | Dev | — | — | — | — | — |

**Suggested prompts for this phase:**

- "Scaffold an Express 4 + TypeScript project with `better-sqlite3` and `knex` migrations for the Todo data model."
- "Generate unit tests using Vitest for the `TodoService.createTodo` function, mocking the database layer."
- "Write a Supertest integration test suite covering all acceptance criteria in stories B-1 through B-5."

---

## Phase 3 — Frontend Implementation

| Date | Role | Activity | Tool / Agent | Prompt or Action | Outcome | Limitations / Notes |
|---|---|---|---|---|---|---|
| _Pending_ | Dev | — | — | — | — | — |

**Suggested prompts for this phase:**

- "Create a React + TypeScript + Tailwind `TodoForm` component that calls `POST /api/todos` and shows a validation error for empty input."
- "Generate a `TodoItem` component with a checkbox for `completed` and a delete button, following the data model in `03-architecture.md`."
- "Write React Testing Library unit tests for `TodoForm`, covering empty-submit validation and successful submission."

---

## Phase 4 — E2E & Accessibility Testing

| Date | Role | Activity | Tool / Agent | Prompt or Action | Outcome | Limitations / Notes |
|---|---|---|---|---|---|---|
| _Pending_ | QA | — | — | — | — | — |

**Suggested prompts for this phase:**

- "Write Playwright tests for E2E scenarios E2E-1 through E2E-11 listed in `05-test-strategy.md`."
- "Add `@axe-core/playwright` accessibility checks to the existing E2E test suite and fail the test if critical violations are found."
- "Generate a Playwright test that verifies todo persistence after a full page reload."

---

## Phase 5 — DevOps & Containerisation

| Date | Role | Activity | Tool / Agent | Prompt or Action | Outcome | Limitations / Notes |
|---|---|---|---|---|---|---|
| _Pending_ | DevOps | — | — | — | — | — |

**Suggested prompts for this phase:**

- "Write a multi-stage Dockerfile for the Express + TypeScript backend that runs as a non-root user and includes a HEALTHCHECK instruction."
- "Write a multi-stage Dockerfile for the Vite + React frontend that serves the built output via Caddy or nginx-alpine."
- "Write a `docker-compose.yml` that wires backend and frontend together, mounts a named volume for the SQLite DB, and passes `DATABASE_PATH` via environment variable."

---

## Known AI Limitations Observed

| Limitation | Context | Workaround |
|---|---|---|
| Agent requires a non-empty default branch to open a PR | Bootstrap issue on empty repo | Commit a README first before triggering the agent |
| Generated code may not include all edge-case validations | Backend service generation | Always cross-reference with acceptance criteria in `04-stories.md` |
| Playwright selectors may need tuning | E2E test generation | Review generated selectors against actual DOM; use `data-testid` attributes |
| axe-core may not catch all WCAG violations | Accessibility testing | Supplement with manual keyboard + screen reader testing |

---

## Useful References

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [BMAD Methodology](https://github.com/bmadcode/BMAD-METHOD)
- [Playwright Docs](https://playwright.dev)
- [axe-core Rules](https://dequeuniversity.com/rules/axe)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
