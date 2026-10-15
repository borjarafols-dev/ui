import { Input as RACInput, type InputProps as RACInputProps } from 'react-aria-components'

import { field } from '../recipes/field'

export interface InputProps extends Omit<RACInputProps, 'className'> {
  className?: string
}

const { input } = field()

/**
 * Bare styled input for building custom fields. Prefer `TextField`, which
 * wires label, description and error for you.
 */
export function Input({ className, ...props }: InputProps) {
  return <RACInput data-slot="input" {...props} className={input({ className })} />
}
