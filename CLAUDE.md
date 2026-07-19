# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A statically-generated personal knowledge base ("notes") built on **Nuxt 4** + **@nuxt/content v3** + **@nuxt/ui v4**. Content is markdown; the `app/` layer is the presentation shell around it. Dark mode is the crafted primary identity (light is a toggle). Requires **Node >= 22.5**.

## Commands

```bash
npm run dev        # dev server on http://localhost:3000
npm run build      # SSR/Nitro production build
npm run generate   # static prerender — the real target; use this to catch content errors
npm run preview    # serve the built output
```

There is no test runner, linter, or typecheck script configured. To verify content and routing changes, run `npm run generate` — it crawls all links and prerenders every page (`nuxt.config.ts` sets `crawlLinks: true`). `failOnError` is currently `false`, so read the output for warnings rather than relying on a non-zero exit.

## Architecture

**Two coupled layers that must stay in sync:**

1. **`content/` — the notes.** Numeric-prefixed folders (`1.dev`, `2.teaching`, …) define a fixed top-level taxonomy. Prefixes set sidebar **order** and are stripped from URLs (`content/1.dev/9.git/1.git-cheat-sheet.md` → `/dev/git/git-cheat-sheet`). Each folder has a `.navigation.yml` (`title` + `icon`) for its sidebar entry.

2. **`app/utils/sections.ts` — `siteSections`.** The same top-level taxonomy, hand-declared, driving header nav / homepage grid / footer. **When you add or rename a top-level `content/N.<slug>` folder, update `siteSections` to match** — nothing derives one from the other, so they drift silently.

**Single content collection.** `content.config.ts` defines one `docs` collection (`type: 'page'`) over all `**/*.md`. One tree keeps sidebar, search, and prev/next surroundings coherent. The Zod `schema` there is the source of truth for note frontmatter (tags, keywords, category, createdAt/updatedAt, draft, featured, links, readingTime).

**Three visibility tiers for content:**
- `-`-prefixed filenames (e.g. `-scratch.md`) → excluded entirely, not even rendered in dev (`exclude: ['**/-*.md']` in `content.config.ts`).
- `draft: true` frontmatter → visible in dev (with a DRAFT badge), 404 in production. Filtering happens in two places: `useNotesIndex.ts` (`import.meta.env.PROD` transform) and `app/pages/[...slug].vue`.
- normal → always visible.

**Reading time** is computed once at parse time by a `content:file:afterParse` hook in `nuxt.config.ts` (word count / 200 over the raw markdown body). Never set `readingTime` in frontmatter.

**Data access is centralized in composables** (`app/composables/`), each wrapping `useAsyncData` under a **fixed key** so every caller shares one fetch — do not call `queryCollection*` ad hoc in components, reuse these:
- `useNotesIndex()` — bodyless index of all notes, powers grids/tags/related/homepage.
- `useDocsNavigation()` — the sidebar/search nav tree.

**Client-only personalization** (`useFavorites`, `useRecentlyViewed`, `useReadingSettings`) persists to `localStorage` and is SSR-empty at prerender. Any UI that depends on it must render inside `<ClientOnly>` to avoid hydration mismatch — see the header comments in `useFavorites.ts`.

**MDC / global components.** Components under `app/components/content/` are registered **globally with bare names** (`nuxt.config.ts` `components` config) because MDC resolves them from markdown at runtime — e.g. `::video-embed` → `VideoEmbed.vue`, mermaid fences → `ProsePre.vue` → `MermaidDiagram.vue`. Everything else in `app/components/` uses the default lazy path-prefixed scan.

## Conventions that bite

- **Module order in `nuxt.config.ts` matters:** `@nuxt/ui` must precede `@nuxt/content` so Nuxt UI's prose components register with MDC. `@nuxt/ui` bundles Tailwind v4, `@nuxt/icon`, `@nuxt/fonts`, and color-mode — do not add those separately.
- **Syntax-highlight languages are an explicit allowlist** in `nuxt.config.ts` (`content.build.markdown.highlight.langs`). A language not listed renders *unhighlighted with no error* — add new languages there.
- **Icons are bundled at build time** from locally-installed `@iconify-json/*` packages (no CDN). Use icons from `lucide`, `simple-icons`, or `vscode-icons`; install another `@iconify-json/*` package to add a set.
- **Theme** is centralized in `app/app.config.ts` (colors `primary: 'phosphor'`, `neutral: 'stone'`; terminal-flavored mono UI). `app/assets/css/main.css` holds custom CSS.

## Authoring notes

Frontmatter and MDC conventions live in `content/6.meta/1.authoring-guide.md` (rendered at `/meta/authoring-guide`); `content/6.meta/2.markdown-showcase.md` demonstrates every supported MDC feature. Follow those when adding or editing content. Cross-link notes with root-relative paths (`/dev/clean-code/naming-things`), and bump `updatedAt` on meaningful edits.
