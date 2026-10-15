import type { ComponentMetadata } from '../metadata/schema'
import type { SpinnerProps } from './spinner'

export default {
  component: 'Spinner',
  sourceHash: 'sha256:5937c9c056161205fb2974192b680baa60f02f5484c4fa8fb649278426e058df',
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
