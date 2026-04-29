# User Stories & Acceptance Criteria

**Persona:** Scrum Master (SM)  
**Status:** Ready for Sprint Planning

---

## Epic 1 — Core Todo CRUD (Backend)

### Story B-1: Create a Todo (API)

> **As a** frontend developer,  
> **I want** a `POST /api/todos` endpoint,  
> **so that** I can persist a new todo with a description.

**Acceptance Criteria**

- [ ] Returns `201` and the created todo object (`id`, `description`, `completed: false`, `createdAt`) when a valid description is provided.
- [ ] Returns `400` with a descriptive error message when `description` is missing or empty.
- [ ] Returns `400` when `description` exceeds 500 characters.
- [ ] `id` is a UUID generated server-side; `createdAt` is a server-side ISO 8601 timestamp.
- [ ] Persists the todo in the database (verified by a subsequent `GET /api/todos`).

---

### Story B-2: List All Todos (API)

> **As a** frontend developer,  
> **I want** a `GET /api/todos` endpoint,  
> **so that** I can display all existing todos to the user.

**Acceptance Criteria**

- [ ] Returns `200` and an array of all todos, ordered by `createdAt` descending.
- [ ] Returns an empty array `[]` (not `null` or an error) when no todos exist.
- [ ] Each todo in the array includes `id`, `description`, `completed`, and `createdAt`.

---

### Story B-3: Update a Todo (API)

> **As a** frontend developer,  
> **I want** a `PUT /api/todos/:id` endpoint,  
> **so that** I can toggle a todo's completion status or edit its description.

**Acceptance Criteria**

- [ ] Returns `200` and the updated todo when `description` or `completed` (or both) are provided in the request body.
- [ ] Returns `400` when the request body contains no recognised updatable fields.
- [ ] Returns `404` when the given `id` does not exist.
- [ ] Partial updates are supported: sending only `completed` does not clear `description`.

---

### Story B-4: Delete a Todo (API)

> **As a** frontend developer,  
> **I want** a `DELETE /api/todos/:id` endpoint,  
> **so that** I can permanently remove a todo.

**Acceptance Criteria**

- [ ] Returns `200` and `{ "ok": true }` when a todo is successfully deleted.
- [ ] Returns `404` when the given `id` does not exist.
- [ ] The deleted todo no longer appears in subsequent `GET /api/todos` responses.

---

### Story B-5: Health Check (API)

> **As a** DevOps engineer,  
> **I want** a `GET /healthz` endpoint,  
> **so that** Docker and monitoring tools can verify the backend is running.

**Acceptance Criteria**

- [ ] Returns `200` and `{ "ok": true }` at all times the server is running.
- [ ] Does not require any authentication or request body.

---

## Epic 2 — Core Todo CRUD (Frontend)

### Story F-1: Add a Todo (UI)

> **As a** user,  
> **I want** a text input and submit button,  
> **so that** I can add a new todo to my list.

**Acceptance Criteria**

- [ ] A text input and a submit button (or Enter key) are visible on the page.
- [ ] Submitting a non-empty description calls `POST /api/todos` and adds the new todo to the list without a full page reload.
- [ ] The text input clears after a successful submission.
- [ ] Submitting an empty input shows a validation message and does not call the API.
- [ ] While the API call is in-flight, the submit button is disabled to prevent double-submission.
- [ ] On API error, an error message is shown and the input value is preserved.

---

### Story F-2: View All Todos (UI)

> **As a** user,  
> **I want** to see my todos when I open the app,  
> **so that** I can review what needs to be done.

**Acceptance Criteria**

- [ ] On initial load, the app fetches and displays all todos.
- [ ] A loading indicator (spinner or skeleton) is shown while the request is in-flight.
- [ ] When the list is empty, a friendly empty-state message is displayed.
- [ ] When the API fails, an error message with a "Retry" button is displayed.
- [ ] Incomplete todos are visually distinct from completed todos (e.g., completed items are greyed out / struck through).

---

### Story F-3: Complete / Uncomplete a Todo (UI)

> **As a** user,  
> **I want** to mark a todo as done or revert it,  
> **so that** I can track my progress.

**Acceptance Criteria**

- [ ] Each todo item has a checkbox (or equivalent toggle).
- [ ] Checking the checkbox calls `PUT /api/todos/:id` with `completed: true`; the visual state updates immediately.
- [ ] Unchecking calls `PUT /api/todos/:id` with `completed: false`; the visual state reverts.
- [ ] Completed todos display a visual completion indicator (strikethrough text or similar).
- [ ] State persists: refreshing the browser shows the same completion state.

---

### Story F-4: Delete a Todo (UI)

> **As a** user,  
> **I want** to delete a todo I no longer need,  
> **so that** my list stays relevant.

**Acceptance Criteria**

- [ ] Each todo item has a delete button (icon or label).
- [ ] Clicking the delete button calls `DELETE /api/todos/:id` and removes the item from the list without a page reload.
- [ ] If the list becomes empty after deletion, the empty-state message is shown.
- [ ] On API error, an error message is shown and the todo remains in the list.

---

### Story F-5: Responsive Layout (UI)

> **As a** mobile user,  
> **I want** the app to work on my phone,  
> **so that** I can manage todos on the go.

**Acceptance Criteria**

- [ ] App renders correctly at 375 px viewport width (no horizontal overflow).
- [ ] All touch targets (buttons, checkboxes) meet the 44 × 44 px minimum size recommendation.
- [ ] Text is legible at default browser font size on mobile.

---

## Epic 3 — Accessibility

### Story A-1: Keyboard Navigation & Screen Reader Support

> **As a** user relying on keyboard or assistive technology,  
> **I want** full keyboard access and screen reader announcements,  
> **so that** I can use the app without a mouse.

**Acceptance Criteria**

- [ ] All interactive elements (input, buttons, checkboxes) are reachable via `Tab` / `Shift+Tab`.
- [ ] Focus order is logical (top → bottom of the page).
- [ ] Adding, completing, and deleting todos is fully operable by keyboard alone.
- [ ] All form controls have associated `<label>` elements or `aria-label` attributes.
- [ ] Dynamic list updates are announced to screen readers (via `aria-live` region or equivalent).
- [ ] Automated `axe-core` audit reports zero critical or serious violations.

---

## Epic 4 — Deployment

### Story D-1: Dockerised Local Development

> **As a** developer or DevOps engineer,  
> **I want** to start the app with `docker-compose up`,  
> **so that** there is no manual environment setup required.

**Acceptance Criteria**

- [ ] `docker-compose up` starts both the backend and frontend services without errors.
- [ ] The frontend is reachable at `http://localhost:3000`.
- [ ] The backend health check responds at `http://localhost:3001/healthz`.
- [ ] Todo data is stored in a named Docker volume and persists across `docker-compose down` / `up` cycles.
- [ ] Environment variables (e.g., `DATABASE_PATH`) are configurable via `.env`.

---

## Story Map Summary

| ID | Story | Epic | Priority |
|---|---|---|---|
| B-1 | Create Todo (API) | Backend CRUD | Must |
| B-2 | List Todos (API) | Backend CRUD | Must |
| B-3 | Update Todo (API) | Backend CRUD | Must |
| B-4 | Delete Todo (API) | Backend CRUD | Must |
| B-5 | Health Check (API) | Backend CRUD | Must |
| F-1 | Add Todo (UI) | Frontend CRUD | Must |
| F-2 | View Todos (UI) | Frontend CRUD | Must |
| F-3 | Complete Todo (UI) | Frontend CRUD | Must |
| F-4 | Delete Todo (UI) | Frontend CRUD | Must |
| F-5 | Responsive Layout | Frontend UX | Should |
| A-1 | Accessibility | Accessibility | Should |
| D-1 | Docker Compose | Deployment | Must |
