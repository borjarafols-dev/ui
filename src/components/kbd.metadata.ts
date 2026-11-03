import type { ComponentMetadata } from '../metadata/schema'
import type { KbdProps } from './kbd'

export default {
  component: 'Kbd',
  sourceHash: 'sha256:69e891f1a66500c57fad2107e9c7eef09058e63d4b687008d045d9054c9a1917',
  category: 'display',
  summary: 'A key or keyboard shortcut shown as text, such as "Esc" or "⌘ K".',
  whenToUse: [
    'Listing shortcuts in a keyboard shortcut legend.',
    'Showing the shortcut next to a menu item, with size="sm".',
    'Telling the user which key to press in help text or a Tooltip.',
  ],
  whenNotToUse: [
    'Binding or handling a shortcut: Kbd only displays it, so handle the key in the app.',
    'Anything clickable: use Button.',
    'Status or category labels: use Badge.',
  ],
  alternatives: [
    { component: 'Badge', when: 'The label is a status or category, not a key.' },
    { component: 'Tooltip', when: 'The shortcut is a hint on an icon button; put the Kbd inside the Tooltip content.' },
  ],
  keyProps: ['children', 'size', 'aria-label'],
  antiPatterns: [
    'Expecting Kbd to trigger the action; it binds nothing, so the app must listen for the key itself.',
    'Putting a whole combination in one Kbd ("⌘K"); render one Kbd per key.',
    'Rendering a symbol (⌘, ⇧, ⌥) without an aria-label; pass the key name, such as aria-label="Command".',
  ],
  accessibility: [
    'Renders a <kbd> element, which screen readers read as its text; it is not focusable or interactive.',
    'Inside a MenuItem it fills the keyboard slot, so the item describes itself with the shortcut.',
    'The caller must give symbol keys an aria-label with the key name, because symbols read badly.',
  ],
  example: `<p>
  Press <Kbd aria-label="Command">⌘</Kbd> <Kbd>K</Kbd> to search.
</p>`,
} satisfies ComponentMetadata<KbdProps>
