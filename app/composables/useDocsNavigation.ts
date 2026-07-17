import type { ContentNavigationItem } from '@nuxt/content'

/**
 * The docs navigation tree, fetched once and shared by key across every caller
 * (header search, sidebar, etc.). Defining the handler in one place avoids
 * Nuxt's "different handler for the same key" warning.
 */
export function useDocsNavigation() {
  return useAsyncData<ContentNavigationItem[]>(
    'docs-navigation',
    () => queryCollectionNavigation('docs'),
    { default: () => [] }
  )
}
