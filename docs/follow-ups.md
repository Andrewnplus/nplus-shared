# Structural follow-ups

Three big items used to live here; all three are now implemented. Notes below capture status + where to pick up.

## 1. ✅ nplus-design preview site — DONE

Lives at [`Andrewnplus/nplus-design`](https://github.com/Andrewnplus/nplus-design). Served at `https://andrewnplus.github.io/nplus-design/` (configure CNAME for `design.nplus.page` later if desired). Renders every shared token and component in both themes side-by-side.

**Maintenance**: when adding a new primitive to `@nplus/shared`, also add a render section to `src/pages/components.astro` in `nplus-design`. The two will drift if you don't.

## 2. ✅ Shared `SubscribeBand` component — DONE

Lives at `nplus-shared/components/SubscribeBand.astro`. Has three variants: `band` (full-width dark CTA, default), `inline` (bordered card for article bodies), `compact` (single pill). Each consumer site keeps a thin wrapper (`SubscribeSubstack` for nplus.page, `SubstackCTA` for nplus.faith) that supplies the per-site copy + Substack URL.

## 3. ✅ Visual regression CI — DONE (artifact-based; Argos integration optional)

Both consumer repos now ship:

- `scripts/screenshot.mjs` — Playwright script that visits a fixed list of routes and writes one PNG per `route × viewport` into `./screenshots/`. The actual screenshot driver lives at `@nplus/shared/lib/visual-regression.mjs` so both sites use the same headless Chrome config.
- `.github/workflows/visual-regression.yml` — runs on every PR (and on workflow_dispatch). Builds the site, spins up `astro preview`, captures screenshots, uploads them as a workflow artifact (`screenshots-pr-<n>`).

**How to use**: open a PR that changes UI, wait for the workflow to finish, download the artifact, eyeball the PNGs. Two viewports captured: 1280×800 (desktop) and 390×844 (mobile).

**What's NOT done (deliberately deferred)**:

- **Diff against baseline**: zero false positives but also zero automation. Each PR you compare PNGs by eye against the previous run.
- **Argos / Chromatic upload**: would automate the diff but needs an external account + a repo secret. To enable later:
  1. Sign up at <https://argos-ci.com> with the `Andrewnplus` org.
  2. Add `ARGOS_TOKEN` as a repo secret (one per consumer site).
  3. Add `@argos-ci/cli` as a dev dep and append a step to the workflow:
     ```yaml
     - name: Upload to Argos
       if: env.ARGOS_TOKEN != ''
       env:
         ARGOS_TOKEN: ${{ secrets.ARGOS_TOKEN }}
       run: npx @argos-ci/cli upload screenshots/
     ```

For an editorial 2-site setup with low PR frequency, the artifact approach is honest: it surfaces visual changes for human review without lying about what "passing CI" means.

---

## Open work that's worth doing next

These weren't in the original three but came up while building this out:

- **`design.nplus.page` subdomain + CNAME**: requires DNS + `public/CNAME` in `nplus-design` repo. Skipped because it needs DNS access.
- **Move the per-site Subscribe wrappers (`SubscribeSubstack`, `SubstackCTA`) to be even thinner**: today they re-export `SubscribeBand` with copy. Could be a 4-line component. They're 25 lines because of the prop-passthrough; consider simplifying.
- **Add `EpisodeCard` / `PodcastCard` to shared**: both sites have a card for "external audio episode + cover image". Today: `EpisodeCard.astro` (OTW) and `PodcastCard.astro` (nplus.page). They share ~70% structure. Lift after the next time either site touches them.
- **Lighthouse CI**: pair with the visual-regression workflow to track perf/SEO/a11y scores across PRs. Cheap to add.
