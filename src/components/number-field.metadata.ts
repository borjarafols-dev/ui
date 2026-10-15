import type { ComponentMetadata } from '../metadata/schema'
import type { NumberFieldProps } from './number-field'

export default {
  component: 'NumberField',
  sourceHash: 'sha256:917df6fade6b8d953b98bdcd57182f48b7b3c49eeb4625472fbd6a99025efa3b',
  category: 'form',
  summary: 'A labelled field for numeric values, with locale-aware formatting and parsing.',
  whenToUse: [
    'Quantities, prices, ages or counts.',
    'Years, with formatOptions={{ useGrouping: false }} so 2024 isn’t shown as 2,024.',
  ],
  whenNotToUse: [
    'Codes that only look numeric (postcodes, phone numbers, IDs): use TextField.',
    'Choosing from a few fixed values: use Select.',
  ],
  alternatives: [
    { component: 'TextField', when: 'The value is digits but not a number you calculate with.' },
    { component: 'Select', when: 'Only a few specific values are allowed.' },
  ],
  keyProps: ['label', 'value', 'onChange', 'minValue', 'maxValue', 'formatOptions', 'error'],
  antiPatterns: [
    'Parsing a string from onChange; it already receives a number (NaN when empty).',
    'Formatting years with default options, which adds a thousands separator.',
  ],
  accessibility: ['Handles the label, description and error wiring, plus arrow-key stepping.'],
  example: `<NumberField label="Seats" minValue={1} value={seats} onChange={setSeats} />`,
} satisfies ComponentMetadata<NumberFieldProps>
