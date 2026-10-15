import type * as React from 'react'

import { badge, type BadgeVariants } from '../recipes/badge'

export interface BadgeProps extends React.ComponentPropsWithRef<'span'>, BadgeVariants {}

/**
 * Static status label. Not interactive: use `Button` for actions.
 *
 * @usage Short status or category text (one or two words), never a sentence.
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant ?? 'primary'}
      className={badge({ variant, className })}
      {...props}
    />
  )
}
