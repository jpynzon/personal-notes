<script setup lang="ts">
const route = useRoute()
const tag = computed(() => decodeURIComponent(String(route.params.tag)))

const { data: notes } = await useNotesIndex()

const matches = computed(() =>
  (notes.value ?? []).filter((n) => (n.tags ?? []).includes(tag.value))
)

useSeoMeta({
  title: () => `#${tag.value}`,
  description: () => `Notes tagged ${tag.value}.`
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <PromptPath :path="`/tags/${tag}`" class="mb-5" />
    <h1 class="flex items-center gap-2 font-display text-3xl font-semibold tracking-tight text-[var(--ui-text-highlighted)]">
      <span class="text-[var(--ui-text-dimmed)]">#</span>{{ tag }}
    </h1>
    <p class="mt-2 text-[var(--ui-text-muted)]">
      {{ matches.length }} {{ matches.length === 1 ? 'note' : 'notes' }} tagged
      <span class="font-mono text-[var(--ui-text)]">{{ tag }}</span>.
    </p>

    <div v-if="matches.length" class="mt-10 grid gap-4 sm:grid-cols-2">
      <NoteCard v-for="note in matches" :key="note.path" :note="note" />
    </div>

    <div v-else class="mt-10">
      <p class="font-mono text-sm text-[var(--ui-text-dimmed)]">
        No notes with this tag.
      </p>
      <UButton to="/tags" variant="link" color="primary" class="mt-2 font-mono" label="← All tags" />
    </div>
  </div>
</template>
