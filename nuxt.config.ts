// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Module order matters: @nuxt/ui must precede @nuxt/content so Nuxt UI's
  // prose components are registered with the MDC renderer (copy buttons,
  // callouts, code-groups, etc.). @nuxt/ui bundles Tailwind v4, @nuxt/icon,
  // @nuxt/fonts and color-mode — do not add those separately.
  modules: ['@nuxt/ui', '@nuxt/content'],

  css: ['~/assets/css/main.css'],

  // Components used inside markdown (::video-embed, mermaid via ProsePre) are
  // resolved by MDC at runtime, so they must be registered globally under their
  // bare names. Everything else keeps the default (lazy, path-prefixed) scan.
  components: [
    { path: '~/components/content', pathPrefix: false, global: true },
    '~/components'
  ],

  // Dark is the crafted primary identity; users can still toggle to light.
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · notes',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'A personal knowledge base — developer notes, teaching material, snippets and cheat sheets.'
        }
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }]
    }
  },

  content: {
    experimental: {
      // Use Node's built-in node:sqlite (Node >= 22.5) instead of the
      // better-sqlite3 native addon — avoids node-gyp failures on Windows/CI.
      nativeSqlite: true
    },
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          // Dual theme — flips with color mode via generated `.dark` CSS.
          theme: {
            default: 'vitesse-light',
            dark: 'vitesse-dark'
          },
          // Content v3 only bundles a small default set; list every language
          // used across notes or the block renders unhighlighted (no error).
          langs: [
            'bash', 'shell', 'sh', 'powershell', 'js', 'ts', 'jsx', 'tsx',
            'vue', 'vue-html', 'html', 'css', 'scss', 'json', 'jsonc', 'yaml',
            'toml', 'ini', 'md', 'mdc', 'php', 'blade', 'sql', 'dockerfile',
            'docker', 'nginx', 'apache', 'diff', 'regex', 'python', 'http',
            'csharp', 'cs'
          ]
        }
      }
    },
    renderer: {
      anchorLinks: { h2: true, h3: true, h4: false }
    }
  },

  icon: {
    // Bundle icons into the client build from the locally installed
    // @iconify-json packages — no runtime/CDN fetches, offline-safe.
    clientBundle: {
      scan: true,
      sizeLimitKb: 512
    }
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/tags'],
      // Kept lenient during development; flipped to strict for the final
      // `nuxt generate` verification in M8.
      failOnError: false
    }
  },

  routeRules: {
    '/favorites': { prerender: true },
    '/recent': { prerender: true }
  },

  // Compute reading time once at parse time and store it as a queryable field.
  // `ctx.file.body` is the raw markdown source (frontmatter included, MDC code
  // preserved), which gives a deterministic count — the parsed AST hides fenced
  // code inside node props and would undercount.
  hooks: {
    'content:file:afterParse'(ctx: any) {
      const raw = typeof ctx?.file?.body === 'string' ? ctx.file.body : ''
      const body = raw.replace(/^---[\s\S]*?\n---/, '') // drop frontmatter block
      const words = body.split(/\s+/).filter(Boolean).length
      if (ctx?.content && ctx.content.readingTime == null) {
        ctx.content.readingTime = Math.max(1, Math.round(words / 200))
      }
    }
  }
})
