import { tv } from 'tailwind-variants'

export const select = tv({
  slots: {
    trigger:
      'flex w-full cursor-default items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-left text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50',
    value: 'block truncate data-[placeholder]:text-muted-foreground',
    icon: 'ml-2 text-muted-foreground',
    popover:
      'max-h-60 w-(--trigger-width) overflow-auto rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-lg',
    listbox: 'outline-none',
    item: 'cursor-default px-3 py-2 text-sm outline-none selected:font-medium focus:bg-accent focus:text-accent-foreground disabled:opacity-50',
  },
})
