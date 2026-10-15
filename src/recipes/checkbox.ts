import { tv } from 'tailwind-variants'

export const checkbox = tv({
  slots: {
    root: 'inline-flex cursor-default items-center gap-2 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-50',
    box: 'flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background text-primary-foreground transition-colors',
    icon: 'size-3',
  },
  variants: {
    checked: { true: { box: 'border-primary bg-primary' } },
    focusVisible: { true: { box: 'ring-2 ring-ring ring-offset-1 ring-offset-background' } },
    invalid: { true: { box: 'border-destructive' } },
  },
})
