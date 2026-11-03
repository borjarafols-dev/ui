import { tv, type VariantProps } from 'tailwind-variants'

export const kbd = tv({
  base: 'inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-border bg-muted px-1 font-mono text-xs font-medium text-muted-foreground',
  variants: {
    size: {
      sm: 'h-4 min-w-4 text-[0.625rem]',
      md: '',
    },
  },
  defaultVariants: { size: 'md' },
})

export type KbdVariants = VariantProps<typeof kbd>
