// Run in CI, or on a development machine with Playwright Chromium installed.
import { chromium } from "@playwright/test";
import { mkdir, writeFile, mkdtemp, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { serve } from "./serve.mjs";
const require = createRequire(import.meta.url);
const directory = "docs/audit-v2/generated";
await mkdir(directory + "/captures", { recursive: true });
const widths = [1440, 1280, 768, 390, 320];
const routes = [
  "/",
  "/projects/nlos-computational-imaging/",
  "/projects/industrial-computer-vision/",
  "/projects/cnn-reproducibility/",
  "/projects/basel-tram-air/",
  "/projects/distributed-sentiment-analysis/",
];
const baseline = process.env.QA_BASELINE_DIR;
const servers = [await serve("dist", 4173)];
if (baseline) servers.push(await serve(baseline, 4174));
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const report = {
  date: new Date().toISOString(),
  browser: browser.version(),
  conditions: {
    widths,
    height: 900,
    deviceScaleFactor: 1,
    reducedMotion:
      "reduce for deterministic captures; separate normal-motion test",
    network: "local HTTP, no throttling",
    baseline: process.env.QA_BASELINE_SHA || null,
  },
  checks: [],
  interactionChecks: [],
  errors: [],
};
const verify = (condition, message) => {
  if (!condition) report.errors.push(message);
};
async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter(
          (i) =>
            i.loading !== "lazy" ||
            (i.getClientRects().length > 0 &&
              getComputedStyle(i).visibility !== "hidden" &&
              i.getBoundingClientRect().top < innerHeight &&
              i.getBoundingClientRect().bottom > 0),
        )
        .map((i) => i.decode().catch(() => {})),
    );
  });
}
let zoomContext;
let zoomDirectory;
try {
  for (const version of baseline ? ["before", "after"] : ["after"]) {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    context.setDefaultTimeout(15_000);
    const page = await context.newPage();
    page.on("pageerror", (error) => {
      if (version === "after")
        report.errors.push("Page error: " + error.message);
    });
    const base =
      version === "before" ? "http://127.0.0.1:4174" : "http://127.0.0.1:4173";
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        console.log(`${version}: ${width}px ${route}`);
        const response = await page.goto(base + route);
        await ready(page);
        const layout = await page.evaluate(() => {
          const visible = [...document.querySelectorAll("body *")].filter(
            (e) =>
              e.namespaceURI === "http://www.w3.org/1999/xhtml" &&
              e.getClientRects().length &&
              getComputedStyle(e).visibility !== "hidden",
          );
          const small = visible
            .filter(
              (e) =>
                [...e.childNodes].some(
                  (n) => n.nodeType === 3 && n.textContent.trim(),
                ) && parseFloat(getComputedStyle(e).fontSize) < 12,
            )
            .map((e) => ({
              text: e.textContent.trim().slice(0, 60),
              size: getComputedStyle(e).fontSize,
            }));
          const overflow = visible
            .filter((e) => {
              const r = e.getBoundingClientRect();
              return (
                r.width > 0 &&
                (r.right > document.documentElement.clientWidth + 1 ||
                  r.left < -1)
              );
            })
            .map((e) => ({
              tag: e.tagName,
              class: e.className,
              text: e.textContent.trim().slice(0, 50),
            }));
          return {
            width: innerWidth,
            clientWidth: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
            small,
            overflow,
          };
        });
        const check = {
          version,
          width,
          route,
          status: response.status(),
          layout,
        };
        report.checks.push(check);
        await writeFile(
          directory + "/browser.json",
          JSON.stringify(report, null, 2) + "\n",
        );
        if (version === "after") {
          verify(
            response.status() === 200,
            `${width} ${route}: status ${response.status()}`,
          );
          verify(
            layout.scrollWidth <= layout.clientWidth,
            `${width} ${route}: horizontal overflow (${layout.scrollWidth}/${layout.clientWidth})`,
          );
          verify(
            layout.overflow.length === 0,
            `${width} ${route}: element clipped outside viewport`,
          );
          verify(
            layout.small.length === 0,
            `${width} ${route}: ${layout.small.length} text elements below 12px`,
          );
          await page.addScriptTag({
            path: require.resolve("axe-core/axe.min.js"),
          });
          check.axe = await page.evaluate(async () => {
            const r = await window.axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
              },
            });
            return {
              violations: r.violations.map((v) => ({
                id: v.id,
                impact: v.impact,
                nodes: v.nodes.map((n) => ({
                  target: n.target,
                  summary: n.failureSummary,
                })),
              })),
              incomplete: r.incomplete.map((v) => ({
                id: v.id,
                nodes: v.nodes.length,
              })),
              passes: r.passes.length,
            };
          });
          verify(
            check.axe.violations.length === 0,
            `${width} ${route}: axe ${check.axe.violations.map((v) => v.id).join(", ")}`,
          );
        }
        if (route === "/" || width === 1440 || width === 390) {
          const name = route === "/" ? "hero" : route.split("/")[2];
          await page.screenshot({
            path: `${directory}/captures/${version}-${name}-${width}.jpg`,
            type: "jpeg",
            quality: 85,
          });
        }
        if (route !== "/" && (width === 1440 || width === 390)) {
          await page.locator(".case-figure").scrollIntoViewIfNeeded();
          await ready(page);
          await page.locator(".case-figure").screenshot({
            path: `${directory}/captures/${version}-${route.split("/")[2]}-figure-${width}.jpg`,
            type: "jpeg",
            quality: 85,
          });
        }
        if (route === "/") {
          await page
            .getByRole("button", {
              name: "MAGYAR SA — Applied ML project",
              exact: true,
            })
            .click();
          await ready(page);
          if (version === "after") {
            check.organizationAxe = await page.evaluate(async () => {
              const r = await window.axe.run(
                document.getElementById("organizations"),
                {
                  runOnly: {
                    type: "tag",
                    values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
                  },
                },
              );
              return r.violations.map((v) => ({
                id: v.id,
                nodes: v.nodes.map((n) => ({
                  target: n.target,
                  summary: n.failureSummary,
                })),
              }));
            });
            verify(
              check.organizationAxe.length === 0,
              `${width}: expanded organization accessibility`,
            );
          }
          const panelHeight = await page
            .locator("#organization-details")
            .evaluate((e) => e.getBoundingClientRect().height);
          await page.locator("#organizations").screenshot({
            path: `${directory}/captures/${version}-organizations-${width}.jpg`,
            type: "jpeg",
            quality: 85,
          });
          if (version === "after") {
            const labels = [
              "ISL — Research internship",
              "ENSISA — Engineering degree",
              "UQAC — Master’s double-degree pathway",
            ];
            for (const name of labels) {
              await page.getByRole("button", { name, exact: true }).click();
              verify(
                Math.abs(
                  (await page
                    .locator("#organization-details")
                    .evaluate((e) => e.getBoundingClientRect().height)) -
                    panelHeight,
                ) < 1,
                `${width}: organization panel changes height`,
              );
            }
            await page
              .getByRole("link", { name: "View education", exact: true })
              .focus();
            await page.keyboard.press("Escape");
            verify(
              await page
                .getByRole("button", { name: labels[2], exact: true })
                .evaluate((e) => e === document.activeElement),
              `${width}: organization Escape focus`,
            );
            const logos = await page
              .locator(".logo-tile img")
              .evaluateAll((images) =>
                images.map((i) => ({
                  src: i.currentSrc,
                  loaded: i.complete && i.naturalWidth > 0,
                  filter: getComputedStyle(i).filter,
                  fitsTile:
                    i.getBoundingClientRect().left >=
                      i.closest("button").getBoundingClientRect().left &&
                    i.getBoundingClientRect().right <=
                      i.closest("button").getBoundingClientRect().right,
                })),
              );
            verify(
              logos.length === 4 &&
                logos.every(
                  (i) => i.loaded && i.filter === "none" && i.fitsTile,
                ),
              `${width}: logo load or original colors`,
            );
            check.logos = logos;
            if (width < 681) {
              await page
                .getByRole("button", { name: "Open navigation" })
                .click();
              await page
                .getByRole("navigation")
                .getByRole("link", { name: "Projects", exact: true })
                .focus();
              await page.keyboard.press("Escape");
              verify(
                await page
                  .getByRole("button", { name: "Open navigation" })
                  .evaluate((e) => e === document.activeElement),
                `${width}: navigation Escape focus`,
              );
            }
          }
          if (width === 1440 || width === 390 || width === 320) {
            for (const selector of [
              "#education",
              "#experience",
              ".project-feature:first-child",
            ]) {
              await page.locator(selector).evaluate((element) =>
                element.scrollIntoView({ block: "start", behavior: "instant" }),
              );
              await ready(page);
              // Capture the viewport with its sticky navigation and scroll padding.
              await page.screenshot({
                path: `${directory}/captures/${version}-${selector.replace(/[^a-z]/g, "")}-${width}.jpg`,
                type: "jpeg",
                quality: 85,
              });
            }
          }
        }
      }
    }
    await context.close();
  }
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  page.setDefaultTimeout(15_000);
  await page.goto("http://127.0.0.1:4173/");
  await ready(page);
  // Reach an unobserved, off-screen control before its scroll observer fires.
  // Focused blocks must be visible synchronously, without an entrance fade.
  const focusedReveal = await page.evaluate(() => {
    const logo = document.getElementById("organization-isl");
    const block = logo.closest("[data-reveal]");
    const wasWaiting = block.classList.contains("will-reveal") &&
      !block.classList.contains("is-revealed");
    logo.focus();
    const style = getComputedStyle(block);
    const result = {
      wasWaiting,
      revealed: block.classList.contains("is-revealed"),
      opacity: style.opacity,
      transition: style.transitionDuration,
    };
    logo.blur();
    result.staysRevealed = block.classList.contains("is-revealed");
    return result;
  });
  report.interactionChecks.push({ name: "focus-before-reveal", ...focusedReveal });
  verify(
    focusedReveal.wasWaiting && focusedReveal.revealed &&
      focusedReveal.opacity === "1" && focusedReveal.transition === "0s" &&
      focusedReveal.staysRevealed,
    "Off-screen focus must reveal content immediately and permanently",
  );
  await page.screenshot({
    path: directory + "/captures/after-keyboard-reveal.jpg",
    type: "jpeg",
    quality: 85,
  });
  // Short screens expose menu clipping that the 900px-high width matrix cannot.
  for (const version of baseline ? ["before", "after"] : ["after"]) {
  for (const viewport of [{ width: 390, height: 360 }, { width: 320, height: 320 }]) {
    await page.setViewportSize(viewport);
    await page.goto(`http://127.0.0.1:${version === "before" ? 4174 : 4173}/`);
    await ready(page);
    await page.getByRole("button", { name: "Open navigation" }).click();
    const cv = page.getByRole("navigation").getByRole("link", { name: "CV", exact: true });
    await cv.focus();
    const menuLayout = await page.locator("#main-nav").evaluate((nav) => {
      const menu = nav.getBoundingClientRect();
      const cv = nav.querySelector(".nav-cv").getBoundingClientRect();
      return {
        bottom: menu.bottom,
        height: innerHeight,
        scrollable: nav.scrollHeight > nav.clientHeight,
        cvVisible: cv.top >= menu.top && cv.bottom <= menu.bottom + 1,
      };
    });
    report.interactionChecks.push({ name: "short-menu", version, viewport, ...menuLayout });
    if (version === "after") verify(
      menuLayout.scrollable && menuLayout.bottom <= viewport.height && menuLayout.cvVisible,
      `${viewport.width}x${viewport.height}: menu CV must remain visible and reachable`,
    );
    await page.screenshot({
      path: `${directory}/captures/${version}-short-menu-${viewport.width}.jpg`,
      type: "jpeg",
      quality: 85,
    });
    if (version === "after") {
    await page.keyboard.press("Tab");
    verify(
      await page.getByRole("button", { name: "Open navigation" }).count() === 1,
      `${viewport.width}: menu must dismiss when keyboard focus leaves`,
    );
    verify(
      await page.getByRole("link", { name: "Explore my work" }).evaluate((e) => e === document.activeElement),
      `${viewport.width}: menu dismissal must preserve the next keyboard target`,
    );
    }
  }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://127.0.0.1:4173/");
  await ready(page);
  await page.getByRole("button", { name: "01 Signals" }).click();
  await page.waitForFunction(
    () =>
      Number(
        getComputedStyle(document.querySelector(".cloud-points")).opacity,
      ) < 0.01 &&
      Number(
        getComputedStyle(document.querySelector(".signal-traces")).opacity,
      ) > 0.99,
  );
  verify(
    Number(
      await page
        .locator(".signal-traces")
        .evaluate((e) => getComputedStyle(e).opacity),
    ) > 0.99,
    "Signal traces not visible",
  );
  await page.getByRole("button", { name: "Pause visual animation" }).click();
  verify(
    (await page
      .locator(".cloud-motion")
      .evaluate((e) => getComputedStyle(e).animationPlayState)) === "paused",
    "Animation pause does not stop cloud",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  verify(
    (await page
      .locator(".signal-traces")
      .evaluate((e) => getComputedStyle(e).animationName)) === "none",
    "Reduced motion is not respected",
  );
  // Equivalent 200% reflow viewport; native browser zoom is tested separately below.
  await page.setViewportSize({ width: 720, height: 450 });
  await page.goto("http://127.0.0.1:4173/");
  await ready(page);
  report.reflow200 = {
    method:
      "720 × 450 CSS viewport, equivalent to 1440 × 900 at 200%; not native browser zoom",
    overflow: await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    ),
  };
  verify(!report.reflow200.overflow, "200% reflow viewport overflows");
  await page.screenshot({
    path: directory + "/captures/after-reflow-200.jpg",
    type: "jpeg",
    quality: 85,
  });
  // Native browser zoom, using Chromium's tabs API in an isolated local-only profile.
  zoomDirectory = await mkdtemp(resolve(tmpdir(), "portfolio-zoom-"));
  const extension = resolve("scripts/qa/zoom-extension");
  zoomContext = await chromium.launchPersistentContext(zoomDirectory, {
    channel: "chromium",
    viewport: null,
    reducedMotion: "reduce",
    args: [
      "--no-sandbox",
      "--window-size=1440,900",
      `--disable-extensions-except=${extension}`,
      `--load-extension=${extension}`,
    ],
  });
  zoomContext.setDefaultTimeout(15_000);
  const zoomPage = zoomContext.pages()[0];
  await zoomPage.goto("http://127.0.0.1:4173/");
  await ready(zoomPage);
  let worker = zoomContext.serviceWorkers()[0];
  if (!worker) worker = await zoomContext.waitForEvent("serviceworker");
  const originalWidth = await zoomPage.evaluate(() => innerWidth);
  const factor = await worker.evaluate(async () => {
    const [tab] = await chrome.tabs.query({ url: "http://127.0.0.1:4173/*" });
    await chrome.tabs.setZoom(tab.id, 2);
    return chrome.tabs.getZoom(tab.id);
  });
  await zoomPage.waitForFunction(
    (width) => Math.abs(innerWidth - width / 2) <= 1,
    originalWidth,
  );
  report.nativeZoom200 = {
    method:
      "Chromium native tabs.setZoom(2), 1440 × 900 window, isolated CI-only profile",
    factor,
    originalWidth,
    pages: [],
  };
  for (const route of routes) {
    await zoomPage.goto("http://127.0.0.1:4173" + route);
    await ready(zoomPage);
    const layout = await zoomPage.evaluate(() => ({
      width: innerWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      devicePixelRatio,
    }));
    report.nativeZoom200.pages.push({ route, ...layout });
    verify(
      factor === 2 &&
        Math.abs(layout.width - originalWidth / 2) <= 1 &&
        layout.scrollWidth <= layout.clientWidth,
      `Native 200% zoom: ${route}`,
    );
    if (route === "/" || route.includes("industrial-computer-vision")) {
      // Capture the full physical viewport: Playwright's CSS clip crops native zoom screenshots.
      const session = await zoomContext.newCDPSession(zoomPage);
      const capture = await session.send("Page.captureScreenshot", {
        format: "jpeg",
        quality: 85,
        fromSurface: true,
        captureBeyondViewport: false,
      });
      await writeFile(
        `${directory}/captures/after-native-zoom-200-${route === "/" ? "home" : "magyar"}.jpg`,
        Buffer.from(capture.data, "base64"),
      );
      await session.detach();
    }
  }
  await zoomContext.close();
  zoomContext = null;
  await rm(zoomDirectory, { recursive: true, force: true });
  zoomDirectory = null;
  const pdf = await page.request.get(
    "http://127.0.0.1:4173/cv/Matthis-Lahargoue-CV.pdf",
  );
  verify(
    pdf.status() === 200 && pdf.headers()["content-type"] === "application/pdf",
    "CV download failed",
  );
  const missing = await page.request.get(
    "http://127.0.0.1:4173/does-not-exist/",
  );
  verify(missing.status() === 404, "Missing route must return 404");
  await page.goto("http://127.0.0.1:4173/#experience-magyar");
  await ready(page);
  verify(
    await page.locator("#experience-magyar").evaluate((e) => e.open),
    "Direct experience hash did not open details",
  );
  await page.locator("#experience-magyar summary").focus();
  await page.keyboard.press("Enter");
  verify(
    !(await page.locator("#experience-magyar").evaluate((e) => e.open)),
    "Native keyboard disclosure did not close",
  );
  await page.goto("http://127.0.0.1:4173/projects/industrial-computer-vision/");
  await page.getByRole("link", { name: "All projects", exact: true }).click();
  verify(new URL(page.url()).hash === "#projects", "Case-study return link");
  await page
    .getByRole("link", {
      name: "Read NLOS computational imaging case study",
      exact: true,
    })
    .click();
  await page.locator(".next-project").click();
  verify(
    new URL(page.url()).pathname === "/projects/industrial-computer-vision/",
    "Next project navigation",
  );
} catch (error) {
  report.errors.push(error.stack);
} finally {
  if (zoomContext) await zoomContext.close();
  if (zoomDirectory) await rm(zoomDirectory, { recursive: true, force: true });
  await browser.close();
  for (const server of servers) server.close();
  await writeFile(
    directory + "/browser.json",
    JSON.stringify(report, null, 2) + "\n",
  );
  console.log(
    JSON.stringify(
      {
        browser: report.browser,
        checks: report.checks.length,
        errors: report.errors,
      },
      null,
      2,
    ),
  );
  if (report.errors.length) process.exitCode = 1;
}
