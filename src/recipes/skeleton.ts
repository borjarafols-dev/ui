import { tv, type VariantProps } from 'tailwind-variants'

export const skeleton = tv({
  base: 'block bg-muted motion-safe:animate-pulse',
  variants: {
    shape: {
      text: 'h-4 rounded-sm',
      block: 'rounded-md',
      circle: 'aspect-square rounded-full',
    },
  },
  defaultVariants: { shape: 'text' },
})

export type SkeletonVariants = VariantProps<typeof skeleton>
