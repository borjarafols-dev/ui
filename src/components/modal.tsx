import type * as React from 'react'
import { Dialog, Heading, Modal as RACModal, ModalOverlay } from 'react-aria-components'

import { modal } from '../recipes/modal'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  /** Accessible name when there is no visible `title`. */
  'aria-label'?: string
  /** Close when the backdrop is clicked. Escape always closes. */
  isDismissable?: boolean
  className?: string
  children: React.ReactNode
}

const slots = modal()

/** Modal dialog with focus trap, focus restore, scroll lock and Escape to close. */
export function Modal({
  open,
  onClose,
  title,
  'aria-label': ariaLabel,
  isDismissable = true,
  className,
  children,
}: ModalProps) {
  return (
    <ModalOverlay
      isOpen={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      isDismissable={isDismissable}
      className={slots.overlay()}
    >
      <RACModal>
        <Dialog
          data-slot="modal"
          aria-label={title ? undefined : ariaLabel}
          className={slots.dialog({ className })}
        >
          {title && (
            <Heading slot="title" className={slots.title()}>
              {title}
            </Heading>
          )}
          {children}
        </Dialog>
      </RACModal>
    </ModalOverlay>
  )
}
