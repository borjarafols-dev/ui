# ui-library-base

A React + TypeScript design-system library: shadcn-style components built on **Tailwind CSS v4** (CSS-first configuration) and **Radix UI** primitives, themed entirely through **CSS variables**.

Tailwind is an implementation detail. The shipped CSS is pre-compiled; every utility value resolves to a public CSS variable, so consumers re-theme components by overriding variables — no content scanning, no consumer Tailwind config merging.

## Install

Internal/git distribution (not published to npm). The `prepare` script builds `dist/` automatically on install:

```sh
npm i github:borjarafols/ui-library-base
```

`react` and `react-dom` are peer dependencies.

## Usage

```tsx
import 'ui-library-base/styles.css' // tokens + pre-compiled utilities (no preflight)
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from 'ui-library-base'

export function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
        <Button>Continue</Button>
      </CardContent>
    </Card>
  )
}
```

## Theming

Tokens live in three layers, following shadcn/Radix naming:

1. **Primitive** — `--gray-1…--gray-12`, `--brand-1…--brand-12`
2. **Semantic** — `--background`, `--foreground`, `--primary`, `--border`, `--ring`, …
3. **Component** — e.g. `--button-primary-bg`, `--button-primary-bg-hover`

### CSS path

Override the semantic variables anywhere; utilities resolve through them:

```css
.my-brand {
  --primary: rebeccapurple;
  --radius-md: 0.75rem;
}
```

### JS path

```tsx
import { applyTheme, createTheme } from 'ui-library-base'

applyTheme({ '--primary': 'rebeccapurple' }) // on <html> by default
applyTheme({ '--primary': 'tomato' }, someElement) // scoped subtree

// or as a style object / CSS string:
<div style={createTheme({ '--primary': 'rebeccapurple' })} />
```

### Dark mode

Set the `data-theme` attribute — no media-query/class coupling:

```html
<html data-theme="dark">…</html>
```

### Scaling spacing

`--spacing: 0.25rem` is a public token. Compiled utilities emit `calc(var(--spacing) * n)`, so overriding `--spacing` rescales all padding/gap utilities. Note it also rescales your own usage of Tailwind spacing utilities.

## Using with Tailwind v4 in the consumer

The library ships its own pre-compiled utilities. If the consumer app also uses Tailwind v4 and wants the same tokens in app code, map the public variables in the app's own CSS:

```css
@import 'tailwindcss';

@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-border: var(--border);
}
```

Now `bg-primary`, `text-foreground`, … work in app code and follow the same token overrides.

## Styling contract

Components expose state through attributes (`data-variant`, `data-size`, `data-disabled`, `data-slot`, `aria-disabled`, …) — never rely on internal classes for behavior or tests.

## Development

```sh
npm install        # installs deps and builds dist/ (prepare)
npm run dev        # Storybook on http://localhost:6006
npm run build      # tsup (JS + d.ts) then Tailwind CLI -> dist/styles.css
npm run test       # vitest
npm run typecheck  # tsc --noEmit
npm run build-storybook
```
