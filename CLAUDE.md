# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build (also type-checks and lints)
- `npm run start` — run the production build
- `npm run lint` — run ESLint

There is no test suite yet.

## Architecture

Next.js (App Router) + TypeScript, styled with plain CSS (no CSS framework).

- `app/layout.tsx`, `app/page.tsx`, `app/globals.css` — root layout and the single page, which renders `<TaskList />`.
- `components/TaskList.tsx` — client component (`"use client"`) holding all task state and logic: add, toggle-done, delete. This is where the app's actual behavior lives.
- `lib/types.ts` — shared `Task` type (`{ id, text, done }`).

There is no backend or database. `TaskList` persists tasks directly to the browser's `localStorage` (key `"tasks"`) via `useEffect` — load on mount, save on every change. If server-side persistence is added later, that read/write logic in `TaskList.tsx` is the place to replace, and this file should be updated to describe the new data flow.
