# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Trojan Command Center — mobile-first USC Trojans football tracker for usctrojansfb.com. Next.js 15 (App Router) + React 19 + TypeScript + Tailwind, deployed on Vercel. All football data comes from the College Football Data API (CFBD); there is no database — everything is fetched server-side and cached via Next's `fetch` revalidation.

## Commands

```bash
npm install
cp .env.example .env.local   # set CFBD_API_KEY
npm run dev                  # http://localhost:3000
npm run build
npm run start
```

There is no lint script, no test suite, and no CI config in this repo. `npx tsc --noEmit` can be used to typecheck. Verify changes by running `npm run dev` and checking the affected page in the browser — this is a visual, content-driven site.

Deploy target: Vercel project with env `CFBD_API_KEY`, domain usctrojansfb.com.

## Architecture

**Data layer (`lib/cfbd.ts`)** is the single point of contact with the CFBD API. Every fetch goes through the internal `cfbd<T>(path, revalidate)` helper, which attaches the `CFBD_API_KEY` bearer token and returns `[]` on 400/403/404 instead of throwing (so pages degrade gracefully rather than crash on missing data for a given season/team). `TEAM` ("USC") and `YEAR` (season year) are module-level constants used to build every query — bump `YEAR` here each season. Page-level data fetching should always go through the exported functions in this file (`getGames`, `getRoster`, `getRecord`, `getRankings`, `getTeamStats`, `getRecruits`, etc.) rather than calling CFBD directly. Helper functions like `isUscHome`, `opponentOf`, `mediaForGame`, and `pickNextAndLast` encapsulate recurring logic (home/away detection, matching game media/TV outlet to a game, picking the next/last game from a schedule) and should be reused rather than reimplemented in components.

**Types (`lib/types.ts`)** mirror the CFBD API response shapes (`Game`, `RosterPlayer`, `TeamRecord`, `RankingWeek`, `PlayerSeasonStat`, `Recruit`, `Coach`, etc.). When adding a new CFBD endpoint, add its shape here first.

**Formatting helpers (`lib/utils.ts`)**: `formatGameDate` (Pacific-time game date/time formatting), `formatHeight` (inches → `5'11"`), `classYear` (numeric year → Fr/So/Jr/Sr), `countdownParts` (ms remaining → days/hours/min/sec for countdown UI). Use these instead of duplicating date/roster formatting logic in components.

**Routing (`app/`)**: standard Next App Router pages, all server components doing async data fetching directly in the page function (see `app/page.tsx`, `app/roster/page.tsx`). Dynamic routes: `app/schedule/[id]/page.tsx` (single game hub) and `app/roster/[id]/page.tsx` (player profile), both keyed on CFBD's numeric IDs. Pages generally `Promise.all([...])` several `lib/cfbd.ts` calls up front, with non-critical ones (e.g. recruiting rank, roster) wrapped in `.catch(() => fallback)` so a failing endpoint doesn't take down the whole page.

**Shared UI (`components/`)**: `Header` and `BottomNav` form the persistent app shell (mobile bottom nav + desktop header) wired in `app/layout.tsx`. `GameCard` and `RosterList` are the main reusable list-item components; `Countdown` is a client component for the live kickoff countdown.

**Styling**: Tailwind with a small custom design-system layer. Brand colors (`cardinal`, `gold`, `cream`, `ink` — each with shade variants like `cardinal-deep`, `gold-bright`, `ink-soft`) are defined in `tailwind.config.ts` and are the palette to use for any new UI — avoid introducing arbitrary hex colors in components. Reusable page-level classes (`.page-shell`, `.eyebrow`, `.page-title`, `.page-sub`, `.card`, `.btn-gold`, `.btn-ghost`, `.empty-state`) are defined once in `app/globals.css` under `@layer components` — prefer these over rebuilding the same patterns with raw utility classes. Fonts: Instrument Serif (`font-serif`, headings/display) and Source Sans 3 (`font-sans`, body), loaded via `next/font/google` in `app/layout.tsx`.

**Path alias**: `@/*` maps to the project root (e.g. `@/lib/cfbd`, `@/components/GameCard`).
