import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative } from "node:path";
const root = resolve("dist");
async function walk(dir) {
  const files = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      files.map((f) =>
        f.isDirectory() ? walk(resolve(dir, f.name)) : resolve(dir, f.name),
      ),
    )
  ).flat();
}
const all = await walk(root);
const pages = all.filter((f) => f.endsWith(".html"));
const errors = [];
let links = 0;
for (const file of pages) {
  const html = await readFile(file, "utf8");
  if (/<!--(?:app|meta)-->/g.test(html))
    errors.push(`${file}: unrendered placeholder`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (new Set(ids).size !== ids.length)
    errors.push(`${file}: duplicate element ID`);
  if (html.includes('id="main"') && (html.match(/<h1\b/g) || []).length !== 1)
    errors.push(`${file}: expected one H1`);
  for (const [, id] of html.matchAll(/aria-controls="([^"]+)"/g)) {
    if (!ids.includes(id))
      errors.push(`${file}: missing controlled region ${id}`);
  }
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]*"/.test(img[0]))
      errors.push(`${file}: image missing alt`);
  }
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if ((!raw.startsWith("/") && !raw.startsWith("#")) || raw.startsWith("//"))
      continue;
    const [pathname, hash] = raw.split("#");
    let target = pathname ? resolve(root, "." + pathname) : file;
    try {
      if ((await stat(target)).isDirectory())
        target = resolve(target, "index.html");
      await stat(target);
    } catch {
      errors.push(`${file}: missing ${raw}`);
      continue;
    }
    if (hash && target.endsWith(".html")) {
      const content = await readFile(target, "utf8");
      if (!content.includes(`id="${hash}"`))
        errors.push(`${file}: missing anchor ${raw}`);
    }
    links++;
  }
  if (file.includes("/projects/") && !html.includes("Scope &amp; limitations."))
    errors.push(`${file}: missing scope/limitations`);
}
// Keep old Jekyll demo pages and PDFs out of the deployable artifact.
if (
  all.some(
    (f) => relative(root, f).startsWith("_") || /paper[123]\.pdf$/.test(f),
  )
)
  errors.push("Legacy template content in distribution");
const js = all.filter((f) => f.endsWith(".js") && f.includes("/assets/"));
const bytes = (await Promise.all(js.map((f) => stat(f)))).reduce(
  (n, s) => n + s.size,
  0,
);
if (bytes > 480_000) errors.push(`JS exceeds 480 KB budget: ${bytes}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `PASS: ${pages.length} static HTML files, ${links} local links/assets/anchors, image alt and control targets; JavaScript ${(bytes / 1024).toFixed(0)} KB (raw).`,
  );
