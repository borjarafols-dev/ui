import type { ComponentMetadata } from '../metadata/schema'
import type { InputProps } from './input'

export default {
  component: 'Input',
  sourceHash: 'sha256:e010d1cc36bdca73ddd76652cc28cd01e898673452b71a9f36c4c854954cd0b5',
  category: 'form',
  summary: 'A bare styled text input for composing a custom field.',
  whenToUse: ['Building a custom field layout that TextField can’t express, paired with Label.'],
  whenNotToUse: [
    'Any ordinary text, email or password field: use TextField, which wires label, description and error.',
    'Numbers: use NumberField. Search boxes: use SearchField.',
  ],
  alternatives: [
    { component: 'TextField', when: 'Almost always: a labelled single-line field with error handling.' },
    { component: 'NumberField', when: 'The value is numeric.' },
    { component: 'SearchField', when: 'The field filters or searches.' },
  ],
  keyProps: ['id', 'type', 'placeholder', 'value', 'onChange'],
  antiPatterns: [
    'Using Input without a Label; every input needs an accessible name.',
    'Rebuilding error and description handling around Input; use TextField.',
  ],
  accessibility: ['Provides no label, description or error wiring; the caller must link a Label via htmlFor/id.'],
  example: `<Label htmlFor="coupon">Coupon code</Label>
<Input id="coupon" name="coupon" />`,
} satisfies ComponentMetadata<InputProps>
