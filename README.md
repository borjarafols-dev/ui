# @brafols/ui

The shared UI base for brafols frontends: accessible components on **React Aria Components**, styled with **tailwind-variants** recipes on **Tailwind CSS v4**. Everything is themed through **CSS-variable tokens**. Each app keeps the components and gives them its own look by overriding tokens.

Tailwind is an implementation detail. The shipped CSS is precompiled and every utility resolves to a public CSS variable, so apps don't need content scanning or a merged Tailwind config.

## Install

Distributed by git tag. Pin an exact version:

```sh
npm i github:borjarafols-dev/ui#v1.0.0
```

Each tag contains the built `dist/`, so no install scripts run. `react` and `react-dom` 19 are peer dependencies.

## Use in React

```tsx
import '@brafols/ui/styles.css' // tokens + precompiled utilities (no preflight)
import { Button, Card, CardContent, CardHeader, CardTitle, TextField } from '@brafols/ui'

export function SignIn() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <TextField label="Email" type="email" />
        <Button onPress={() => {}}>Continue</Button>
      </CardContent>
    </Card>
  )
}
```

Components follow React Aria's APIs: `onPress` / `isDisabled` on buttons, value-based `onChange` on fields, and `selectedKey` / `onSelectionChange` on `Select`.

| Component | Notes |
|---|---|
| `Button` | Variants `primary` `secondary` `outline` `ghost` `destructive` `link`; sizes `sm` `md` `lg` |
| `Badge` | Static label; variants `primary` `secondary` `outline` `destructive` |
| `Card` + `CardHeader` `CardTitle` `CardDescription` `CardContent` `CardFooter` | Presentational |
| `TextField`, `TextArea`, `NumberField`, `SearchField` | `label`, `description`, `error` built in |
| `Select` | Listbox in a popover, not a native `<select>` |
| `Checkbox` | Supports `isIndeterminate` |
| `Input`, `Label` | Bare parts for custom fields |
| `Modal`, `ConfirmDialog` | Focus trap, Escape to close |
| `DataTable` | React Aria `Table`; `columns` / `data` / `keyField` |
| `Spinner`, `EmptyState` | |

## Use outside React (Astro)

The style recipes don't depend on React, so static markup can use them without hydrating anything:

```astro
---
import '@brafols/ui/styles.css'
import { button, card } from '@brafols/ui/recipes'
const { root, header, title, content } = card()
---
<article class={root()}>
  <header class={header()}><h2 class={title()}>Plans</h2></header>
  <div class={content()}>
    <a href="/signup" class={button({ variant: 'primary' })}>Start free</a>
  </div>
</article>
```

Use the React components only inside islands that need interaction.

## Theming

Tokens come in three layers, following shadcn/Radix naming:

1. **Primitive**: `--gray-1…12`, `--brand-1…12`
2. **Semantic**: `--background`, `--foreground`, `--primary`, `--border`, `--ring`, `--overlay`, …
3. **Component**: e.g. `--button-primary-bg`, `--button-primary-bg-hover`

An app gives the library its own look in one `theme.css`. Override both themes:

```css
:root {
  --brand-9: oklch(0.62 0.19 150);
  --radius: 0.75rem;
  --font-sans: 'Inter Tight', system-ui, sans-serif;
}
[data-theme='dark'] {
  --primary: oklch(0.7 0.17 150);
}
```

Rules for apps:

- **Override tokens; don't restyle components.** Use `className` on library components for layout only (margin, width, grid placement).
- **App-only tokens use the app's prefix** (`--alo-hero-bg`) and are built from library tokens. Never add unprefixed tokens.
- **Set `data-theme` and global overrides on `<html>`.** Popovers and modals render in a portal on `<body>`, so a theme scoped to a subtree won't reach them.

There is also a JS path: `applyTheme({ '--primary': '…' })` on `<html>` by default, plus `createTheme()` / `createThemeCss()`.

### Dark mode

```html
<html data-theme="dark">…</html>
```

The library ships both themes.

### App code with Tailwind v4

To use the same tokens in an app's own Tailwind utilities:

```css
@import 'tailwindcss';

@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
}
```

## Enforcing tokens in apps

The token check (contract C2) ships as a bin, so apps run the same check in their CI:

```sh
npx brafols-ui-check-tokens src   # exits 1 listing file:line  class for each palette class or hex color
```

It checks `.ts`, `.tsx` and `.astro` files and skips tests, stories and metadata, plus `node_modules`, `dist` and dot-directories. See [`docs/USAGE.md`](docs/USAGE.md#enforcing-tokens-in-your-app) for wiring it into CI.

## For agents

The package ships an agent-facing manifest at `node_modules/@brafols/ui/dist/ai/`:

- **`components.json`** has two halves:
  - facts extracted from source on every build: exports, the props each component declares, recipe variants, the tokens it uses, and the version it first shipped in;
  - model-written metadata: when to use, when not to, alternatives, anti-patterns, accessibility, and an example.
- **`USAGE.md`** has the rules for building app UI with the library, plus a snippet to paste into an app's `AGENTS.md`.

Contributors and agents working on this repo should read [`AGENTS.md`](AGENTS.md).

## Styling contract

State is exposed through attributes, never internal classes:

- Ours: `data-slot`, `data-variant`, `data-size`.
- React Aria's: `data-hovered`, `data-pressed`, `data-focus-visible`, `data-disabled`, `data-invalid`, `data-selected`, …

Tests and app CSS should target these.

## Releases

A merge to `main` with a releasable conventional commit cuts a tag (`scripts/release.mjs`):

- `feat` → minor
- `fix` / `perf` → patch
- `!` or `BREAKING CHANGE:` → major

Commits like `feat(BOR-12): …` parse the same way. `npm run release:dry-run` prints the next version.

## Development

```sh
npm install
npm run dev        # Storybook on http://localhost:6006
npm run test       # vitest
npm run typecheck  # tsc --noEmit
npm run build      # tsup, Tailwind CLI -> dist/styles.css, then dist/ai manifest
npm run lint:tokens        # no palette/hex colors in components and recipes
npm run metadata:check     # metadata fresh + every component has stories/test/metadata
npm run metadata:stale     # what needs regenerating (--json for tools)
npm run build-storybook
```
