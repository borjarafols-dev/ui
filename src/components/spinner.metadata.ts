import type { ComponentMetadata } from '../metadata/schema'
import type { SpinnerProps } from './spinner'

export default {
  component: 'Spinner',
  sourceHash: 'sha256:d3465d50ec853a681d0a8d47c4c36fb13beb11cd1bb6d1f9226a8e6e2a6d4c91',
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
    'Leaving the generic localised default label when the context matters ("Loading invoices").',
  ],
  accessibility: [
    'Renders role="status" with an accessible label, localised (en, es, ca) from React Aria’s locale by default.',
    'The caller can make the label specific.',
  ],
  example: `{query.isLoading ? <Spinner label="Loading members" /> : <MembersTable data={query.data} />}`,
} satisfies ComponentMetadata<SpinnerProps>
