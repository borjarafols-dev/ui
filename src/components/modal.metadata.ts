import type { ComponentMetadata } from '../metadata/schema'
import type { ModalProps } from './modal'

export default {
  component: 'Modal',
  sourceHash: 'sha256:6e516f002475920de569538618eff4affac6ce9944702daa4f0f1ab95395377f',
  category: 'overlay',
  summary: 'A dialog over the page that traps focus until the user finishes or dismisses it.',
  whenToUse: [
    'A short edit form opened from a list or detail view.',
    'A focused decision that needs more than yes/no.',
  ],
  whenNotToUse: [
    'A plain "are you sure?" before a destructive action: use ConfirmDialog.',
    'Long or primary content: give it its own page.',
    'Grouping content on a page: use Card.',
  ],
  alternatives: [
    { component: 'ConfirmDialog', when: 'The step is only a yes/no confirmation.' },
    { component: 'Card', when: 'The content can live on the page without blocking it.' },
  ],
  keyProps: ['open', 'onClose', 'title', 'aria-label', 'isDismissable'],
  antiPatterns: [
    'No title and no aria-label; the dialog then has no accessible name.',
    'Toggling open without handling onClose; Escape and backdrop clicks call onClose, so update your state there.',
    'Setting the theme on an inner element; modals render on <body>, so data-theme belongs on <html>.',
  ],
  accessibility: [
    'Handles the focus trap, focus restore, scroll lock and Escape to close.',
    'Uses title as the accessible name; without a title, pass aria-label.',
  ],
  example: `<Modal open={isOpen} onClose={close} title="Edit profile">
  <form className="grid gap-4" onSubmit={submit}>
    <TextField label="Name" defaultValue={user.name} />
    <div className="flex justify-end gap-3">
      <Button variant="secondary" onPress={close}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>
  </form>
</Modal>`,
} satisfies ComponentMetadata<ModalProps>
