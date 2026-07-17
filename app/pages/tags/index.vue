<script setup lang="ts">
const { data: notes } = await useNotesIndex()

const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const note of notes.value ?? []) {
    for (const tag of note.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

// Scale the type size with frequency for a subtle tag-cloud effect.
function sizeClass(count: number) {
  const max = tags.value[0]?.count ?? 1
  const ratio = count / max
  if (ratio > 0.66) return 'text-lg'
  if (ratio > 0.33) return 'text-base'
  return 'text-sm'
}

useSeoMeta({
  title: 'Tags',
  description: 'Browse every note by tag.'
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
    <PromptPath path="/tags" class="mb-5" />
    <h1 class="font-display text-3xl font-semibold tracking-tight text-[var(--ui-text-highlighted)]">
      Tags
    </h1>
    <p class="mt-2 text-[var(--ui-text-muted)]">
      {{ tags.length }} tags across the knowledge base.
    </p>

    <div v-if="tags.length" class="mt-10 flex flex-wrap items-center gap-x-3 gap-y-3">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.name"
        :to="`/tags/${tag.name}`"
        class="inline-flex items-baseline gap-1.5 font-mono text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-primary)]"
        :class="sizeClass(tag.count)"
      >
        <span class="text-[var(--ui-text-dimmed)]">#</span>{{ tag.name }}
        <span class="text-xs text-[var(--ui-text-dimmed)]">{{ tag.count }}</span>
      </NuxtLink>
    </div>

    <p v-else class="mt-10 font-mono text-sm text-[var(--ui-text-dimmed)]">
      No tags yet.
    </p>
  </div>
</template>
