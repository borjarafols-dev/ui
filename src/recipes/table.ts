import { tv } from 'tailwind-variants'

export const table = tv({
  slots: {
    root: 'w-full border-collapse text-sm',
    header: 'bg-muted',
    column:
      'border-b border-border px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring',
    row: 'border-b border-border text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
    cell: 'px-6 py-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
    empty: 'py-8 text-center text-sm text-muted-foreground',
  },
})
