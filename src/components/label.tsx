import * as React from 'react'

import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '../lib/utils'

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'select-none text-sm font-medium leading-none text-foreground',
        'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
Label.displayName = 'Label'
