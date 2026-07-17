<script setup lang="ts">
import type { NoteSummary } from '~/composables/useNotesIndex'

// Suggests related notes by scoring every other note against the current one:
// shared tags weigh most, then a shared immediate folder, then a shared
// top-level section. Runs off the shared notes index, so it's computed at
// prerender and baked into the static page.
const props = defineProps<{
  path: string
  tags?: string[]
}>()

const { data: notes } = useNotesIndex()

function section(p: string) {
  return p.split('/').filter(Boolean)[0] ?? ''
}
function folder(p: string) {
  const segs = p.split('/').filter(Boolean)
  return segs.slice(0, -1).join('/')
}

const related = computed<NoteSummary[]>(() => {
  const all = notes.value ?? []
  const currentTags = new Set(props.tags ?? [])
  const currentSection = section(props.path)
  const currentFolder = folder(props.path)

  return all
    .filter((n) => n.path !== props.path)
    .map((n) => {
      const shared = (n.tags ?? []).filter((t) => currentTags.has(t)).length
      let score = shared * 3
      if (folder(n.path) === currentFolder) score += 2
      else if (section(n.path) === currentSection) score += 1
      return { note: n, score }
    })
    .filter((x) => x.score >= 2)
    .sort((a, b) => b.score - a.score || (b.note.updatedAt ?? '').localeCompare(a.note.updatedAt ?? ''))
    .slice(0, 4)
    .map((x) => x.note)
})
</script>

<template>
  <section v-if="related.length" class="mt-16">
    <div class="mb-4 flex items-center gap-3">
      <h2 class="font-mono text-xs uppercase tracking-widest text-[var(--ui-text-muted)]">
        Related notes
      </h2>
      <div class="h-px flex-1 bg-[var(--ui-border)]" />
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      <NoteCard v-for="note in related" :key="note.path" :note="note" compact />
    </div>
  </section>
</template>
