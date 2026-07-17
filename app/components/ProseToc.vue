<script setup lang="ts">
// A scroll-position table of contents. Active tracking is driven by scroll
// position (not IntersectionObserver) so it degrades gracefully and stays
// predictable. Renders the Nuxt Content `body.toc.links` tree.
interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const props = defineProps<{
  links: TocLink[]
  title?: string
}>()

// Height of the sticky header + a little breathing room, so a heading counts as
// "current" a touch before it reaches the very top.
const OFFSET = 96

const activeId = ref<string | null>(null)

// Flatten the (possibly nested) tree into document order for tracking.
const flat = computed<TocLink[]>(() => {
  const out: TocLink[] = []
  const walk = (items: TocLink[]) => {
    for (const item of items) {
      out.push(item)
      if (item.children?.length) walk(item.children)
    }
  }
  walk(props.links ?? [])
  return out
})

function updateActive() {
  const ids = flat.value.map((l) => l.id)
  if (!ids.length) return

  const scrollY = window.scrollY
  // Bottom of page: force the last heading active so the final section lights up.
  const atBottom =
    window.innerHeight + scrollY >= document.documentElement.scrollHeight - 2
  if (atBottom) {
    activeId.value = ids[ids.length - 1] ?? null
    return
  }

  let current: string | null = ids[0] ?? null
  for (const id of ids) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top - OFFSET <= 0) current = id
    else break
  }
  activeId.value = current
}

function scrollTo(id: string, e: MouseEvent) {
  e.preventDefault()
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - OFFSET + 8
  window.scrollTo({ top, behavior: 'smooth' })
  history.replaceState(null, '', `#${id}`)
}

onMounted(() => {
  updateActive()
  window.addEventListener('scroll', updateActive, { passive: true })
  window.addEventListener('resize', updateActive, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActive)
  window.removeEventListener('resize', updateActive)
})
</script>

<template>
  <nav aria-label="Table of contents" class="font-mono text-xs">
    <p class="mb-3 flex items-center gap-2 uppercase tracking-widest text-[var(--ui-text-dimmed)]">
      <span class="text-[var(--ui-primary)]">#</span>
      {{ title ?? 'On this page' }}
    </p>
    <ul class="space-y-0.5 border-l border-[var(--ui-border)]">
      <li v-for="link in flat" :key="link.id">
        <a
          :href="`#${link.id}`"
          :class="[
            'block border-l-2 py-1 leading-snug transition-colors',
            link.depth >= 3 ? 'pl-6' : 'pl-3',
            activeId === link.id
              ? 'border-[var(--ui-primary)] text-[var(--ui-primary)]'
              : 'border-transparent text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]'
          ]"
          :style="{ marginLeft: '-1px' }"
          @click="(e) => scrollTo(link.id, e)"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
