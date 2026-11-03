import { tv, type VariantProps } from 'tailwind-variants'

export const meter = tv({
  slots: {
    root: 'flex flex-col gap-1.5',
    header: 'flex items-baseline justify-between gap-2 text-sm',
    label: 'font-medium text-foreground',
    value: 'tabular-nums text-muted-foreground',
    track: 'w-full overflow-hidden rounded-full bg-muted',
    fill: 'h-full w-(--meter-value) rounded-full bg-meter-fill transition-[width] motion-reduce:transition-none',
  },
  variants: {
    size: {
      sm: { track: 'h-1' },
      md: { track: 'h-2' },
    },
    status: {
      normal: {},
      warning: { fill: 'bg-warning', value: 'text-warning' },
      destructive: { fill: 'bg-destructive', value: 'text-destructive' },
    },
  },
  defaultVariants: { size: 'md', status: 'normal' },
})

export type MeterVariants = VariantProps<typeof meter>
