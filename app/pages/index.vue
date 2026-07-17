<script setup lang="ts">
import { siteSections } from '~/utils/sections'

const { open: searchOpen } = useContentSearch()
// Awaited so the featured grid and section counts are present at SSR render,
// matching the client payload (avoids a hydration mismatch).
const { data: notes } = await useNotesIndex()
const { recent, popular } = useRecentlyViewed()

// Note counts per top-level section, for the section grid.
const counts = computed(() => {
  const map: Record<string, number> = {}
  for (const s of siteSections) map[s.slug] = 0
  for (const note of notes.value ?? []) {
    const seg = note.path.split('/').filter(Boolean)[0]
    if (seg && seg in map) map[seg] += 1
  }
  return map
})

const featured = computed(() =>
  (notes.value ?? []).filter((n) => n.featured).slice(0, 6)
)

// Map recent/popular localStorage entries back to full note summaries.
const byPath = computed(() => new Map((notes.value ?? []).map((n) => [n.path, n])))
const recentNotes = computed(() =>
  recent.value.map((e) => byPath.value.get(e.path)).filter((n): n is NonNullable<typeof n> => !!n).slice(0, 4)
)
const popularNotes = computed(() =>
  popular.value.map((e) => byPath.value.get(e.path)).filter((n): n is NonNullable<typeof n> => !!n)
)

useSeoMeta({
  title: 'Home',
  description:
    'A personal knowledge base — developer notes, teaching material, snippets and cheat sheets, all in one fast, searchable place.'
})
</script>

<template>
  <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
    <!-- Hero: a quiet terminal, the site's native surface -->
    <section class="pt-16 pb-14 sm:pt-24 sm:pb-20">
      <div class="mx-auto max-w-3xl text-center">
        <p class="font-mono text-sm text-[var(--ui-text-muted)]">
          <span class="text-[var(--ui-primary)]">~</span>
          <span class="mx-1.5">$</span>
          <span>cat ./what-is-this.md</span>
        </p>

        <h1
          class="mx-auto mt-6 max-w-2xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-[var(--ui-text-highlighted)] sm:text-[2.75rem]"
        >
          Everything I know,
          <span class="text-[var(--ui-primary)]">one keystroke away.</span>
        </h1>

        <p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--ui-text-muted)]">
          A second brain for a developer who also teaches — dev notes, lesson
          plans, snippets and cheat sheets, kept in one fast, searchable place.
        </p>

        <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
          <UButton
            size="lg"
            color="primary"
            icon="i-lucide-search"
            label="Search everything"
            class="font-mono"
            @click="searchOpen = true"
          />
          <UButton
            size="lg"
            variant="outline"
            color="neutral"
            trailing-icon="i-lucide-arrow-right"
            label="Browse development"
            class="font-mono"
            to="/dev"
          />
        </div>

        <p class="mt-4 font-mono text-xs text-[var(--ui-text-dimmed)]">
          press
          <kbd class="rounded border border-[var(--ui-border-accented)] bg-[var(--ui-bg-muted)] px-1.5">⌘K</kbd>
          or
          <kbd class="rounded border border-[var(--ui-border-accented)] bg-[var(--ui-bg-muted)] px-1.5">/</kbd>
          anywhere
        </p>
      </div>
    </section>

    <!-- Sections -->
    <section class="pb-8">
      <div class="mb-5 flex items-center gap-3">
        <h2 class="font-mono text-xs uppercase tracking-widest text-[var(--ui-text-muted)]">
          Sections
        </h2>
        <div class="h-px flex-1 bg-[var(--ui-border)]" />
      </div>
      <SectionGrid :counts="counts" />
    </section>

    <!-- Featured -->
    <section v-if="featured.length" class="pt-10 pb-4">
      <div class="mb-5 flex items-center gap-3">
        <h2 class="font-mono text-xs uppercase tracking-widest text-[var(--ui-text-muted)]">
          Featured
        </h2>
        <div class="h-px flex-1 bg-[var(--ui-border)]" />
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NoteCard v-for="note in featured" :key="note.path" :note="note" />
      </div>
    </section>

    <!-- Recently viewed + Popular for you (client-only, from localStorage) -->
    <ClientOnly>
      <div class="grid gap-x-10 gap-y-10 pt-10 pb-4 lg:grid-cols-2">
        <section v-if="recentNotes.length">
          <div class="mb-5 flex items-center gap-3">
            <h2 class="font-mono text-xs uppercase tracking-widest text-[var(--ui-text-muted)]">
              Recently viewed
            </h2>
            <NuxtLink to="/recent" class="font-mono text-xs text-[var(--ui-text-dimmed)] hover:text-[var(--ui-primary)]">
              all →
            </NuxtLink>
            <div class="h-px flex-1 bg-[var(--ui-border)]" />
          </div>
          <div class="grid gap-3">
            <NoteCard v-for="note in recentNotes" :key="note.path" :note="note" compact />
          </div>
        </section>

        <section v-if="popularNotes.length">
          <div class="mb-5 flex items-center gap-3">
            <h2 class="font-mono text-xs uppercase tracking-widest text-[var(--ui-text-muted)]">
              Popular for you
            </h2>
            <div class="h-px flex-1 bg-[var(--ui-border)]" />
          </div>
          <div class="grid gap-3">
            <NoteCard v-for="note in popularNotes" :key="note.path" :note="note" compact />
          </div>
        </section>
      </div>
    </ClientOnly>
  </div>
</template>
