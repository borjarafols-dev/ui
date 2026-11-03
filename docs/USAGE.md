# Using @borjarafols-dev/ui (for agents and people building app UI)

This file ships inside the package at `node_modules/@borjarafols-dev/ui/dist/ai/USAGE.md`, next to `components.json`, and matches the installed version.

## Before you build any UI

1. **Read `components.json`.** For each piece of UI you need, look for a component whose `metadata.whenToUse` fits. Read its `whenNotToUse` too.
2. **Choose in this order:**
   1. An existing app composite in the app's own `src/ui/`.
   2. A library component.
   3. A library recipe on plain markup.
   4. A new app composite built from library pieces.
3. **Don't re-implement a library component** (button, field, select, modal, table, …), even with different styles. Change its look through tokens.
4. **If something the ticket needs is missing from the library, stop and report it.** Gaps should have been caught when the spec was written. Don't hand-roll a lookalike.

## Install

`npm i @borjarafols-dev/ui@^X.Y.Z` (published to GitHub Packages).

Developer, once: add this to `~/.npmrc`, with a personal access token that has `read:packages`:

```ini
@borjarafols-dev:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=<read:packages token>
```

CI, in the workflow that runs `npm ci`:

```yaml
permissions:
  contents: read
  packages: read
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: 24
      registry-url: https://npm.pkg.github.com
      scope: '@borjarafols-dev'
  - run: npm ci
    env:
      NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

The package must grant the consuming repo Read under "Manage Actions access". Don't add an `.npmrc` that maps the scope to the repo.

## Setup (once per app)

```ts
import '@borjarafols-dev/ui/styles.css' // in the app entry, before the app's own CSS
```

Set the theme on `<html>`: `<html data-theme="light">` or `"dark"`. Popovers and modals portal to `<body>`, so a theme on an inner element doesn't reach them.

### Language of built-in labels

The library's built-in default labels (SearchField's clear button, Spinner's label, DataTable's name, empty message, search field, paging footer, Columns button, expand and collapse buttons and "Show n new rows" button, ConfirmDialog's cancel, confirm and pending labels, ToastRegion's name and close button, Link's "opens in a new tab" cue) are localised in English, Spanish and Catalan. They follow React Aria's locale, like React Aria's own strings:

- To set the language, wrap the app's root in React Aria's `I18nProvider`. Don't add a wrapper of your own.
- Without a provider, labels follow the browser's language.
- The locale is matched by language (`ca-ES` and `ca-AD` both get Catalan). Unsupported languages, such as `fr-FR`, get English.
- An explicit prop (`cancelLabel`, `clearLabel`, `closeLabel`, `label`, `aria-label`, `emptyMessage`, …) always wins over the localised default.

```tsx
import { I18nProvider } from 'react-aria-components'

createRoot(root).render(
  <I18nProvider locale="ca-ES">
    <App />
  </I18nProvider>,
)
```

Set the provider's `locale` from the app's own language setting, so library labels match the app's copy. Modals and popovers keep the locale, because React context reaches through portals.

### Client-side navigation

`Link` (and any React Aria component with an `href`) navigates with a full page load unless the app mounts React Aria's `RouterProvider`. Mount it once, at the app root, inside the router, with the router's `navigate` and `useHref`. Don't wrap `Link` in the router's own link component, and don't add a provider of your own.

With React Router, put it in the root layout route, where the router's hooks work:

```tsx
import { Outlet, useHref, useNavigate, type NavigateOptions } from 'react-router'
import { RouterProvider } from 'react-aria-components'

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions
  }
}

export function RootLayout() {
  const navigate = useNavigate()
  return (
    <RouterProvider navigate={navigate} useHref={useHref}>
      <Outlet />
    </RouterProvider>
  )
}
```

- `useHref` turns a router path into the real `href` (base path included), so modifier clicks and "open in new tab" still work.
- The `RouterConfig` declaration types `routerOptions` on every `Link`: `<Link href="/projects" routerOptions={{ replace: true }}>`.
- Links with `isExternal` (or a `target` other than `_self`) and hrefs to another origin skip the router and load normally.

## Rules

- **Tokens only.**
  - Never write palette classes (`bg-blue-600`, `text-gray-500`) or hex colors.
  - In app code, use token utilities (`bg-primary`, `text-muted-foreground`, `border-border`).
  - Status colors: `destructive` for errors, `success` for confirmations (`text-success`, `border-success`, or `bg-success` with `text-success-foreground`). Both are defined for light and dark.
  - The app's look lives in its `theme.css`, which overrides library tokens for both `:root` and `[data-theme='dark']`.
- **App tokens use the app prefix** (`--alo-hero-bg`) and are defined from library tokens. Never add unprefixed tokens.
- **`className` on library components is for layout only**: margin, width, flex/grid placement. Don't use it to change colors, borders, radius or typography.
- **React Aria APIs:**
  - Buttons: `onPress` / `isDisabled`, not `onClick` / `disabled`.
  - Fields: value-based `onChange`, `isInvalid`, or `error`.
  - `Select`: `selectedKey` / `onSelectionChange`.
- **Testing:** `Select` is a listbox, not a native `<select>`. Click the trigger, then the `option`; `userEvent.selectOptions` won't work. Query by role and accessible name.
- **Links that look like buttons:** put the `button()` recipe on the router link or a React Aria `Link`. Don't wrap a `Button` in an `<a>`.
- **Astro and other non-React markup:** use recipes from `@borjarafols-dev/ui/recipes` (`class={button({ variant: 'primary' })}`). Use the React components only inside islands that need interaction.
- **State styling:** target data attributes (`data-variant`, `data-selected`, `data-invalid`, …), never internal class names.

## Enforcing tokens in your app

The package ships the library's own token check as a bin, so every app runs the same implementation, versioned with the tokens it protects. It fails on palette classes (`bg-blue-600`, `text-white`) and hex colors.

```sh
npx brafols-ui-check-tokens src
```

- Pass one or more files or directories. It checks `.ts`, `.tsx` and `.astro` files and skips `*.test.*`, `*.stories.*` and `*.metadata.ts` files, plus `node_modules`, `dist` and dot-directories (`.astro`, `.git`) inside the given directories. Keep checked source out of those.
- It exits 1 and lists each hit as `file:line  class`, or exits 0 and prints `Token check passed.`

Add it to the app's scripts and run it in CI next to the typecheck and tests:

```json
{
  "scripts": {
    "lint:tokens": "brafols-ui-check-tokens src"
  }
}
```

```yaml
- run: npm ci
- run: npm run lint:tokens
```

## Migrating

### DataTable: `columns`/`keyField` to TanStack column definitions

`DataTable` builds its rows with TanStack Table, so `columns` are TanStack column definitions and `keyField` is replaced by `getRowId`. The library depends on `@tanstack/react-table` itself; the app doesn't install it.

- Build `columns` with `createDataTableColumnHelper<Row>()`: `key` becomes the accessor's first argument, `header` stays `header`, and `render(value, row)` becomes `cell: (info) => …`, with `info.getValue()` for the value and `info.row.original` for the row.
- Replace `keyField="id"` with `getRowId={(row) => row.id}`. It must return a string.
- Type a column list as `DataTableColumnDef<Row>[]` (was `DataTableColumn<Row>[]`), or let `column.columns([...])` infer it.
- Build `columns` once (module scope or `useMemo`), not inline on every render, so the rows aren't rebuilt each time.
- `DataTable` now renders inside a wrapper `div` (`data-slot="data-table-container"`); `data-slot="data-table"` and `className` stay on the table. Style or select the table by its own `data-slot`, not as a direct child of your layout.
- A Columns button above the table lists every hideable column. Give the identifying column `enableHiding: false`; give every column `enableHiding: false` to have no Columns button.

Before:

```tsx
import { Badge, DataTable, type DataTableColumn } from '@borjarafols-dev/ui'

const columns: DataTableColumn<Member>[] = [
  { key: 'name', header: 'Name' },
  { key: 'status', header: 'Status', render: (value) => <Badge>{String(value)}</Badge> },
]

<DataTable aria-label="Members" columns={columns} data={members} keyField="id" />
```

After:

```tsx
import { Badge, createDataTableColumnHelper, DataTable } from '@borjarafols-dev/ui'

const column = createDataTableColumnHelper<Member>()
const columns = column.columns([
  column.accessor('name', { header: 'Name' }),
  column.accessor('status', { header: 'Status', cell: (info) => <Badge>{info.getValue()}</Badge> }),
])

<DataTable aria-label="Members" columns={columns} data={members} getRowId={(member) => member.id} />
```

## Copy into your app's AGENTS.md

```md
## UI

This app's UI is built on @borjarafols-dev/ui (React Aria + tailwind-variants, token-themed).
Before writing or changing UI, read node_modules/@borjarafols-dev/ui/dist/ai/USAGE.md and
node_modules/@borjarafols-dev/ui/dist/ai/components.json, and follow them. The app's look
lives in src/styles/theme.css (token overrides only). App composites live in src/ui/.
```
