# Ardian Idrizi Portfolio (Full-Stack)

Live site: https://ardian-portfolio.netlify.app

This repository contains a full-stack developer portfolio with:
- A **React + Vite** frontend (custom client-side router, SEO metadata support, responsive pages)
- An **Express + Prisma** backend (project CRUD, admin metrics, GitHub sync helper, contact form mailer)
- Deployment-ready configuration for **Netlify** (frontend) and a Node host such as **Render** (backend)

## Monorepo Layout

```text
portfolio/
├── front-end/               # React app
│   ├── public/              # static assets, redirects, SEO files
│   └── src/
│       ├── components/      # Layout, cards, SEO helpers
│       ├── data/            # project types + route helpers
│       ├── lib/             # lightweight router implementation
│       ├── pages/           # Home, Projects, About, Resume, Contact, etc.
│       └── services/        # GitHub project/case-study integration
├── back-end/                # Express API + Prisma
│   ├── prisma/              # schema + migrations
│   └── index.js             # API server
├── netlify.toml             # frontend deploy settings
└── README.md
```

## Tech Stack

### Frontend
- React 19
- Vite 7
- Vanilla CSS
- Custom SPA router (`front-end/src/lib/router.jsx`)

### Backend
- Node.js + Express 5
- Prisma ORM
- PostgreSQL datasource (`DATABASE_URL`)
- Nodemailer (contact form email delivery)

## Frontend Features

- Multi-page SPA experience:
  - `/` Home
  - `/projects` Project listing
  - `/projects/:owner/:repo` Project detail page
  - `/about`
  - `/resume`
  - `/contact`
- SEO component support for page metadata.
- GitHub-powered project ingestion logic with support for:
  - pinned/public repository metadata
  - optional `case-study.json` or `CASE_STUDY.md` parsing
  - README summary extraction fallback

## Backend API

Base URL (local default): `http://localhost:4000`

### Public endpoints
- `GET /api/health`
- `GET /api/projects`
  - Optional query params: `tags`, `search`, `category`
- `POST /api/projects`
- `PATCH /api/projects/:id` (currently supports `published`, `views`)
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/view`
- `POST /api/projects/sync-github`
- `POST /api/contact`

### Admin endpoints (requires `x-admin-token`)
- `GET /api/admin/stats`
- `GET /api/admin/projects`
- `GET /api/admin/analytics`

For admin routes, set `x-admin-token` to the same value as `ADMIN_PASSWORD` in your backend environment config.

## Local Development

### 1) Prerequisites
- Node.js 20+ recommended
- npm
- A PostgreSQL database (local or hosted)

### 2) Backend setup

```bash
cd back-end
npm install
```

Create `back-end/.env`:

```env
PORT=4000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/portfolio"
CORS_ORIGIN="http://localhost:5173"
ADMIN_PASSWORD="your_admin_secret"

# Optional integrations
GITHUB_TOKEN=""
GITHUB_USERNAME="ardidrizi"
EMAIL_USER=""
EMAIL_PASSWORD=""
```

Run migrations + start backend:

```bash
npx prisma migrate dev
npm run dev
```

> Note: `npm run dev` uses `nodemon`. You can also run `npm start` for a plain Node process.

### 3) Frontend setup

```bash
cd front-end
npm install
```

Create `front-end/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

Start frontend:

```bash
npm run dev
```

Frontend default dev URL: `http://localhost:5173`

## Build Commands

### Frontend
```bash
cd front-end
npm run build
npm run preview
```

### Backend
```bash
cd back-end
npm start
```

## Deployment Notes

- **Frontend**: configured by `netlify.toml`
- **Backend**: configure host env vars (`DATABASE_URL`, `CORS_ORIGIN`, `ADMIN_PASSWORD`, and optional GitHub/email keys)
- If deploying frontend and backend on separate domains, ensure backend `CORS_ORIGIN` includes the frontend origin.

For extended environment and deployment docs, see:
- `ENV_SETUP.md`
- `DEPLOYMENT.md`

## Author

- GitHub: https://github.com/ardidrizi
- LinkedIn: https://linkedin.com/in/ardian-idrizi
