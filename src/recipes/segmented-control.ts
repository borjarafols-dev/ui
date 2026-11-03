import { tv, type VariantProps } from 'tailwind-variants'

/** SegmentedControl slots: `const { root, item } = segmentedControl({ size })`. */
export const segmentedControl = tv({
  slots: {
    root: 'inline-flex items-center gap-0.5 rounded-md bg-muted p-0.5 orientation-vertical:flex-col orientation-vertical:items-stretch',
    item: 'relative inline-flex cursor-default items-center justify-center gap-1.5 whitespace-nowrap rounded-sm px-3 font-medium text-muted-foreground outline-none transition-colors motion-reduce:transition-none hover:text-foreground selected:bg-background selected:text-foreground selected:shadow-xs focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
  },
  variants: {
    size: {
      sm: { item: 'h-7 text-xs' },
      md: { item: 'h-8 text-sm' },
    },
  },
  defaultVariants: { size: 'md' },
})

export type SegmentedControlVariants = VariantProps<typeof segmentedControl>
