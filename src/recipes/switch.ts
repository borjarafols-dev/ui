import { tv, type VariantProps } from 'tailwind-variants'

export const switchRecipe = tv({
  slots: {
    root: 'group/switch inline-flex cursor-default items-center gap-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50',
    track:
      'relative inline-flex shrink-0 items-center rounded-full bg-input px-0.5 transition-colors group-selected/switch:bg-primary group-focus-visible/switch:ring-2 group-focus-visible/switch:ring-ring group-focus-visible/switch:ring-offset-2 group-focus-visible/switch:ring-offset-background motion-reduce:transition-none',
    thumb:
      'block rounded-full bg-background shadow-xs transition-transform group-selected/switch:bg-primary-foreground motion-reduce:transition-none',
    content: 'flex flex-col gap-0.5',
    label: '',
    description: 'text-xs text-muted-foreground',
  },
  variants: {
    size: {
      sm: {
        track: 'h-4 w-7',
        thumb: 'size-3 group-selected/switch:translate-x-3 rtl:group-selected/switch:-translate-x-3',
      },
      md: {
        track: 'h-5 w-9',
        thumb: 'size-4 group-selected/switch:translate-x-4 rtl:group-selected/switch:-translate-x-4',
      },
    },
  },
  defaultVariants: { size: 'md' },
})

export type SwitchVariants = VariantProps<typeof switchRecipe>
