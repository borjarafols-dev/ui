import type * as React from 'react'

import { skeleton, type SkeletonVariants } from '../recipes/skeleton'

export interface SkeletonProps
  extends Omit<React.ComponentPropsWithRef<'div'>, 'className' | 'children'>,
    SkeletonVariants {
  /** Width and height of the placeholder. */
  className?: string
}

/**
 * Placeholder shaped like the content that is loading: a line of text, a block or an avatar.
 * Always hidden from assistive technology.
 *
 * @usage For page and section loading; inside a button use Spinner.
 * @usage Shape skeletons like the content they replace; don't show one generic block for a whole page.
 * @usage Set aria-busy on the loading region and put sr-only Loading text in it; skeletons are hidden from screen readers.
 * @usage className sets width and height only.
 */
export function Skeleton({ className, shape, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      data-slot="skeleton"
      data-shape={shape ?? 'text'}
      aria-hidden="true"
      className={skeleton({ shape, className })}
    />
  )
}
