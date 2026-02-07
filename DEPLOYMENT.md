# Deployment (Netlify + Render)

## Backend (Render)

1. Create a new **Web Service** on Render from this repo.
2. Render will read [render.yaml](render.yaml) automatically.
3. In Render, update these environment values:
   - `CORS_ORIGIN`: set to your Netlify site URL.
   - `GITHUB_TOKEN` and `GITHUB_USERNAME`: optional for GitHub sync.
4. The SQLite database is stored on the attached disk at `/var/data/portfolio.db`.

## Frontend (Netlify)

1. Create a new site on Netlify from this repo.
2. The build settings are in [netlify.toml](netlify.toml).
3. Add environment variable `VITE_API_BASE_URL` with your Render service URL.
4. Trigger a new deploy.

## Local env examples

- Backend: [back-end/.env.example](back-end/.env.example)
- Frontend: [front-end/.env.example](front-end/.env.example)
