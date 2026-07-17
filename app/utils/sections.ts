/**
 * The fixed top-level taxonomy. Content lives under matching `content/N.<slug>`
 * folders; this drives the header nav, homepage grid and footer so they never
 * drift from one another.
 */
export interface SiteSection {
  slug: string
  label: string
  to: string
  icon: string
  description: string
  /** Show in the primary header navigation (space is limited). */
  primary?: boolean
}

export const siteSections: SiteSection[] = [
  {
    slug: 'dev',
    label: 'Development',
    to: '/dev',
    icon: 'i-lucide-terminal',
    description: 'Languages, frameworks and the craft of building software.',
    primary: true
  },
  {
    slug: 'teaching',
    label: 'Teaching',
    to: '/teaching',
    icon: 'i-lucide-graduation-cap',
    description: 'Lesson plans, activities, rubrics and student references.',
    primary: true
  },
  {
    slug: 'snippets',
    label: 'Snippets',
    to: '/snippets',
    icon: 'i-lucide-code',
    description: 'Small, copy-ready fragments you reach for again and again.',
    primary: true
  },
  {
    slug: 'cheat-sheets',
    label: 'Cheat Sheets',
    to: '/cheat-sheets',
    icon: 'i-lucide-scroll-text',
    description: 'Dense, scannable references for commands and syntax.',
    primary: true
  },
  {
    slug: 'templates',
    label: 'Templates',
    to: '/templates',
    icon: 'i-lucide-copy',
    description: 'Reusable starting points for files, configs and docs.'
  },
  {
    slug: 'troubleshooting',
    label: 'Troubleshooting',
    to: '/troubleshooting',
    icon: 'i-lucide-bug',
    description: 'Symptoms, causes and fixes for problems worth remembering.'
  }
]

export const primarySections = siteSections.filter((s) => s.primary)
