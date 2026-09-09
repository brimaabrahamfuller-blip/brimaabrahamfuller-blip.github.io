# NextGents Tech Firm official website

The public corporate website for **NextGents Tech Firm, Inc.**, based in Monrovia, Liberia. It presents the firm, its capabilities, and its two primary products: GentsConcerts and GentsAcademy.

## Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

The site is a static-first TypeScript/Vite application and can be served from GitHub Pages. The Vite base is relative so the build works at the repository site path as well as a custom domain.

## Content notes

Public product descriptions were checked against the README and brand documentation in the `gentsconcerts` and `gentsacademy` repositories. Repository-owned product imagery is included in `public/assets/`. The GentsConcerts public URL is configured in `src/content.ts`. The GentsAcademy public application URL was not present in the inspected source material, so the site intentionally shows a pending-link state instead of guessing a destination. Update `siteConfig.products.academy` when an approved public URL is available.

No product backend, database, authentication, payment flow, or private environment variable is included in this corporate site.
