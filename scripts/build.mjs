import { readFile, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
const pkg = JSON.parse(await readFile("package.json", "utf8"));
if (pkg.name !== "matthis-research-portfolio")
  throw new Error("Run the build from the portfolio root.");
function run(file, args = []) {
  const result = spawnSync(process.execPath, [file, ...args], {
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status || 1);
}
run("node_modules/typescript/bin/tsc", ["--noEmit"]);
for (const path of ["dist", ".ssr"])
  await rm(path, { recursive: true, force: true });
run("node_modules/vite/bin/vite.js", ["build", "--emptyOutDir"]);
run("node_modules/vite/bin/vite.js", [
  "build",
  "--ssr",
  "src/entry-server.tsx",
  "--outDir",
  ".ssr",
  "--emptyOutDir",
]);
await import("./prerender.mjs");
