# Refined PRD: Todo Application (BMAD)

**Persona:** Product Manager (PM)  
**Version:** 1.0  
**Status:** Ready for Engineering Handoff

---

## 1. Product Goal

Provide a no-nonsense, single-user Todo manager that enables anyone to:

- Add a task (todo) with a text description.
- View all incomplete and completed todos in a single list.
- Mark any todo as complete or revert it to incomplete.
- Delete any todo permanently.

---

## 2. In-Scope Features

### 2.1 Todo Management

| Feature | Details |
|---|---|
| Add todo | User types a description and submits. Empty descriptions are rejected with a visible validation message. |
| List todos | All todos display in a single view. Incomplete todos appear before completed ones. |
| Complete / uncomplete | Checkbox or toggle marks a todo done; visual difference (e.g., strikethrough) is applied immediately. |
| Delete todo | Removes the todo from the list and the database immediately. |
| Persist on reload | All todos and their states survive a full browser refresh and server restart. |

### 2.2 UI States

| State | Expected Behaviour |
|---|---|
| Loading | Spinner or skeleton shown while fetching data |
| Empty list | Friendly empty-state message with a prompt to add the first todo |
| Error (API failure) | User-visible error message with a retry option |
| Success feedback | Immediate optimistic or confirmed update in the list |

### 2.3 Non-Functional Requirements

| Requirement | Detail |
|---|---|
| Performance | No full-page reloads required for any user action |
| Responsiveness | Mobile-first layout; usable on screens ≥ 320 px wide |
| Accessibility | WCAG 2.1 AA minimum; keyboard-navigable; screen-reader friendly |
| Security | Inputs sanitised against XSS; no raw SQL string concatenation |
| Test coverage | ≥ 70% lines/branches for critical business logic |
| Containerisation | Runs with `docker-compose up`; data persists in a named volume |

---

## 3. Out-of-Scope (v1)

- User accounts, registration, or login
- Sharing, collaboration, or multi-user isolation
- Deadlines, reminders, recurring tasks, or notifications
- Priorities, tags, labels, or categories
- Search, sort controls, or advanced filtering
- Analytics, reports, or productivity metrics

---

## 4. Data Model

```
Todo {
  id          : string   // UUID, server-generated
  description : string   // required, non-empty, user-provided
  completed   : boolean  // default false
  createdAt   : string   // ISO 8601 timestamp, server-generated
}
```

---

## 5. API Summary

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/todos` | Fetch all todos |
| `POST` | `/api/todos` | Create a new todo |
| `PUT` | `/api/todos/:id` | Update description and/or completed status |
| `DELETE` | `/api/todos/:id` | Delete a todo |
| `GET` | `/healthz` | Health check for monitoring/Docker |

---

## 6. Acceptance Criteria (Top-Level)

- [ ] User can add a todo; it appears in the list without a page reload.
- [ ] User cannot submit an empty description; validation message is shown.
- [ ] User can mark a todo complete; visual state updates immediately.
- [ ] User can unmark a completed todo back to incomplete.
- [ ] User can delete any todo; it disappears from the list immediately.
- [ ] All todos persist after refreshing the browser.
- [ ] All todos persist after restarting the backend server (data in DB).
- [ ] App shows a loading indicator while data is being fetched.
- [ ] App shows an error state with a retry action when the API fails.
- [ ] App shows an empty-state message when no todos exist.
- [ ] App is usable on a 375 px wide mobile viewport.
- [ ] App passes automated accessibility audit (zero critical violations).
- [ ] `docker-compose up` starts all services; app is reachable in a browser.

---

## 7. Extensibility Notes

The following patterns should be considered during implementation to allow for clean future additions without re-architecting:

- Route and data-model structure ready to accept a `userId` field for future multi-user support.
- Modular frontend components designed to accept additional metadata (e.g., due date, priority) as optional props.
- Backend service layer separated from route handlers for easy unit testing and future middleware injection.
