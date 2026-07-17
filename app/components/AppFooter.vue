<script setup lang="ts">
import { siteSections } from '~/utils/sections'

const app = useAppConfig()
// Generated once at build time — a quiet honesty signal, terminal-styled.
const builtAt = new Date().toISOString().slice(0, 10)
</script>

<template>
  <footer class="mt-24 border-t border-[var(--ui-border)] bg-[var(--ui-bg-muted)]">
    <div class="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div class="max-w-xs">
          <div class="flex items-center gap-2 font-display text-base font-semibold">
            <span class="terminal-cursor" aria-hidden="true" />
            <span>notes</span>
          </div>
          <p class="mt-3 text-sm text-[var(--ui-text-muted)]">
            {{ app.site.tagline }} — a place to keep everything worth remembering.
          </p>
        </div>

        <nav class="grid grid-cols-2 gap-x-12 gap-y-2 sm:grid-cols-3" aria-label="Footer">
          <NuxtLink
            v-for="s in siteSections"
            :key="s.slug"
            :to="s.to"
            class="font-mono text-sm text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-primary)]"
          >
            {{ s.label }}
          </NuxtLink>
          <NuxtLink
            to="/tags"
            class="font-mono text-sm text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-primary)]"
          >
            Tags
          </NuxtLink>
        </nav>
      </div>

      <div
        class="mt-10 flex flex-col gap-2 border-t border-[var(--ui-border-muted)] pt-6 font-mono text-xs text-[var(--ui-text-dimmed)] sm:flex-row sm:items-center sm:justify-between"
      >
        <span>built {{ builtAt }} · nuxt · content · static</span>
        <span class="flex items-center gap-1.5">
          <span class="inline-block size-1.5 rounded-full bg-[var(--ui-primary)]" />
          all systems nominal
        </span>
      </div>
    </div>
  </footer>
</template>
