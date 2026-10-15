import { Button as RACButton, type ButtonProps as RACButtonProps } from 'react-aria-components'

import { button, type ButtonVariants } from '../recipes/button'

export interface ButtonProps extends Omit<RACButtonProps, 'className'>, ButtonVariants {
  className?: string
}

/**
 * Button on React Aria Components. Use `onPress` / `isDisabled`, not
 * `onClick` / `disabled`. For links styled as buttons, put the `button()`
 * recipe on a React Aria `Link` or your router's link.
 */
export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <RACButton
      data-slot="button"
      data-variant={variant ?? 'primary'}
      data-size={size ?? 'md'}
      {...props}
      className={button({ variant, size, className })}
    />
  )
}
