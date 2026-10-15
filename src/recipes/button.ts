import { tv, type VariantProps } from 'tailwind-variants'

/**
 * Button styles. Framework-agnostic: use on a React Aria `Button`/`Link`, a
 * router link, or a plain `<a>`/`<button>` in an `.astro` file.
 */
export const button = tv({
  base: 'inline-flex cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  variants: {
    variant: {
      primary: 'bg-button-primary text-button-primary-foreground shadow-xs hover:bg-button-primary-hover pressed:bg-button-primary-hover',
      secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 pressed:bg-secondary/80',
      outline: 'border border-border bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground pressed:bg-accent',
      ghost: 'hover:bg-accent hover:text-accent-foreground pressed:bg-accent',
      destructive: 'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 pressed:bg-destructive/90',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      sm: 'h-8 gap-1.5 px-3 text-xs',
      md: 'h-9 px-4 py-2',
      lg: 'h-10 px-6',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})

export type ButtonVariants = VariantProps<typeof button>
