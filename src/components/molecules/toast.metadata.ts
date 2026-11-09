import type { ComponentMetadata } from '../../metadata/schema'
import type { ToastRegionProps } from './toast'

export default {
  component: 'ToastRegion',
  sourceHash: 'sha256:7567dca70e8b9990d5f72a4a8fcb5b3e39cbe18b8ae90b9174a7b239cf47044e',
  category: 'feedback',
  summary: 'A region at the bottom end of the screen that shows short success, error, info and warning messages queued with toasts.success, toasts.error, toasts.info and toasts.warning, optionally with one action such as Undo.',
  whenToUse: [
    'Confirming that an action finished, such as "Profile saved" after a form submit.',
    'Reporting a failure that is not tied to one field, such as a request that could not be sent.',
    'Offering Undo after a reversible delete or archive, as a shortcut to an outcome that is also reachable elsewhere in the UI.',
    'Neutral news that closes itself (info), or something the user should notice that is not a failure (warning).',
  ],
  whenNotToUse: [
    'A validation error on one field: pass error to TextField, Select or the other field.',
    'A question the user must answer before continuing, or a decision with two outcomes: use ConfirmDialog.',
    'A page with nothing to show: use EmptyState.',
    'A status that stays on the page: use Badge.',
  ],
  alternatives: [
    { component: 'ConfirmDialog', when: 'The user must decide before the action runs.' },
    { component: 'EmptyState', when: 'The feedback is that a list or page has no content.' },
    { component: 'Badge', when: 'The status belongs next to the item and should stay visible.' },
  ],
  keyProps: ['aria-label', 'closeLabel'],
  antiPatterns: [
    'Mounting a ToastRegion per page or per component; mount it once at the app root and call toasts.success or toasts.error from anywhere.',
    'Using toasts.error for confirmations; error toasts stay until dismissed, so use toasts.success for anything that went right.',
    'Recolouring toasts with className; className is for layout, and colours come from the success, destructive, info and warning tokens.',
    'Putting long text or several actions in a toast; keep it to a short title, an optional description and at most one action.',
    'Making the toast action the only way to do something; it can close before a user reaches it, so the same outcome must be reachable elsewhere in the UI.',
  ],
  accessibility: [
    'The region is a named landmark, each toast is announced as an alert and every toast has a close button reachable by keyboard.',
    'The region name and close label are localised; pass aria-label or closeLabel to override them.',
    'Success and info toasts pause their timeout while the region is hovered or focused, and wait 10 seconds by default when they have an action; the caller still writes a title that makes sense without its context.',
    'Tab reaches the action before the close button and the action is named by its label, so the caller passes a self-explanatory label such as "Undo".',
  ],
  example: `// Once, at the app root
<ToastRegion />

// Anywhere, for example in a mutation callback
toasts.success('Profile saved')
toasts.error('Could not save the profile', { description: 'Check your connection and try again.' })
toasts.success('Card dismissed', {
  action: { label: 'Undo', onAction: () => restoreCard(id) },
})`,
} satisfies ComponentMetadata<ToastRegionProps>
