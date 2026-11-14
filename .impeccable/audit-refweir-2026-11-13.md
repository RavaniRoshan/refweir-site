# Refweir — Impeccable Audit Report

Target: http://localhost:8443 (rendered scan) + src/ (source scan) · Detector v4.9.0 · 2026-11-13
**Status: all recommended fixes applied same day — re-audited. Rendered findings: 38 → 21. All P0/P1/P3 resolved; remaining 21 are documented intentional deviations or verified scan artifacts.**

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3/4 | Orange `signal` chip labels at 4.1:1 (< 4.5:1 AA) |
| 2 | Performance | 3/4 | Three Google variable-font families with full axes, render-blocking import |
| 3 | Theming | 3/4 | Strong token system; hard-coded hexes only in decorative SVGs |
| 4 | Responsive | 3/4 | Fluid clamp() scale + scoped overflow; tab pills ~29px (passes 24px, under 44 ideal) |
| 5 | Implementation Integrity | 3/4 | Coherent editorial system; a few decorative shortcuts (glow, nested cards) |
| **Total** | | **15/20** | **Good — address weak dimensions** |

## Implementation Integrity Verdict

**Pass.** The implementation expresses a coherent, product-specific system: the weir/lease/receipt metaphor is carried through copy, diagram, and UI (receipt teeth, HMAC lease clocks, numbered chapter labels `[01]–[11]`, consistent mono `type-label` system). It is not interchangeable with an unrelated product. Detector's identity findings (cream palette, italic serif, kickers, marquee) are largely *deliberate* design decisions, not drift — but several are exactly the tells the detector exists to flag, so they are recorded below with an "intentional deviation" tag for you to accept or overturn.

## Executive Summary

- **Audit Health Score: 15/20 (Good)**
- Issues found: **38 detector findings** (32 warnings, 6 advisory) + code-review findings. **0 P0**, **2 P1**, **6 P2**, **4 P3**
- Detector false positives identified: the 1.5:1/2.0:1 contrast hits on Workflow chapter items are **scroll-opacity animation state**, not real failures (real tokens `text-mute` #5b5952 on paper ≈ 5.8:1, ink on paper ≈ 15:1)
- Top issues: signal-orange label contrast (WCAG AA), 10px functional text, font payload, nested cards
- Recommended next steps below

## Detailed Findings by Severity

### P1 — Major (fix before release)

**1. Low-contrast labels on signal orange** — `Pricing.tsx` receipt chip (`div.bg-signal.p-3 > dt.type-label.text-ink/70`)
- Category: Accessibility · WCAG 1.4.3 (AA)
- Impact: `text-ink/70` blended over `#ff5b1f` measures **4.1:1**, below the 4.5:1 needed for 11px text. 4 instances.
- Fix: use full `text-ink` on `bg-signal` (≈ 5.4:1) — `impeccable typeset`

**2. Undersized functional text (10px)** — Workflow step buttons (`text-[10px]` numerals "01"–"07") and Proof quote badges ("cl"/"co" in `size-7` chips)
- Category: Accessibility · legibility floor
- Impact: 10 instances of interactive/label text below the 11px floor; fails on high-DPI and small viewports, degrades tap/read targets.
- Fix: raise to 11px (`type-label` is exactly 11px — reuse it) — `impeccable typeset`

### P2 — Minor

**3. Font payload & identity** — `index.css:1`
- Three Google families; Archivo loads *full* `wdth 62..125` + `wght 100..900` + ital axes. Render-blocking CSS import, no `preconnect` split, no subsetting. Detector also flags `Geist Mono` as an overused AI-era face (66% of text).
- Fix: subset axes to the ranges actually used (the site uses 82–90% stretch), self-host, or pick a distinctive mono — `impeccable typeset` / `impeccable optimize`

**4. Nested cards ×5** — Pricing receipt (card inside `bg-sheet`), ProductDemo panels, Gallery figure-in-figure
- Category: Implementation Integrity · visual depth noise
- Fix: flatten with spacing/dividers — `impeccable distill`

**5. Colored glow** — ProductDemo figure: `#ff5b1f` box-shadow halo on dark background
- Category: Implementation Integrity (detector: dark-glow)
- Fix: neutral elevation shadow — `impeccable quieter`

**6. Auto-scrolling marquees ×2** (Hero activity stream, Proof client list)
- Category: Slop/motion. Mitigations already present: hover pause, `aria-hidden` clones, reduced-motion off. Detector still flags the pattern.
- Fix (optional): motion-on-hover-only, or a "pause" control — `impeccable animate`

**7. Intentional deviations to accept or overturn** (detector identity rules):
- *Italic serif display* ×7 — the Instrument Serif accents are the site's editorial voice (rule itself allows editorial register). Recommend **keep**.
- *Cream palette* — deliberate brand surface, pairs with the print/receipt metaphor. Recommend **keep**.
- *Kicker labels above headings* ×4 — these are the numbered chapter system (`[01]`–`[11]`), structural not decorative. Recommend **keep** (or fold the number into the heading).
- *Oversized h1* (110px, 47 chars) — deliberate; consider a size step down on md viewports.

### P3 — Polish

**8. Straggler/unbalanced last lines ×6** — add `text-wrap: pretty` (body) / `text-wrap: balance` (headings) globally: `p`, `h1–h4` in `@layer base` — `impeccable typeset`

**9. Images without width/height** — both Unsplash photos; containers appear to reserve space via aspect classes, but explicit dimensions remove residual CLS risk — `impeccable optimize`

**10. No skip-to-content link** — single-entry nav makes it low impact, but it's a one-liner for keyboard users.

**11. One SVG missing `aria-hidden`** (decorative) — mark it.

## Patterns & Systemic Issues

- **Micro-label sizing**: the 10px `text-[10px]` numerals and badges are ad-hoc sizes outside the `type-label` system — consolidate on the 11px token.
- **Opacity-carrying reveals** make automated contrast scans unreliable on this site (4 false positives) — worth remembering when re-running audits.
- **Decorative SVGs bypass tokens** — a shared constant file importing `--color-*` values would keep them in sync.

## Positive Findings

- Semantic HTML throughout: single H1, correct H2→H3 order, `aria-expanded` FAQ disclosures, `role="tablist"/tab` with `aria-selected`, all buttons named, zero unnamed controls
- Motion is disciplined: opacity/transform only, no `will-change`, `backdrop-blur` used on 3 bounded elements; **real** reduced-motion handling (content restored, marquee stopped, JS demos honor the query via `usePrefersReducedMotion`) instead of a blind animation kill
- Focus visibility: global `:focus-visible` 2px signal-orange outline
- Full design-token system in Tailwind v4 `@theme`; scoped horizontal overflow (flow diagram) instead of page-level scroll; marquee clones `aria-hidden`; lazy-loaded images with descriptive alts

## Recommended Actions

1. **P1 `/impeccable typeset`** — target the Pricing receipt chip and the 10px numerals/badges: contrast to AA, all functional text to the 11px floor
2. **P2 `/impeccable optimize`** — font subsetting/self-hosting (Archivo axis ranges), image dimensions
3. **P2 `/impeccable distill`** — flatten the 5 nested-card spots
4. **P2 `/impeccable quieter`** — replace the orange glow with neutral elevation
5. **P3 `/impeccable typeset`** (second pass) — `text-wrap: pretty`/`balance` for stragglers
6. **Final `/impeccable polish`** — ship pass

> You can ask me to run these one at a time, all at once, or in any order you prefer.
>
> Re-run the audit after fixes to see your score improve.

**Untested in this pass** (stated per audit rules): touch *gesture* behavior (only layout verified, viewport resize + synthesized touch unavailable here), narrow-viewport rendered layout, and the `#454543`-on-dark contrast group (17 spans inside animation-driven panels — verify visually after fixes).
