import { tv } from 'tailwind-variants'

/** Tabs slots: `const { root, list, tab, indicator, panel } = tabs()`. */
export const tabs = tv({
  slots: {
    root: 'flex flex-col gap-4 orientation-vertical:flex-row',
    list: 'group/tab-list flex gap-4 border-b border-border orientation-vertical:flex-col orientation-vertical:border-b-0 orientation-vertical:border-e',
    tab: 'relative cursor-default rounded-sm px-1 pb-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground selected:text-foreground disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring group-orientation-vertical/tab-list:py-1 group-orientation-vertical/tab-list:pe-3',
    indicator:
      'absolute inset-x-0 -bottom-px h-0.5 bg-primary transition-[translate,width,height] duration-200 motion-reduce:transition-none group-orientation-vertical/tab-list:inset-x-auto group-orientation-vertical/tab-list:inset-y-0 group-orientation-vertical/tab-list:-end-px group-orientation-vertical/tab-list:h-auto group-orientation-vertical/tab-list:w-0.5',
    panel: 'rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring',
  },
})
