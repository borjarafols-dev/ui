import { tv } from 'tailwind-variants'

export const modal = tv({
  slots: {
    overlay: 'fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4',
    dialog:
      'max-h-[90vh] min-w-80 max-w-[90vw] overflow-auto rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-lg outline-none',
    title: 'mb-4 text-lg font-semibold text-foreground',
  },
})
