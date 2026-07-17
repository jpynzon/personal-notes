<script setup lang="ts">
// A hairline phosphor bar pinned under the header that tracks how far down the
// document the reader has scrolled. Purely decorative, so it stays out of the
// accessibility tree and is disabled under reduced-motion via CSS transitions.
const progress = ref(0)

function update() {
  const doc = document.documentElement
  const scrollable = doc.scrollHeight - doc.clientHeight
  progress.value = scrollable > 0 ? Math.min(1, doc.scrollTop / scrollable) : 0
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})
</script>

<template>
  <div
    class="fixed inset-x-0 top-14 z-40 h-0.5 bg-transparent"
    aria-hidden="true"
  >
    <div
      class="h-full origin-left bg-[var(--ui-primary)] transition-transform duration-75 ease-out"
      :style="{ transform: `scaleX(${progress})`, width: '100%' }"
    />
  </div>
</template>
