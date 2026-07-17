<script setup lang="ts">
import { pathCrumbs } from '~/utils/content'

// The site's signature: breadcrumbs rendered as a shell path. Each segment is
// a real link to its section; the trailing block cursor is decorative.
const props = defineProps<{
  path: string
  /** Hide the blinking cursor (e.g. when many render in a list). */
  quiet?: boolean
}>()

const crumbs = computed(() => pathCrumbs(props.path))
</script>

<template>
  <nav
    aria-label="Breadcrumb"
    class="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-xs text-[var(--ui-text-muted)]"
  >
    <NuxtLink
      to="/"
      class="text-[var(--ui-primary)] transition-opacity hover:opacity-80"
      aria-label="Home"
    >~</NuxtLink>

    <template v-for="(crumb, i) in crumbs" :key="crumb.to">
      <span class="text-[var(--ui-text-dimmed)]" aria-hidden="true">/</span>
      <NuxtLink
        v-if="i < crumbs.length - 1"
        :to="crumb.to"
        class="transition-colors hover:text-[var(--ui-text)]"
      >{{ crumb.label }}</NuxtLink>
      <span
        v-else
        class="text-[var(--ui-text)]"
        aria-current="page"
      >{{ crumb.label }}</span>
    </template>

    <span class="ml-1 text-[var(--ui-text-dimmed)]">$</span>
    <span v-if="!quiet" class="terminal-cursor ml-0.5" aria-hidden="true" />
  </nav>
</template>
