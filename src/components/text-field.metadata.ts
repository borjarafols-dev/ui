import type { ComponentMetadata } from '../metadata/schema'
import type { TextFieldProps } from './text-field'

export default {
  component: 'TextField',
  sourceHash: 'sha256:59cc012f93fc19f5a3a2f34efd05f327d9db4ee8cee08fb23ac3c607b8d2c87a',
  category: 'form',
  summary: 'A labelled single-line text field with description and error built in.',
  whenToUse: [
    'Names, emails, passwords, URLs and other single-line text.',
    'Any form field that shows a validation error.',
  ],
  whenNotToUse: [
    'Multi-line text: use TextArea.',
    'Numbers you calculate with: use NumberField.',
    'Search and filter boxes: use SearchField.',
  ],
  alternatives: [
    { component: 'TextArea', when: 'The text can span several lines.' },
    { component: 'NumberField', when: 'The value is a number.' },
    { component: 'SearchField', when: 'The field filters or searches.' },
  ],
  keyProps: ['label', 'type', 'value', 'onChange', 'description', 'error', 'isRequired'],
  antiPatterns: [
    'Reading event.target.value in onChange; it receives the string directly.',
    'Building a field from Input + Label + a <p> for errors; TextField already wires them accessibly.',
    'Using placeholder as the label; always pass label (or aria-label).',
  ],
  accessibility: [
    'Handles the label, description and error wiring, including aria-invalid when error is set.',
    'Provide autocomplete hints (autoComplete="email") where they apply.',
  ],
  example: `<TextField label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} error={errors.email} />`,
} satisfies ComponentMetadata<TextFieldProps>
