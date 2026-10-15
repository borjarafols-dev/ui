import { Label as RACLabel, type LabelProps as RACLabelProps } from 'react-aria-components'

import { field } from '../recipes/field'

export interface LabelProps extends Omit<RACLabelProps, 'className'> {
  className?: string
}

const { label } = field()

/** Styled label. Inside a React Aria field it links up automatically. */
export function Label({ className, ...props }: LabelProps) {
  return <RACLabel data-slot="label" {...props} className={label({ className })} />
}
