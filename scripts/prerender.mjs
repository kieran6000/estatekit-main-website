/**
 * Writes static HTML for every indexable route, after `vite build` (client)
 * and `vite build --ssr src/entry-server.jsx` (server) have both run.
 *
 *   /            -> dist/index.html
 *   /pitch       -> dist/pitch.html
 *   /pitch/res   -> dist/pitch/res.html
 *
 * Flat `name.html` files rather than `name/index.html` because Cloudflare
 * Pages (and Vercel with cleanUrls) serve them at `/name` with no trailing
 * slash, which is what every canonical on the site uses.
 *
 * Also writes:
 *   dist/app.html   the empty shell, for client-only routes (/thank-you...).
 *                   _redirects points at `/app`, not `/app.html`: Cloudflare
 *                   answers `/app.html` with a 308 to `/app`, which would
 *                   move the visitor off /thank-you.
 *   dist/404.html   the same shell marked noindex; React renders the 404
 *   dist/sitemap.xml  public/sitemap.xml plus /resources and every article, and the author page
 *
 * The build must never touch Meta, Discord, Supabase, Google or Whop, so all
 * outbound network access is blocked before the app is loaded. Any attempt
 * fails the build and names the URL.
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SSR = join(ROOT, "dist-ssr");
const SITE = "https://estatekit.co";

// ── No network, at all ──────────────────────────────────────────────────────
const attempts = [];
const refuse = (what) => {
  attempts.push(String(what));
  throw new Error(`Network access during prerender is not allowed: ${what}`);
};
globalThis.fetch = (input) => refuse(typeof input === "string" ? input : input?.url);
globalThis.WebSocket = class { constructor(url) { refuse(url); } };
for (const mod of [http, https]) {
  mod.request = (opts) => refuse(typeof opts === "string" ? opts : opts?.href || opts?.host || opts?.hostname);
  mod.get = mod.request;
}
net.Socket.prototype.connect = function (...args) {
  const o = args[0];
  return refuse(typeof o === "object" ? `${o.host || o.path}:${o.port ?? ""}` : String(o));
};

// ── Helpers ─────────────────────────────────────────────────────────────────
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => escText(s).replace(/"/g, "&quot;");
// JSON inside <script> must not be able to close the tag.
const safeJson = (v) => JSON.stringify(v).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

const fileFor = (route) => (route === "/" ? "index.html" : `${route.slice(1)}.html`);

function headTags({ meta, jsonLd }, route) {
  if (!meta) throw new Error(`${route} rendered without calling usePageMeta, so it has no title or description`);
  const tags = [
    `<title>${escText(meta.title)}</title>`,
    `<meta name="description" content="${escAttr(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, nofollow" : "index, follow"}" />`,
    `<link rel="canonical" href="${escAttr(meta.url)}" />`,
    `<meta property="og:title" content="${escAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escAttr(meta.url)}" />`,
    `<meta property="og:type" content="${escAttr(meta.type)}" />`,
    `<meta name="twitter:card" content="${meta.image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${escAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escAttr(meta.description)}" />`,
  ];
  if (meta.image) {
    tags.push(
      `<meta property="og:image" content="${escAttr(meta.image)}" />`,
      `<meta name="twitter:image" content="${escAttr(meta.image)}" />`,
    );
  }
  for (const [id, schema] of Object.entries(jsonLd)) {
    tags.push(`<script type="application/ld+json" id="${escAttr(id)}">${safeJson(schema)}</script>`);
  }
  return tags.join("\n    ");
}

const TITLE_RE = /<title>[\s\S]*?<\/title>/;
const DESC_RE = /<meta\s+name="description"[\s\S]*?\/>/;
const ROOT_RE = /<div id="root"><\/div>/;

function fill(template, route, head, appHtml, builtAt) {
  if (!TITLE_RE.test(template) || !DESC_RE.test(template) || !ROOT_RE.test(template)) {
    throw new Error("dist/index.html no longer has the <title>, description meta or empty #root this script expects");
  }
  return template
    .replace(DESC_RE, "")
    .replace(TITLE_RE, headTags(head, route))
    .replace(
      ROOT_RE,
      `<div id="root" data-route="${escAttr(route)}" data-built-at="${builtAt}">${appHtml}</div>`,
    );
}

/** Every /assets/... URL a page points at must exist in the client build. */
function checkAssets(html, route) {
  const missing = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)]
    .map((m) => m[1])
    .filter((p) => !existsSync(join(DIST, decodeURIComponent(p))));
  if (missing.length) throw new Error(`${route} points at files the client build doesn't have: ${missing.join(", ")}`);
}

/**
 * An article's full text is its own JS file, which main.jsx waits for
 * before hydrating. Tell the browser about it up front so it downloads
 * alongside the app instead of after it.
 */
function preloadTags(source, manifest) {
  if (!source) return "";
  const files = new Set();
  const walk = (key) => {
    const chunk = manifest[key];
    if (!chunk || files.has(chunk.file)) return;
    files.add(chunk.file);
    (chunk.imports || []).forEach(walk);
  };
  walk(source);
  if (!files.size) throw new Error(`The build manifest has no entry for ${source}`);
  return [...files].map((f) => `\n    <link rel="modulepreload" crossorigin href="/${escAttr(f)}" />`).join("");
}

function writeSitemap(extras) {
  const base = readFileSync(join(ROOT, "public", "sitemap.xml"), "utf8");
  const extra = extras
    .filter(({ path }) => !base.includes(`<loc>${SITE}${path}</loc>`))
    .map(({ path, updatedDate }) =>
      [
        "  <url>",
        `    <loc>${SITE}${path}</loc>`,
        updatedDate ? `    <lastmod>${updatedDate}</lastmod>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  const out = base.replace(/\s*<\/urlset>\s*$/, `\n${extra.join("\n")}\n</urlset>\n`);
  writeFileSync(join(DIST, "sitemap.xml"), out);
  return extra.length;
}

// ── Build ───────────────────────────────────────────────────────────────────
const template = readFileSync(join(DIST, "index.html"), "utf8");
const { render, routes, sitemapExtras, articleFiles } = await import(
  pathToFileURL(join(SSR, "entry-server.js")).href
);
const MANIFEST = join(DIST, ".vite", "manifest.json");
const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const builtAt = Date.now();

// The shell first, from the untouched template, before index.html is replaced.
// Everything served from it is noindex (thank-you pages, rebook, 404s), and
// the page's own usePageMeta says so too once it renders.
const shell = template.replace(DESC_RE, (m) => `${m}\n    <meta name="robots" content="noindex" />`);
writeFileSync(join(DIST, "app.html"), shell);
writeFileSync(join(DIST, "404.html"), shell);

for (const route of routes) {
  const { html, head } = await render(route, builtAt);
  if (!html.trim()) throw new Error(`${route} rendered nothing`);
  const page = fill(template, route, head, html, builtAt).replace(
    "</head>",
    `${preloadTags(articleFiles[route], manifest)}\n  </head>`,
  );
  checkAssets(page, route);
  const out = join(DIST, fileFor(route));
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
  console.log(`  prerendered ${route.padEnd(48)} -> dist/${fileFor(route)}  (${(page.length / 1024).toFixed(1)} kB)`);
}

const added = writeSitemap(sitemapExtras);
console.log(`  sitemap.xml: ${added} resource URL(s) added`);

rmSync(SSR, { recursive: true, force: true });
rmSync(join(DIST, ".vite"), { recursive: true, force: true });

if (attempts.length) {
  console.error(`\nBlocked ${attempts.length} network call(s) during prerender:\n  ${attempts.join("\n  ")}`);
  process.exit(1);
}
console.log(`  ${routes.length} pages, 0 network calls`);
