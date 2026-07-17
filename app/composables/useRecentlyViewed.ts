const KEY = 'notes:recent:v1'
const MAX = 50
let hydrated = false

export interface RecentEntry {
  path: string
  title: string
  ts: number
  count: number
}

/**
 * Recently-viewed history with per-note visit counts, persisted to
 * localStorage. The visit count doubles as the popularity signal ("popular for
 * you"). Same SSR pattern as useFavorites — hydrate once on the client, render
 * dependent UI inside <ClientOnly>.
 */
export function useRecentlyViewed() {
  const entries = useState<RecentEntry[]>('recent', () => [])

  onMounted(() => {
    if (hydrated) return
    hydrated = true
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) entries.value = JSON.parse(raw)
    } catch {
      // ignore malformed storage
    }
  })

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(entries.value))
    } catch {
      // non-fatal
    }
  }

  /** Record a visit — bumps the count and moves the note to the front. */
  function record(path: string, title: string) {
    const now = Date.now()
    const existing = entries.value.find((e) => e.path === path)
    if (existing) {
      existing.count += 1
      existing.ts = now
      existing.title = title
    } else {
      entries.value.unshift({ path, title, ts: now, count: 1 })
    }
    // Most recent first, capped.
    entries.value.sort((a, b) => b.ts - a.ts)
    if (entries.value.length > MAX) entries.value.length = MAX
    persist()
  }

  function clear() {
    entries.value = []
    persist()
  }

  // Chronological history.
  const recent = computed(() => entries.value)

  // "Popular for you": most-visited, needing at least two visits to qualify.
  const popular = computed(() =>
    [...entries.value]
      .filter((e) => e.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  )

  return { entries, recent, popular, record, clear }
}
