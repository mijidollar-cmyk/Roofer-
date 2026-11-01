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

## Roofing quote form

The repository now includes:

- `quote.html` — mobile-responsive quote form.
- `functions/api/quote.js` — Cloudflare Pages Function that validates the submission server-side and sends the lead through Resend.

The form posts to `/api/quote`, so the Resend API key is never exposed to visitors.

### Required Cloudflare variables/secrets

In the Cloudflare Pages project, open **Settings → Variables and Secrets** and add:

- `RESEND_API_KEY` — Secret containing the Resend API key.
- `QUOTE_EMAIL` — Variable containing the email address that should receive quote leads.
- `EMAIL_FROM` — Variable containing a verified Resend sender, for example `Hyper Roof <quotes@yourdomain.com>`.

Do not put `RESEND_API_KEY` in GitHub, HTML, JavaScript, or a plaintext `vars` configuration. Cloudflare recommends Worker/Pages secrets for API keys and other sensitive values. See: https://developers.cloudflare.com/workers/configuration/secrets/

### Resend setup

1. Create a Resend account.
2. Add and verify the sending domain you will use for `EMAIL_FROM`.
3. Create a Resend API key.
4. Add the API key as the Cloudflare secret `RESEND_API_KEY`.
5. Set `QUOTE_EMAIL` to the inbox where roofing leads should arrive.
6. Set `EMAIL_FROM` to a verified sender on the Resend domain.
7. Redeploy the Pages project.

### Test

Open `/quote.html`, submit a test lead, and confirm it arrives at `QUOTE_EMAIL`.

The API endpoint is `POST /api/quote`.

The form includes server-side validation and a honeypot field for basic bot filtering. For high-volume pay-per-call traffic, add Cloudflare Turnstile and/or rate limiting before scaling the form.

## Important

The complete binary-asset package is available as the fixed website ZIP from the project workspace. The GitHub connector used for this repository does not accept local file paths for binary uploads, so binary assets must be uploaded through GitHub's web interface or deployed directly to Cloudflare Pages.

## Deployment

Latest site changes are committed to `main` and are ready for the connected Cloudflare Pages deployment.
