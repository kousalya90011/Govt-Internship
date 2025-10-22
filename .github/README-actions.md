# Actions / Deployment checklist

1. Push this repository to: https://github.com/kousalya90011/Govt-Internship.git
2. Frontend (GitHub Pages)
   - The workflow will build `frontend` and publish `frontend/dist` to GitHub Pages on `main` push.
   - After first deploy, confirm Pages settings in repository -> Pages to ensure the site is enabled.

3. Backend (GHCR)
   - The workflow builds and pushes an image to GHCR: `ghcr.io/<owner>/<repo>:latest`.
   - If push is blocked, set `GHCR_TOKEN` in repo secrets and update the workflow to do `docker/login-action` with that token.

4. Optional: Deploy backend to Render
   - Add `RENDER_API_KEY` and `RENDER_SERVICE_ID` to repository secrets. The workflow step runs only when both are present.
