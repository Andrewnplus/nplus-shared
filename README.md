# @nplus/shared

Shared infrastructure for the N+ static-site family:

- [`andrewnplus.github.io`](../../sites/andrewnplus.github.io) — `nplus.page` (personal brand, dark cathedral route)
- [`outside-the-walls`](../../sites/outside-the-walls) — `nplus.faith` (theology podcast, warm parchment route)
- [`nplus-design`](../nplus-design) — preview site at <https://nplus.page/nplus-design/> that renders every shared component in both themes

All are Astro 6 + React 19 + Tailwind v4 + MDX 5. The visual identity is **intentionally** different; this package only shares the parts that should NOT diverge: lint/ts base configs, two Astro components, and a few pure lib utilities.

## What's in here

| Export                                  | Used by                    |
| --------------------------------------- | -------------------------- |
| `eslint.base`                           | all three                  |
| `tsconfig.base.json`                    | all three                  |
| `components/ReadingProgress.astro`      | all three                  |
| `components/SubscribeBand.astro`        | all three                  |
| `lib/visual-regression`                 | nplus.page, nplus.faith    |
| `lib/reading-time`                      | nplus.page, nplus.faith    |
| `lib/format`                            | nplus.page                 |

Keep this table true: an export no consumer imports gets deleted, not kept "for later".

## Wiring up

Consumers depend on the GitHub repo, not a local path, so CI can install it:

```jsonc
// package.json
"dependencies": {
  "@nplus/shared": "github:Andrewnplus/nplus-shared#main"
}
```

The consumer's `package-lock.json` pins the commit. After pushing a change here, pull it into each consumer with `npm update @nplus/shared` and commit the lockfile — check it on `nplus-design` first.

```js
// eslint.config.mjs
import base from "@nplus/shared/eslint.base";
export default [...base /* , per-repo overrides */];
```

```json
// tsconfig.json
{ "extends": "@nplus/shared/tsconfig.base.json" }
```

```ts
import { readingTime } from "@nplus/shared/lib/reading-time";
import { formatDate } from "@nplus/shared/lib/format";
```

## Design-token contract

The shared components read only CSS variables, so every site must define the same names inside its own `@theme { ... }` block, with its own values:

- `--color-surface-50` … `--color-surface-950` — page bg → deepest dark (50 = light page bg, 950 = deepest hero bg)
- `--color-brand-50` … `--color-brand-900` — primary accent (500 = CTA, 400 = link/eyebrow on dark, 600 = link/hover on light)
- `--color-brand-alt-50` … `--color-brand-alt-900` — optional secondary
- `--font-sans`, `--font-serif`, `--font-display` (may equal serif), `--font-mono`
- `--color-page` — optional, defaults to `--color-surface-50`

| Variable                | nplus.page (cool stone)        | nplus.faith (warm parchment) |
| ----------------------- | ------------------------------ | ---------------------------- |
| `--color-surface-50`    | `#f7f7f5` cool linen           | `#faf6ee` warm cream         |
| `--color-surface-900`   | `#0d0e0c` near-black           | `#14100c` deep wood          |
| `--color-brand-500`     | `#1f8aa5` Fiestaware turquoise | `#8a3a2c` oxblood            |
| `--color-brand-alt-500` | (unused)                       | `#3f5638` deep forest        |
| `--font-display`        | Fraunces                       | Source Serif 4               |

Long-form prose: each site's `.prose-blog` maps the Tailwind Typography hooks (`--tw-prose-body`, `--tw-prose-headings`, `--tw-prose-links`, …) onto these tokens rather than hard-coding colors.

## Visual identity continuity (signal that "it's the same author")

The two sites have intentionally different visual languages, but should share a few subtle anchors so a reader who lands on both can feel the family resemblance:

- **Favicon system**: same geometric mark (an `N+` ligature or stacked N+), different color fill per site (`brand-500` of that site). Each site keeps its own PNG/ICO bundle under `public/`, but the geometry must match. When refreshing one, refresh both.
- **Footer copyright line**: `© {year} Andrew Yang · CC BY-NC-SA 4.0` — same wording, same order, same separator.
- **Subscribe CTA structure**: three-part — eyebrow (`Newsletter` uppercase tracked) → serif headline → pill button. Colors per theme.
- **Font fallback chain**: Noto Serif TC, Noto Sans TC, JetBrains Mono — never mix `PingFang TC` on one and `Songti TC` on the other.

These rules live here (and not in each site's DESIGN.md) because they describe what *connects* the family rather than what each site looks like.

## Visual regression

Each consumer site has `scripts/screenshot.mjs` (route list) on top of `lib/visual-regression.mjs` (shared headless Chrome config), run by `.github/workflows/visual-regression.yml` on every PR. It uploads one PNG per route × viewport (1280×800, 390×844) as the `screenshots-pr-<n>` artifact; compare by eye. There is no baseline diff — adding Argos would need an account and an `ARGOS_TOKEN` secret per site.

## Adding new shared code

Something deserves to live here when:

- both sites would otherwise copy it, and
- it is pure (lib) or reads only the token contract (component).

If only one site uses it, leave it in that site. Don't pre-emptively share. A new component also gets a render section in `nplus-design/src/pages/components.astro`, or the preview drifts.

Candidates once either site touches them again: `EpisodeCard` (nplus.faith) and `PodcastCard` (nplus.page) share ~70% of their structure.
