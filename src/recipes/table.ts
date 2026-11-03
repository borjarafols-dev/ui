import { tv } from 'tailwind-variants'

export const table = tv({
  slots: {
    container: 'flex w-full flex-col gap-3',
    toolbar: 'flex items-end gap-3',
    search: 'w-full max-w-xs',
    columnsButton: 'ml-auto',
    popover:
      'min-w-40 rounded-md border border-border bg-popover text-popover-foreground shadow-lg',
    columnList: 'flex flex-col gap-2 p-3 outline-none',
    root: 'w-full border-collapse text-sm',
    header: 'bg-muted',
    column:
      'border-b border-border text-left text-xs font-medium tracking-wider text-muted-foreground uppercase outline-none allows-sorting:hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring',
    columnContent: 'inline-flex items-center gap-1',
    sortIndicator: 'leading-none',
    row: 'border-b border-border text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
    cell: 'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
    empty: 'py-8 text-center text-sm text-muted-foreground',
    footer: 'flex flex-wrap items-end justify-end gap-3 text-sm text-muted-foreground',
    pageSize: 'w-24',
    position: 'self-center tabular-nums',
    pager: 'flex gap-2',
  },
  variants: {
    density: {
      comfortable: { column: 'px-6 py-3', cell: 'px-6 py-4' },
      compact: { column: 'px-3 py-1.5', row: 'h-7', cell: 'px-3 py-1' },
    },
  },
  defaultVariants: { density: 'comfortable' },
})
