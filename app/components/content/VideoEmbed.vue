<script setup lang="ts">
// Responsive video embed used from markdown as ::video-embed{src="…"}.
// Accepts YouTube / Vimeo URLs (privacy-friendly nocookie hosts) or a direct
// video file. The iframe is lazy so it costs nothing until scrolled into view.
const props = defineProps<{
  src: string
  title?: string
}>()

interface Parsed {
  kind: 'youtube' | 'vimeo' | 'file'
  url: string
}

const parsed = computed<Parsed>(() => {
  const src = props.src?.trim() ?? ''

  const yt = src.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  )
  if (yt) {
    return { kind: 'youtube', url: `https://www.youtube-nocookie.com/embed/${yt[1]}` }
  }

  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) {
    return { kind: 'vimeo', url: `https://player.vimeo.com/video/${vimeo[1]}` }
  }

  return { kind: 'file', url: src }
})
</script>

<template>
  <div class="my-6 overflow-hidden rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-black">
    <div class="relative aspect-video">
      <video
        v-if="parsed.kind === 'file'"
        :src="parsed.url"
        controls
        preload="metadata"
        class="absolute inset-0 size-full"
      />
      <iframe
        v-else
        :src="parsed.url"
        :title="title ?? 'Embedded video'"
        loading="lazy"
        class="absolute inset-0 size-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>
  </div>
</template>
