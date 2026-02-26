# Ardian Idrizi – Full-Stack Developer Portfolio

Live site: https://ardian-portfolio.netlify.app

This repo powers my full-stack portfolio, showcasing frontend UI work, backend API design, and deployment on Netlify. It demonstrates a clean, production-ready React experience with optional API-backed project data via Express and Prisma.

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express, Prisma, SQLite
- Deployment: Netlify

## Features

- Recruiter-friendly single-page layout with clear sections and fast load times
- Dynamic project data from a REST API (optional, if backend is running)
- Mobile-responsive styling and accessible navigation

## Screenshots

Add images to [front-end/public/](front-end/public/) and reference them here:

- `screenshot-home.png`
- `screenshot-projects.png`
- `screenshot-contact.png`

## Local Development

### a) Clone

```
git clone <repo-url>
cd portfolio
```

### b) Frontend setup

```
cd front-end
npm install
npm run dev
```

### c) Backend setup (Optional)

The backend is optional if you only need the frontend experience.

```
cd back-end
npm install
npx prisma migrate dev
npm run dev
```

### d) Environment variables

- Frontend: create [front-end/.env](front-end/.env) as needed
  - `VITE_API_BASE_URL=http://localhost:5005`
- Backend: create [back-end/.env](back-end/.env)
  - `DATABASE_URL="file:./dev.db"`

## API Overview

All routes are under `/api` (only when the backend is running).

- `GET /api/health` -> `{ status: "ok" }`
- `GET /api/projects` -> list projects
- `POST /api/projects` -> create a project
- `DELETE /api/projects/:id` -> delete a project

Errors return `{ error: string }`.

## Project Structure

```
portfolio/
	front-end/
		public/
		src/
			App.jsx
			App.css
			index.css
			main.jsx
	back-end/
		prisma/
			schema.prisma
		index.js
	README.md
	netlify.toml
```

## Author

- GitHub: https://github.com/ardidrizi
- LinkedIn: https://linkedin.com/in/ardidrizi
- Email: ardianidizi@gmail.com
