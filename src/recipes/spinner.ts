import { tv, type VariantProps } from 'tailwind-variants'

export const spinner = tv({
  base: 'animate-spin rounded-full border-2 border-muted border-t-primary motion-reduce:animate-[spin_1.5s_linear_infinite]',
  variants: {
    size: { sm: 'size-4', md: 'size-8', lg: 'size-12' },
  },
  defaultVariants: { size: 'md' },
})

export type SpinnerVariants = VariantProps<typeof spinner>
