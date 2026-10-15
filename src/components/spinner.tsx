import { spinner, type SpinnerVariants } from '../recipes/spinner'

export interface SpinnerProps extends SpinnerVariants {
  /** Accessible name announced to screen readers. */
  label?: string
  className?: string
}

/** Indeterminate loading indicator. */
export function Spinner({ size, label = 'Loading', className }: SpinnerProps) {
  return (
    <div
      data-slot="spinner"
      data-size={size ?? 'md'}
      role="status"
      aria-label={label}
      className={spinner({ size, className })}
    />
  )
}
