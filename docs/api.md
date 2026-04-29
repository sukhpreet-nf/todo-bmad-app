# REST API Contract

Base URL: `http://localhost:3001` (dev) · `/` via Nginx proxy (prod)
All requests/responses are JSON. Errors: `{ "error": string }`.

## `GET /healthz`

Liveness probe. No auth, no rate limit.

```json
200 OK
{ "ok": true, "timestamp": "2026-04-29T23:30:57.257Z" }
```

## `GET /api/todos`

List all todos sorted by `createdAt` ascending.

```json
200 OK
[
  {
    "id": "5b2a…uuid",
    "description": "Buy milk",
    "completed": false,
    "createdAt": "2026-04-29T23:31:10.000Z"
  }
]
```

## `POST /api/todos`

Create a todo.

**Request**
```json
{ "description": "Buy milk" }
```

**Validation**
- `description` required, must be a non-empty string after `trim()`.

**Responses**
- `201 Created` → full todo object (see GET).
- `400 Bad Request` → `{"error":"description is required and must be non-empty"}`

## `PUT /api/todos/:id`

Partial update — any subset of fields may be omitted.

**Request**
```json
{ "description": "Buy oat milk", "completed": true }
```

**Validation**
- If `description` provided, must be non-empty string after `trim()`.
- If `completed` provided, must be boolean (coerced to `0|1` in DB).

**Responses**
- `200 OK` → updated todo object.
- `400 Bad Request` → `{"error":"description must be non-empty if provided"}`
- `404 Not Found` → `{"error":"Todo not found"}`

## `DELETE /api/todos/:id`

Delete a todo.

**Responses**
- `204 No Content`
- `404 Not Found` → `{"error":"Todo not found"}`

## Cross-cutting

| Concern | Behavior |
|---------|----------|
| CORS | Allowlist via `CORS_ORIGIN` env. If unset or `*`, CORS is **disabled** (origin: `false`). Set to your frontend origin in dev/prod. |
| Rate limit | 300 requests / 15 min per IP on `/api/todos*`. Standard `RateLimit-*` headers. |
| Body size | Default Express `1mb` JSON limit. |
| 404 | Any unmatched route → `{"error":"Not found"}`. |
| 500 | Unexpected errors → `{"error":"Internal server error"}` (stack logged server-side). |
