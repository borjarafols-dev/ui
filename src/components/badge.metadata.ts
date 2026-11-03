import type { ComponentMetadata } from '../metadata/schema'
import type { BadgeProps } from './badge'

export default {
  component: 'Badge',
  sourceHash: 'sha256:5e395a0b66eda701b293f385a75185a9bedb1d45506660323f97b8c45c495a0b',
  category: 'display',
  summary: 'A small static label for a status or category, such as "Active" or "Draft".',
  whenToUse: [
    'Showing a row status in a DataTable cell.',
    'Tagging an item with a short category or plan name.',
    'Showing a service or job status, with variant="success", "warning", "info" or "destructive" for healthy, degraded, informational or failed.',
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
    'Using a status variant (success, warning, info, destructive) for a category or plan name; use secondary or outline instead.',
  ],
  accessibility: [
    'Renders a plain <span>, read as inline text.',
    'Colour never carries the meaning alone: the text must name the status ("Failed", "Degraded"), not just a coloured badge.',
  ],
  example: `<Badge variant={service.healthy ? 'success' : 'warning'}>
  {service.healthy ? 'Operational' : 'Degraded'}
</Badge>`,
} satisfies ComponentMetadata<BadgeProps>
