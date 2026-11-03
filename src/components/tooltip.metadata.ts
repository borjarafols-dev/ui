import type { ComponentMetadata } from '../metadata/schema'
import type { TooltipProps } from './tooltip'

export default {
  component: 'Tooltip',
  sourceHash: 'sha256:c25cfff4f4b8838180e5771cfac0d7053c693bc236a931d759e51cbeb6c5fa6c',
  category: 'overlay',
  summary: 'Short supplementary text shown on hover after a delay or at once on keyboard focus of its trigger.',
  whenToUse: [
    'Naming an icon-only button for sighted users, alongside its own aria-label.',
    'Showing the exact value behind an abbreviation, such as 1,214 behind "1.2k".',
    'Showing the absolute time behind a relative one, such as 2026-11-03 14:02 behind "3m ago".',
  ],
  whenNotToUse: [
    'Essential information the user needs to act: show it as visible text, not in a Tooltip.',
    'Rich or interactive content (links, buttons) on demand: use a popover dialog, not a Tooltip.',
    'Explaining why a control is disabled: disabled controls never show a tooltip, so say it in visible text.',
    'Confirming an action or asking for input: use Modal or ConfirmDialog.',
  ],
  alternatives: [
    { component: 'Modal', when: 'The content is interactive or needs the user to read and respond.' },
    { component: 'Badge', when: 'A short status should be visible at all times, not on hover.' },
  ],
  keyProps: ['content', 'children', 'isTextTrigger', 'placement', 'delay', 'trigger', 'isDisabled'],
  antiPatterns: [
    'Relying on the tooltip to name an icon-only Button; give the Button its own aria-label too.',
    'Putting a tooltip on a disabled Button to explain why; disabled controls get no hover or focus, so explain it in visible text.',
    'Wrapping plain text without isTextTrigger; keyboard users then cannot reach it, so set isTextTrigger.',
    'Putting links, buttons or long formatted content in content; keep it to short plain text and use a popover dialog for more.',
    'Setting isTextTrigger on every cell of a long table; each one adds a tab stop, so use it sparingly.',
  ],
  accessibility: [
    'Renders role="tooltip" and points the trigger\'s aria-describedby at it; opens on hover after delay and at once on focus, and Escape closes it.',
    'isTextTrigger wraps the child in a focusable span (tabIndex 0) so keyboard users can reach the tooltip.',
    'The caller still names the trigger (aria-label on icon-only buttons) and keeps essential information out of the tooltip.',
  ],
  example: `<Tooltip content="2026-11-03 14:02" isTextTrigger>
  <time dateTime="2026-11-03T14:02">3m ago</time>
</Tooltip>`,
} satisfies ComponentMetadata<TooltipProps>
