import type { ComponentMetadata } from '../metadata/schema'
import type { BadgeProps } from './badge'

export default {
  component: 'Badge',
  sourceHash: 'sha256:1d3f395ec8c41e3e5aaad990079862d43b0b7b6ead0e0ef541ec5e35604bc711',
  category: 'display',
  summary: 'A small static label for a status or category, such as "Active" or "Draft".',
  whenToUse: [
    'Showing a row status in a DataTable cell.',
    'Tagging an item with a short category or plan name.',
    'Flagging something as new, deprecated or failed, with variant="destructive" for errors.',
  ],
  whenNotToUse: [
    'Anything clickable: use Button with variant="outline" or "ghost".',
    'Sentences or explanations: use plain text or CardDescription.',
  ],
  alternatives: [{ component: 'Button', when: 'Pressing the element should do something.' }],
  keyProps: ['variant', 'children'],
  antiPatterns: [
    'Attaching onClick to a Badge; it is not focusable or keyboard accessible, so use Button.',
    'Long text in a badge; keep it to one or two words.',
  ],
  accessibility: [
    'Renders a plain <span>, read as inline text.',
    'If color alone carries meaning (red vs grey), the text must also say it ("Failed", not just a red dot).',
  ],
  example: `<Badge variant={member.active ? 'primary' : 'secondary'}>
  {member.active ? 'Active' : 'Paused'}
</Badge>`,
} satisfies ComponentMetadata<BadgeProps>
