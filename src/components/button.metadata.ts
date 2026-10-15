import type { ComponentMetadata } from '../metadata/schema'
import type { ButtonProps } from './button'

export default {
  component: 'Button',
  sourceHash: 'sha256:6958557299824f2d1aad30ef86ec8198ca41ddc1d865f5cd75443f3e20729cc4',
  category: 'action',
  summary: 'A pressable control that runs an action, such as saving a form or opening a dialog.',
  whenToUse: [
    'Submitting or saving a form.',
    'Starting an action on the current page, such as opening a modal or deleting an item.',
    'A destructive action, with variant="destructive" (often followed by a ConfirmDialog).',
    'Low-emphasis actions in toolbars or table rows, with variant="ghost" or "outline".',
  ],
  whenNotToUse: [
    'Navigating to another page: put the button() recipe on a router link or React Aria Link.',
    'Showing a status or category: use Badge.',
    'Toggling an on/off setting: use Checkbox.',
  ],
  alternatives: [
    { component: 'ConfirmDialog', when: 'The action is destructive and needs an explicit "are you sure" step.' },
    { component: 'Badge', when: 'The element only shows a label and does nothing when clicked.' },
  ],
  keyProps: ['variant', 'size', 'onPress', 'isDisabled', 'type'],
  antiPatterns: [
    'Using onClick or disabled; use onPress and isDisabled, which React Aria handles for touch, keyboard and mouse.',
    'Wrapping a Button in an <a> for navigation; style the link itself with the button() recipe.',
    'Several primary buttons in one section; keep one primary and make the rest secondary, outline or ghost.',
    'Changing colors through className; override the --button-primary-* or semantic tokens instead.',
  ],
  accessibility: [
    'Handles keyboard activation, focus-visible ring and the disabled state for you.',
    'An icon-only button needs an aria-label.',
  ],
  example: `<Button variant="primary" onPress={save} isDisabled={!isDirty}>
  Save changes
</Button>`,
} satisfies ComponentMetadata<ButtonProps>
