import type * as React from 'react'
import {
  Collection,
  Header,
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  MenuSection as RACMenuSection,
  MenuTrigger,
  Popover,
  Separator,
  type MenuItemProps as RACMenuItemProps,
  type MenuProps as RACMenuProps,
  type MenuSectionProps as RACMenuSectionProps,
  type PopoverProps,
} from 'react-aria-components'

import { menu } from '../recipes/menu'
import { Kbd } from './kbd'

export interface MenuProps<T> extends Omit<RACMenuProps<T>, 'className'> {
  /** The trigger: a library Button. */
  trigger: React.ReactElement
  /** Popover placement. Defaults to 'bottom end'. */
  placement?: PopoverProps['placement']
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** On the popover. */
  className?: string
}

/**
 * A button that opens a list of actions. Each `MenuItem` runs `onAction` with
 * its `id` or follows its `href` through the app's `RouterProvider`.
 *
 * @usage For actions on a thing (row overflow, user menu); not for site navigation: use Link in a nav, or Tabs.
 * @usage Not for choosing a value in a form: use Select.
 * @usage Put destructive items last, after a separator, with the destructive variant; confirm them with ConfirmDialog.
 * @usage An icon-only trigger needs an aria-label that says what the menu holds ("Row actions").
 */
export function Menu<T extends object>({
  trigger,
  placement = 'bottom end',
  isOpen,
  onOpenChange,
  className,
  ...props
}: MenuProps<T>) {
  const slots = menu()
  return (
    <MenuTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      {trigger}
      <Popover data-slot="menu-popover" placement={placement} className={slots.popover({ className })}>
        <RACMenu data-slot="menu" {...props} className={slots.menu()} />
      </Popover>
    </MenuTrigger>
  )
}

export interface MenuItemProps extends Omit<RACMenuItemProps, 'className' | 'children'> {
  variant?: 'default' | 'destructive'
  /** Keyboard shortcut shown at the end of the item. Display only: the menu doesn't bind it. */
  shortcut?: string
  children?: React.ReactNode
  className?: string
}

export function MenuItem({ variant = 'default', shortcut, children, className, textValue, ...props }: MenuItemProps) {
  const slots = menu({ variant })
  return (
    <RACMenuItem
      data-slot="menu-item"
      data-variant={variant}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      {...props}
      className={slots.item({ className })}
    >
      {({ selectionMode, isSelected }) => (
        <>
          {selectionMode !== 'none' && (
            <span aria-hidden="true" className={slots.check()}>
              {isSelected ? '✓' : null}
            </span>
          )}
          {children}
          {shortcut && <Kbd className={slots.shortcut()}>{shortcut}</Kbd>}
        </>
      )}
    </RACMenuItem>
  )
}

export interface MenuSectionProps<T> extends Omit<RACMenuSectionProps<T>, 'className'> {
  title?: string
  className?: string
}

export function MenuSection<T extends object>({ title, items, children, className, ...props }: MenuSectionProps<T>) {
  const slots = menu()
  return (
    <RACMenuSection data-slot="menu-section" {...props} className={className}>
      {title && <Header className={slots.sectionHeader()}>{title}</Header>}
      <Collection items={items}>{children}</Collection>
    </RACMenuSection>
  )
}

export function MenuSeparator({ className }: { className?: string }) {
  return <Separator data-slot="menu-separator" className={menu().separator({ className })} />
}
