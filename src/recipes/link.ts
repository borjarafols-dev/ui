import { tv, type VariantProps } from 'tailwind-variants'

export const link = tv({
  slots: {
    root: 'inline-flex items-baseline gap-0.5 rounded-sm underline-offset-4 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    externalIcon: 'size-3 shrink-0 self-center',
  },
  variants: {
    variant: {
      inline: { root: 'text-primary underline hover:no-underline' },
      plain: { root: 'text-foreground hover:underline' },
      muted: { root: 'text-muted-foreground hover:text-foreground hover:underline' },
    },
  },
  defaultVariants: { variant: 'inline' },
})

export type LinkVariants = VariantProps<typeof link>
