# Portfolio Front-End (React + Vite)

This app is a single-page portfolio built with React and Vite.

## Prerequisites

- Node.js 20+
- npm 10+

## Environment variables

Create a `.env.local` file in `front-end/` with:

```bash
VITE_GITHUB_TOKEN=your_github_personal_access_token
```

- `VITE_GITHUB_TOKEN` is optional but recommended to avoid low GitHub API rate limits when loading repositories.

## Local development

From the `front-end/` directory:

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

## SEO and deployment notes

- Per-page SEO tags are managed in `src/components/Seo.jsx`.
- Static crawl files are available in `public/robots.txt` and `public/sitemap.xml`.
- Netlify SPA fallback routing is configured in `public/_redirects` and root `netlify.toml`.
