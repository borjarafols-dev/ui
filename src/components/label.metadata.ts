import type { ComponentMetadata } from '../metadata/schema'
import type { LabelProps } from './label'

export default {
  component: 'Label',
  sourceHash: 'sha256:5b192bce5c75782eeb012136329a3cae184d2eaa7aace2874801fbcb99c01921',
  category: 'form',
  summary: 'A styled form label that links to its control automatically inside React Aria fields.',
  whenToUse: ['Labelling a control in a custom field built from Input or other React Aria parts.'],
  whenNotToUse: ['Library fields (TextField, Select, NumberField, …): pass their label prop instead.'],
  alternatives: [{ component: 'TextField', when: 'A standard labelled text field is enough.' }],
  keyProps: ['htmlFor', 'children'],
  antiPatterns: [
    'Adding a Label next to a library field that already has a label prop, which double-labels it.',
    'Using Label as general-purpose text styling; use typography classes on the right element instead.',
  ],
  accessibility: ['Outside a React Aria field, link it to its control with htmlFor/id.'],
  example: `<Label htmlFor="coupon">Coupon code</Label>
<Input id="coupon" />`,
} satisfies ComponentMetadata<LabelProps>
