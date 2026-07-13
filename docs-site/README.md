# s4d_tools documentation site

Static documentation site for the `s4d_tools` Python library, built with
Vite + React (TypeScript) + Tailwind CSS.

## Design system

| Token        | Value     | Use                                          |
| ------------ | --------- | -------------------------------------------- |
| Alabaster    | `#FAFAFA` | Base background                              |
| Gunmetal     | `#2B343A` | Body text                                    |
| Muted Pine   | `#4A7C59` | Accents, links, active states (AA on Alabaster) |
| Pine dark    | `#3E6B4C` | Accent *text* on Soft Slate surfaces (AA on `#EAECEE`) |
| Soft Slate   | `#EAECEE` | Card / surface backgrounds                   |
| Muted ink    | `#55636C` | Secondary text (AA on both backgrounds)      |

Fonts: Inter (variable, self-hosted via Fontsource) for UI and body,
JetBrains Mono for code. No external network requests at runtime.

Accessibility: WCAG 2.1 AA contrast throughout, a single consistent
`:focus-visible` treatment, skip-to-content link, ARIA tabs pattern on the
pipeline explorer, ARIA combobox pattern on search, and
`prefers-reduced-motion` respected.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # type-checks, then outputs static site to dist/
npm run preview # serve the production build locally
```

## Deploy to GitHub Pages

The build uses `base: "./"` (relative asset paths) and hash-based routing,
so `dist/` works from any Pages location — user site root or
`/<repo>/` project subpath — with no rewrite configuration.

Example workflow (`.github/workflows/docs-site.yml`):

```yaml
name: Deploy docs site
on:
  push:
    branches: [main]
    paths: ["docs-site/**"]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: docs-site/package-lock.json
      - run: npm ci
        working-directory: docs-site
      - run: npm run build
        working-directory: docs-site
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs-site/dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

> Note: this repository currently deploys MkDocs output to the `gh-pages`
> branch (see `.github/workflows/docs-pages.yml`). Adopt one mechanism —
> either replace that workflow with the one above, or publish this site to a
> subdirectory of the existing `gh-pages` branch.

## Structure

```
src/
  components/   Header, DocsLayout (3-column shell), CodeBlock, CopyButton, SearchBar, Logo
  data/         api.ts (API reference model), searchIndex.ts (site search)
  pages/        Home, Concepts, Pipeline (interactive layer explorer), Quickstart, Api
```
