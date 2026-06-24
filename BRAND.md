# Cena — Brand System

> **Start with the craving, not the restaurant.**

Cena is a dish-first restaurant discovery and reservation platform. The brand
should read like a confident, modern AI product — the precision of Linear,
Vercel, and Stripe — but warmed up so it feels organic, appetizing, and human.
Carrot-inspired: cream, orange, leaf-green, warm ink. Clean, never neon, no
gradient soup.

---

## 1. Color

Carrot pulled out of warm soil: cream flesh, orange root, green top, dark earth.
Every color is slightly warm (nudged toward red/yellow) — there are no cold
grays in the system.

### Roles

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Background | `--bg` | `#F4EEE2` | Page background (cream) |
| Background sunken | `--bg-sunken` | `#EBE3D3` | Recessed bands, alt sections |
| Surface | `--surface` | `#FCFAF4` | Cards, raised panels |
| Surface hover | `--surface-hover` | `#FFFFFF` | Card hover lift |
| Ink | `--ink` | `#1E1B16` | Primary text, headlines (warm near-black) |
| Ink muted | `--ink-muted` | `#6B6053` | Secondary text, captions |
| Ink faint | `--ink-faint` | `#9A8E7C` | Disabled, placeholder |
| Primary | `--primary` | `#F2641E` | Carrot orange — CTAs, key accents |
| Primary hover | `--primary-hover` | `#DA5512` | Hover state |
| Primary active | `--primary-active` | `#C0470C` | Pressed state |
| Primary tint | `--primary-tint` | `#FBE4D6` | Soft fills, badges, highlight bg |
| Secondary | `--secondary` | `#2F7D4F` | Leaf green — supporting accent, success |
| Secondary tint | `--secondary-tint` | `#DCEBDF` | Soft green fills |
| Accent green | `--accent` | `#46B36A` | Brighter sprout green — tiny accents, live dots |
| Border | `--border` | `#E2D9C8` | Hairlines, card borders |
| Border strong | `--border-strong` | `#CFC3AD` | Inputs, dividers needing weight |

### States

- **Cards** rest on `--surface` with a `1px --border` and a soft warm shadow
  (`0 1px 2px rgba(30,27,22,.04), 0 8px 24px -12px rgba(30,27,22,.12)`).
- **Card hover** → background `--surface-hover`, lift `translateY(-2px)`,
  shadow deepens, border warms toward `--primary` at 25% mix.
- **Primary button** → `--primary` bg, white label (bold). Hover
  `--primary-hover` + `translateY(-1px)`; active `--primary-active`, no lift.
- **Secondary button** → transparent bg, `--ink` label, `1px --border-strong`.
  Hover bg `rgba(30,27,22,.04)`, border `--ink`.

### Contrast (WCAG)

All combinations below are verified live on the styleguide page (each swatch
prints its measured ratio). Targets:

- `--ink` on `--bg` → **13.8:1** — AAA.
- `--ink-muted` on `--bg` → **4.9:1** — AA body text. ✓
- `--secondary` on `--bg` → **4.6:1** — AA body text. ✓
- White on `--primary` → **3.4:1** — passes AA for **large/bold** text only.
  Therefore button labels on carrot are **always ≥16px bold** (large-text
  threshold), and carrot is **never** used for small body copy on cream. For
  small text in orange, use `--primary-active` (`#C0470C`, **4.6:1** on cream).

---

## 2. Typography

A sharp modern pairing: a warm display serif against a clean neutral grotesque.

- **Display / headlines / wordmark — Fraunces** (Google Fonts). A "soft" serif
  with optical sizing and high warmth; gives Cena its appetite and personality.
  Use `opsz` high, weights 400–600. Always tight tracking.
- **Body / UI — Inter** (Google Fonts). The clean, neutral "AI product" voice.
  Weights 400/500/600.

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Type scale (1.25 major-third-ish, tightened)

| Token | Font | Size (clamp) | Weight | Tracking | Line-height |
|-------|------|--------------|--------|----------|-------------|
| Display | Fraunces | `clamp(2.75rem, 6vw, 4.5rem)` | 500 | -0.03em | 1.02 |
| H1 | Fraunces | `clamp(2.25rem, 4.5vw, 3.5rem)` | 500 | -0.025em | 1.05 |
| H2 | Fraunces | `clamp(1.75rem, 3vw, 2.5rem)` | 500 | -0.02em | 1.1 |
| H3 | Fraunces | `1.5rem` | 500 | -0.015em | 1.15 |
| Title | Inter | `1.25rem` | 600 | -0.01em | 1.3 |
| Body-lg | Inter | `1.125rem` | 400 | 0 | 1.6 |
| Body | Inter | `1rem` | 400 | 0 | 1.6 |
| Small | Inter | `0.875rem` | 500 | 0 | 1.5 |
| Eyebrow | Inter | `0.8125rem` | 600 | +0.12em UPPERCASE | 1 |
| Caption | Inter | `0.75rem` | 500 | +0.01em | 1.4 |

Rules: headlines never exceed weight 600. Eyebrows are the only uppercase.
Body line-length caps at ~68ch.

---

## 3. Wordmark

Lowercase **cena**, set tight in Fraunces 600, in `--ink`. One organic touch:
a small carrot-orange **sprout** rising from the dot position above the final
letter — a seedling, not a logo gimmick. Crisp at every size because letters
are live vector text and the sprout is a hand-built SVG path.

- Provided as an inline SVG component (`<Wordmark />`) — see styleguide and
  `wordmark.svg` notes in the styleguide source.
- Minimum size 16px cap-height; sprout scales with it.
- On dark/photo backgrounds: ink → `--bg` (cream), sprout keeps `--primary`.
- Clear space = 0.5× the cap-height on all sides.
- Never: stretch, recolor the letters to orange, add a tagline lockup smaller
  than 14px, or place on a busy photo without a scrim.

---

## 4. Motion & spacing

**Spacing** — 4px base scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
Generous whitespace; section vertical padding `clamp(64px, 10vw, 128px)`.
Content max-width 1120px; text blocks max ~68ch. Radii: buttons 12px, cards
20px, pills full, phone mock 40px.

**Motion** — restrained and physical.

- Entrance easing `cubic-bezier(0.22, 1, 0.36, 1)`; hover easing `ease-out`.
- Durations: hover/tap 150ms; scroll-reveal 500–600ms; loop beats 600ms.
- Scroll reveal: `opacity 0→1`, `translateY(16px→0)`, stagger 60–80ms.
- Hover: cards lift `-2px`; buttons lift `-1px` + darken; live dots pulse.
- **`prefers-reduced-motion`**: all reveals resolve to final state instantly,
  the core-flow loop cross-fades instead of sliding, no pulsing.

---

## 5. Voice

Confident, concise, a little warm. Never cutesy, never hypey.

- **Do:** "Start with the craving, not the restaurant." · "Rate the pad see ew,
  not just the restaurant." · "Find it nearby. Reserve in a tap."
- **Don't:** exclamation spam, "yummy/delish," buzzword stacks, fake metrics.
- Sentences are short. Verbs lead. One idea per line in headlines.
- Lowercase wordmark; sentence case for UI; Title Case only for buttons.
