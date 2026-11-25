// When the site is served from a sub-path (GitHub Pages project URL, e.g. user.github.io/spind/),
// root links in the source ("/contact", "/images/x.svg", "https://site/og.png") would skip the sub-path.
// This rewrites them in the built HTML, so components keep writing plain "/path" links.
// With base "/" (custom domain, local dev) it does nothing.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

export default function baseLinks() {
  let base = '/';
  let origin = '';
  return {
    name: 'base-links',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.replace(/\/$/, '');
        origin = config.site ? new URL(config.site).origin : '';
      },
      'astro:build:done': async ({ dir }) => {
        if (!base || base === '/') return;
        const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const b = esc(base.slice(1));
        // Attribute values starting with a single "/" that is not already the base (and not "//host").
        const attr = new RegExp(`((?:href|src|action|content|poster|data-[\\w-]+)=["'])/(?!/|${b}(?:/|["'?#]))`, 'g');
        const css = new RegExp(`(url\\(["']?)/(?!/|${b}/)`, 'g');
        const abs = origin ? new RegExp(`${esc(origin)}/(?!${b}(?:/|["'?#]))`, 'g') : null;
        let count = 0;
        for await (const file of htmlFiles(fileURLToPath(dir))) {
          const html = await readFile(file, 'utf8');
          let out = html.replace(attr, `$1${base}/`).replace(css, `$1${base}/`);
          if (abs) out = out.replace(abs, `${origin}${base}/`);
          if (out !== html) { await writeFile(file, out); count++; }
        }
        console.log(`[base-links] prefixed root links with ${base} in ${count} pages`);
      },
    },
  };
}
