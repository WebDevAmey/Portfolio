# Amey Tarmale — Portfolio

Personal portfolio of [Amey Tarmale](https://github.com/WebDevAmey), a full-stack web developer building component libraries, AI agents, and full-stack products.

Built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **TypeScript**, on top of the open-source [Portfolio-v2](https://github.com/Ashutoshx7/Portfolio-v2-) template by Ashutosh Singh.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (App Router)
- **Library:** [React](https://react.dev/) 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/), [GSAP](https://greensock.com/gsap/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Deployment:** [Vercel](https://vercel.com/) with Analytics & Speed Insights

---

## Features

- Responsive, grid-based layout with blueprint-style micro-details
- Dark and light mode with system preference detection
- Command palette (`Cmd/Ctrl + K`) for quick navigation
- Interactive GitHub contribution graph
- Project showcase with detail pages
- Experience timeline
- Open-source contributions section
- Skills and technologies grid
- Blog listing
- Contact page
- Sound-engineered micro-interactions

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm / yarn / pnpm / bun

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm start
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```text
Portfolio
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components & UI primitives
│   ├── data/                # Projects, experience, blogs, highlights
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utility functions and sound engine
├── public/                  # Static assets
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## Editing content

| What | Where |
| --- | --- |
| Name, bio, socials, skills | `src/app/page.tsx` |
| Social hover cards | `src/components/pixel-perfect/social-hover-card.tsx` |
| Projects | `src/data/projectsData.ts` |
| Experience list and timeline | `src/data/experienceData.ts`, `src/components/ExperienceTimeline.tsx` |
| Blog posts | `src/data/blogsData.ts` (section hidden while empty) |
| Highlights | `src/data/highlightsData.ts` (section hidden while empty) |
| Site metadata | `src/app/layout.tsx` |

Search the code for `TODO(Amey)` to find the spots that still need personal details.

## Environment variables

| Name | Purpose |
| --- | --- |
| `GITHUB_TOKEN` | GitHub token used by `/api/github` for the contribution graph and pull-request list. A token with no scopes (public data only) is enough. |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, used for Open Graph links. Falls back to the Vercel production URL. |

The contact form posts to [FormSubmit](https://formsubmit.co/); the first submission sends an activation email to `ameytarmale7@gmail.com`.

---

## Deployment

This site is optimized for deployment on [Vercel](https://vercel.com/). Connect your GitHub repository to Vercel and deploy with zero configuration.

For other platforms, use the static or Node.js output mode configured in `next.config.ts`.

---

## Connect

- **GitHub:** [WebDevAmey](https://github.com/WebDevAmey)
- **Twitter / X:** [@ameytwtcorp](https://x.com/ameytwtcorp)
- **LinkedIn:** [Amey Tarmale](https://www.linkedin.com/in/amey-tarmale-64b499241)
- **Email:** [ameytarmale7@gmail.com](mailto:ameytarmale7@gmail.com)
