// SPDX-License-Identifier: MIT OR Apache-2.0
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { filesIn, readJson, root, verify } from "../verify.mjs";

const assetLimit = 25 * 1024 * 1024;
const largeFileTypes = { ".wasm": "application/wasm" };
const largeFiles = { bucket: "capycanvas-downloads", prefix: "editor", origin: "https://downloads.capycanvas.art" };
const site = join(root, "doc");
const assets = join(root, ".release-work/cloudflare-assets");
const config = join(root, "release/cloudflare/wrangler.jsonc");
const wrangler = (...args) => execFileSync("npx", ["--yes", "wrangler@4.160.0", ...args, "--config", config], { stdio: "inherit" });
const web = process.env.CAPYCANVAS_WEB;
if (!web) throw new Error("Set CAPYCANVAS_WEB to a capycanvas-web checkout");

console.log(verify(site, readJson(join(root, "release/manifest.json")), readJson(join(root, "release/source.json"))));
rmSync(assets, { recursive: true, force: true });
const redirects = [];
for (const path of filesIn(site)) {
  const file = join(site, path);
  if (statSync(file).size <= assetLimit) {
    mkdirSync(dirname(join(assets, path)), { recursive: true });
    cpSync(file, join(assets, path));
    continue;
  }
  const type = largeFileTypes[extname(path)];
  if (!type || !/\.[a-f0-9]{20}\.[a-z0-9]+$/.test(path)) throw new Error(`Cannot serve large file from R2: ${path}`);
  wrangler("r2", "object", "put", `${largeFiles.bucket}/${largeFiles.prefix}/${path}`, "--remote", "--file", file, "--content-type", type, "--cache-control", "public, max-age=31536000, immutable");
  redirects.push(`/${path} ${largeFiles.origin}/${largeFiles.prefix}/${path} 302`);
}
writeFileSync(join(assets, "_redirects"), redirects.map((line) => `${line}\n`).join(""));
execFileSync("node", [join(web, "site/scripts/allow-downloads.mjs")], { stdio: "inherit" });
wrangler("deploy");
