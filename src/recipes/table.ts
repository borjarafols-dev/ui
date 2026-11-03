import { tv } from 'tailwind-variants'

export const table = tv({
  slots: {
    container: 'flex flex-col gap-3',
    toolbar: 'flex items-end gap-3',
    search: 'w-full max-w-xs',
    root: 'w-full border-collapse text-sm',
    header: 'bg-muted',
    column:
      'border-b border-border px-6 py-3 text-left text-xs font-medium tracking-wider text-muted-foreground uppercase outline-none allows-sorting:hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
    columnContent: 'inline-flex items-center gap-1',
    sortIndicator: 'leading-none',
    row: 'border-b border-border text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
    cell: 'px-6 py-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
    empty: 'py-8 text-center text-sm text-muted-foreground',
    footer: 'flex flex-wrap items-end justify-end gap-3 text-sm text-muted-foreground',
    pageSize: 'w-24',
    position: 'self-center tabular-nums',
    pager: 'flex gap-2',
  },
})
