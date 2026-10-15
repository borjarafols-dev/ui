import { tv } from 'tailwind-variants'

/** Card slots: `const { root, header, title } = card()`. */
export const card = tv({
  slots: {
    root: 'rounded-xl border border-border bg-card text-card-foreground shadow-sm dark:shadow-black/40',
    header: 'flex flex-col gap-1.5 p-6',
    title: 'text-lg leading-none font-semibold',
    description: 'text-sm text-muted-foreground',
    content: 'p-6 pt-0',
    footer: 'flex items-center p-6 pt-0',
  },
})
