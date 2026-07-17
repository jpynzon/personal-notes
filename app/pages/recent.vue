<script setup lang="ts">
const { recent, clear } = useRecentlyViewed()
const { data: notes } = await useNotesIndex()

const recentNotes = computed(() => {
  const byPath = new Map((notes.value ?? []).map((n) => [n.path, n]))
  return recent.value
    .map((e) => byPath.get(e.path))
    .filter((n): n is NonNullable<typeof n> => !!n)
})

useSeoMeta({
  title: 'Recently viewed',
  description: 'Notes you have opened recently.'
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <PromptPath path="/recent" class="mb-5" />
    <div class="flex items-center justify-between gap-4">
      <h1 class="flex items-center gap-2 font-display text-3xl font-semibold tracking-tight text-[var(--ui-text-highlighted)]">
        <UIcon name="i-lucide-history" class="size-7 text-[var(--ui-primary)]" />
        Recently viewed
      </h1>
      <ClientOnly>
        <UButton
          v-if="recentNotes.length"
          icon="i-lucide-trash-2"
          variant="ghost"
          color="neutral"
          size="sm"
          class="font-mono"
          label="Clear"
          @click="clear"
        />
      </ClientOnly>
    </div>

    <ClientOnly>
      <div v-if="recentNotes.length" class="mt-10 grid gap-4 sm:grid-cols-2">
        <NoteCard v-for="note in recentNotes" :key="note.path" :note="note" />
      </div>

      <div v-else class="mt-10 rounded-[var(--ui-radius)] border border-dashed border-[var(--ui-border-accented)] p-10 text-center">
        <UIcon name="i-lucide-history" class="mx-auto size-8 text-[var(--ui-text-dimmed)]" />
        <p class="mt-3 font-mono text-sm text-[var(--ui-text-muted)]">
          Nothing here yet.
        </p>
        <p class="mt-1 text-sm text-[var(--ui-text-dimmed)]">
          Notes you open will show up here.
        </p>
        <UButton to="/dev" variant="outline" color="neutral" class="mt-5 font-mono" label="Browse notes" />
      </div>

      <template #fallback>
        <div class="mt-10 grid gap-4 sm:grid-cols-2">
          <div v-for="i in 2" :key="i" class="h-28 animate-pulse rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-bg-muted)]" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
