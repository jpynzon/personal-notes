<script setup lang="ts">
// Shared command-palette open state (Nuxt UI owns this ref via a shared
// composable; the header, hero and error page all drive the same overlay).
const { open } = useContentSearch()

// Search index: heading-level sections plus each note's tags/keywords folded
// into its top section so a tag query still finds the note. Loaded client-side
// only (`server: false`) so the index never bloats prerendered page payloads.
const { data: searchFiles } = await useLazyAsyncData(
  'search-files',
  async () => {
    const [sections, notes] = await Promise.all([
      queryCollectionSearchSections('docs'),
      queryCollection('docs')
        .select('path', 'title', 'description', 'tags', 'keywords', 'draft')
        .all()
    ])

    const visibleNotes = import.meta.env.PROD
      ? notes.filter((n) => !n.draft)
      : notes
    const draftPaths = new Set(
      notes.filter((n) => n.draft).map((n) => n.path)
    )
    const byPath = new Map(visibleNotes.map((n) => [n.path, n]))

    const enriched = sections
      // Hide draft sections in production.
      .filter((s) => !(import.meta.env.PROD && [...draftPaths].some((p) => s.id.startsWith(p))))
      .map((s) => {
        const note = byPath.get(s.id)
        if (!note) return s
        const extra = [note.description, ...(note.tags ?? []), ...(note.keywords ?? [])]
          .filter(Boolean)
          .join(' ')
        return { ...s, content: [s.content, extra].filter(Boolean).join(' ') }
      })

    return enriched
  },
  { server: false }
)

const { data: navigation } = await useDocsNavigation()

// '/' opens search from anywhere (defineShortcuts ignores keypresses in inputs).
defineShortcuts({
  '/': () => {
    open.value = true
  }
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="searchFiles || []"
        :navigation="navigation || []"
        :fuse="{ resultLimit: 25, fuseOptions: { threshold: 0.3 } }"
        placeholder="Search notes, tags, commands…"
      />
    </ClientOnly>
  </UApp>
</template>
