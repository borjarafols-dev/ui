import {
  Button,
  Text,
  UNSTABLE_Toast as RACToast,
  UNSTABLE_ToastContent as RACToastContent,
  UNSTABLE_ToastQueue as RACToastQueue,
  UNSTABLE_ToastRegion as RACToastRegion,
} from 'react-aria-components'

import { useStrings } from '../../i18n/strings'
import { toast } from '../../recipes/toast'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

interface ToastContent {
  variant: ToastVariant
  title: string
  description?: string
  action?: ToastAction
}

export interface ToastAction {
  /** Names the action: "Undo", "View". */
  label: string
  /** Runs when the action is pressed. The toast closes after it. */
  onAction: () => void
}

export interface ToastOptions {
  description?: string
  /** Called when the toast closes, by the user or after its timeout. */
  onClose?: () => void
  /** A shortcut button before the close button, such as Undo. */
  action?: ToastAction
}

export interface SuccessToastOptions extends ToastOptions {
  /** Milliseconds before the toast closes itself. Defaults to 5000, or 10000 with an `action`. */
  timeout?: number
}

export interface ToastRegionProps {
  /** Accessible name of the region. Defaults to a localised label. */
  'aria-label'?: string
  /** Accessible name of each toast's close button. Defaults to a localised label. */
  closeLabel?: string
  className?: string
}

const SUCCESS_TIMEOUT = 5000
// An action needs time to be read and reached before the toast goes.
const ACTION_TIMEOUT = 10000

const queue = new RACToastQueue<ToastContent>({ maxVisibleToasts: 5 })

/**
 * Queue toasts from anywhere: event handlers, mutation callbacks, code outside
 * React. They render in the app's `ToastRegion`.
 */
export const toasts = {
  /** A confirmation. Closes itself after its timeout. */
  success(title: string, options: SuccessToastOptions = {}): void {
    add('success', title, options)
  },
  /** A failure. Stays until the user closes it. */
  error(title: string, options: ToastOptions = {}): void {
    add('error', title, options)
  },
  /** Neutral news. Closes itself after its timeout. */
  info(title: string, options: SuccessToastOptions = {}): void {
    add('info', title, options)
  },
  /** Something the user should notice that is not a failure. Stays until the user closes it. */
  warning(title: string, options: ToastOptions = {}): void {
    add('warning', title, options)
  },
}

const SELF_CLOSING: ReadonlySet<ToastVariant> = new Set(['success', 'info'])

function add(variant: ToastVariant, title: string, { description, onClose, action, timeout }: SuccessToastOptions) {
  const selfClosing = SELF_CLOSING.has(variant)
  queue.add(
    { variant, title, description, action },
    { onClose, timeout: selfClosing ? (timeout ?? (action ? ACTION_TIMEOUT : SUCCESS_TIMEOUT)) : undefined },
  )
}

/** Close every toast. For tests; not exported from the package. */
export function clearToasts(): void {
  queue.clear()
}

/**
 * Landmark region that shows the toasts queued with `toasts.success`,
 * `toasts.error`, `toasts.info` and `toasts.warning`, stacked at the bottom end of the viewport. F6 moves focus
 * into it; every toast has a close button.
 *
 * @usage Mount it once, at the app's root; never per page or per component.
 * @usage For transient feedback on an action (saved, failed to save); not for validation errors on a field, which belong on the field.
 * @usage Success toasts close themselves; error toasts stay until dismissed, so use `error` only for failures the user must notice.
 * @usage An action (Undo, View) is a shortcut; the same outcome must be reachable elsewhere in the UI.
 * @usage One action per toast at most; for a decision with two outcomes use ConfirmDialog.
 * @usage info for neutral news that closes itself; warning for something the user should notice that is not a failure.
 */
export function ToastRegion({ 'aria-label': ariaLabel, closeLabel, className }: ToastRegionProps) {
  const t = useStrings()
  const slots = toast()
  return (
    <RACToastRegion
      queue={queue}
      data-slot="toast-region"
      aria-label={ariaLabel ?? t.notifications}
      className={slots.region({ className })}
    >
      {({ toast: queued }) => {
        const { variant, title, description, action } = queued.content
        const variantSlots = toast({ variant })
        return (
          <RACToast toast={queued} data-slot="toast" data-variant={variant} className={variantSlots.toast()}>
            <RACToastContent className={variantSlots.content()}>
              <Text slot="title" className={variantSlots.title()}>
                {title}
              </Text>
              {description && (
                <Text slot="description" className={variantSlots.description()}>
                  {description}
                </Text>
              )}
            </RACToastContent>
            {action && (
              <Button
                data-slot="toast-action"
                onPress={() => {
                  action.onAction()
                  queue.close(queued.key)
                }}
                className={variantSlots.action()}
              >
                {action.label}
              </Button>
            )}
            <Button slot="close" aria-label={closeLabel ?? t.close} className={variantSlots.close()}>
              <span aria-hidden="true">✕</span>
            </Button>
          </RACToast>
        )
      }}
    </RACToastRegion>
  )
}
