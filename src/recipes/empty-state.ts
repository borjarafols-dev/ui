import { tv } from 'tailwind-variants'

export const emptyState = tv({
  slots: {
    root: 'flex flex-col items-center justify-center py-12 text-center',
    title: 'text-lg font-medium text-foreground',
    description: 'mt-2 max-w-prose text-sm text-muted-foreground',
    action: 'mt-6',
  },
})
