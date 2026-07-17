import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // One collection for everything. A single tree keeps the sidebar, search
    // index and prev/next surroundings coherent across dev + teaching notes.
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        // Dash-prefixed files are drafts-in-progress, excluded entirely (not
        // even rendered in dev). Use `draft: true` frontmatter for the softer
        // "hidden in prod, visible in dev" tier.
        exclude: ['**/-*.md']
      },
      // `type: 'page'` already provides title, description, path, body, seo,
      // navigation and the TOC — we only declare the extra metadata below.
      schema: z.object({
        tags: z.array(z.string()).default([]),
        keywords: z.array(z.string()).default([]), // search synonyms, never shown
        category: z.string().optional(), // display override; else derived from path
        createdAt: z.string().optional(), // 'YYYY-MM-DD'
        updatedAt: z.string().optional(), // 'YYYY-MM-DD' — the "last updated" date
        draft: z.boolean().default(false),
        featured: z.boolean().default(false), // homepage highlight
        readingTime: z.number().optional(), // injected by the afterParse hook
        // Optional external references rendered in the note header.
        links: z
          .array(
            z.object({
              label: z.string(),
              to: z.string(),
              icon: z.string().optional()
            })
          )
          .default([])
      })
    })
  }
})
