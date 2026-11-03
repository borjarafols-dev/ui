import {
  Label,
  Meter as RACMeter,
  type MeterProps as RACMeterProps,
} from 'react-aria-components'

import { meter } from '../recipes/meter'

export interface MeterProps extends Omit<RACMeterProps, 'className' | 'children'> {
  /** Visible label. When absent, pass aria-label. */
  label?: string
  /** Show the formatted value text. Defaults to true. */
  showValue?: boolean
  /** Value at which the meter turns warning. In value units, between minValue and maxValue. */
  warningAt?: number
  /** Value at which the meter turns destructive. Must be >= warningAt when both are set. */
  destructiveAt?: number
  size?: 'sm' | 'md'
  className?: string
}

type MeterStatus = 'normal' | 'warning' | 'destructive'

function meterStatus(value: number, warningAt?: number, destructiveAt?: number): MeterStatus {
  if (destructiveAt !== undefined && value >= destructiveAt) return 'destructive'
  if (warningAt !== undefined && value >= warningAt) return 'warning'
  return 'normal'
}

/**
 * A known quantity against a limit, such as storage used or quota consumed.
 * Optional thresholds turn the fill warning, then destructive.
 *
 * @usage For a quantity against a known limit (quota, storage, budget); not for task progress: use a progress bar.
 * @usage Set warningAt and destructiveAt in value units, not percent, unless maxValue is 100.
 * @usage When the meter turns warning or destructive, say it in text too (valueLabel or nearby copy).
 */
export function Meter({
  label,
  showValue = true,
  warningAt,
  destructiveAt,
  size = 'md',
  className,
  ...props
}: MeterProps) {
  const status = meterStatus(props.value ?? 0, warningAt, destructiveAt)
  const slots = meter({ size, status })
  return (
    <RACMeter
      data-slot="meter"
      data-size={size}
      data-status={status}
      {...props}
      className={slots.root({ className })}
    >
      {({ percentage, valueText }) => (
        <>
          {(label || showValue) && (
            <div className={slots.header()}>
              {label && <Label className={slots.label()}>{label}</Label>}
              {showValue && <span className={slots.value()}>{valueText}</span>}
            </div>
          )}
          <div className={slots.track()}>
            <div data-slot="meter-fill" className={slots.fill()} style={{ width: `${percentage}%` }} />
          </div>
        </>
      )}
    </RACMeter>
  )
}
