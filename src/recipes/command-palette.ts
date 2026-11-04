import { tv } from 'tailwind-variants'

export const commandPalette = tv({
  slots: {
    overlay: 'fixed inset-0 z-50 flex items-start justify-center bg-overlay p-4 pt-[15vh]',
    dialog:
      'flex max-h-[60vh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg outline-none',
    search: 'flex items-center gap-2 border-b border-border px-3',
    input:
      'h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none',
    list: 'flex-1 overflow-auto p-1 outline-none',
    empty: 'py-6 text-center text-sm text-muted-foreground',
    loading: 'flex justify-center py-2',
  },
})
