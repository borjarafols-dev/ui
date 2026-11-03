import { tv } from 'tailwind-variants'

export const tooltip = tv({
  slots: {
    tooltip:
      'max-w-64 rounded-md bg-foreground px-2 py-1 text-xs text-background shadow-md outline-none transition-opacity duration-150 entering:opacity-0 exiting:opacity-0 motion-reduce:transition-none',
    arrow: 'fill-foreground placement-bottom:rotate-180 placement-left:-rotate-90 placement-right:rotate-90',
    textTrigger:
      'cursor-help rounded-sm underline decoration-dotted underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring',
  },
})
