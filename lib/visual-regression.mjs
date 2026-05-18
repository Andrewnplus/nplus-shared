/**
 * Shared screenshot driver. Imported by per-site scripts; takes a list of
 * routes + a port number, walks the routes, writes one PNG per route into
 * ./screenshots/.
 *
 * Each consumer site exposes its own list of routes to capture (because
 * the page structure differs) but they all use the same playwright call.
 */

import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * @param {object} opts
 * @param {string} opts.baseURL       e.g. "http://localhost:4321"
 * @param {string[]} opts.routes      e.g. ["/", "/blog/", "/about/"]
 * @param {string} opts.outDir        e.g. "./screenshots"
 * @param {{width:number,height:number}[]} [opts.viewports]
 */
export async function capture({ baseURL, routes, outDir, viewports }) {
  const sizes = viewports ?? [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
  ];

  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  for (const route of routes) {
    for (const vp of sizes) {
      await page.setViewportSize(vp);
      const url = baseURL.replace(/\/$/, "") + route;
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => {
        // disable scroll-driven animations & reduce flake
        const style = document.createElement("style");
        style.textContent = `*,*::before,*::after{
          animation-duration:.001ms !important;
          animation-iteration-count:1 !important;
          transition-duration:.001ms !important;
          scroll-behavior:auto !important;
        }`;
        document.head.appendChild(style);
      });
      await page.waitForTimeout(200);
      const slug = route.replace(/^\/+|\/+$/g, "").replace(/\//g, "_") || "home";
      const fname = `${slug}__${vp.width}x${vp.height}.png`;
      await page.screenshot({ path: join(outDir, fname), fullPage: true });
      console.log(`✓ ${fname}`);
    }
  }

  await browser.close();
}
