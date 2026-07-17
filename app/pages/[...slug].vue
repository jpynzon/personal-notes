<script setup lang="ts">
import { deriveCategory } from '~/utils/content'

const route = useRoute()

// The note itself.
const { data: page } = await useAsyncData(`doc-${route.path}`, () =>
  queryCollection('docs').path(route.path).first()
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Note not found', fatal: true })
}
// Soft drafts: routable in dev (with a badge), hidden in production.
if (import.meta.env.PROD && page.value.draft) {
  throw createError({ statusCode: 404, statusMessage: 'Note not found', fatal: true })
}

// The full navigation tree — fetched once and shared across every doc page.
const { data: navigation } = await useDocsNavigation()

// Prev/next within the whole corpus.
const { data: surround } = await useAsyncData(`surround-${route.path}`, () =>
  queryCollectionItemSurroundings('docs', route.path, {
    fields: ['title', 'description', 'path']
  })
)

// Shared notes index (awaited so SSR matches client for the child listing and
// RelatedNotes).
const { data: allNotes } = await useNotesIndex()

// When the current page is a section/folder landing (index.md), list its direct
// child notes as cards so landing pages are useful without hand-maintained lists.
const childPages = computed(() => {
  const base = route.path.endsWith('/') ? route.path : `${route.path}/`
  return (allNotes.value ?? [])
    .filter((n) => {
      if (!n.path.startsWith(base)) return false
      const rest = n.path.slice(base.length)
      return rest.length > 0 && !rest.includes('/') // direct children only
    })
    .sort((a, b) => a.title.localeCompare(b.title))
})

// Scope the sidebar to the current top-level section's subtree when possible,
// so a reader in /dev sees the dev tree, not every section at once.
const sectionNav = computed(() => {
  const nav = navigation.value ?? []
  const top = route.path.split('/').filter(Boolean)[0]
  const match = nav.find((item: any) => item.path === `/${top}`)
  return match?.children?.length ? match.children : nav
})

const category = computed(
  () => page.value?.category || deriveCategory(page.value?.path ?? route.path)
)
const tocLinks = computed(() => page.value?.body?.toc?.links ?? [])

// Wide reading mode drops the TOC column and widens the article.
const { wide } = useReadingSettings()
const showToc = computed(() => tocLinks.value.length > 0 && !wide.value)

// Record the visit for recently-viewed / popular (client-only).
const { record } = useRecentlyViewed()
onMounted(() => {
  if (page.value) record(page.value.path, page.value.title)
})

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description
})
</script>

<template>
  <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
    <div
      class="lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10"
      :class="showToc ? 'xl:grid-cols-[15rem_minmax(0,1fr)_14rem]' : 'xl:grid-cols-[15rem_minmax(0,1fr)]'"
    >
      <!-- Sidebar navigation -->
      <aside class="hidden lg:block">
        <div
          class="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-3"
        >
          <p class="mb-3 px-2 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--ui-text-dimmed)]">
            Navigation
          </p>
          <UContentNavigation
            :navigation="sectionNav"
            highlight
            :highlight-color="'primary'"
            color="neutral"
            variant="link"
          />
        </div>
      </aside>

      <!-- Main content -->
      <div class="min-w-0 py-8 lg:py-10">
        <article v-if="page" class="mx-auto" :class="wide ? 'max-w-none' : 'max-w-3xl'">
          <header class="mb-8">
            <PromptPath :path="page.path" class="mb-5" />

            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-2">
                <h1 class="font-display text-[2rem] font-semibold leading-tight tracking-tight text-[var(--ui-text-highlighted)]">
                  {{ page.title }}
                </h1>
                <UBadge
                  v-if="page.draft"
                  color="warning"
                  variant="subtle"
                  label="DRAFT"
                  class="font-mono"
                />
              </div>
              <div class="shrink-0 pt-1">
                <NoteActions :path="page.path" :title="page.title" />
              </div>
            </div>

            <p v-if="page.description" class="mt-3 text-lg leading-relaxed text-[var(--ui-text-muted)]">
              {{ page.description }}
            </p>

            <div class="mt-5 flex flex-col gap-4 border-y border-[var(--ui-border-muted)] py-4">
              <NoteMeta
                :reading-time="page.readingTime"
                :updated-at="page.updatedAt"
                :created-at="page.createdAt"
                :category="category"
              />
              <TagList v-if="page.tags?.length" :tags="page.tags" />
            </div>
          </header>

          <div class="prose max-w-none dark:prose-invert">
            <ContentRenderer :value="page" />
          </div>

          <!-- Child notes (section/folder landing pages) -->
          <section v-if="childPages.length" class="mt-10">
            <div class="mb-4 flex items-center gap-3">
              <h2 class="font-mono text-xs uppercase tracking-widest text-[var(--ui-text-muted)]">
                In this section
              </h2>
              <div class="h-px flex-1 bg-[var(--ui-border)]" />
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <NoteCard v-for="child in childPages" :key="child.path" :note="child" />
            </div>
          </section>

          <!-- Prev / next -->
          <UContentSurround
            v-if="surround?.length"
            :surround="surround"
            class="mt-16"
          />

          <!-- Related notes -->
          <RelatedNotes :path="page.path" :tags="page.tags" />
        </article>
      </div>

      <!-- Table of contents -->
      <aside class="hidden xl:block">
        <div
          v-if="showToc"
          class="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8"
        >
          <ProseToc :links="tocLinks" />
        </div>
      </aside>
    </div>
  </div>
</template>
