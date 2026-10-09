# Hyper Roof

Static roofing website prepared for Cloudflare Pages.

## Cloudflare Pages settings

- Production branch: `main`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `.`
- Root directory: `/`
- Make sure `index.html` is at the repository root.

After deployment, Cloudflare Pages provides a `*.pages.dev` URL. If the URL is not appearing, open Workers & Pages > your project > Deployments and check the latest Build log.

## Important

The complete binary-asset package is available as the fixed website ZIP from the project workspace. The GitHub connector used for this repository does not accept local file paths for binary uploads, so binary assets must be uploaded through GitHub's web interface or deployed directly to Cloudflare Pages.
