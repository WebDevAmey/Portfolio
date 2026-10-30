# Portfolio v2: Implementation plan

Companion to `SPEC.md`. Each step is one or two commits on `revamp/v2`. Run `npm run lint && npm run typecheck && npm test && npm run build` before every push.

## Steps

- [x] **0. Guardrails**
  - `.claude/settings.json` with `includeCoAuthoredBy: false` and empty `attribution.commit` / `attribution.pr`.
  - Confirm `git config user.name` / `user.email` match the existing history.
  - `docs: add revamp spec and implementation plan`
- [x] **1. Tooling**
  - Add Prettier, Vitest; scripts `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `format`.
  - `chore: add prettier, vitest and typecheck scripts`
- [x] **2. Strip the template**
  - Delete old routes (`projects` index, `experience`, `contact`, `pull-requests`, `highlights`, `blogs`, `api/github`), old components, hooks, sound engine, unused images and sounds.
  - Remove dependencies: three, gsap, framer-motion, cmdk, radix, next-themes, react-icons, lucide-react, shadcn, class-variance-authority, tailwind-merge, tw-animate-css.
  - Add permanent redirects in `next.config.ts`; enable `experimental.viewTransition`.
  - `refactor: remove template routes, components and dependencies`
- [x] **3. Tokens and base styles**
  - `src/styles/tokens.css` (color, type, space, radius, motion), `src/app/globals.css` (Tailwind import, `@theme inline` mapping, base, focus, selection, reduced-motion reset).
  - Fonts in `src/app/fonts.ts` (Bricolage Grotesque, JetBrains Mono).
  - `src/lib/motion.ts` (durations and easings for JS).
  - `feat: add design tokens, fonts and base styles`
- [x] **4. Data**
  - `src/data/site.ts`, `src/data/projects.ts` (typed, OVRT added), `src/lib/project-art.ts` for placeholder gradients.
  - `feat: add typed site and project data`
- [x] **5. Layout shell**
  - `src/app/layout.tsx` (metadata, OG/Twitter, viewport, analytics only on Vercel), `components/site-header.tsx`, `components/site-footer.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`.
  - `feat: add header, footer and metadata routes`
- [x] **6. Hero**
  - `components/icons.tsx`, `components/status-badge.tsx`, `components/morph-pill.tsx`, `sections/hero.tsx`, `lib/use-reduced-motion.ts`.
  - `feat(hero): add morphing pill sentence and status badge`
- [x] **7. Works**
  - `components/project-thumb.tsx`, `components/works-ring.tsx` (port of existing ring + keyboard, caption, hint), `components/works-bento.tsx`, `components/cursor-dot.tsx`, `sections/works.tsx`.
  - `feat(works): add spotlight ring with keyboard control`
  - `feat(works): add bento grid and index list for small screens`
  - `feat(works): add magnetic lime cursor`
- [x] **8. Case study**
  - `app/projects/[slug]/page.tsx` with `generateStaticParams`, `generateMetadata`, shared `ViewTransition` thumbnail, next-project link.
  - `feat: add case study pages with view transition`
- [x] **9. About and contact**
  - `sections/about.tsx`, `sections/contact.tsx`, `components/squish-button.tsx`, `lib/shards.ts`.
  - `feat(about): add about summary`, `feat(contact): add squishy cta with shard burst`
- [x] **10. Daily quote**
  - `src/lib/quotes.ts` (`getDayOfYear`, `getQuoteForDate`, `msUntilNextMidnight`), `src/data/quotes.json`, `components/daily-quote.tsx`, `src/lib/quotes.test.ts`.
  - `feat(quote): add deterministic daily quote`, `test(quote): cover data and day-of-year mapping`
- [x] **11. Polish and QA**
  - Contrast pass, lime budget, focus order, Lighthouse, 360/768/1280/1920 screenshots, reduced motion, keyboard only.
  - `perf: …`, `fix: …` as needed.
- [x] **12. Docs**
  - README: setup, scripts, structure, adding a project, editing quotes.
  - `docs: rewrite readme for v2`
- [x] **12b. Revision 2: black and white, koi pond**
  - Remove the magnetic cursor and the display font; monochrome tokens; centred pill nav.
  - `lib/pond/*` and `components/pond-canvas.tsx`; hero intro under the pond.
  - Restyle works, about, contact and the case study; redesign the footer with `components/local-time.tsx`.
  - `refactor: remove the custom cursor and display font`, `feat(pond): …`, `style: …`, `feat(footer): …`
- [ ] **13. Deploy**
  - Push `revamp/v2`; Vercel builds a preview automatically. Merge to `main` only after Amey approves.

## File plan

```
src/
  app/
    layout.tsx            fonts, metadata, header/footer shell
    page.tsx              composes sections
    globals.css           tailwind + base
    fonts.ts
    sitemap.ts robots.ts opengraph-image.tsx
    projects/[slug]/page.tsx
    not-found.tsx
  components/             site-header, site-footer, status-badge, morph-pill, icons,
                          project-thumb, works-ring, works-bento, pond-canvas,
                          squish-button, daily-quote, local-time
  sections/               hero, works, about, contact
  data/                   site.ts, projects.ts, quotes.json
  lib/                    motion.ts, quotes.ts, quotes.test.ts, shards.ts,
                          use-reduced-motion.ts, project-art.ts
  lib/pond/               engine.ts, koi.ts, scenery.ts, caustics.ts, random.ts
  styles/tokens.css
public/project-image/     existing thumbnails (dark variants only)
```

## Test plan

- Unit (Vitest), `src/lib/quotes.test.ts`:
  - 366 entries, ids exactly 1-366, non-empty text and author, no duplicate text (case and punctuation insensitive), each ≤ 160 chars.
  - `getDayOfYear`: Jan 1 = 1, Dec 31 = 365 (2025) / 366 (2024, 2028), Feb 29 = 60, Mar 1 = 60 vs 61, 2100 is not leap.
  - DST: dates on both sides of DST changes, evaluated with `TZ=America/New_York` and `TZ=Europe/London`, plus 00:30 and 23:30 on a transition day.
  - `getQuoteForDate` returns id 366 only on leap-year 31 Dec; `msUntilNextMidnight` is positive and ≤ 24h (25h on a DST fall-back day).
- Static checks: `eslint`, `tsc --noEmit`, `next build`.
- Manual/automated browser checks with Playwright: screenshots at 360, 768, 1280, 1920; keyboard walk (Tab order, ring arrows, Enter); `reducedMotion: 'reduce'` context; console free of errors.
- Lighthouse CLI (mobile preset) against `next start`.

## Rollback

- `main` is untouched until approval, so production keeps serving the old site.
- After merge, revert with `git revert -m 1 <merge-sha>` or promote the previous Vercel deployment from the dashboard (instant).
- Removed files remain in history on `main` before the merge commit.
