# Full Stack Notes Demo

A three-tier demo application with a React frontend (port 3000), Express backend (port 5000), and PostgreSQL 15 database running via Docker. Users can submit arbitrary text through the UI and immediately see it stored and listed from the database.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js 20 + Express + pg
- **Database:** PostgreSQL 15 (official Docker Hub image)

## Prerequisites

- Node.js >= 20.19 and npm >= 10
- Docker + Docker Compose (for the PostgreSQL container)

## Getting Started

1. **Install dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
   Update the values if you change ports, credentials, or origin settings.

3. **Start PostgreSQL (Docker)**
   ```bash
   docker compose up -d postgres
   ```
   This uses the official `postgres:15-alpine` image with credentials defined in `docker-compose.yml`.

4. **Run the backend (port 5000)**
   ```bash
   cd backend
   npm run dev
   ```
   The server performs any pending migrations (table creation) on startup.

5. **Run the frontend (port 3000)**
   ```bash
   cd frontend
   npm run dev
   ```
   Vite will open `http://localhost:3000`. Submit entries via the form; the table refreshes with the latest data.

## API Overview

- `GET /health` – simple health probe
- `GET /api/entries` – returns all stored entries ordered by creation time
- `POST /api/entries` – body `{ "content": "text here" }`; stores and returns the created entry

## Helpful Commands

- `docker compose logs -f postgres` – follow database logs
- `docker compose down -v` – stop and remove the Postgres container and volume (removes data)
- `npm run build` (frontend) – production build for the React app

## Notes

- No Dockerfiles were created for the frontend or backend; run them locally with Node.js as described above.
- The backend enforces simple validation and CORS restrictions. Adjust `ALLOWED_ORIGINS` inside `backend/.env` if deploying elsewhere.
