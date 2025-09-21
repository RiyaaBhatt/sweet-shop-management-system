# Sweet Shop Management System

**Live Demo:** [https://sweet-shop-management-system-ecru.vercel.app/](https://sweet-shop-management-system-ecru.vercel.app/)

**Admin Credentials:**  
- Email: `admin@sweetshop.com`  
- Password: `admin123`

Full-stack sample for managing sweets, orders, users and admin reports. This repo contains a TypeScript + Express backend (Prisma + PostgreSQL) and a React + Vite frontend.

## Required versions

- Node.js: >= 18.x (recommended 18 or 20)
- npm: >= 9.x
- PostgreSQL: 12+

## Quick Start (development)

The repository has two main folders: `backend/` and `frontend/`.

1. Backend

   - Move into backend and install:

     ```powershell
     cd backend; npm install
     ```

   - Copy environment file and set `DATABASE_URL` in `.env` (Postgres connection string):

     ```powershell
     copy .env.example .env
     # then edit .env to set DATABASE_URL
     ```

   - Run Prisma migrations (development):

     ```powershell
     npx prisma migrate dev --name init
     # or if you only want to apply already created migrations:
     # npx prisma migrate deploy
     ```

   - Seed sample data (if seed script exists):

     ```powershell
     npm run seed
     ```

   - Start backend in watch mode:

     ```powershell
     npm run dev
     ```

   - Backend base URL: http://localhost:8000 (API root `http://localhost:8000/api`)

2. Frontend

   - Move into frontend and install:

     ```powershell
     cd frontend; npm install
     ```

   - Start the Vite dev server:

     ```powershell
     npm run dev
     ```

   - Frontend URL: http://localhost:8080

Notes: the frontend expects the backend API at `http://localhost:8000/api`. If you change the backend port, update `frontend/src/api/config.ts`.

## Running tests and coverage

### Backend

- Run unit & integration tests (Jest):

  ```powershell
  cd backend
  npm test
  ```

- Generate coverage report (HTML + text):

  ```powershell
  cd backend
  npm run coverage
  ```

  Coverage artifacts will be under `backend/coverage/` (open `index.html` to view the report).

### Frontend

- Frontend has no automated test scripts by default in package.json. You can add React Testing Library tests and run them with Jest or Vitest. For now run lint and manual checks:

  ```powershell
  cd frontend
  npm run dev
  ```

## Useful commands (summary)

- Backend dev: `cd backend; npm install; npm run dev`
- Backend tests: `cd backend; npm test`
- Backend coverage: `cd backend; npm run coverage`
- Frontend dev: `cd frontend; npm install; npm run dev`

## Notes and caveats

- This repository includes fallback logic in the backend services to support running tests even when the Prisma migrations have not been applied (in-memory fallback orders). For production, make sure to run Prisma migrations and remove any in-memory fallbacks.
- Make sure your `.env` contains a valid `DATABASE_URL` before running migrations or the dev server.

## Contributing

- Please open issues or PRs for changes. Add tests for any new backend behavior and run the coverage script.

---


