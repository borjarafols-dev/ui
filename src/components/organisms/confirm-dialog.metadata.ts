import type { ComponentMetadata } from '../../metadata/schema'
import type { ConfirmDialogProps } from './confirm-dialog'

export default {
  component: 'ConfirmDialog',
  sourceHash: 'sha256:a5d1a44e5eb8666865bb7352a50e8becdc00cbbc57986eb4d0899cdf3cabded1',
  category: 'overlay',
  summary: 'A modal "are you sure?" step with a cancel and a confirm button, destructive by default.',
  whenToUse: [
    'Before deleting, removing or revoking something that can’t be undone.',
    'Before an irreversible action with side effects for other people, such as cancelling a booking.',
    'Before deleting something that destroys many things at once, such as a project or a repository: set confirmText to its name so the user types it.',
  ],
  whenNotToUse: [
    'Routine saves or reversible changes: just do them, and offer undo if needed.',
    'Collecting input before acting: use Modal with a form.',
    'Deleting a single row: use a plain confirm without confirmText.',
  ],
  alternatives: [{ component: 'Modal', when: 'The step needs more than a yes/no, such as a reason or a form.' }],
  keyProps: ['open', 'title', 'message', 'confirmLabel', 'onConfirm', 'onCancel', 'isPending', 'confirmText'],
  antiPatterns: [
    'Confirm labels like "OK" or "Yes"; name the action ("Delete member").',
    'Closing the dialog before the action finishes; keep it open with isPending until the request settles.',
    'Using confirmVariant="primary" for a destructive action; leave the destructive default.',
    'Setting confirmText to a fixed word like "DELETE"; use the object’s own name as the user sees it.',
    'Passing translated "Cancel" or "Working…" labels by hand; the defaults follow React Aria’s locale, so pass only labels that differ.',
  ],
  accessibility: [
    'Built on Modal: focus trap, Escape to cancel, and focus returns to the trigger.',
    'While isPending, both buttons are disabled and clicking the backdrop does nothing.',
    'Default cancel, confirm and pending labels are localised (en, es, ca) from React Aria’s locale; the caller still provides a confirmLabel naming the action.',
    'With confirmText, focus moves to a labelled field and confirm stays disabled until the trimmed value matches exactly; Enter confirms only on a match.',
  ],
  example: `<ConfirmDialog
  open={isOpen}
  title='Delete project "acme"?'
  message="Its 4 repositories stay on GitHub. Runs and history are deleted."
  confirmLabel="Delete project"
  confirmText={project.name}
  isPending={remove.isPending}
  onConfirm={() => remove.mutate(project.id)}
  onCancel={close}
/>`,
} satisfies ComponentMetadata<ConfirmDialogProps>
