<script setup lang="ts">
import type { NoteSummary } from '~/composables/useNotesIndex'
import { deriveCategory } from '~/utils/content'

const props = defineProps<{
  note: Pick<NoteSummary, 'path' | 'title' | 'description' | 'tags' | 'category' | 'readingTime'>
  compact?: boolean
}>()

const category = computed(
  () => props.note.category || deriveCategory(props.note.path)
)
</script>

<template>
  <NuxtLink
    :to="note.path"
    class="group flex h-full flex-col rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-bg)] p-5 transition-colors hover:border-[var(--ui-border-accented)] hover:bg-[var(--ui-bg-muted)]"
  >
    <div class="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--ui-text-dimmed)]">
      <span>{{ category }}</span>
      <span v-if="note.readingTime" class="text-[var(--ui-border-accented)]">·</span>
      <span v-if="note.readingTime">{{ note.readingTime }} min</span>
    </div>

    <h3 class="mt-2 font-display text-base font-semibold text-[var(--ui-text-highlighted)] group-hover:text-[var(--ui-primary)]">
      {{ note.title }}
    </h3>

    <p v-if="note.description && !compact" class="mt-1.5 line-clamp-2 text-sm text-[var(--ui-text-muted)]">
      {{ note.description }}
    </p>

    <div v-if="note.tags?.length && !compact" class="mt-auto pt-4">
      <TagList :tags="note.tags.slice(0, 4)" size="sm" plain />
    </div>
  </NuxtLink>
</template>
