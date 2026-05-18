# @nplus/shared

Shared infrastructure for the N+ static-site family:

- [`andrewnplus.github.io`](../andrewnplus.github.io) — `nplus.page` (personal brand, dark cathedral route)
- [`outside-the-walls`](../outside-the-walls) — `nplus.faith` (theology podcast, warm parchment route)

Both sites are Astro 6 + React 19 + Tailwind v4 + MDX 5. The visual identity is **intentionally** different; this package only shares the parts that should NOT diverge: token API, lint/format/ts base configs, and a small set of pure-TS lib utilities.

## What's in here

```
nplus-shared/
├── configs/
│   ├── eslint.base.mjs         ← extend in each repo's eslint.config.mjs
│   ├── prettier.base.json      ← reference in each repo's package.json
│   └── tsconfig.base.json      ← extend in each repo's tsconfig.json
├── design-tokens/
│   ├── tokens.contract.css     ← documents the shared CSS-var API (surface-*/brand-*)
│   └── prose.contract.css      ← shared .prose-blog override pattern
└── lib/
    ├── reading-time.ts         ← mixed CJK + Latin word counter → minutes
    ├── format.ts               ← formatDate(d, "short"|"long")
    └── seo.ts                  ← buildMeta({ title, description, image, url })
```

## Wiring up

Each consumer repo declares this as a file: dependency:

```jsonc
// package.json
"dependencies": {
  "@nplus/shared": "file:../nplus-shared"
}
```

Then:

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
// somewhere in src/
import { readingTime } from "@nplus/shared/lib/reading-time";
import { formatDate } from "@nplus/shared/lib/format";
```

```css
/* src/styles/global.css */
@import "@nplus/shared/tokens.contract.css";
/* then redefine the values per theme */
```

## Design-token contract

Both sites expose the same CSS-variable names with **different values**:

| Variable             | nplus.page (cool stone)      | nplus.faith (warm parchment) |
| -------------------- | ---------------------------- | ----------------------------- |
| `--color-surface-50` | `#f7f7f5` cool linen          | `#faf6ee` warm cream          |
| `--color-surface-900`| `#0d0e0c` near-black          | `#14100c` deep wood           |
| `--color-brand-500`  | `#1f8aa5` Fiestaware turquoise| `#8a3a2c` oxblood             |
| `--color-brand-alt-500` | (unused)                   | `#3f5638` deep forest         |
| `--font-display`     | Fraunces                      | Source Serif 4                |

A site that wants its own theme just overrides the values inside `@theme { ... }`. Component code never reads colors directly — only via these tokens.

## Visual identity continuity (signal that "it's the same author")

The two sites have intentionally different visual languages, but should share a few subtle anchors so a reader who lands on both can feel the family resemblance:

- **Favicon system**: same geometric mark (an `N+` ligature or stacked N+), different color fill per site (`brand-500` of that site). Each site keeps its own PNG/ICO bundle under `public/`, but the geometry must match. When refreshing one, refresh both.
- **Footer copyright line**: `© {year} Andrew Yang · CC BY-NC-SA 4.0` — same wording, same order, same separator.
- **Subscribe CTA structure**: three-part — eyebrow (`Newsletter` uppercase tracked) → serif headline → pill button. Colors per theme.
- **Font fallback chain**: Noto Serif TC, Noto Sans TC, JetBrains Mono — never mix `PingFang TC` on one and `Songti TC` on the other.

These rules live here (and not in each site's DESIGN.md) because they describe what *connects* the family rather than what each site looks like.

## Adding new shared utilities

A function deserves to live here when:

- it's pure (no UI), and
- both sites would otherwise copy it.

If only one site uses it, leave it in that site. Don't pre-emptively share.
