import type { ComponentMetadata } from '../metadata/schema'
import type { SelectProps } from './select'

export default {
  component: 'Select',
  sourceHash: 'sha256:0213d484edc7070617813db657021d3009ac11b41f3947d713d17fbd88308b0d',
  category: 'form',
  summary: 'A labelled dropdown for picking one option from a list, built as a listbox in a popover.',
  whenToUse: [
    'Picking one value from four or more options, such as a plan, role or country.',
    'Form fields where the options are known up front.',
  ],
  whenNotToUse: [
    'Two or three options: buttons or checkboxes are usually clearer.',
    'Picking several options: use Checkbox items.',
    'Free text or long searchable lists: use TextField or SearchField.',
  ],
  alternatives: [
    { component: 'Checkbox', when: 'Several options can be selected.' },
    { component: 'SearchField', when: 'The list is long enough that people need to search it.' },
  ],
  keyProps: ['label', 'options', 'selectedKey', 'onSelectionChange', 'placeholder', 'error'],
  antiPatterns: [
    'Treating it as a native <select> (value/onChange, userEvent.selectOptions); use selectedKey/onSelectionChange, and in tests click the trigger and then the option.',
    'Passing options without stable value strings; value is the key emitted by onSelectionChange.',
  ],
  accessibility: [
    'Handles listbox semantics, typeahead, keyboard navigation and focus management.',
    'The popover renders on <body>, so the theme must be set on <html>.',
  ],
  example: `<Select
  label="Plan"
  placeholder="Choose a plan"
  options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]}
  selectedKey={plan}
  onSelectionChange={(key) => setPlan(String(key))}
/>`,
} satisfies ComponentMetadata<SelectProps>
