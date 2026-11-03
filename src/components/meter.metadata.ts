import type { ComponentMetadata } from '../metadata/schema'
import type { MeterProps } from './meter'

export default {
  component: 'Meter',
  sourceHash: 'sha256:cc3d4ed0b4970f9770ff9c7d8389c4f175aede0ef1aa2c201ab7f625e6c584dd',
  category: 'display',
  summary: 'A bar showing a known quantity against a limit, turning warning then destructive past optional thresholds.',
  whenToUse: [
    'Showing storage used, quota consumed or budget spent against a fixed limit.',
    'Usage limits in a header or on a usage page, with a warning as the value nears the limit.',
  ],
  whenNotToUse: [
    'Progress towards finishing a task or upload: use a progress bar, not a Meter.',
    'An indeterminate wait with no known value: use Spinner.',
    'A one-word status with no quantity: use Badge.',
  ],
  alternatives: [
    { component: 'Spinner', when: 'Something is loading and there is no value to show.' },
    { component: 'Badge', when: 'Only the status matters, not the quantity behind it.' },
  ],
  keyProps: ['label', 'value', 'maxValue', 'warningAt', 'destructiveAt', 'valueLabel', 'formatOptions', 'showValue', 'size'],
  antiPatterns: [
    'Passing thresholds as percentages when maxValue is not 100; set warningAt and destructiveAt in value units (limit * 0.8).',
    'Relying on the warning or destructive colour alone; say it in text too, in valueLabel ("90% used, near limit") or nearby copy.',
    'Recolouring the normal fill with className; override the --meter-fill token instead.',
    'Rendering without a label or aria-label; the meter then has no accessible name.',
  ],
  accessibility: [
    'Renders role="meter" with aria-valuenow, aria-valuemin, aria-valuemax and aria-valuetext from formatOptions or valueLabel.',
    'The visible label names the meter; with showValue={false} the value is still announced through aria-valuetext.',
    'The caller provides the name (label or aria-label) and puts the warning or destructive status into text.',
  ],
  example: `<Meter
  label="5-hour limit"
  value={used}
  maxValue={limit}
  warningAt={limit * 0.8}
  destructiveAt={limit * 0.95}
  valueLabel={used >= limit * 0.8 ? \`\${used} of \${limit}, near limit\` : \`\${used} of \${limit}\`}
  size="sm"
/>`,
} satisfies ComponentMetadata<MeterProps>
