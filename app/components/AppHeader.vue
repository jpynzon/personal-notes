<script setup lang="ts">
import { primarySections } from '~/utils/sections'

// The command palette's open state is owned by Nuxt UI's shared composable, so
// the header button, the `/` shortcut and Ctrl/Cmd+K all drive one overlay.
const { open: searchOpen } = useContentSearch()
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (v) => (colorMode.preference = v ? 'dark' : 'light')
})

const mobileOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => (mobileOpen.value = false))
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-[var(--ui-border)] bg-[var(--ui-bg)]/80 backdrop-blur-md"
  >
    <div class="mx-auto flex h-14 max-w-[90rem] items-center gap-4 px-4 sm:px-6 lg:px-8">
      <!-- Brand: a shell prompt -->
      <NuxtLink
        to="/"
        class="group flex shrink-0 items-center gap-2 font-display text-lg font-semibold tracking-tight"
      >
        <span class="terminal-cursor" aria-hidden="true" />
        <span>notes</span>
      </NuxtLink>

      <!-- Primary nav -->
      <nav class="hidden items-center gap-1 md:flex" aria-label="Sections">
        <UButton
          v-for="s in primarySections"
          :key="s.slug"
          :to="s.to"
          :label="s.label"
          variant="ghost"
          color="neutral"
          class="font-mono text-sm text-[var(--ui-text-muted)] hover:text-[var(--ui-text)]"
          active-class="!text-[var(--ui-primary)]"
        />
      </nav>

      <div class="ml-auto flex items-center gap-1.5">
        <!-- Search trigger -->
        <button
          type="button"
          class="group hidden items-center gap-2 rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] px-2.5 py-1.5 text-sm text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-border-accented)] hover:text-[var(--ui-text)] sm:flex"
          aria-label="Search notes"
          @click="searchOpen = true"
        >
          <UIcon name="i-lucide-search" class="size-4" />
          <span class="font-mono">Search</span>
          <kbd
            class="ml-2 rounded border border-[var(--ui-border-accented)] bg-[var(--ui-bg)] px-1.5 font-mono text-[0.7rem] text-[var(--ui-text-dimmed)]"
          >⌘K</kbd>
        </button>

        <UButton
          icon="i-lucide-search"
          variant="ghost"
          color="neutral"
          class="sm:hidden"
          aria-label="Search notes"
          @click="searchOpen = true"
        />

        <UButton
          to="/favorites"
          icon="i-lucide-star"
          variant="ghost"
          color="neutral"
          aria-label="Favorites"
        />

        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            variant="ghost"
            color="neutral"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="isDark = !isDark"
          />
          <template #fallback>
            <div class="size-8" />
          </template>
        </ClientOnly>

        <UButton
          :icon="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'"
          variant="ghost"
          color="neutral"
          class="md:hidden"
          aria-label="Toggle menu"
          @click="mobileOpen = !mobileOpen"
        />
      </div>
    </div>

    <!-- Mobile nav -->
    <nav
      v-if="mobileOpen"
      class="border-t border-[var(--ui-border)] bg-[var(--ui-bg)] px-4 py-3 md:hidden"
      aria-label="Sections"
    >
      <NuxtLink
        v-for="s in primarySections"
        :key="s.slug"
        :to="s.to"
        class="flex items-center gap-3 rounded-[var(--ui-radius)] px-2 py-2 font-mono text-sm text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-muted)] hover:text-[var(--ui-text)]"
      >
        <UIcon :name="s.icon" class="size-4" />
        {{ s.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
