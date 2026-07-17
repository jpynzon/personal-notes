<script setup lang="ts">
import { formatDate } from '~/utils/content'

// A quiet statusline beneath the title, echoing a tmux/vim status bar: a row of
// mono segments carrying the note's metadata.
const props = defineProps<{
  readingTime?: number
  updatedAt?: string | null
  createdAt?: string | null
  category?: string | null
}>()

const updated = computed(() => formatDate(props.updatedAt))
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-[var(--ui-text-muted)]">
    <span v-if="readingTime" class="flex items-center gap-1.5">
      <UIcon name="i-lucide-clock" class="size-3.5 text-[var(--ui-text-dimmed)]" />
      ~{{ readingTime }} min read
    </span>

    <span v-if="updated" class="flex items-center gap-1.5">
      <UIcon name="i-lucide-history" class="size-3.5 text-[var(--ui-text-dimmed)]" />
      updated {{ updated }}
    </span>

    <span v-if="category" class="flex items-center gap-1.5">
      <UIcon name="i-lucide-folder" class="size-3.5 text-[var(--ui-text-dimmed)]" />
      {{ category }}
    </span>
  </div>
</template>
