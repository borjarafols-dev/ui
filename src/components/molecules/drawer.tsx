import { useContext, type ReactNode } from 'react'
import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
} from 'react-aria-components'

import { useStrings } from '../../i18n/strings'
import { drawer, type DrawerVariants } from '../../recipes/drawer'

export interface DrawerProps extends DrawerVariants {
  /** Controlled open state. Omit inside a `DialogTrigger`. */
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  title?: string
  /** Accessible name when there is no visible `title`. */
  'aria-label'?: string
  /** Close when the backdrop is clicked. Defaults to true. Escape always closes. */
  isDismissable?: boolean
  /** Footer content, usually Cancel and a primary action. Sticks to the bottom. */
  footer?: ReactNode
  /** Label of the close button. Defaults to a localised label. */
  closeLabel?: string
  /** Merged on the panel. */
  className?: string
  children: ReactNode | ((opts: { close: () => void }) => ReactNode)
}

/**
 * Modal panel that slides in from the inline end, over a dimmed page. Focus trap, focus restore,
 * scroll lock and Escape to close; a close button in the header and a footer that stays visible
 * while the body scrolls. Controlled with `isOpen`, or uncontrolled inside a `DialogTrigger`.
 *
 * @usage For editing or inspecting one record while keeping the page in view; for a short blocking decision use Modal or ConfirmDialog.
 * @usage Not for navigation menus or a persistent sidebar; those belong in the app layout.
 * @usage One drawer at a time; don't open a drawer from a drawer.
 * @usage Put Save and Cancel in footer so they stay visible while the body scrolls.
 */
export function Drawer({
  isOpen,
  onOpenChange,
  title,
  'aria-label': ariaLabel,
  isDismissable = true,
  footer,
  closeLabel,
  size,
  className,
  children,
}: DrawerProps) {
  const t = useStrings()
  const trigger = useContext(OverlayTriggerStateContext)
  const slots = drawer({ size })
  // Inside a DialogTrigger, drive the overlay from the trigger's state so `onOpenChange` still fires.
  const controlled = isOpen != null || !trigger
  return (
    <ModalOverlay
      isOpen={controlled ? isOpen : trigger.isOpen}
      onOpenChange={(open) => {
        if (!controlled) trigger.setOpen(open)
        onOpenChange?.(open)
      }}
      isDismissable={isDismissable}
      className={slots.overlay()}
    >
      <Modal className={slots.panel({ className })}>
        <Dialog
          data-slot="drawer"
          data-size={size ?? 'md'}
          aria-label={title ? undefined : ariaLabel}
          className={slots.dialog()}
        >
          {({ close }) => (
            <>
              <div className={slots.header()}>
                {title && (
                  <Heading slot="title" className={slots.title()}>
                    {title}
                  </Heading>
                )}
                <Button slot="close" aria-label={closeLabel ?? t.close} className={slots.close()}>
                  <span aria-hidden="true">✕</span>
                </Button>
              </div>
              <div className={slots.body()}>{typeof children === 'function' ? children({ close }) : children}</div>
              {footer && <div className={slots.footer()}>{footer}</div>}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}
