<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { open: searchOpen } = useContentSearch()
const isNotFound = computed(() => props.error?.statusCode === 404)

// error.vue renders outside the default layout, so pull in the color mode CSS
// state by rendering the same shell chrome around the message.
</script>

<template>
  <UApp>
    <div class="flex min-h-screen flex-col">
      <AppHeader />
      <main class="flex flex-1 items-center justify-center px-4 py-20">
        <div class="w-full max-w-lg">
          <div
            class="overflow-hidden rounded-[var(--ui-radius)] border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] font-mono text-sm shadow-sm"
          >
            <div class="flex items-center gap-2 border-b border-[var(--ui-border)] px-4 py-2">
              <span class="size-2.5 rounded-full bg-[var(--ui-border-accented)]" />
              <span class="size-2.5 rounded-full bg-[var(--ui-border-accented)]" />
              <span class="size-2.5 rounded-full bg-[var(--ui-border-accented)]" />
              <span class="ml-2 text-xs text-[var(--ui-text-dimmed)]">notes — zsh</span>
            </div>
            <div class="space-y-2 p-5 leading-relaxed">
              <p class="text-[var(--ui-text-muted)]">
                <span class="text-[var(--ui-primary)]">~</span> $ cd {{ $route.fullPath }}
              </p>
              <p class="text-[var(--color-phosphor-500)]">
                <template v-if="isNotFound">cd: no such file or directory</template>
                <template v-else>error: {{ error.statusCode }} — something broke</template>
              </p>
              <p class="text-[var(--ui-text-dimmed)]">
                {{ isNotFound ? 'The note you were looking for isn\'t here.' : error.message }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <UButton
              icon="i-lucide-search"
              color="primary"
              label="Search notes"
              class="font-mono"
              @click="searchOpen = true"
            />
            <UButton
              to="/"
              variant="outline"
              color="neutral"
              icon="i-lucide-home"
              label="Go home"
              class="font-mono"
              @click="clearError({ redirect: '/' })"
            />
          </div>
        </div>
      </main>
    </div>
  </UApp>
</template>
