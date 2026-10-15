import type { ComponentMetadata } from '../metadata/schema'
import type { SpinnerProps } from './spinner'

export default {
  component: 'Spinner',
  sourceHash: 'sha256:d4c1cd242947f2fd46fb2a82733afaae1108e5d6ae37ac6d27a65804af063908',
  category: 'feedback',
  summary: 'An indeterminate loading indicator announced to screen readers.',
  whenToUse: ['A section or page is waiting for data.', 'A short wait with no known progress.'],
  whenNotToUse: [
    'A button’s own pending state: disable the Button and change its label (as ConfirmDialog does).',
    'Loaded data that came back empty: use EmptyState.',
  ],
  alternatives: [{ component: 'EmptyState', when: 'Loading has finished and there is nothing to show.' }],
  keyProps: ['size', 'label'],
  antiPatterns: [
    'Several spinners on one screen for the same request; show one for the region that is loading.',
    'Leaving the default "Loading" label when the context matters ("Loading invoices").',
  ],
  accessibility: ['Renders role="status" with an accessible label; the caller can make the label specific.'],
  example: `{query.isLoading ? <Spinner label="Loading members" /> : <MembersTable data={query.data} />}`,
} satisfies ComponentMetadata<SpinnerProps>
