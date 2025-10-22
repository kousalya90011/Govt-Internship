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

1. Initialize a git repo and push to GitHub (replace with your repo):

  ```powershell
  cd "c:\Users\CHILUKURI KOUSALYA\Desktop\CAPSTONE"
  git init
  git add .
  git commit -m "initial commit"
  git branch -M main
  git remote add origin https://github.com/kousalya90011/Govt-Internship.git
  git push -u origin main
  ```

2. Frontend: the workflow `.github/workflows/frontend-pages.yml` builds the `frontend` and deploys `frontend/dist` to GitHub Pages automatically on push to `main`.

3. Backend: the workflow `.github/workflows/backend-container.yml` builds and pushes a Docker image to GitHub Container Registry (GHCR). To allow pushing, configure a personal access token or rely on Actions' permissions.

Secrets and notes

- To publish to GHCR you may need to set the proper permissions and/or a token if your repo policy requires it.
- For local development with a Postgres DB, set `DATABASE_URL` in your environment before starting the backend.

GHCR and Render notes

- Pushing to GHCR from Actions should work with default Action permissions in many repos. If not, create a PAT with `write:packages` and set it as `GHCR_TOKEN` in your repo secrets, then update the workflow to log in using `docker/login-action`.
- To auto-deploy the backend to Render.com after image push, create two repository secrets:
  - `RENDER_API_KEY` — your Render API key
  - `RENDER_SERVICE_ID` — the service id (the workflow calls the Render deploy endpoint). The workflow step is conditional and will only run if both secrets are present.
