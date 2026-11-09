import type { ComponentMetadata } from '../../metadata/schema'
import type { SegmentedControlProps } from './segmented-control'

export default {
  component: 'SegmentedControl',
  sourceHash: 'sha256:6b82340de1b3ba61e3da5355761b192f6d911677696e0cc08e7c6253611414af',
  category: 'form',
  summary: 'A short row of two to five options that filter or change the view of the same data, such as a time range or a list or grid view.',
  whenToUse: [
    'Picking a chart time range such as 24h, 7d or 30d.',
    'Filtering a list by kind (All, Bugs, Features), with selectionMode="multiple" when several filters can be on at once.',
    'Switching how the same content is shown, such as a list or a grid view.',
  ],
  whenNotToUse: [
    'Switching between panels of different content: use Tabs.',
    'More than five options or long labels: use Select.',
    'An on/off setting: use Switch or Checkbox.',
  ],
  alternatives: [
    { component: 'Tabs', when: 'Each option shows a different panel of content rather than filtering the same view.' },
    { component: 'Select', when: 'There are more than five options or the labels are long.' },
    { component: 'Checkbox', when: 'The choice is a single on/off setting.' },
  ],
  keyProps: ['aria-label', 'selectedKeys', 'defaultSelectedKeys', 'onSelectionChange', 'selectionMode', 'size', 'isDisabled'],
  antiPatterns: [
    'Passing a single value as selectedKeys; pass an iterable such as [range] and read the key with [...keys][0] in onSelectionChange.',
    'Leaving out aria-label on the group; always name it, for example aria-label="Time range".',
    'Using onClick on SegmentedControlItem; give each item an id and handle the change with onSelectionChange on the group.',
    'Styling the selected item with className; selection is styled through data-selected by the recipe.',
    'Using it to switch between panels of content; use Tabs instead.',
  ],
  accessibility: [
    'Single mode renders a radiogroup of radios; multiple mode renders toggle buttons with aria-pressed.',
    'Arrow keys move focus between items and the group is one tab stop; disabled items are skipped.',
    'The selected item stands out by a background and a shadow, not only by colour.',
    'The caller must give the group an aria-label.',
  ],
  example: `<SegmentedControl aria-label="Time range" selectedKeys={[range]} onSelectionChange={(keys) => setRange([...keys][0] as Range)}>
  <SegmentedControlItem id="24h">24h</SegmentedControlItem>
  <SegmentedControlItem id="7d">7d</SegmentedControlItem>
  <SegmentedControlItem id="30d">30d</SegmentedControlItem>
</SegmentedControl>`,
} satisfies ComponentMetadata<SegmentedControlProps>
