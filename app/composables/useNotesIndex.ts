import type { Collections } from '@nuxt/content'

export type NoteSummary = Pick<
  Collections['docs'],
  | 'path'
  | 'title'
  | 'description'
  | 'tags'
  | 'category'
  | 'featured'
  | 'updatedAt'
  | 'createdAt'
  | 'readingTime'
  | 'draft'
>

/**
 * A lightweight index of every note (no body), fetched once and shared by key.
 * Powers listing grids, tag pages, related notes and homepage sections without
 * each of them running its own query. Drafts are filtered out in production.
 */
export function useNotesIndex() {
  return useAsyncData<NoteSummary[]>(
    'notes-index',
    () =>
      queryCollection('docs')
        .select(
          'path',
          'title',
          'description',
          'tags',
          'category',
          'featured',
          'updatedAt',
          'createdAt',
          'readingTime',
          'draft'
        )
        .order('updatedAt', 'DESC')
        .all() as Promise<NoteSummary[]>,
    {
      default: () => [],
      transform: (notes: NoteSummary[]) =>
        import.meta.env.PROD ? notes.filter((n) => !n.draft) : notes
    }
  )
}
