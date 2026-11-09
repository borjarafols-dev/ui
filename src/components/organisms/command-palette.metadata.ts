import type { ComponentMetadata } from '../../metadata/schema'
import type { CommandPaletteProps } from './command-palette'

export default {
  component: 'CommandPalette',
  sourceHash: 'sha256:02ec36a69173de299e48563b35169c60cb15c0c04c716845875dbc45c16b69a0',
  category: 'overlay',
  summary:
    'A Mod+K dialog with a search input and sectioned results to find a page, a record or an action and run it with Enter; local sections filter in the palette, loaded sections show what the caller passes.',
  whenToUse: [
    'Jumping to any page, record or action from the keyboard in an app with many destinations.',
    'Combining local commands (pages, actions) with records loaded from a server as the user types.',
  ],
  whenNotToUse: [
    'Choosing a value in a form: use Select.',
    'Actions on one row or thing: use Menu.',
    'A short blocking task or form: use Modal.',
  ],
  alternatives: [
    { component: 'Menu', when: 'The user opens a short list of actions from a button.' },
    { component: 'Select', when: 'The user picks a value that a form submits.' },
    { component: 'Modal', when: 'The dialog holds a form or a decision rather than search results.' },
  ],
  keyProps: ['isOpen', 'onOpenChange', 'onAction', 'inputValue', 'onInputChange', 'filter', 'isShortcutEnabled', 'emptyMessage'],
  antiPatterns: [
    'Mounting a palette per page; mount one at the app root and feed it page-specific items from the app state.',
    'Offering a command only in the palette; every command must also be reachable through a link, a button or a menu.',
    'Passing loaded records as plain children, which the palette filters again; give the section items and isLoading instead.',
    'Leaving the default filter on a palette whose sections are all server-filtered; pass filter={null}, control inputValue and debounce the query.',
    'Wrapping local CommandPaletteItems in another component, which the palette then never filters; place them directly inside CommandPaletteSection.',
  ],
  accessibility: [
    'Handles the modal dialog, focus trap, focus into the input, focus restore, Escape (clears the text, then closes) and the Mod+K shortcut.',
    'Arrow keys move through results across sections with virtual focus, so typing stays in the input; Enter runs the item.',
    'The caller supplies item text in the user\'s words and a visible way to open the palette, such as a header button.',
  ],
  example: `<CommandPalette onAction={runCommand}>
  <CommandPaletteSection title="Pages">
    <CommandPaletteItem id="inbox" href="/">Inbox</CommandPaletteItem>
    <CommandPaletteItem id="runs" href="/admin/runs" keywords={['jobs']}>Runs</CommandPaletteItem>
  </CommandPaletteSection>
  <CommandPaletteSection title="Actions">
    <CommandPaletteItem id="theme" shortcut="T">Toggle theme</CommandPaletteItem>
  </CommandPaletteSection>
</CommandPalette>`,
} satisfies ComponentMetadata<CommandPaletteProps>
