import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { render, projects, profile } from "../.ssr/entry-server.js";
const interFont = (await readdir("dist/assets")).find((file) => /^inter-latin-wght-normal.*\.woff2$/.test(file));
if (!interFont) throw new Error("Missing primary font");
const template = await readFile("dist/index.html", "utf8");
const origin = (process.env.SITE_URL || "https://matla91.github.io").replace(
  /\/$/,
  "",
);
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const routes = [
  {
    path: "/",
    title: "Matthis Lahargoue — Machine Learning & Computational Imaging",
    description:
      "Machine learning, computer vision and computational imaging. Explore the research and engineering work of Matthis Lahargoue.",
  },
  ...projects.map((p) => ({
    path: `/projects/${p.slug}/`,
    title: `${p.shortTitle} — Matthis Lahargoue`,
    description: p.summary,
  })),
  {
    path: "/404.html",
    title: "Page not found — Matthis Lahargoue",
    description: "Return to the portfolio of Matthis Lahargoue.",
  },
];
for (const page of routes) {
  const url = origin + page.path;
  const jsonld =
    page.path === "/"
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: profile.name,
          url: origin,
          description:
            "Engineering student and computational imaging research intern",
          sameAs: [profile.github, profile.linkedin],
          knowsAbout: [
            "Machine Learning",
            "Computer Vision",
            "Computational Imaging",
          ],
        })
      : "";
  const metadata = `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${interFont}"/><link rel="canonical" href="${escape(url)}"/><meta property="og:type" content="website"/><meta property="og:title" content="${escape(page.title)}"/><meta property="og:description" content="${escape(page.description)}"/><meta property="og:url" content="${escape(url)}"/><meta property="og:image" content="${origin}/assets/og-cover.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta property="og:image:alt" content="Matthis Lahargoue — machine learning, computer vision, scientific computing"/><meta name="twitter:card" content="summary_large_image"/>${page.path === "/404.html" ? '<meta name="robots" content="noindex"/>' : ""}${jsonld ? `<script type="application/ld+json">${jsonld.replaceAll("<", "\\u003c")}</script>` : ""}`;
  let html = template
    .replace("<!--app-->", render(page.path))
    .replace("<!--meta-->", metadata)
    .replace(/<title>.*?<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/>/,
      `<meta name="description" content="${escape(page.description)}" />`,
    );
  const target =
    page.path === "/404.html"
      ? "dist/404.html"
      : resolve("dist", "." + page.path, "index.html");
  await mkdir(resolve(target, ".."), { recursive: true });
  await writeFile(target, html);
}
// Preserve the meaningful incoming URLs from the previous public portfolio.
const redirects = {
  "/about/": "/#about",
  "/about.html": "/#about",
  "/cv/": "/cv/Matthis-Lahargoue-CV.pdf",
  "/resume/": "/cv/Matthis-Lahargoue-CV.pdf",
  "/portfolio/": "/#projects",
  "/portfolio/01-magyar-cv/": "/projects/industrial-computer-vision/",
  "/portfolio/02-cnn-stock-prediction/": "/projects/cnn-reproducibility/",
  "/portfolio/03-sentiment-analysis-spark/":
    "/projects/distributed-sentiment-analysis/",
  "/portfolio/04-diabetes-prediction/":
    "https://github.com/matla91/Diabetes-Prediction-Kaggle-Playground-Series-S5E12",
};
for (const [from, to] of Object.entries(redirects)) {
  const target = from.endsWith(".html")
    ? resolve("dist", "." + from)
    : resolve("dist", "." + from, "index.html");
  await mkdir(resolve(target, ".."), { recursive: true });
  await writeFile(
    target,
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${escape(to)}"><title>Page moved — Matthis Lahargoue</title><link rel="canonical" href="${escape(to.startsWith("https:") ? to : origin + to)}"><body><p>This page has moved. <a href="${escape(to)}">Continue to the portfolio</a>.</p></body></html>`,
  );
}
await writeFile("dist/.nojekyll", "");
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
    .filter((p) => p.path !== "/404.html")
    .map((p) => `<url><loc>${origin}${p.path}</loc></url>`)
    .join("")}</urlset>`,
);
console.log(
  `Prerendered ${routes.length} pages and ${Object.keys(redirects).length} legacy redirects.`,
);
