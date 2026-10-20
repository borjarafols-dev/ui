import type { ComponentMetadata } from '../metadata/schema'
import type { ToastRegionProps } from './toast'

export default {
  component: 'ToastRegion',
  sourceHash: 'sha256:ba0a905d8b468832cae0fe48822d19443d99489128df45969a4a9a5e5320c806',
  category: 'feedback',
  summary: 'A region at the bottom end of the screen that shows short success and error messages queued with toasts.success and toasts.error.',
  whenToUse: [
    'Confirming that an action finished, such as "Profile saved" after a form submit.',
    'Reporting a failure that is not tied to one field, such as a request that could not be sent.',
  ],
  whenNotToUse: [
    'A validation error on one field: pass error to TextField, Select or the other field.',
    'A question the user must answer before continuing: use ConfirmDialog.',
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
    'Recolouring toasts with className; className is for layout, and colours come from the success and destructive tokens.',
    'Putting long text or actions in a toast; keep it to a short title and an optional description.',
  ],
  accessibility: [
    'The region is a named landmark, each toast is announced as an alert and every toast has a close button reachable by keyboard.',
    'The region name and close label are localised; pass aria-label or closeLabel to override them.',
    'Success toasts pause their timeout while the region is hovered or focused; the caller still writes a title that makes sense without its context.',
  ],
  example: `// Once, at the app root
<ToastRegion />

// Anywhere, for example in a mutation callback
toasts.success('Profile saved')
toasts.error('Could not save the profile', { description: 'Check your connection and try again.' })`,
} satisfies ComponentMetadata<ToastRegionProps>
