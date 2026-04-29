# Product Requirements Document (Refined)

## Product Vision

A lightweight, full-stack Todo application that serves as a reference implementation for modern web development with BMAD methodology.

## User Stories

### US-001: Add a Todo
**As a** user, **I want to** add a new todo item **so that** I can track tasks I need to complete.

**Acceptance Criteria:**
- Input field accepts text description
- Submit via button or Enter key
- Empty submissions are rejected with error message
- New todo appears immediately in the list

### US-002: View Todos
**As a** user, **I want to** see all my todos **so that** I know what needs to be done.

**Acceptance Criteria:**
- Active todos shown in "Active" section
- Completed todos shown in "Completed" section
- Empty state shown when no todos exist

### US-003: Complete a Todo
**As a** user, **I want to** mark a todo as complete **so that** I can track my progress.

**Acceptance Criteria:**
- Checkbox toggles completion status
- Completed todos show strikethrough text
- Status is persisted on the backend

### US-004: Delete a Todo
**As a** user, **I want to** delete a todo **so that** I can remove tasks I no longer need.

**Acceptance Criteria:**
- Delete button removes todo from the list
- Deletion is permanent

### US-005: Persist Todos
**As a** user, **I want** my todos to persist across sessions **so that** I don't lose my task list.

**Acceptance Criteria:**
- Todos survive page reloads
- Data stored in SQLite database

## Data Model

```typescript
type Todo = {
  id: string;          // UUID v4
  description: string; // required, non-empty, trimmed
  completed: boolean;  // default false
  createdAt: string;   // ISO 8601 date string
}
```

## API Contract

| Method | Path | Success | Error |
|--------|------|---------|-------|
| GET | /api/todos | 200 Todo[] | — |
| POST | /api/todos | 201 Todo | 400 {error} |
| PUT | /api/todos/:id | 200 Todo | 400, 404 |
| DELETE | /api/todos/:id | 200 {ok:true} | 404 |
| GET | /healthz | 200 {ok, timestamp} | — |
