import { gzipSync } from "node:zlib";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
export async function serve(directory, port) {
  const root = resolve(directory);
  const server = createServer(async (req, res) => {
    try {
      let file = resolve(
        root,
        "." + decodeURIComponent(new URL(req.url, "http://localhost").pathname),
      );
      if (file !== root && !file.startsWith(root + sep)) {
        res.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
      const content = await readFile(file);
      const compress =
        /\b(text\/|application\/(javascript|xml))/.test(
          mime[extname(file)] || "",
        ) && req.headers["accept-encoding"]?.includes("gzip");
      res
        .writeHead(200, {
          "content-type": mime[extname(file)] || "application/octet-stream",
          "cache-control": "max-age=600",
          vary: "Accept-Encoding",
          ...(compress ? { "content-encoding": "gzip" } : {}),
        })
        .end(compress ? gzipSync(content) : content);
    } catch {
      res
        .writeHead(404, { "content-type": "text/html" })
        .end(await readFile(resolve(root, "404.html")));
    }
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  return server;
}
