import type { ComponentMetadata } from '../metadata/schema'
import type { TextAreaProps } from './text-area'

export default {
  component: 'TextArea',
  sourceHash: 'sha256:53bc6b423bf826bd1c16b6e3c86ce5b499e78a1bad149279c28346881bf3f686',
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
