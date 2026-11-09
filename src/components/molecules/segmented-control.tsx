import { createContext, useContext } from 'react'
import {
  ToggleButton as RACToggleButton,
  ToggleButtonGroup as RACToggleButtonGroup,
  type ToggleButtonGroupProps as RACToggleButtonGroupProps,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components'

import { segmentedControl, type SegmentedControlVariants } from '../../recipes/segmented-control'

export interface SegmentedControlProps extends Omit<RACToggleButtonGroupProps, 'className'>, SegmentedControlVariants {
  className?: string
}

export interface SegmentedControlItemProps extends Omit<RACToggleButtonProps, 'className'> {
  className?: string
}

const SizeContext = createContext<SegmentedControlVariants['size']>('md')

/**
 * A short row of options that filter or change the view of the same data.
 * Defaults to single selection that can't be emptied; `selectionMode="multiple"`
 * for filters. Keeps React Aria's `Set`-based `selectedKeys` /
 * `onSelectionChange`, so it can be driven from the URL.
 *
 * @usage For two to five short options that filter or change the view of the same content; not for switching panels: use Tabs.
 * @usage More than five options, or long labels: use Select.
 * @usage Always give the group an aria-label.
 * @usage Not for on/off settings: use Switch or Checkbox.
 */
export function SegmentedControl({
  size,
  className,
  selectionMode = 'single',
  disallowEmptySelection = selectionMode === 'single',
  ...props
}: SegmentedControlProps) {
  return (
    <SizeContext.Provider value={size}>
      <RACToggleButtonGroup
        data-slot="segmented-control"
        data-size={size ?? 'md'}
        {...props}
        selectionMode={selectionMode}
        disallowEmptySelection={disallowEmptySelection}
        className={segmentedControl().root({ className })}
      />
    </SizeContext.Provider>
  )
}

/** Needs an `id`: it is the key in the group's `selectedKeys`. */
export function SegmentedControlItem({ className, ...props }: SegmentedControlItemProps) {
  const size = useContext(SizeContext)
  return (
    <RACToggleButton
      data-slot="segmented-control-item"
      {...props}
      className={segmentedControl({ size }).item({ className })}
    />
  )
}
