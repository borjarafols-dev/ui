import { tv, type VariantProps } from 'tailwind-variants'

export const menu = tv({
  slots: {
    popover:
      'min-w-40 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none',
    menu: 'max-h-[inherit] overflow-auto outline-none',
    item: 'flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground disabled:opacity-50',
    sectionHeader: 'px-2 py-1.5 text-xs font-medium text-muted-foreground',
    separator: '-mx-1 my-1 h-px bg-border',
    shortcut: 'ms-auto text-xs text-muted-foreground',
    check: 'inline-flex w-4 shrink-0 justify-center',
  },
  variants: {
    variant: {
      default: {},
      destructive: {
        item: 'text-destructive focus:bg-destructive focus:text-destructive-foreground',
        shortcut: 'text-current',
      },
    },
  },
  defaultVariants: { variant: 'default' },
})

export type MenuVariants = VariantProps<typeof menu>
