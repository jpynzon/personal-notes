<script setup lang="ts">
import { siteSections } from '~/utils/sections'

// Optional per-section note counts, keyed by slug, passed from the homepage.
const props = defineProps<{ counts?: Record<string, number> }>()
</script>

<template>
  <ul class="grid gap-px overflow-hidden rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-border)] sm:grid-cols-2 lg:grid-cols-3">
    <li v-for="s in siteSections" :key="s.slug">
      <NuxtLink
        :to="s.to"
        class="group flex h-full flex-col gap-3 bg-[var(--ui-bg)] p-6 transition-colors hover:bg-[var(--ui-bg-muted)]"
      >
        <div class="flex items-center justify-between">
          <UIcon
            :name="s.icon"
            class="size-6 text-[var(--ui-text-muted)] transition-colors group-hover:text-[var(--ui-primary)]"
          />
          <span
            v-if="props.counts?.[s.slug] != null"
            class="font-mono text-xs text-[var(--ui-text-dimmed)]"
          >{{ props.counts[s.slug] }} notes</span>
        </div>
        <div>
          <h3 class="font-display text-base font-semibold text-[var(--ui-text-highlighted)]">
            {{ s.label }}
          </h3>
          <p class="mt-1 text-sm text-[var(--ui-text-muted)]">
            {{ s.description }}
          </p>
        </div>
        <span
          class="mt-auto flex items-center gap-1 font-mono text-xs text-[var(--ui-text-dimmed)] transition-colors group-hover:text-[var(--ui-primary)]"
        >
          cd {{ s.to }}
          <UIcon name="i-lucide-arrow-right" class="size-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </NuxtLink>
    </li>
  </ul>
</template>
