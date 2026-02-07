# Copilot Instructions for this Portfolio Repo

## Overview

- This repo is a small full-stack portfolio app:
  - Backend: Express + Prisma + SQLite in [back-end](back-end).
  - Frontend: React + Vite SPA in [front-end](front-end).
- The frontend manages and displays projects via a REST API exposed by the backend.
- Prioritize keeping the simple, single-page portfolio structure and minimal dependencies.

## Backend (Express + Prisma)

- Entry point: [back-end/index.js](back-end/index.js).
  - Uses `express`, `cors`, `dotenv`, and `@prisma/client`.
  - JSON API under `/api/*`:
    - `GET /api/projects` – list all projects.
    - `POST /api/projects` – create project from `{ title, description, link?, image? }` body.
    - `DELETE /api/projects/:id` – delete by `id`.
    - `GET /api/health` – health check used for simple monitoring.
  - Logs every request with timestamp, method, URL, and body keys. Preserve this middleware when adding routes.
- Data model: [back-end/prisma/schema.prisma](back-end/prisma/schema.prisma).
  - Single model `Project` with `id (String @id @default(cuid())`, `title`, `description`, `link?`, `image?`, `createdAt @default(now())`.
  - When adding fields, update both Prisma schema and frontend types/usage, and prefer optional fields rather than breaking existing data.
- Environment & DB:
  - Uses SQLite via `DATABASE_URL` in `.env` (not in repo). Keep compatible with file-based SQLite URLs unless explicitly migrated.
- Scripts in [back-end/package.json](back-end/package.json):
  - `dev`: currently `nodemon index.js && tsc --watch` (note: backend is plain JS; avoid introducing TS unless you also add `tsconfig` and migrate).
  - `test`: `jest` exists as a dev dependency but there are no tests yet. If you add tests, keep them close to the routes and use `supertest`.

## Frontend (React + Vite)

- Entry: [front-end/src/main.jsx](front-end/src/main.jsx) renders `<App />` into `#root` with `StrictMode`.
- Main UI: [front-end/src/App.jsx](front-end/src/App.jsx).
  - Single-page portfolio with sections: `hero`, `about`, `skills`, `projects`, `contact`.
  - `featuredProjects` is a static array at the top; dynamic projects come from the backend.
  - API base URL is controlled by `import.meta.env.VITE_API_BASE_URL` with fallback to `http://localhost:5005`:
    - When changing backend ports, update this env var instead of hardcoding URLs.
  - On mount, calls `GET ${API_BASE_URL}/api/projects` and expects an array of `Project` objects shaped like the Prisma model.
  - The 2Add a project2 form posts to `POST ${API_BASE_URL}/api/projects` with `title`, `description`, and optional `link`.
    - Client-side validation requires `title` and `description` and surfaces backend errors from `{ error: string }` responses.
  - `formatDate(createdAt)` expects an ISO-like date string and renders `MMM YYYY`; if adding date logic, keep it robust to invalid values.
- Styling:
  - Primary layout and components are styled in [front-end/src/App.css](front-end/src/App.css) and [front-end/src/index.css](front-end/src/index.css).
  - Follow existing utility-like classes (`.projects-grid`, `.project-card`, `.skills-tags`, etc.) and mobile `@media (max-width: 640px)` breakpoint for new sections.
- Scripts in [front-end/package.json](front-end/package.json):
  - `dev`: `vite`
  - `build`: `vite build`
  - `preview`: `vite preview`
  - `lint`: `eslint .` using the config in [front-end/eslint.config.js](front-end/eslint.config.js).

## Cross-Stack Conventions

- API contract:
  - Backend responses for errors should use `{ error: string }` (the frontend form expects this shape).
  - Projects returned from `/api/projects` must at least include `id`, `title`, `description`, and `createdAt` (string). Optional `link`/`image` can be missing.
  - Keep route prefixes (`/api/...`) stable; if new resources are added, stay under `/api`.
- IDs:
  - The Prisma `Project.id` is a `String` with `cuid()`. If you create new endpoints or filters, treat IDs as opaque strings in the frontend.
- Logging & errors:
  - Preserve the existing request-logging middleware and pattern; when adding routes, log and return generic 500 `{ error: "..." }` rather than leaking stack traces.

## Typical Workflows

- Run backend locally (from repo root or back-end directory):
  - Install deps: `cd back-end && npm install`.
  - Ensure `.env` contains `DATABASE_URL` for SQLite.
  - Run migrations: `npx prisma migrate dev` (if schema changed or DB not initialized).
  - Start dev server: `npm run dev` (Express with nodemon).
- Run frontend locally:
  - Install deps: `cd front-end && npm install`.
  - Optionally set `VITE_API_BASE_URL` in `front-end/.env` to match the backend URL.
  - Start dev server: `npm run dev` (Vite, default port 5173).

## How to Extend Safely

- When adding new backend routes:
  - Place them in [back-end/index.js](back-end/index.js) alongside existing `app.get/post/delete` calls.
  - Use async/await with `try/catch`, mirror existing error shapes, and reuse the shared `prisma` client.
- When evolving the Project model:
  - Update [back-end/prisma/schema.prisma](back-end/prisma/schema.prisma) and run migrations.
  - Reflect field changes in the frontend cards and form in [front-end/src/App.jsx](front-end/src/App.jsx).
- When enhancing UI/sections:
  - Keep the single-page structure and anchor-based nav (`href="#about"`, etc.).
  - Reuse existing class naming and spacing patterns from [front-end/src/App.css](front-end/src/App.css).

## Agent Notes

- Do not introduce TypeScript to the backend unless explicitly requested (despite `tsc` scripts existing).
- Prefer small, focused changes that keep the portfolio easy to deploy on simple hosts (e.g., Railway/Netlify) and avoid heavy new dependencies.
- If unsure about a behavior, look first at [front-end/src/App.jsx](front-end/src/App.jsx) and [back-end/index.js](back-end/index.js), which define most of the app logic.
