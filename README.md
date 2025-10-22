# CAPSTONE

This repository contains a small React + Express app. The `frontend` uses Vite; the `backend` is an Express app that optionally seeds a Postgres database.

Quick local run

- Backend

  ```powershell
  cd backend
  npm install
  $env:DISABLE_ETL='1' # optional: skip DB seeding if you don't have Postgres
  npm start
  ```

- Frontend

  ```powershell
  cd frontend
  npm install
  npm run dev
  ```

Deploying to GitHub

1. Initialize a git repo and push to GitHub (create a repo on GitHub first):

   ```powershell
   git init
   git add .
   git commit -m "initial"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```

2. Frontend: the workflow `.github/workflows/frontend-pages.yml` builds the `frontend` and deploys `frontend/dist` to GitHub Pages automatically on push to `main`.

3. Backend: the workflow `.github/workflows/backend-container.yml` builds and pushes a Docker image to GitHub Container Registry (GHCR). To allow pushing, configure a personal access token or rely on Actions' permissions.

Secrets and notes

- To publish to GHCR you may need to set the proper permissions and/or a token if your repo policy requires it.
- For local development with a Postgres DB, set `DATABASE_URL` in your environment before starting the backend.
