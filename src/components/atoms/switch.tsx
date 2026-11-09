import type * as React from 'react'
import { useId } from 'react'
import { Switch as RACSwitch, type SwitchProps as RACSwitchProps } from 'react-aria-components'

import { switchRecipe, type SwitchVariants } from '../../recipes/switch'

export interface SwitchProps extends Omit<RACSwitchProps, 'className' | 'children'>, SwitchVariants {
  /** Visible label. When absent, pass aria-label. */
  children?: React.ReactNode
  /** Help text under the label. */
  description?: string
  className?: string
}

/**
 * An on/off setting that takes effect at once, such as enabling a feature or muting notifications.
 * `isSelected` / boolean `onChange`.
 *
 * @usage For settings that apply at once; inside a form submitted with a Save button use Checkbox.
 * @usage The label names the setting, never the state ("Notifications", not "On/Off").
 * @usage Not for choosing between two named options: use SegmentedControl.
 */
export function Switch({ children, description, size, className, ...props }: SwitchProps) {
  const labelId = useId()
  const descriptionId = useId()
  const slots = switchRecipe({ size })
  const hasLabel = children != null && children !== false

  // The root is a <label>: without explicit ids, the description would join the accessible name.
  return (
    <RACSwitch
      data-slot="switch"
      data-size={size ?? 'md'}
      aria-labelledby={hasLabel && description ? labelId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      {...props}
      className={slots.root({ className })}
    >
      <span className={slots.track()}>
        <span className={slots.thumb()} />
      </span>
      {(hasLabel || description) && (
        <span className={slots.content()}>
          {hasLabel && (
            <span id={labelId} className={slots.label()}>
              {children}
            </span>
          )}
          {description && (
            <span id={descriptionId} className={slots.description()}>
              {description}
            </span>
          )}
        </span>
      )}
    </RACSwitch>
  )
}
