<script setup lang="ts">
// Per-note controls: favorite, copy link, wide reading mode, and (when a repo
// is configured) a link to the file's history. Favorite/wide state hydrate from
// localStorage in onMounted — matching the empty server render at hydration
// time — so no <ClientOnly> is needed here.
const props = defineProps<{
  path: string
  title: string
}>()

const { isFavorite, toggle } = useFavorites()
const { wide, toggleWide } = useReadingSettings()
const toast = useToast()
const app = useAppConfig()

const favorited = computed(() => isFavorite(props.path))

const historyUrl = computed(() =>
  app.site.repoContentUrl ? app.site.repoContentUrl : null
)

function copyLink() {
  const url = `${window.location.origin}${props.path}`
  navigator.clipboard?.writeText(url).then(
    () =>
      toast.add({
        title: 'Link copied',
        description: url,
        icon: 'i-lucide-link',
        color: 'primary'
      }),
    () =>
      toast.add({
        title: 'Could not copy link',
        color: 'error'
      })
  )
}

function onFavorite() {
  toggle(props.path)
  toast.add({
    title: favorited.value ? 'Added to favorites' : 'Removed from favorites',
    icon: favorited.value ? 'i-lucide-star' : 'i-lucide-star-off',
    color: 'neutral'
  })
}
</script>

<template>
  <div class="flex items-center gap-1">
    <UButton
      :icon="favorited ? 'i-lucide-star' : 'i-lucide-star'"
      :variant="favorited ? 'soft' : 'ghost'"
      :color="favorited ? 'primary' : 'neutral'"
      size="sm"
      :aria-label="favorited ? 'Remove from favorites' : 'Add to favorites'"
      :ui="{ leadingIcon: favorited ? 'fill-current' : '' }"
      @click="onFavorite"
    />
    <UButton
      icon="i-lucide-link"
      variant="ghost"
      color="neutral"
      size="sm"
      aria-label="Copy link to this note"
      @click="copyLink"
    />
    <UButton
      :icon="wide ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
      variant="ghost"
      color="neutral"
      size="sm"
      class="hidden xl:inline-flex"
      :aria-label="wide ? 'Exit wide mode' : 'Wide reading mode'"
      @click="toggleWide"
    />
    <UButton
      v-if="historyUrl"
      :to="historyUrl"
      target="_blank"
      icon="i-lucide-history"
      variant="ghost"
      color="neutral"
      size="sm"
      aria-label="View history on GitHub"
    />
  </div>
</template>
