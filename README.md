# Hyper Roof

Static roofing website with a Cloudflare Worker entry point and quote-request API.

## Cloudflare Workers deployment (for roofer.pennycedis.workers.dev)

The repository includes:
- `wrangler.jsonc` — Worker name, entry point, and static asset configuration.
- `worker.js` — serves the quote API and hands other requests to static assets.
- `functions/api/quote.js` — validates quote submissions and sends them through Resend.
- `.assetsignore` — keeps Worker source/configuration files out of public static assets.

Connect this repository to the existing **Worker** in Cloudflare Workers & Pages. Use:
- Git branch: `main`
- Root directory: repository root (`/`)
- Build command: leave blank
- Deploy command: `npx wrangler deploy`
- Preview command: leave the Cloudflare default

The Worker name in `wrangler.jsonc` is `roofer` and must match the existing Worker name. If the Cloudflare project uses a different name, update the `name` field before deploying.

Workers Builds uses a separate build step (optional) and deploy step (default `npx wrangler deploy`). See https://developers.cloudflare.com/workers/ci-cd/builds/configuration/.

## Quote form configuration

In Cloudflare, open the Worker > Settings > Variables and Secrets and add:
- `RESEND_API_KEY` — Secret containing the Resend API key.
- `QUOTE_EMAIL` — Variable containing the inbox that should receive quote requests.
- `EMAIL_FROM` — Variable containing a verified Resend sender, for example `Hyper Roof <quotes@yourdomain.com>`.

Do not commit the Resend API key to GitHub or put it in browser JavaScript.

### Resend setup

1. Create a Resend account.
2. Add and verify the sending domain used by `EMAIL_FROM`.
3. Create a Resend API key.
4. Add it to Cloudflare as the `RESEND_API_KEY` secret.
5. Set `QUOTE_EMAIL` and `EMAIL_FROM` in Worker runtime settings.
6. Redeploy the Worker after configuration.

The form posts to `POST /api/quote`. Test it with a sample request after deployment and confirm the message arrives at `QUOTE_EMAIL`.

## Alternative: Cloudflare Pages

If this repository is connected to a **Pages** project instead of a Worker, use:
- Production branch: `main`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `.`
- Root directory: repository root (`/`)

Pages uses `functions/api/quote.js` as a Pages Function. Pages projects normally receive a `*.pages.dev` URL; the Worker configuration above is intended for the `workers.dev` deployment.

## Important

The address and phone number currently shown on the website are clearly marked temporary placeholders. Replace them with genuine business contact details before advertising or launch.
