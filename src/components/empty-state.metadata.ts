import type { ComponentMetadata } from '../metadata/schema'
import type { EmptyStateProps } from './empty-state'

export default {
  component: 'EmptyState',
  sourceHash: 'sha256:e3d9d11d353f13f7201b48d3c0869cb21e484b8bc9857e1d184684ebb06af21f',
  category: 'feedback',
  summary: 'A centered message for a list or section that has no items yet, with an optional action.',
  whenToUse: [
    'A list, table or dashboard section with no data yet.',
    'Search or filter results that came back empty.',
  ],
  whenNotToUse: [
    'While data is loading: use Spinner.',
    'Errors from a failed request: show an error message with a retry action instead of "nothing here".',
  ],
  alternatives: [{ component: 'Spinner', when: 'The data is still loading.' }],
  keyProps: ['title', 'description', 'action'],
  antiPatterns: [
    'Showing EmptyState before the first load finishes; show Spinner until the request settles.',
    'A vague title like "No data"; say what is missing ("No members yet").',
  ],
  accessibility: ['The title renders as an <h3>; make sure that fits the page heading outline.'],
  example: `<EmptyState
  title="No members yet"
  description="Invite your first member to get started."
  action={<Button onPress={openInvite}>Invite member</Button>}
/>`,
} satisfies ComponentMetadata<EmptyStateProps>
