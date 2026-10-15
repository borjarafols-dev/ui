import type * as React from 'react'
import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as RACTextField,
  type TextFieldProps as RACTextFieldProps,
} from 'react-aria-components'

import { field } from '../recipes/field'

export interface TextFieldProps extends Omit<RACTextFieldProps, 'className' | 'children'> {
  label?: string
  description?: string
  error?: string
  placeholder?: string
  inputRef?: React.Ref<HTMLInputElement>
  className?: string
}

const slots = field()

/** Single-line text field. Value-based `onChange`. `error` marks it invalid. */
export function TextField({
  label,
  description,
  error,
  placeholder,
  inputRef,
  className,
  isInvalid,
  ...props
}: TextFieldProps) {
  return (
    <RACTextField
      data-slot="text-field"
      {...props}
      isInvalid={error ? true : isInvalid}
      className={slots.root({ className })}
    >
      {label && <Label className={slots.label()}>{label}</Label>}
      <Input ref={inputRef} placeholder={placeholder} className={slots.input()} />
      {description && (
        <Text slot="description" className={slots.description()}>
          {description}
        </Text>
      )}
      <FieldError className={slots.error()}>{error}</FieldError>
    </RACTextField>
  )
}
