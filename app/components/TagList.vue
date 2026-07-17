<script setup lang="ts">
// Tags render as mono chips. By default each links to its tag page; pass
// `plain` to render non-interactive chips instead (required inside another
// link, e.g. NoteCard, where nested <a> elements would be invalid HTML).
defineProps<{
  tags?: string[]
  size?: 'sm' | 'md'
  plain?: boolean
}>()
</script>

<template>
  <ul v-if="tags?.length" class="flex flex-wrap items-center gap-1.5">
    <li v-for="tag in tags" :key="tag">
      <component
        :is="plain ? 'span' : resolveComponent('NuxtLink')"
        :to="plain ? undefined : `/tags/${tag}`"
        class="inline-flex items-center gap-1 rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] px-2 py-0.5 font-mono text-[var(--ui-text-muted)] transition-colors"
        :class="[
          size === 'sm' ? 'text-[0.7rem]' : 'text-xs',
          plain ? '' : 'hover:border-[var(--ui-primary)]/40 hover:text-[var(--ui-primary)]'
        ]"
      >
        <span class="text-[var(--ui-text-dimmed)]">#</span>{{ tag }}
      </component>
    </li>
  </ul>
</template>
