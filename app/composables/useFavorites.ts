const KEY = 'notes:favorites:v1'
let hydrated = false

/**
 * Favorited note paths, persisted to localStorage. State is shared via
 * useState (SSR-safe: empty at prerender), hydrated once on the client after
 * mount. Always render favorite-dependent UI inside <ClientOnly> to avoid a
 * hydration mismatch between the empty server output and the client's list.
 */
export function useFavorites() {
  const favorites = useState<string[]>('favorites', () => [])

  onMounted(() => {
    if (hydrated) return
    hydrated = true
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) favorites.value = JSON.parse(raw)
    } catch {
      // ignore malformed storage
    }
  })

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites.value))
    } catch {
      // storage may be unavailable (private mode, quota) — non-fatal
    }
  }

  const isFavorite = (path: string) => favorites.value.includes(path)

  function toggle(path: string) {
    const i = favorites.value.indexOf(path)
    if (i >= 0) favorites.value.splice(i, 1)
    else favorites.value.unshift(path)
    persist()
  }

  return { favorites, isFavorite, toggle }
}
