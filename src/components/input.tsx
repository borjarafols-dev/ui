import * as React from 'react'

import { cn } from '../lib/utils'

export type InputProps = React.ComponentPropsWithoutRef<'input'>

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, disabled, ...props }, ref) => (
    <input
      data-slot="input"
      data-disabled={disabled ? '' : undefined}
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
        className,
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    />
  ),
)
Input.displayName = 'Input'
