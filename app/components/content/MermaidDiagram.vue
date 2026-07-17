<script setup lang="ts">
// Renders a Mermaid diagram. This component is mounted client-side only (its
// parent, ProsePre, wraps it in <ClientOnly>), so the container ref is always
// present by onMounted. Mermaid (~500KB) is dynamically imported, so it only
// loads on pages that actually contain a diagram and never runs at prerender.
const props = defineProps<{ code: string }>()

const colorMode = useColorMode()
const container = ref<HTMLElement | null>(null)
const error = ref<string | null>(null)

// Module-level counter → unique, deterministic ids (Mermaid errors on collisions).
let seq = 0

async function render() {
  if (!container.value) return
  error.value = null
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: colorMode.value === 'dark' ? 'dark' : 'neutral',
      themeVariables: {
        fontFamily: 'var(--font-mono)',
        primaryColor: '#1b1917',
        lineColor: '#8f8a81',
        primaryBorderColor: '#ffb454'
      }
    })
    const id = `mermaid-${seq++}`
    const { svg } = await mermaid.render(id, props.code)
    if (container.value) container.value.innerHTML = svg
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err)
  }
}

onMounted(render)
// Mermaid can't restyle in place — re-render from scratch on theme change.
watch(() => colorMode.value, render)
</script>

<template>
  <div class="my-6">
    <div
      v-show="!error"
      ref="container"
      class="mermaid-diagram flex justify-center overflow-x-auto rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] p-4"
      role="img"
    />
    <div
      v-if="error"
      class="rounded-[var(--ui-radius)] border border-[var(--color-phosphor-500)]/40 bg-[var(--ui-bg-muted)] p-4"
    >
      <p class="mb-2 font-mono text-xs text-[var(--color-phosphor-500)]">
        diagram error: {{ error }}
      </p>
      <pre class="overflow-x-auto font-mono text-xs text-[var(--ui-text-muted)]">{{ code }}</pre>
    </div>
  </div>
</template>
