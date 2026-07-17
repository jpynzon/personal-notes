<script setup lang="ts">
// The reading-progress bar is a client concern wired up in M6; the slot below
// renders each page's content.
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <ReadingProgressBar />
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
