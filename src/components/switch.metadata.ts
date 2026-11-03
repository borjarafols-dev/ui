import type { ComponentMetadata } from '../metadata/schema'
import type { SwitchProps } from './switch'

export default {
  component: 'Switch',
  sourceHash: 'sha256:edc2c32b30359bcde67516d78cfc73fd906556da73d622cef661617b46038b4d',
  category: 'form',
  summary: 'An on/off setting that takes effect as soon as it is toggled, with an optional description.',
  whenToUse: [
    'Enabling or disabling a provider or feature from a settings page.',
    'Muting or unmuting notifications, saved as soon as it changes.',
    'A list of independent preferences that each apply at once.',
  ],
  whenNotToUse: [
    'An option inside a form submitted with a Save button: use Checkbox.',
    'Choosing between two named options: use SegmentedControl.',
    'Running a one-off action: use Button.',
  ],
  alternatives: [{ component: 'Checkbox', when: 'The choice only applies when a form is submitted.' }],
  keyProps: ['children', 'isSelected', 'defaultSelected', 'onChange', 'description', 'isDisabled', 'isReadOnly', 'size'],
  antiPatterns: [
    'Labelling the state ("On", "Off"); the label names the setting, such as "Notifications".',
    'Reading event.target.checked in onChange; onChange receives the new boolean directly.',
    'Rendering a Switch with no children and no aria-label; pass aria-label when there is no visible label.',
    'Leaving the switch interactive while its save request runs; set isDisabled until the request settles.',
  ],
  accessibility: [
    'Renders a native checkbox input with role switch, toggled by click and Space, with a visible focus ring.',
    'Names the switch by its children and links description as its accessible description.',
    'The caller must provide a label (children or aria-label) that names the setting, not its state.',
  ],
  example: `<Switch isSelected={provider.enabled} onChange={(enabled) => updateProvider({ enabled })}>
  Enabled
</Switch>`,
} satisfies ComponentMetadata<SwitchProps>
