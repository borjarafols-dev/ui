import {
  Focusable,
  OverlayArrow,
  Tooltip as RACTooltip,
  TooltipTrigger,
  type TooltipProps as RACTooltipProps,
  type TooltipTriggerComponentProps as RACTooltipTriggerProps,
} from 'react-aria-components'

import { tooltip } from '../recipes/tooltip'

export interface TooltipProps extends Omit<RACTooltipTriggerProps, 'children'> {
  /** The tooltip text. Plain text only. */
  content: React.ReactNode
  /** The trigger: a library Button or Link, or any element when isTextTrigger is set. */
  children: React.ReactElement
  /** Wrap a non-interactive child (text, a badge) so it can take focus. */
  isTextTrigger?: boolean
  placement?: RACTooltipProps['placement']
  className?: string
}

const slots = tooltip()

/**
 * Short text shown on hover after `delay` (500 ms) and at once on keyboard
 * focus: the name behind an icon-only button, the exact value behind an
 * abbreviation, the absolute time behind a relative one.
 *
 * @usage Short supplementary text only; never essential information, links or buttons inside it.
 * @usage Icon-only buttons still need aria-label; the tooltip doesn't name them.
 * @usage Don't put a tooltip on a disabled control; explain why it is disabled in visible text.
 * @usage For rich or interactive content on demand use a popover dialog, not a tooltip.
 * @usage isTextTrigger adds a tab stop per trigger; use it sparingly.
 */
export function Tooltip({
  content,
  children,
  isTextTrigger,
  placement,
  className,
  delay = 500,
  ...props
}: TooltipProps) {
  return (
    <TooltipTrigger delay={delay} {...props}>
      {isTextTrigger ? (
        <Focusable>
          {/* Focusable warns without an interactive role; aria-describedby is announced on button. */}
          <span role="button" tabIndex={0} data-slot="tooltip-trigger" className={slots.textTrigger()}>
            {children}
          </span>
        </Focusable>
      ) : (
        children
      )}
      <RACTooltip data-slot="tooltip" placement={placement} className={slots.tooltip({ className })}>
        <OverlayArrow className={slots.arrow()}>
          <svg width={8} height={8} viewBox="0 0 8 8" aria-hidden="true">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        {content}
      </RACTooltip>
    </TooltipTrigger>
  )
}
