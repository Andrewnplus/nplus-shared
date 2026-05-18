# Structural follow-ups

These items are flagged as worth doing but are intentionally **not** scaffolded inside this repo because they each require either a separate Astro/Storybook project or external account setup. Recording them here so the next pass can pick up exactly where we left off.

## 1. nplus-design preview site

**What it is**: a separate small Astro site that imports every shared primitive from `@nplus/shared` and renders them on a single `/preview` page (token swatches, `ReadingProgress`, future `SubscribeBand`, etc). The way Storybook is meant to be — but with zero JS framework, just Astro pages.

**Where to put it**: new repo `Andrewnplus/nplus-design` (or `Andrewnplus/preview`). Deploy via the same `nplus-father/workflows` reusable, host at e.g. `design.nplus.page` or as a GitHub Pages subpath.

**Why it's valuable**:

- When you change a shared token, you see what breaks before consumer sites do.
- New components (`SubscribeBand`, future `EpisodeCard`) get a documented rendering before the consumer adopts.
- Acts as the implicit "spec" for what the contract should look like.

**Sketch**:

```
nplus-design/
├── astro.config.mjs           ← same as the consumer sites
├── package.json               ← consumes @nplus/shared via github: ref
└── src/
    ├── styles/global.css      ← imports tokens.contract.css, exposes BOTH themes side-by-side
    ├── pages/
    │   ├── index.astro        ← list of all primitives
    │   ├── tokens.astro       ← color/typography/spacing swatches
    │   ├── components.astro   ← rendered components in nplus.page theme
    │   └── components-faith.astro ← same components in nplus.faith theme
    └── components/
        └── Swatch.astro
```

**Effort**: ~2–4 hours initial setup. The hard part is the design intent, not the code.

---

## 2. Visual regression CI (Chromatic / Percy / Argos)

**What it is**: every PR runs a headless browser, takes snapshots of every page (and the preview site above), diffs against `main`. Catches "I changed a Tailwind class and unintentionally broke this other page" before merge.

**Recommended tool**: [Argos CI](https://argos-ci.com/) — Playwright-based, generous free tier, easier setup than Chromatic for static sites.

**Setup outline**:

1. Sign up at argos-ci.com with the `Andrewnplus` GitHub org.
2. Add `@argos-ci/cli` and `playwright` as devDependencies in each consumer repo.
3. Write a Playwright script that visits the top-N pages and screenshots them.
4. Run in GitHub Actions on PR:
   ```yaml
   - run: npm run build
   - run: npx playwright install --with-deps chromium
   - run: node scripts/visual-regression.mjs
   - run: npx @argos-ci/cli upload screenshots/
     env:
       ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
   ```
5. PR gets a check with a link to the visual diff in Argos's UI.

**Why deferred**: needs an external account, repo secret, and per-repo CI surgery. Not blocking; revisit when a regression actually slips through.

---

## 3. Shared `SubscribeBand` component

Now that we've validated `.astro` files ship cleanly through the package (see `components/ReadingProgress.astro`), the next candidate is the closing CTA band. Today each site has its own (`SubscribeSubstack.astro` / `SubstackCTA.astro`); they have ~80% overlap.

**Plan**:

- Accept `theme: "light" | "dark"`, `eyebrow`, `heading`, `subhead`, `cta` (label + href) as props.
- Default to dark theme, since both sites currently use a dark band before footer.
- Move into `nplus-shared/components/SubscribeBand.astro`.
- Each consumer wraps it once in a thin per-site component that injects copy + URL.

**Effort**: ~30 minutes. Do it next time either site touches its subscribe band copy.
