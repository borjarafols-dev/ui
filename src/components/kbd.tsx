import type * as React from 'react'
import { Keyboard } from 'react-aria-components'

import { kbd, type KbdVariants } from '../recipes/kbd'

export interface KbdProps extends Omit<React.ComponentPropsWithRef<'kbd'>, 'className'>, KbdVariants {
  className?: string
}

/**
 * A key or key combination shown as text, in a shortcut legend, a menu item or a tooltip.
 * Inside a React Aria `MenuItem` it fills the item's keyboard slot.
 *
 * @usage Display only: it doesn't bind the key; the app must handle the shortcut.
 * @usage One Kbd per key in a combination.
 * @usage Symbols (⌘, ⇧, ⌥) need an aria-label with the key name.
 */
export function Kbd({ className, size, ...props }: KbdProps) {
  return <Keyboard data-slot="kbd" data-size={size ?? 'md'} className={kbd({ size, className })} {...props} />
}
