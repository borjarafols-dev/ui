import type * as React from 'react'
import {
  FieldError,
  Group,
  Input,
  Label,
  NumberField as RACNumberField,
  Text,
  type NumberFieldProps as RACNumberFieldProps,
} from 'react-aria-components'

import { field } from '../recipes/field'

export interface NumberFieldProps extends Omit<RACNumberFieldProps, 'className' | 'children'> {
  label?: string
  description?: string
  error?: string
  placeholder?: string
  inputRef?: React.Ref<HTMLInputElement>
  className?: string
}

const slots = field()

/**
 * Numeric field. Value-based numeric `onChange`. Pass
 * `formatOptions={{ useGrouping: false }}` for year-like values so `2024`
 * isn't shown as `2,024`.
 */
export function NumberField({
  label,
  description,
  error,
  placeholder,
  inputRef,
  className,
  isInvalid,
  ...props
}: NumberFieldProps) {
  return (
    <RACNumberField
      data-slot="number-field"
      {...props}
      isInvalid={error ? true : isInvalid}
      className={slots.root({ className })}
    >
      {label && <Label className={slots.label()}>{label}</Label>}
      <Group>
        <Input ref={inputRef} placeholder={placeholder} className={slots.input()} />
      </Group>
      {description && (
        <Text slot="description" className={slots.description()}>
          {description}
        </Text>
      )}
      <FieldError className={slots.error()}>{error}</FieldError>
    </RACNumberField>
  )
}
