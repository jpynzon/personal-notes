<script setup lang="ts">
// Shadows Nuxt UI's prose <pre> so ```mermaid fenced blocks render as diagrams
// while every other code block behaves exactly as upstream (syntax highlight,
// filename header, copy button). The original is imported by its package path —
// NOT via auto-import, which would resolve back to this file and recurse.
import UProsePre from '@nuxt/ui/runtime/components/prose/Pre.vue'

const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
  hideHeader?: boolean
}>()

const isMermaid = computed(() => props.language === 'mermaid')
</script>

<template>
  <ClientOnly v-if="isMermaid">
    <MermaidDiagram :code="code ?? ''" />
    <template #fallback>
      <pre class="my-6 overflow-x-auto rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] p-4 font-mono text-xs text-[var(--ui-text-muted)]">{{ code }}</pre>
    </template>
  </ClientOnly>
  <UProsePre v-else v-bind="props">
    <slot />
  </UProsePre>
</template>

