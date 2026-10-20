import { tv, type VariantProps } from 'tailwind-variants'

export const toast = tv({
  slots: {
    region:
      'fixed bottom-4 end-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    toast:
      'flex items-start gap-3 rounded-lg border border-transparent p-4 text-sm shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    content: 'flex min-w-0 flex-1 flex-col gap-1',
    title: 'font-medium',
    description: 'opacity-90',
    close:
      'flex size-6 shrink-0 cursor-default items-center justify-center rounded-md opacity-80 outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring',
  },
  variants: {
    variant: {
      success: { toast: 'bg-success text-success-foreground' },
      error: { toast: 'bg-destructive text-destructive-foreground' },
    },
  },
  defaultVariants: { variant: 'success' },
})

export type ToastVariants = VariantProps<typeof toast>
