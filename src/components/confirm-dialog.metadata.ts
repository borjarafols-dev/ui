import type { ComponentMetadata } from '../metadata/schema'
import type { ConfirmDialogProps } from './confirm-dialog'

export default {
  component: 'ConfirmDialog',
  sourceHash: 'sha256:382f3403ef3977309f8624cef4318ac054c341ba1c33cf51051a75f463ab11b2',
  category: 'overlay',
  summary: 'A modal "are you sure?" step with a cancel and a confirm button, destructive by default.',
  whenToUse: [
    'Before deleting, removing or revoking something that can’t be undone.',
    'Before an irreversible action with side effects for other people, such as cancelling a booking.',
  ],
  whenNotToUse: [
    'Routine saves or reversible changes: just do them, and offer undo if needed.',
    'Collecting input before acting: use Modal with a form.',
  ],
  alternatives: [{ component: 'Modal', when: 'The step needs more than a yes/no, such as a reason or a form.' }],
  keyProps: ['open', 'title', 'message', 'confirmLabel', 'onConfirm', 'onCancel', 'isPending'],
  antiPatterns: [
    'Confirm labels like "OK" or "Yes"; name the action ("Delete member").',
    'Closing the dialog before the action finishes; keep it open with isPending until the request settles.',
    'Using confirmVariant="primary" for a destructive action; leave the destructive default.',
    'Passing translated "Cancel" or "Working…" labels by hand; the defaults follow React Aria’s locale, so pass only labels that differ.',
  ],
  accessibility: [
    'Built on Modal: focus trap, Escape to cancel, and focus returns to the trigger.',
    'While isPending, both buttons are disabled and clicking the backdrop does nothing.',
    'Default cancel, confirm and pending labels are localised (en, es, ca) from React Aria’s locale; the caller still provides a confirmLabel naming the action.',
  ],
  example: `<ConfirmDialog
  open={isOpen}
  title="Delete this member?"
  message="Their history stays, but they lose access right away."
  confirmLabel="Delete member"
  isPending={remove.isPending}
  onConfirm={() => remove.mutate(member.id)}
  onCancel={close}
/>`,
} satisfies ComponentMetadata<ConfirmDialogProps>
