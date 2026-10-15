import type { ComponentMetadata } from '../metadata/schema'
import type { CheckboxProps } from './checkbox'

export default {
  component: 'Checkbox',
  sourceHash: 'sha256:b91f0ac8b3285e803cb2670c1f04e9e237522a0152083883ac71ac64ca1fec67',
  category: 'form',
  summary: 'A labelled checkbox for a yes/no choice or for picking items from a set.',
  whenToUse: [
    'Accepting terms or opting into emails in a form.',
    'Choosing several items from a short list.',
    'A "select all" control, with isIndeterminate when only some items are selected.',
  ],
  whenNotToUse: [
    'Picking exactly one of many options: use Select.',
    'Running an action immediately on press: use Button.',
  ],
  alternatives: [{ component: 'Select', when: 'Only one option can be chosen.' }],
  keyProps: ['label', 'isSelected', 'defaultSelected', 'onChange', 'isIndeterminate', 'isDisabled'],
  antiPatterns: [
    'Reading event.target.checked in onChange; onChange receives the boolean directly.',
    'Using a Checkbox without its label prop and adding a separate text node; pass label so the whole row is clickable and named.',
  ],
  accessibility: [
    'Renders a real checkbox input with its label, so it is keyboard and screen-reader accessible.',
    'Announces the indeterminate state; the caller must still describe what "select all" covers.',
  ],
  example: `<Checkbox label="Email me about new classes" isSelected={optIn} onChange={setOptIn} />`,
} satisfies ComponentMetadata<CheckboxProps>
