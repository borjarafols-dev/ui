import { useStrings } from '../i18n/strings'
import { spinner, type SpinnerVariants } from '../recipes/spinner'

export interface SpinnerProps extends SpinnerVariants {
  /** Accessible name announced to screen readers. Defaults to a localised label. */
  label?: string
  className?: string
}

/** Indeterminate loading indicator. */
export function Spinner({ size, label, className }: SpinnerProps) {
  const t = useStrings()
  return (
    <div
      data-slot="spinner"
      data-size={size ?? 'md'}
      role="status"
      aria-label={label ?? t.loading}
      className={spinner({ size, className })}
    />
  )
}
