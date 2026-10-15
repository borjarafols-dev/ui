import type * as React from 'react'

import { Button } from './button'
import { Modal } from './modal'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Shown on the confirm button while `isPending`. */
  pendingLabel?: string
  confirmVariant?: 'primary' | 'destructive'
  /** Disables both buttons and shows `pendingLabel` while the action runs. */
  isPending?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * "Are you sure?" prompt built on `Modal`. The confirm button is destructive by default.
 *
 * @usage Only for destructive or irreversible actions; don't confirm routine saves.
 * @usage The confirm label names the action ("Delete member"), never "OK" or "Yes".
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  pendingLabel = 'Working…',
  confirmVariant = 'destructive',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} isDismissable={!isPending}>
      <div data-slot="confirm-dialog" className="max-w-sm">
        <div className="text-sm text-muted-foreground">{message}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onPress={onCancel} isDisabled={isPending}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onPress={onConfirm} isDisabled={isPending}>
            {isPending ? pendingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
