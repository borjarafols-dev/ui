import { tv } from 'tailwind-variants'

/**
 * Form field slots shared by TextField, TextArea, NumberField, SearchField and
 * Select. In `.astro`: `const { label, input } = field()`.
 */
export const field = tv({
  slots: {
    root: 'flex flex-col gap-1',
    label: 'text-sm font-medium text-foreground',
    input:
      'block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors [&::placeholder]:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/50 invalid:border-destructive invalid:focus:ring-destructive/30 disabled:cursor-not-allowed disabled:opacity-50',
    description: 'text-sm text-muted-foreground',
    error: 'text-sm text-destructive',
  },
})
