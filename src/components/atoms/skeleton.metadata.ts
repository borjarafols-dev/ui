import type { ComponentMetadata } from '../../metadata/schema'
import type { SkeletonProps } from './skeleton'

export default {
  component: 'Skeleton',
  sourceHash: 'sha256:4a30e9ed5c6e65b7ffb5d4644bbc0d5ab94fe907f41a4c8ff8c5dfa4533b35ab',
  category: 'feedback',
  summary: 'A pulsing placeholder shaped like the content that is loading: a line of text, a block or an avatar.',
  whenToUse: [
    'A page or section is waiting for data and its layout is known.',
    'Table rows, card lists or profile headers that load, mimicked line by line.',
    'Keeping the layout stable so content does not jump when it arrives.',
  ],
  whenNotToUse: [
    'A button’s pending state or another small inline spot: use Spinner.',
    'Loaded data that came back empty: use EmptyState.',
  ],
  alternatives: [
    { component: 'Spinner', when: 'The wait is inside a button or a small inline spot with no content shape.' },
    { component: 'EmptyState', when: 'Loading has finished and there is nothing to show.' },
  ],
  keyProps: ['shape', 'className'],
  antiPatterns: [
    'One generic block for a whole page; shape skeletons like the content they replace (lines, rows, avatars).',
    'Relying on the skeletons to announce loading; set aria-busy="true" on the region and put sr-only loading text in it.',
    'Using className for colour or radius; it sets width and height only, the shape prop sets the rest.',
    'Putting aria-label on the loading div; it is not reliably announced, so use sr-only text instead.',
  ],
  accessibility: [
    'Always renders aria-hidden="true", so screen readers skip every skeleton.',
    'The pulse stops when the user prefers reduced motion.',
    'The caller must set aria-busy="true" on the loading region and give it sr-only loading text.',
  ],
  example: `<div aria-busy="true" className="flex flex-col gap-2">
  <span className="sr-only">Loading projects</span>
  <Skeleton className="w-1/3" />
  <Skeleton className="w-2/3" />
  <Skeleton shape="block" className="h-24 w-full" />
</div>`,
} satisfies ComponentMetadata<SkeletonProps>
