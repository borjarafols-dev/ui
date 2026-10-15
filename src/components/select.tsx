import {
  Button,
  FieldError,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as RACSelect,
  SelectValue,
  type SelectProps as RACSelectProps,
} from 'react-aria-components'

import { field } from '../recipes/field'
import { select } from '../recipes/select'

export interface SelectOption {
  value: string
  label: string
  isDisabled?: boolean
}

export interface SelectProps extends Omit<RACSelectProps<SelectOption>, 'className' | 'children'> {
  label?: string
  error?: string
  options: SelectOption[]
  className?: string
}

const fieldSlots = field()
const slots = select()

/**
 * Accessible listbox in a popover, not a native `<select>`. Use `selectedKey`
 * / `onSelectionChange`. In tests, click the trigger and then the `option`;
 * `userEvent.selectOptions` does not work.
 */
export function Select({ label, error, options, className, isInvalid, ...props }: SelectProps) {
  return (
    <RACSelect
      data-slot="select"
      {...props}
      isInvalid={error ? true : isInvalid}
      className={fieldSlots.root({ className })}
    >
      {label && <Label className={fieldSlots.label()}>{label}</Label>}
      <Button className={slots.trigger()}>
        <SelectValue className={slots.value()} />
        <span aria-hidden="true" className={slots.icon()}>
          ▾
        </span>
      </Button>
      <FieldError className={fieldSlots.error()}>{error}</FieldError>
      <Popover className={slots.popover()}>
        <ListBox className={slots.listbox()}>
          {options.map((option) => (
            <ListBoxItem
              key={option.value}
              id={option.value}
              textValue={option.label}
              isDisabled={option.isDisabled}
              className={slots.item()}
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </RACSelect>
  )
}
