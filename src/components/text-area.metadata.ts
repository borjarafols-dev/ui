import type { ComponentMetadata } from '../metadata/schema'
import type { TextAreaProps } from './text-area'

export default {
  component: 'TextArea',
  sourceHash: 'sha256:d39a98d0a0735dfc0c68c328bfe254aa6cedd87b9d89780fbab29f37d5cc3dc6',
  category: 'form',
  summary: 'A labelled multi-line text field with description and error built in.',
  whenToUse: ['Free-form text longer than one line, such as messages, notes or descriptions.'],
  whenNotToUse: ['Single-line values such as names or emails: use TextField.'],
  alternatives: [{ component: 'TextField', when: 'The value fits on one line.' }],
  keyProps: ['label', 'value', 'onChange', 'rows', 'description', 'error'],
  antiPatterns: [
    'Reading event.target.value in onChange; it receives the string directly.',
    'Showing validation messages outside the field; pass error so it is announced and linked.',
  ],
  accessibility: ['Handles label, description and error wiring, including aria-invalid.'],
  example: `<TextArea label="Message" rows={4} value={message} onChange={setMessage} error={errors.message} />`,
} satisfies ComponentMetadata<TextAreaProps>
