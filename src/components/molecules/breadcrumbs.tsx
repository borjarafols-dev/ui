import {
  Breadcrumb as RACBreadcrumb,
  Breadcrumbs as RACBreadcrumbs,
  type BreadcrumbProps as RACBreadcrumbProps,
  type BreadcrumbsProps as RACBreadcrumbsProps,
} from 'react-aria-components'

import { useStrings } from '../../i18n/strings'
import { breadcrumbs } from '../../recipes/breadcrumbs'
import { Link } from '../atoms/link'

export interface BreadcrumbsProps<T> extends Omit<RACBreadcrumbsProps<T>, 'className'> {
  /** Name of the nav landmark. Defaults to the localised breadcrumbs label. */
  'aria-label'?: string
  className?: string
}

const slots = breadcrumbs()

/**
 * Trail of links from the top of a hierarchy down to the current page, in a
 * `<nav>` landmark. In-app hrefs navigate through React Aria's `RouterProvider`
 * when the app mounts one.
 *
 * @usage For pages two or more levels deep; not on top-level pages.
 * @usage The last item is the current page and has no href.
 * @usage Not for steps in a flow (a wizard); breadcrumbs show hierarchy, not progress.
 */
export function Breadcrumbs<T>({
  'aria-label': ariaLabel,
  className,
  render,
  ...props
}: BreadcrumbsProps<T>) {
  const t = useStrings()
  return (
    <nav data-slot="breadcrumbs" aria-label={ariaLabel ?? t.breadcrumbs} className={slots.nav({ className })}>
      <RACBreadcrumbs
        {...props}
        // React Aria names the list too; the nav already carries the name.
        render={({ 'aria-label': _, ...list }, values) => (render ? render(list, values) : <ol {...list} />)}
        className={slots.list()}
      />
    </nav>
  )
}

export interface BreadcrumbProps extends Omit<RACBreadcrumbProps, 'className' | 'children'> {
  /** Omit on the current page. */
  href?: string
  children: React.ReactNode
  className?: string
}

/** One level of `Breadcrumbs`. The last one is the current page. */
export function Breadcrumb({ href, children, className, ...props }: BreadcrumbProps) {
  return (
    <RACBreadcrumb {...props} className={slots.item({ className })}>
      {({ isCurrent }) => (
        <>
          <Link href={href} variant="muted" className={slots.link({ isCurrent })}>
            {children}
          </Link>
          {!isCurrent && (
            <span aria-hidden="true" className={slots.separator()}>
              /
            </span>
          )}
        </>
      )}
    </RACBreadcrumb>
  )
}
