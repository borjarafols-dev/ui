import { tv } from 'tailwind-variants'

/** Disclosure slots: `const { root, heading, trigger, chevron, panel, content, group } = disclosure()`. */
export const disclosure = tv({
  slots: {
    root: 'group/disclosure',
    heading: 'm-0',
    trigger:
      'flex w-full cursor-default items-center gap-2 rounded-sm py-2 text-start text-sm font-medium text-foreground outline-none hover:text-foreground/80 focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
    chevron:
      'size-4 shrink-0 text-muted-foreground transition-transform group-data-[expanded]/disclosure:rotate-90 rtl:rotate-180 rtl:group-data-[expanded]/disclosure:rotate-90 motion-reduce:transition-none',
    panel: 'text-sm text-foreground',
    // Padding sits inside the panel: a `hidden="until-found"` panel keeps its box, so padding on it would show while closed.
    content: 'pb-3 ps-6',
    group: 'divide-y divide-border',
  },
})
