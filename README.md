# ameytarmale.site

Personal site of Amey Tarmale: CS student at MIT-WPU Pune, founder and developer of [OVRT](https://ovrt.in).

Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4. The design is black and white, with pastel keyword markers in the intro and an illustrated day/night meadow in the footer. No animation libraries: motion is CSS, the Web Animations API, View Transitions and SVG. See [`SPEC.md`](SPEC.md) for the design and interaction spec and [`IMPLEMENTATION.md`](IMPLEMENTATION.md) for the build plan.

## Setup

Requires Node 20 or later.

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Development server                                        |
| `npm run build`     | Production build (all pages are static)                   |
| `npm start`         | Serve the production build                                |
| `npm run lint`      | ESLint                                                    |
| `npm run typecheck` | `tsc --noEmit`                                            |
| `npm test`          | Vitest, then the quote tests again under three time zones |
| `npm run format`    | Prettier                                                  |

## Structure

```text
src/
  app/            layout, home page, case studies, sitemap, robots, OG image, fonts
  sections/       hero, works, stack, contact
  components/     header, photo footer, works card fan, CTA, daily quote, local time, icons
  data/           site.ts (bio, links, hero words), projects.ts, quotes.json
  lib/            quote logic, motion tokens for JS, shard burst, helpers
  styles/         tokens.css (colors, type scale, spacing, radii, durations, easings)
```

Design tokens live in `src/styles/tokens.css`. JS animations read the same durations and easings from `src/lib/motion.ts`.

## Add a project

1. Add an entry to `projects` in `src/data/projects.ts`. The type explains each field.
2. Optional screenshot: put a 16:10 `.webp` (about 1440x900) in `public/project-image/` and set `image: shot("file-name", "alt text")`. Without one, the card gets generated monochrome cover art.
3. Set `featured: true` to show it on the home page (keep it to about six; they make up the card fan in `src/components/works-fan.tsx`). Every project gets a case-study page either way.

A case study page is generated at `/projects/<slug>` automatically.

## Edit the daily quote

`src/data/quotes.json` holds 366 entries, `{ id, text, author }`. The quote for a visitor is the one whose `id` equals their local day of the year; `id` 366 only shows on 31 December of leap years.

- Keep exactly 366 entries with ids 1 to 366, no duplicate text, and each quote at 160 characters or fewer. `npm test` checks all of this.
- Only add quotes whose attribution you can verify. If you are unsure, use `"Unknown"`.

## Edit copy

- Bio, links, status badge: `src/data/site.ts`
- Intro paragraph: `src/sections/hero.tsx`
- Tech stack logos: `src/components/stack-icons.tsx` (icons from `simple-icons`)
- GitHub calendar: fetched from the public profile at build time and refreshed daily (`src/lib/github.ts`). If it shows nothing, turn on "Include private contributions on my profile" in GitHub settings.
- Resume: drop a PDF in `public/resume.pdf` and set `resumeUrl: "/resume.pdf"` in `src/data/site.ts`.

## Fonts

Bricolage Grotesque and JetBrains Mono (both SIL OFL 1.1) are self-hosted from `src/app/fonts/` as Latin subsets. Bricolage is shipped as one small static instance (weights 400 to 600) cut from the variable font.

## The footer

The footer background is a photo in `src/assets/footer/`: `hills.webp` and `hills-cutout.webp`, the same photo with the sky removed, which is drawn above the big name so it sits behind the hills. To use a different photo, replace both files with the same dimensions (make the cut-out by masking everything above the horizon). `src/components/site-footer.tsx` handles the pointer drift and the letter-by-letter rise.

## Deploy

Vercel builds every push. Analytics and Speed Insights only render when `VERCEL` is set. Set `NEXT_PUBLIC_SITE_URL` if the domain changes (defaults to `https://www.ameytarmale.site`).
