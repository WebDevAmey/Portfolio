# Portfolio v2: Spec

Owner: Amey Tarmale · Branch: `revamp/v2` · Live: https://www.ameytarmale.site

> **Revision 2 (black and white, koi pond).** After reviewing the first build, Amey asked for a cleaner, minimal, black-and-white site with an animated koi pond at the centre, no custom cursor and a better footer. This revision supersedes the dark cobalt/lime palette, the display font cut, the magnetic cursor, the header and the footer described below; everything else still applies.
>
> - **Palette.** Black on warm white: `--bg #F7F7F5`, `--surface #FFF`, `--chip #ECECEA`, `--fg #111`, `--fg-2 #2A2A2A`, `--mute #666` (5.35:1 on bg, 4.85:1 on chip), hairlines at 8% and 16% black. No accent hue. The pond is the only colour on the page; project screenshots stay grayscale in the ring until a card is active.
> - **Type.** One Bricolage text cut (weights 400 to 600) plus JetBrains Mono for labels. Headings are semibold at modest sizes.
> - **Layout.** One centred column (`--measure` 40rem) for all text, so left edges line up down the page; the pond, bento grid and case-study images use a wider column (`--wide` 60rem). A floating, centred pill nav with a round home mark.
> - **Koi pond.** Original canvas scene under the nav (`components/pond-canvas.tsx`, `lib/pond/*`): a painted pond floor with stones, WebGL caustic light (cellular-noise edges), five koi with a follow-the-leader spine that wander, school loosely and drift toward the pointer, ripples on pointer move, and a dart away from a tap. Edges are feathered with a CSS mask. The engine is code-split and starts in `requestIdleCallback`; it only animates while on screen and the tab is visible. Reduced motion renders a single still frame. Without WebGL the pond renders without caustics.
> - **Hero.** Below the pond: greeting and status badge, the morphing pill sentence, a short line with bold keywords, then Pause, Shuffle and a link to the work.
> - **Contact.** A centred white card with the same squishy "Get in touch" pill, now black; shards are black and greys.
> - **Footer.** Line of the day, then three columns (Navigate, Elsewhere, Contact with live Pune time), a copyright row with "Back to top", and a large faint wordmark.
> - **Removed.** `CursorDot` and the display font file.

## 1. Goals

1. Replace the template-derived site with a single, minimal, dark page that reads as Amey's own: black, cobalt and acid lime, large type, hairlines, a few memorable interactions.
2. Tell the story in under a minute: who he is (hero), what he has built (works), why (about), how to reach him (contact), plus one small daily delight (quote footer).
3. Hit Lighthouse 95+ on mobile in all four categories, CLS ≈ 0, with every interaction usable by keyboard and with reduced motion.

Non-goals: blog, CMS, theme toggle, sound effects, GitHub API widgets.

## 2. Current state (audit, 2026-10-30)

| Area       | Finding                                                                                                                                                                                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repo       | `WebDevAmey/Portfolio`, default branch `main`, 5 commits, all authored as `WebDevAmey <159521019+WebDevAmey@users.noreply.github.com>`.                                                                                                                                                            |
| Stack      | Next.js 16.2 (App Router), React 19.2, TypeScript (strict), Tailwind CSS v4, ESLint 9 with `eslint-config-next`. Deployed on Vercel with `@vercel/analytics` and `@vercel/speed-insights`.                                                                                                         |
| Origin     | Built on an open-source template (Ashutosh Singh's Portfolio-v2). Ships framer-motion, gsap, three, cmdk, radix, next-themes, react-icons, shadcn and a sound engine. Most of it is template weight.                                                                                               |
| Routes     | `/`, `/projects`, `/projects/[slug]`, `/experience`, `/contact` (FormSubmit form), `/pull-requests`, `/highlights`, `/blogs/[slug]`, `/api/github`.                                                                                                                                                |
| Identity   | Name Amey Tarmale; tagline "Full-Stack Web Developer"; bio bullets about React/Next/Node/MongoDB, caring about animation and clean component APIs.                                                                                                                                                 |
| Contact    | Email `ameytarmale7@gmail.com` (used by the contact form). GitHub `WebDevAmey`, X `@ameytwtcorp`, LinkedIn `amey-tarmale-64b499241`.                                                                                                                                                               |
| Resume     | No resume file or link exists anywhere in the repo or on the live site.                                                                                                                                                                                                                            |
| Projects   | 14 in `src/data/projectsData.ts`: Textlab, Mission Planner, System Design Mafia (credit: Atharva Arbat), ResearchGraph, Seam, ButtonLab, MiniKV, HoveraUI, Gatekeep, Cadence, Karagiri, AI Summit Explorer, loom, Lead Agent. All have `.webp` thumbnails in `public/project-image/`.              |
| OVRT       | Not on the site or in the repo. Added from the brief; https://ovrt.in confirms it (AI co-pilot for Shopify stores, built for Indian D2C brands). No thumbnail, so it gets a generated placeholder.                                                                                                 |
| Education  | MIT-WPU is not mentioned anywhere. Taken from the brief.                                                                                                                                                                                                                                           |
| SEO        | Title "Amey Tarmale", description, OG + Twitter (`@ameytwtcorp`) with `/og-image.jpg`, favicon/icon/apple-icon. No sitemap or robots. `metadataBase` falls back to the Vercel URL.                                                                                                                 |
| Quote      | Footer shows one fixed quote (Alex Hormozi).                                                                                                                                                                                                                                                       |
| Works ring | `src/components/WorksRing.tsx` (from the earlier thread): rAF-driven elliptical ring, idle drift, scroll and drag momentum, entrance fan-out, hover spotlight (grayscale + brightness), rolling letter label. Mouse/focus only, no arrow-key cycling, no description, mobile falls back to a list. |
| Tooling    | Only `dev`, `build`, `start`, `lint`. No tests, typecheck script or Prettier.                                                                                                                                                                                                                      |
| References | The vibrant.design CDN is blocked from the build environment (HTTP 403), so no frame sheets or videos could be viewed. The written profiles were used; the two references without profiles (Josh Puckett, shawn.) are ignored.                                                                     |

### Stack decision

Keep Next.js 16 + React 19 + TypeScript + Tailwind v4. The stack is sound and already deployed on Vercel. The revamp removes the template's heavy dependencies (three, gsap, framer-motion, cmdk, radix, next-themes, react-icons, shadcn, sound engine) because the new design needs only CSS, the Web Animations API and View Transitions.

## 3. Information architecture

Single page, anchored sections, plus generated case-study pages.

```
/                     Home
  header              Home mark · Work · About · Contact · Resume (floating pill)
  #top     Hero       Koi pond, then status badge + morphing pill sentence
  #work    Works      Desktop: ring spotlight. Tablet/mobile: bento + index list
  #about   About      4 sentences + fact list
  #contact Contact    Statement + squishy "Get in touch" CTA + direct links
  footer              Daily quote · link columns · Pune time · back to top · wordmark
/projects/[slug]      Case study (static, one per project), shares the thumbnail via View Transition
```

Old routes redirect permanently: `/projects` → `/#work`, `/contact` → `/#contact`, `/experience` → `/#about`, `/pull-requests`, `/highlights`, `/blogs/*` → `/`.

## 4. Design tokens

All in `src/styles/tokens.css` as CSS custom properties, mapped into Tailwind with `@theme inline`.

### Color

| Token             | Value                    | Use                                        | Contrast on `--ink`     |
| ----------------- | ------------------------ | ------------------------------------------ | ----------------------- |
| `--ink`           | `#0A0A0B`                | page background                            |                         |
| `--ink-2`         | `#121316`                | raised surfaces (pills, cards)             |                         |
| `--line`          | `rgba(255,255,255,0.08)` | hairlines                                  | decorative              |
| `--line-strong`   | `rgba(255,255,255,0.16)` | badge outline, hover hairline              | decorative              |
| `--cobalt`        | `#0047FF`                | fills, glows, icon tiles, card sweep       | 3.15:1 (non-text only)  |
| `--cobalt-bright` | `#4A7AFF`                | text links, focus ring (same hue, lighter) | 5.20:1, 4.88:1 on ink-2 |
| `--lime`          | `#C6FF1A`                | status dot, cursor, active marks, shards   | 16.7:1                  |
| `--paper`         | `#F4F4F0`                | primary text                               | 17.95:1                 |
| `--mute`          | `rgba(244,244,240,0.56)` | secondary text                             | 5.95:1, 5.59:1 on ink-2 |

Paper on cobalt is 5.69:1, ink on lime is 16.7:1. Raw `--cobalt` fails AA for text and for 3:1 non-text on `--ink-2`, so `--cobalt-bright` was added as the minimal adjustment for text and focus rings. No other hues. Project thumbnails are content and keep their own colors, but inactive cards are desaturated in the ring.

Lime budget: dot, cursor, active-word underline, CTA shards, selection highlight. Never a large fill.

### Typography

- Display and text: **Bricolage Grotesque**. Characterful, slightly condensed at display sizes, not Inter/Roboto. Self-hosted with `next/font/local`, `display: swap`. To stay inside the performance budget the variable font is cut into two Latin-subset instances: a display cut (88% width, weight 500, optical sizes 12-96, ~21 KB, preloaded) for headings, and a text cut (100% width, weights 400-600, ~21 KB) for everything else.
- Utility: **JetBrains Mono** for labels, hints, metadata, uppercase with wide tracking.

Fluid scale (`clamp`, 360 → 1440px):

| Token         | Size                                       | Line height | Use                          |
| ------------- | ------------------------------------------ | ----------- | ---------------------------- |
| `--step-hero` | `clamp(2.25rem, 1.3rem + 4.2vw, 5.25rem)`  | 1.12        | hero sentence                |
| `--step-3`    | `clamp(1.75rem, 1.2rem + 2.4vw, 3.5rem)`   | 1.05        | section statements           |
| `--step-2`    | `clamp(1.25rem, 1.05rem + 0.9vw, 1.75rem)` | 1.3         | about, quote                 |
| `--step-1`    | `1.0625rem`                                | 1.55        | body                         |
| `--step-0`    | `0.875rem`                                 | 1.5         | small text                   |
| `--step-mono` | `0.6875rem`                                | 1.4         | mono labels, tracking 0.14em |

### Space, radius, motion

- Space: 4px base (`--space-1` … `--space-12`), section padding `clamp(5rem, 12vw, 10rem)`.
- Radius: `--radius-pill: 999px`, `--radius-card: 14px`, `--radius-sm: 8px`.
- Durations: `--dur-fast 140ms`, `--dur-base 260ms`, `--dur-slow 520ms`, `--dur-burst 900ms`.
- Easings: `--ease-out cubic-bezier(.22,1,.36,1)`, `--ease-in cubic-bezier(.55,0,.75,.2)`, `--ease-spring` a `linear()` spring with ~8% overshoot, `--ease-squish cubic-bezier(.3,1.6,.4,1)`.
- JS reads the same values from `src/lib/motion.ts` so animations never hard-code numbers.

## 5. Components

| Component      | Path                           | Notes                                                                                  |
| -------------- | ------------------------------ | -------------------------------------------------------------------------------------- |
| `SiteHeader`   | `components/site-header.tsx`   | Sticky, 56px, translucent ink with blur, hairline bottom after scroll. Skip link.      |
| `StatusBadge`  | `components/status-badge.tsx`  | Outlined pill, lime dot with slow pulse (static under reduced motion), mono label.     |
| `MorphPill`    | `components/morph-pill.tsx`    | Inline pill: icon tile + word. Stacks all words in one grid cell so width is reserved. |
| `Hero`         | `sections/hero.tsx`            | `h1` with sr-only stable sentence and animated visual copy; pause toggle.              |
| `WorksRing`    | `components/works-ring.tsx`    | Evolved from the existing ring (see 6.2).                                              |
| `WorksBento`   | `components/works-bento.tsx`   | Featured projects in an asymmetric grid, then an index list.                           |
| `ProjectThumb` | `components/project-thumb.tsx` | Real image or generated cobalt/ink/lime placeholder; carries the view-transition name. |
| `CursorDot`    | `components/cursor-dot.tsx`    | Fine-pointer only. Small lime dot that grows into a "View" ring over cards.            |
| `SquishButton` | `components/squish-button.tsx` | The contact CTA (see 6.4).                                                             |
| `DailyQuote`   | `components/daily-quote.tsx`   | Client component, reserved height, word reveal.                                        |
| `Icon` set     | `components/icons.tsx`         | Original 24px stroke icons, `currentColor`.                                            |

## 6. Interaction specs

### 6.1 Hero morph pills

Copy (original, first person): "I build **[products]** for **[founders]**, sweat the **[motion]**, and ship from **[Pune]**." Each bracket is a pill that cycles:

| Slot | Words                                                |
| ---- | ---------------------------------------------------- |
| 1    | products · agents · interfaces · libraries           |
| 2    | founders · D2C brands · developers · curious people  |
| 3    | motion · details · latency · typography              |
| 4    | Pune · the terminal · first principles · late nights |

- States: idle → out (squash `scale(1.12, .55)`, `blur(6px)`, opacity 0, `--dur-fast`, `--ease-in`) → in (from `scale(.6)` + blur to rest, `--dur-slow`, `--ease-spring`).
- The icon tile swaps with a short rotate/scale.
- Triggers: pointer enter or focus on a pill advances that pill. A scheduler advances one slot every 2.4s, round-robin, only while the hero is on screen and the tab is visible.
- Layout: every word is rendered in the same grid cell, inactive ones `visibility: hidden`, so pill width equals the longest word. Zero layout shift.
- A11y: the `h1` contains a visually hidden plain sentence ("I build products for founders, sweat the motion, and ship from Pune.") and the animated copy is `aria-hidden`. Pills are not interactive controls for assistive tech. A mono "pause" toggle (`aria-pressed`) stops the auto cycle (WCAG 2.2.2).
- Reduced motion: no auto cycle, swaps on hover/focus use a 140ms opacity crossfade only.

### 6.2 Works

Desktop (≥ 1024px and fine pointer):

- Projects sit on an ellipse around a centered label that reads `WORKS (15)`. Ring drifts at 0.05 rad/s, gets momentum from scroll and drag (kept from the existing ring), slows to 20% while a card is active.
- Spotlight: the active card scales 1.1 and stays vivid; others go `grayscale(1) brightness(.35)` over `--dur-base`. The center label rolls letter by letter to the project name. A caption (one-line summary and stack) fades in bottom-right. A mono hint sits bottom-left: `HOVER · ← → TO CYCLE · ENTER TO OPEN`.
- Keyboard: the ring is one tab stop (roving `tabindex`). Arrow keys move focus to the next/previous project, Home/End jump, Enter follows the link. The focused card gets the cobalt-bright ring.
- Innovation A, magnetic lime cursor: on fine pointers a lime dot trails the pointer with a spring; over a card it grows into a 64px outlined ring labelled `VIEW` and is pulled 30% toward the card center. Hidden for coarse pointers and reduced motion; the native cursor is never hidden.
- Innovation B, expand to case study: clicking a card navigates to `/projects/[slug]`; the thumbnail morphs into the case-study hero using React `<ViewTransition name="thumb-{slug}">` with a 400ms blur-softened morph. Browsers without the API just navigate.
- Reduced motion: no drift, no entrance fan-out, no momentum; the ring is static and spotlight uses opacity only.

Tablet and mobile (< 1024px or coarse pointer):

- Asymmetric bento of the 6 featured projects (spans 2/1/1/2 …), each tile with image, name, one-liner, stack. No hover dependence; tap opens the case study.
- Below it, a hairline index list of the remaining projects (name, summary, arrow).

### 6.3 About

Four first-person sentences (draft, **needs Amey's review**) plus a mono fact list: Based in Pune · B.Tech CSE (third year), MIT-WPU · Building OVRT · Works in TypeScript, React, Next.js, Node, Python.

### 6.4 Squishy CTA

- Element: `<a href="mailto:…">` styled as a dark tactile pill (ink-2, inner highlight, layered shadow, faint dot texture).
- Press (`pointerdown`): `scale(1.04, .9)` in `--dur-fast` with `--ease-squish`; release springs back.
- Click: the pill flashes a crack (scale 1.06, opacity to 0 in 120ms), 28 original shards (a geometric "A" chevron and a diamond, alternating lime and cobalt-bright) burst from the button rect with random velocity, spin and a soft shadow twin, decelerating over `--dur-burst`. At ~650ms the button springs back in, then the mailto opens.
- Fallbacks: with JS off, reduced motion, or a modified click (ctrl/cmd/shift/middle), the default link action runs immediately with no burst.
- Shards live in a fixed, `aria-hidden`, `pointer-events: none` layer and are removed when done.

### 6.5 Daily quote

- Data: `src/data/quotes.json`, 366 entries `{ id, text, author }`, ids 1-366.
- Algorithm: `getDayOfYear(date)` uses the local calendar date only: `(Date.UTC(y, m, d) - Date.UTC(y, 0, 1)) / 86_400_000 + 1`. Using UTC arithmetic on local components makes it immune to DST. `getQuoteForDate(date, quotes)` returns the quote whose `id` equals the day of year. Non-leap years use 1-365; id 366 appears only on 31 December of leap years.
- Rendering: client component; server markup is an empty box with the final reserved height (`min-height` in `lh` units sized for the 160-char maximum), so filling it never shifts layout. On mount the words reveal with a 30ms stagger (blur 4px → 0, translateY 0.3em → 0). Reduced motion: plain opacity fade.
- Midnight: a timeout fires at the next local midnight (+250ms) and re-renders; `visibilitychange` also re-checks the date because background timers are throttled.
- Sourcing: short, verifiable quotes on craft, building, focus, curiosity, persistence, design, startups and learning. Where attribution was not certain the line is original and credited to Amey Tarmale. No fabricated attributions. **The list needs Amey's review.**

## 7. Data models

```ts
// src/data/projects.ts
type Project = {
  slug: string;
  name: string;
  summary: string; // one line, ≤ 90 chars, used in ring caption and bento
  description: string; // full paragraph for the case study
  kind: "Product" | "Library" | "Agent" | "Tool" | "Systems";
  role?: string;
  stack: string[];
  links: { live?: string; repo?: string };
  image?: { src: string; width: number; height: number; alt: string };
  featured: boolean;
  credit?: string;
};

// src/data/quotes.json
type Quote = { id: number; text: string; author: string };

// src/data/site.ts: name, role, email, socials, resumeUrl, siteUrl, about copy, hero slots
```

## 8. Accessibility

- Landmarks: `header`, `nav`, `main`, `section` (each labelled by its `h2`), `footer`. One `h1` per page.
- Skip link, visible 2px `--cobalt-bright` focus ring with 3px offset everywhere.
- All decorative motion is `aria-hidden`; meaning is never carried by motion alone.
- `prefers-reduced-motion: reduce` handled in CSS (`@media`) and JS (`useReducedMotion`).
- Images have real alt text; placeholders are `role="img"` with a label.
- Targets ≥ 44×44px on touch.

## 9. Performance

- Budgets: Lighthouse mobile ≥ 95 in all four; LCP < 2.0s; CLS < 0.01; INP < 200ms; first-load JS for `/` under ~120 KB gzip.
- Static generation for every route. Hero sentence is server-rendered text (LCP element), fonts preloaded.
- Ring, cursor and CTA are client islands; the ring's rAF loop runs only while on screen.
- Thumbnails through `next/image` (AVIF/WebP, sized), `loading="lazy"` below the fold.
- No animation libraries. Vercel Analytics and Speed Insights only render on Vercel.

## 10. Acceptance criteria

- [x] Palette strictly ink/cobalt/lime + paper/mute; lime under ~5% of any viewport.
- [x] Hero pills morph on hover, focus and interval with no layout shift; pause toggle works; reduced motion crossfades.
- [x] Ring: hover and keyboard spotlight, center label swap, caption, arrows/Home/End/Enter; bento on < 1024px.
- [x] Cursor and View Transition expand work and degrade gracefully.
- [x] CTA squishes and bursts, then opens mail; works with JS off, reduced motion and modified clicks.
- [x] 366 unique quotes, deterministic by local day, live midnight swap, tests pass.
- [x] `npm run lint`, `typecheck`, `test`, `build` all pass.
- [x] Lighthouse mobile ≥ 95 ×4 (home 99/100/100/100, LCP 2.0s, CLS 0.002, TBT 60-80ms). Checked at 360, 768, 1280, 1920.
- [x] Zero `Co-Authored-By` or AI mentions in any commit.

## 11. Assumptions and open questions

1. **Git identity.** The build machine's global git identity is not Amey's, so the repo-local identity was set to the one on every existing commit: `WebDevAmey <159521019+WebDevAmey@users.noreply.github.com>`.
2. **Resume.** No resume exists. The nav "Resume" link points to LinkedIn until a PDF is added at `public/resume.pdf` (then change `resumeUrl` in `src/data/site.ts`).
3. **OVRT** copy, year and role come from the brief and ovrt.in; it has a generated placeholder thumbnail. Needs a real screenshot.
4. **Dark only.** The palette is black-first, so the light theme and theme toggle are dropped.
5. **Removed features:** contact form (replaced by mailto + socials), GitHub graph, PR list, experience timeline (single "Freelance" row with no details), blog and highlights (both empty), command palette, sounds. Old URLs redirect.
6. **No years on projects.** The repo has no reliable dates, so projects carry a `kind` label instead of an invented year.
7. **Reference media** could not be viewed (CDN blocked); built from the written profiles only.
8. **Domain:** `metadataBase` defaults to `https://www.ameytarmale.site`.
9. **Placeholder art.** Nine of the old thumbnails were plain title cards, so those projects now use generated cobalt/lime cover art; only real screenshots (Textlab, Flight Deck, System Design Mafia, ResearchGraph, Cadence) are kept.
10. **Hero pills and keyboard.** The animated sentence is `aria-hidden` (screen readers get one stable sentence), so pills are not focusable. Keyboard users get a Shuffle button that advances every pill, plus Pause/Play.
11. **Ring loading.** The ring's code loads only on wide screens with a fine pointer; phones get the server-rendered bento and never download it.
12. **Subagents.** The audit was small enough (one repo, one live page) to do directly, so no Explore or Plan agents were used.
