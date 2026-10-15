import { Checkbox as RACCheckbox, type CheckboxProps as RACCheckboxProps } from 'react-aria-components'

import { checkbox } from '../recipes/checkbox'

export interface CheckboxProps extends Omit<RACCheckboxProps, 'className' | 'children'> {
  label: string
  className?: string
}

/** Labelled checkbox. `isSelected` / boolean `onChange`; supports `isIndeterminate`. */
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <RACCheckbox data-slot="checkbox" {...props} className={checkbox().root({ className })}>
      {({ isSelected, isIndeterminate, isFocusVisible, isInvalid }) => {
        const slots = checkbox({ checked: isSelected || isIndeterminate, focusVisible: isFocusVisible, invalid: isInvalid })
        return (
          <>
            <span className={slots.box()}>
              {isIndeterminate ? (
                <svg viewBox="0 0 12 12" className={slots.icon()} aria-hidden="true">
                  <rect x="2" y="5" width="8" height="2" fill="currentColor" />
                </svg>
              ) : (
                isSelected && (
                  <svg viewBox="0 0 12 12" className={slots.icon()} aria-hidden="true">
                    <path
                      d="M2 6.5 4.5 9 10 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )
              )}
            </span>
            <span>{label}</span>
          </>
        )
      }}
    </RACCheckbox>
  )
}
