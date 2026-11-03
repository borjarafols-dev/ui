import { Link as RACLink, type LinkProps as RACLinkProps } from 'react-aria-components'

import { useStrings } from '../i18n/strings'
import { link, type LinkVariants } from '../recipes/link'

export interface LinkProps extends Omit<RACLinkProps, 'className'>, LinkVariants {
  /** Opens in a new tab with rel="noopener noreferrer" and an "opens in a new tab" cue. */
  isExternal?: boolean
  className?: string
}

/**
 * Text link to another page. In-app hrefs navigate through React Aria's
 * `RouterProvider` when the app mounts one; `isExternal` opens a new tab and
 * says so, visibly and to screen readers.
 *
 * @usage For navigation; for an action that changes data use Button.
 * @usage A link that must look like a button uses the button() recipe on Link, not a Button inside an a.
 * @usage isExternal for every link that leaves the app.
 * @usage Inside running text use the inline variant, which stays underlined.
 */
export function Link({ variant, isExternal, className, children, ...props }: LinkProps) {
  const t = useStrings()
  const slots = link({ variant })
  const cue = isExternal && (
    <>
      {/* The flex container drops this space visually; it separates the cue in the accessible name. */}
      {' '}
      <svg viewBox="0 0 12 12" className={slots.externalIcon()} aria-hidden="true">
        <path d="M4.5 2.5h5v5M9.5 2.5 3 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">{t.opensInNewTab}</span>
    </>
  )
  return (
    <RACLink
      data-slot="link"
      data-variant={variant ?? 'inline'}
      data-external={isExternal || undefined}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      {...props}
      className={slots.root({ className })}
    >
      {typeof children === 'function'
        ? (values) => (
            <>
              {children(values)}
              {cue}
            </>
          )
        : (
            <>
              {children}
              {cue}
            </>
          )}
    </RACLink>
  )
}
