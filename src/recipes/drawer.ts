import { tv, type VariantProps } from 'tailwind-variants'

export const drawer = tv({
  slots: {
    overlay:
      'fixed inset-0 z-50 bg-overlay transition-opacity entering:opacity-0 exiting:opacity-0 motion-reduce:transition-none',
    panel:
      'fixed inset-y-0 end-0 flex h-full w-full flex-col border-s border-border bg-popover text-popover-foreground shadow-lg outline-none transition-transform entering:translate-x-full exiting:translate-x-full rtl:entering:-translate-x-full rtl:exiting:-translate-x-full motion-reduce:transition-none',
    dialog: 'flex min-h-0 flex-1 flex-col outline-none',
    header: 'flex items-center justify-between gap-4 border-b border-border px-6 py-4',
    title: 'text-lg font-semibold text-foreground',
    close:
      'ms-auto flex size-8 shrink-0 cursor-default items-center justify-center rounded-md opacity-80 outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring',
    body: 'flex-1 overflow-auto px-6 py-4',
    footer: 'flex justify-end gap-3 border-t border-border px-6 py-4',
  },
  variants: {
    size: {
      sm: { panel: 'max-w-sm' },
      md: { panel: 'max-w-lg' },
      lg: { panel: 'max-w-3xl' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type DrawerVariants = VariantProps<typeof drawer>
