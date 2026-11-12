# Host editor.capycanvas.art

Cloudflare serves the editor and DNS for `capycanvas.art`; Porkbun remains the
registrar. The Worker `capycanvas-editor` in `release/cloudflare/` serves `doc/`
as static assets only, with no Worker code, so requests are neither billed nor
counted against the Workers request limit. Files over Cloudflare's 25 MiB
static-asset limit, currently only the fingerprinted Wasm, are stored under
`editor/` in the R2 bucket `capycanvas-downloads`; `_redirects` sends their paths
to `https://downloads.capycanvas.art/editor/<path>` with a 302. A zone rule adds
`Access-Control-Allow-Origin: *` to those responses, which the cross-origin Wasm
preload and fetch need. Every byte matches the committed package. Paths with no
file return `index.html`, the single-page fallback that also answers `/`.

## Deploy

The deploy workflow runs `release/cloudflare/deploy.mjs` after committing a
build, with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` from the
repository's `cloudflare` environment, which only `main` may use. The token
needs **Workers Scripts: Edit**, **Workers R2 Storage: Edit** and **Zone WAF:
Edit**. No account IDs, API tokens or keys are stored here. To deploy from your
own machine, set `CLOUDFLARE_API_TOKEN` to such a token, `CLOUDFLARE_ACCOUNT_ID`
to the account that owns `capycanvas.art` and `CAPYCANVAS_WEB` to a
`capycanvas-web` checkout, then run, from an up-to-date `main`:

```bash
node release/cloudflare/deploy.mjs
```

The script runs the same checks as `release/verify.mjs`, uploads large
fingerprinted files to R2, brotli-compressed at maximum quality, with an
immutable cache lifetime, writes their `_redirects` entries, adds them to the
downloads allowlist with
`capycanvas-web`'s `site/scripts/allow-downloads.mjs` (downloads blocks every
path not in the bucket), then deploys the remaining files with the Worker. The Worker owns the `editor` DNS record through
its custom domain; never point `editor` at another host by hand.

## Check

```bash
curl -I https://editor.capycanvas.art/
curl -I https://editor.capycanvas.art/manifest.webmanifest
```

Then compare the live index with the release manifest ([AGENTS.md](AGENTS.md)).
In Chrome/Edge with supported hardware, load online, install/open the app, then
verify it opens offline. Closing an existing app tab allows a waiting update to
activate; save any artwork first.
