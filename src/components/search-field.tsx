import {
  Button,
  Input,
  Label,
  SearchField as RACSearchField,
  type SearchFieldProps as RACSearchFieldProps,
} from 'react-aria-components'

import { useStrings } from '../i18n/strings'
import { field } from '../recipes/field'

export interface SearchFieldProps extends Omit<RACSearchFieldProps, 'className' | 'children'> {
  label?: string
  placeholder?: string
  /** Accessible name of the clear button. Defaults to a localised label. */
  clearLabel?: string
  className?: string
}

const slots = field()

/**
 * Search field. Value-based `onChange`; shows a clear button while it has a
 * value. Give it a `label` or an `aria-label`.
 */
export function SearchField({
  label,
  placeholder,
  clearLabel,
  className,
  ...props
}: SearchFieldProps) {
  const t = useStrings()
  return (
    <RACSearchField data-slot="search-field" {...props} className={slots.root({ className })}>
      {({ isEmpty }) => (
        <>
          {label && <Label className={slots.label()}>{label}</Label>}
          <div className="relative">
            <Input
              placeholder={placeholder}
              className={slots.input({ className: 'pr-8 [&::-webkit-search-cancel-button]:appearance-none' })}
            />
            {!isEmpty && (
              <Button
                aria-label={clearLabel ?? t.clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-muted-foreground outline-none hover:text-foreground focus-visible:text-foreground"
              >
                <span aria-hidden="true">✕</span>
              </Button>
            )}
          </div>
        </>
      )}
    </RACSearchField>
  )
}
