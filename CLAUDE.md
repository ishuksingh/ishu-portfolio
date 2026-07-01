# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Personal portfolio and consulting site for Ishu Kumar — similar in structure to buildwithrv.com. AI-focused consultant portfolio with services, testimonials, and a booking/contact flow.

## Stack

- Next.js 16 (App Router) + React 19 — see AGENTS.md warning about breaking changes
- Tailwind CSS v4
- TypeScript
- Deployed on Vercel

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

## Conventions

- All pages live in `app/` using the App Router (no `pages/` directory)
- Components go in `app/components/`
- Use Tailwind utility classes only — no custom CSS files
- TypeScript strict mode is on; avoid `any`

## Key context

- Brand: professional but approachable, AI-native consultant
- Target audience: enterprise teams and individuals looking for AI training/mentoring
- Do not add placeholder lorem ipsum content — use realistic AI consulting copy
