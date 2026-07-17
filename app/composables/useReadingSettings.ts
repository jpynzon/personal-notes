const KEY = 'notes:reading:wide:v1'
let hydrated = false

/**
 * Reader preferences. Currently: wide reading mode, which widens the article
 * column and hides the table of contents for distraction-free reading.
 * Persisted to localStorage.
 */
export function useReadingSettings() {
  const wide = useState<boolean>('reading-wide', () => false)

  onMounted(() => {
    if (hydrated) return
    hydrated = true
    try {
      wide.value = localStorage.getItem(KEY) === '1'
    } catch {
      // ignore
    }
  })

  function toggleWide() {
    wide.value = !wide.value
    try {
      localStorage.setItem(KEY, wide.value ? '1' : '0')
    } catch {
      // non-fatal
    }
  }

  return { wide, toggleWide }
}
