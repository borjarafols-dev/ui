import * as React from 'react'
import { Form, Input, Label, TextField } from 'react-aria-components'

import { useStrings } from '../i18n/strings'
import { field } from '../recipes/field'
import { Button } from './button'
import { Modal } from './modal'

export interface ConfirmDialogProps {
  open: boolean
  title: string
  message: React.ReactNode
  /** Defaults to a localised generic label; prefer a label that names the action. */
  confirmLabel?: string
  /** Defaults to a localised label. */
  cancelLabel?: string
  /** Shown on the confirm button while `isPending`. Defaults to a localised label. */
  pendingLabel?: string
  confirmVariant?: 'primary' | 'destructive'
  /** Disables both buttons and shows `pendingLabel` while the action runs. */
  isPending?: boolean
  /**
   * The text the user must type to enable confirm, usually the object's name.
   * When set, the dialog shows a text field and confirm stays disabled until it matches.
   */
  confirmText?: string
  /** Label of the text field. Defaults to a localised "Type {confirmText} to confirm". */
  confirmTextLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

const slots = field()

/**
 * "Are you sure?" prompt built on `Modal`. The confirm button is destructive by default.
 *
 * @usage Only for destructive or irreversible actions; don't confirm routine saves.
 * @usage The confirm label names the action ("Delete member"), never "OK" or "Yes".
 * @usage Set confirmText only for irreversible actions that destroy many things at once (a project, a repository); a single row delete needs a plain confirm.
 * @usage confirmText is the object's own name as the user sees it, never a fixed word like "DELETE".
 */
export function ConfirmDialog({ open, title, isPending = false, onCancel, ...props }: ConfirmDialogProps) {
  // The body mounts only while open, so the typed value resets on close.
  return (
    <Modal open={open} onClose={onCancel} title={title} isDismissable={!isPending}>
      <ConfirmDialogBody {...props} isPending={isPending} onCancel={onCancel} />
    </Modal>
  )
}

function ConfirmDialogBody({
  message,
  confirmLabel,
  cancelLabel,
  pendingLabel,
  confirmVariant = 'destructive',
  isPending,
  confirmText,
  confirmTextLabel,
  onConfirm,
  onCancel,
}: Omit<ConfirmDialogProps, 'open' | 'title'>) {
  const t = useStrings()
  const [typed, setTyped] = React.useState('')
  const byName = confirmText !== undefined
  const matches = !byName || typed.trim() === confirmText
  const canConfirm = matches && !isPending

  return (
    <Form
      data-slot="confirm-dialog"
      data-confirm-by-name={byName || undefined}
      className="max-w-sm"
      onSubmit={(event) => {
        event.preventDefault()
        if (canConfirm) onConfirm()
      }}
    >
      <div className="text-sm text-muted-foreground">{message}</div>
      {byName && (
        <TextField
          data-slot="text-field"
          autoFocus
          value={typed}
          onChange={setTyped}
          isDisabled={isPending}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className={slots.root({ className: 'mt-4' })}
        >
          <Label className={slots.label()}>
            <ConfirmTextLabel label={confirmTextLabel ?? t.typeToConfirm(confirmText)} text={confirmText} />
          </Label>
          <Input className={slots.input()} />
        </TextField>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onPress={onCancel} isDisabled={isPending}>
          {cancelLabel ?? t.cancel}
        </Button>
        <Button variant={confirmVariant} onPress={onConfirm} isDisabled={!canConfirm}>
          {isPending ? (pendingLabel ?? t.working) : (confirmLabel ?? t.confirm)}
        </Button>
      </div>
    </Form>
  )
}

function ConfirmTextLabel({ label, text }: { label: string; text: string }) {
  const at = label.indexOf(text)
  if (at === -1) return label
  return (
    <>
      {label.slice(0, at)}
      <span className="font-mono font-semibold text-foreground">{text}</span>
      {label.slice(at + text.length)}
    </>
  )
}
