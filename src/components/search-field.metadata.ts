import type { ComponentMetadata } from '../metadata/schema'
import type { SearchFieldProps } from './search-field'

export default {
  component: 'SearchField',
  sourceHash: 'sha256:d0ae8db3586021daf5bb1bf114490b73949369b64d3e433496c16c6495e264e6',
  category: 'form',
  summary: 'A search input with a clear button that appears while it has a value.',
  whenToUse: ['Filtering a list or table as the user types.', 'A search box above results.'],
  whenNotToUse: ['Ordinary form text: use TextField.'],
  alternatives: [{ component: 'TextField', when: 'The input is form data, not a query.' }],
  keyProps: ['label', 'aria-label', 'value', 'onChange', 'onSubmit', 'placeholder'],
  antiPatterns: [
    'No label and no aria-label; a placeholder is not an accessible name.',
    'Running a network request on every keystroke; debounce the value from onChange.',
  ],
  accessibility: [
    'Escape clears the field, and the clear button is labelled (a localised default from React Aria’s locale, or clearLabel).',
    'The caller provides label or aria-label.',
  ],
  example: `<SearchField aria-label="Search members" placeholder="Name or email" value={query} onChange={setQuery} />`,
} satisfies ComponentMetadata<SearchFieldProps>
