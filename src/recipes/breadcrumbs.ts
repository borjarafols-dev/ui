import { tv } from 'tailwind-variants'

export const breadcrumbs = tv({
  slots: {
    nav: '',
    list: 'flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground',
    item: 'inline-flex items-center gap-1.5',
    link: 'rounded-sm outline-none hover:text-foreground hover:underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring current:font-medium current:text-foreground current:no-underline',
    separator: 'text-muted-foreground',
  },
  variants: {
    // React Aria disables the current page's link, and `disabled:` outranks
    // `current:`, so the current page would otherwise render dimmed.
    isCurrent: { true: { link: 'disabled:cursor-default disabled:opacity-100' } },
  },
})
