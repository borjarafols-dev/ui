import type { ComponentMetadata } from '../metadata/schema'
import type { MenuProps } from './menu'

export default {
  component: 'Menu',
  sourceHash: 'sha256:53908a51ea6f12d32c063cc16cf9a5b60f637bac5fdc8cb7fa3046762f21a298',
  category: 'action',
  summary: 'A button that opens a popover list of actions, with sections, shortcuts, links and destructive items.',
  whenToUse: [
    'A row overflow menu with actions on one item (Rename, Duplicate, Delete).',
    'A user or account menu with links and actions (Profile, Sign out).',
    'A compact "Sort by" choice that applies at once, using selectionMode="single".',
  ],
  whenNotToUse: [
    'Site or section navigation: use a link in a nav, not a Menu.',
    'Choosing a value in a form: use Select.',
    'One or two actions that fit on screen: use Button.',
  ],
  alternatives: [
    { component: 'Select', when: 'The user picks a value that a form submits.' },
    { component: 'Button', when: 'There are only one or two actions and room to show them.' },
    { component: 'ConfirmDialog', when: 'A destructive menu item needs confirming before it runs.' },
  ],
  keyProps: ['trigger', 'onAction', 'disabledKeys', 'placement', 'selectionMode', 'selectedKeys', 'onSelectionChange'],
  antiPatterns: [
    'An icon-only trigger without a name; put an aria-label on the Button that says what the menu holds ("Row actions").',
    'Running a destructive item straight away; put it last after MenuSeparator with variant="destructive" and confirm it with ConfirmDialog.',
    'Expecting shortcut to bind a key; it is display only, so bind the key yourself if it should work.',
    'Giving MenuItems no id; onAction receives the id, so set a stable id on each item.',
  ],
  accessibility: [
    'Handles menu and menuitem roles, opening with Enter, Space or ArrowDown, arrow keys, typeahead, Home/End, and Escape restoring focus to the trigger.',
    'Disabled items get aria-disabled and are skipped by onAction.',
    'The caller names an icon-only trigger with aria-label on the Button.',
  ],
  example: `<Menu
  trigger={<Button variant="ghost" size="sm" aria-label="Row actions">⋯</Button>}
  onAction={(key) => (key === 'delete' ? setConfirming(true) : rename())}
>
  <MenuItem id="rename" shortcut="R">Rename</MenuItem>
  <MenuSeparator />
  <MenuItem id="delete" variant="destructive">Delete</MenuItem>
</Menu>`,
} satisfies ComponentMetadata<MenuProps<object>>
