import type * as React from 'react'
import {
  FieldError,
  Label,
  TextArea as RACTextArea,
  TextField as RACTextField,
  Text,
  type TextFieldProps as RACTextFieldProps,
} from 'react-aria-components'

import { field } from '../recipes/field'

export interface TextAreaProps extends Omit<RACTextFieldProps, 'className' | 'children'> {
  label?: string
  description?: string
  error?: string
  placeholder?: string
  rows?: number
  textAreaRef?: React.Ref<HTMLTextAreaElement>
  className?: string
}

const slots = field()

/** Multi-line text field. Value-based `onChange`. `error` marks it invalid. */
export function TextArea({
  label,
  description,
  error,
  placeholder,
  rows,
  textAreaRef,
  className,
  isInvalid,
  ...props
}: TextAreaProps) {
  return (
    <RACTextField
      data-slot="text-area"
      {...props}
      isInvalid={error ? true : isInvalid}
      className={slots.root({ className })}
    >
      {label && <Label className={slots.label()}>{label}</Label>}
      <RACTextArea ref={textAreaRef} placeholder={placeholder} rows={rows} className={slots.input()} />
      {description && (
        <Text slot="description" className={slots.description()}>
          {description}
        </Text>
      )}
      <FieldError className={slots.error()}>{error}</FieldError>
    </RACTextField>
  )
}
