<script setup lang="ts">
const { favorites } = useFavorites()
const { data: notes } = await useNotesIndex()

const favoriteNotes = computed(() => {
  const byPath = new Map((notes.value ?? []).map((n) => [n.path, n]))
  return favorites.value.map((p) => byPath.get(p)).filter((n): n is NonNullable<typeof n> => !!n)
})

useSeoMeta({
  title: 'Favorites',
  description: 'Notes you have starred for quick access.'
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <PromptPath path="/favorites" class="mb-5" />
    <h1 class="flex items-center gap-2 font-display text-3xl font-semibold tracking-tight text-[var(--ui-text-highlighted)]">
      <UIcon name="i-lucide-star" class="size-7 text-[var(--ui-primary)]" />
      Favorites
    </h1>

    <ClientOnly>
      <div v-if="favoriteNotes.length" class="mt-10 grid gap-4 sm:grid-cols-2">
        <NoteCard v-for="note in favoriteNotes" :key="note.path" :note="note" />
      </div>

      <div v-else class="mt-10 rounded-[var(--ui-radius)] border border-dashed border-[var(--ui-border-accented)] p-10 text-center">
        <UIcon name="i-lucide-star" class="mx-auto size-8 text-[var(--ui-text-dimmed)]" />
        <p class="mt-3 font-mono text-sm text-[var(--ui-text-muted)]">
          No favorites yet.
        </p>
        <p class="mt-1 text-sm text-[var(--ui-text-dimmed)]">
          Star a note with the
          <UIcon name="i-lucide-star" class="inline size-3.5 align-text-bottom" />
          button to keep it here.
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
