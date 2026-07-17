import { siteSections } from './sections'

/**
 * Human label for a top-level section slug, e.g. 'dev' → 'Development'.
 * Falls back to a title-cased slug for anything not in the fixed taxonomy.
 */
export function sectionLabel(slug: string): string {
  const match = siteSections.find((s) => s.slug === slug)
  return match?.label ?? titleCase(slug)
}

/** Derive a display category from a note's path when frontmatter omits one. */
export function deriveCategory(path: string): string {
  const segments = path.split('/').filter(Boolean)
  // Prefer the immediate parent folder, else the top-level section.
  const slug = segments.length >= 2 ? segments[segments.length - 2] : segments[0]
  return slug ? titleCase(slug) : 'Notes'
}

/** Turn 'design-patterns' into 'Design Patterns'. */
export function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Format 'YYYY-MM-DD' as e.g. 'Jul 17, 2026'. Returns '' for empty input. */
export function formatDate(date?: string | null): string {
  if (!date) return ''
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Split a route path into cumulative shell-style crumbs used by PromptPath.
 * '/dev/nuxt/rendering-modes' →
 *   [{ label: 'dev', to: '/dev' }, { label: 'nuxt', to: '/dev/nuxt' }, ...]
 */
export interface PathCrumb {
  label: string
  to: string
}

export function pathCrumbs(path: string): PathCrumb[] {
  const segments = path.split('/').filter(Boolean)
  let acc = ''
  return segments.map((seg) => {
    acc += `/${seg}`
    return { label: seg, to: acc }
  })
}
