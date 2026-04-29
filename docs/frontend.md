# Frontend Module (`frontend/`)

React 18 + Vite 5 + Tailwind 3 + TypeScript. SPA served by Vite in dev and Nginx in prod.

## Entry points

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `vite` | Dev server on `:5173` with `/api` + `/healthz` proxied to backend `:3001` |
| `npm run build` | `vite build` | Emit static bundle to `dist/` |
| `npm run preview` | `vite preview` | Local preview of build |
| `npm test` | `vitest run` | Component unit tests (jsdom + Testing Library) |
| `npm run test:e2e` | `playwright test` | E2E tests (`tests/e2e/`) |

## Environment / build args

| Var | Default | Effect |
|-----|---------|--------|
| `VITE_API_URL` | `/api` (prod build), proxied in dev | Base URL the frontend uses to call the API. Baked at build time. |

## Code map

```
frontend/src/
├── main.tsx          # ReactDOM.createRoot mount
├── App.tsx           # state + lifecycle + handlers
├── types.ts          # shared Todo DTO type
├── api/
│   └── todos.ts      # fetch wrappers: fetchTodos / createTodo / updateTodo / deleteTodo
└── components/
    ├── TodoForm.tsx  # add form (controlled input, disable on submit)
    ├── TodoList.tsx  # list + loading/error/empty states + retry
    └── TodoItem.tsx  # row: toggle / edit / delete
```

## State model

`App.tsx` owns four pieces of state:

| State | Type | Purpose |
|-------|------|---------|
| `todos` | `Todo[]` | source of truth rendered list |
| `loading` | `boolean` | initial fetch spinner |
| `error` | `string \| null` | banner shown on fetch failure (with retry) |
| `adding` | `boolean` | disables add form while POST in flight |

Mutations (`toggle`, `delete`, `update`) follow a "fire-and-merge" pattern: await the API call, then `setTodos(prev => …)`. No optimistic rollback yet — failures will currently throw uncaught from the handler.

## Styling

Tailwind utility classes only. Config in `tailwind.config.js`, processed via `postcss.config.js`. No design tokens or CSS modules.

## Routing

None. Single screen. `nginx.conf` serves `index.html` for any non-`/api`, non-`/healthz` path so a future router would just work.

## Testing posture

- **Unit:** Each component has a `.test.tsx` file covering render, user events (`@testing-library/user-event`), and prop callbacks. `vitest.config.ts` enforces 70% coverage on `src/**`.
- **E2E:** Playwright (`playwright.config.ts`) drives the app against a running stack — happy path of add → toggle → delete.

## Known gaps / TODOs

- No optimistic UI / rollback on failed toggle/delete.
- No client-side routing.
- No global error boundary.
- No persistent toasts; errors only surface via the inline banner inside `TodoList`.
- `process.env`-style runtime config is build-time only (`import.meta.env.VITE_*`).
