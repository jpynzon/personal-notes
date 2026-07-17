export default defineAppConfig({
  // Site-wide constants surfaced to components (edit repo to your own to
  // enable per-note "History" links; leave empty to hide them).
  site: {
    name: 'notes',
    tagline: 'a second brain',
    // e.g. 'https://github.com/you/notes' + '/commits/main/content'
    repoContentUrl: ''
  },

  ui: {
    colors: {
      primary: 'phosphor',
      neutral: 'stone'
    },

    // Tight, terminal-flavoured defaults across primitives.
    icons: {
      dark: 'i-lucide-moon',
      light: 'i-lucide-sun',
      system: 'i-lucide-monitor',
      search: 'i-lucide-search',
      close: 'i-lucide-x',
      chevronRight: 'i-lucide-chevron-right',
      chevronDown: 'i-lucide-chevron-down',
      external: 'i-lucide-arrow-up-right'
    },

    button: {
      defaultVariants: { size: 'md' }
    },

    badge: {
      slots: { base: 'font-mono' }
    },

    contentNavigation: {
      slots: {
        link: 'font-mono text-sm',
        linkTrailingBadge: 'font-mono'
      }
    },

    contentToc: {
      slots: {
        link: 'font-mono text-xs',
        title: 'font-mono text-xs uppercase tracking-wider'
      }
    }
  }
})
