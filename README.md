# yaqlab blog (Astro)

## Local

```bash
npm install
npm run dev
```

## Publishing flow

1. Add/edit post in `src/content/posts/*.md`.
2. Open PR.
3. `validate-content` workflow checks content.
4. Merge to `main` deploys to GitHub Pages and/or VPS (depending on enabled workflow).

## VPS production deploy (`notes.yaqlab.com`)

Workflow: `.github/workflows/deploy-vps-prod.yml`

Required repository secrets:

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_PORT` (optional, default `22`)

Expected target directory on VPS:

- `/var/www/notes.yaqlab.com`

Nginx starter config is available at:

- `deploy/nginx.notes.yaqlab.com.conf`

## Domain (legacy Pages)

Set custom domain in GitHub Pages settings to `yaqlab.com` and configure DNS records accordingly.
