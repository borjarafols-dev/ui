import {
  Button,
  Text,
  UNSTABLE_Toast as RACToast,
  UNSTABLE_ToastContent as RACToastContent,
  UNSTABLE_ToastQueue as RACToastQueue,
  UNSTABLE_ToastRegion as RACToastRegion,
} from 'react-aria-components'

import { useStrings } from '../i18n/strings'
import { toast } from '../recipes/toast'

export type ToastVariant = 'success' | 'error'

interface ToastContent {
  variant: ToastVariant
  title: string
  description?: string
}

export interface ToastOptions {
  description?: string
  /** Called when the toast closes, by the user or after its timeout. */
  onClose?: () => void
}

export interface SuccessToastOptions extends ToastOptions {
  /** Milliseconds before the toast closes itself. Defaults to 5000. */
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

const queue = new RACToastQueue<ToastContent>({ maxVisibleToasts: 5 })

/**
 * Queue toasts from anywhere: event handlers, mutation callbacks, code outside
 * React. They render in the app's `ToastRegion`.
 */
export const toasts = {
  /** A confirmation. Closes itself after its timeout. */
  success(title: string, { description, onClose, timeout = SUCCESS_TIMEOUT }: SuccessToastOptions = {}): void {
    queue.add({ variant: 'success', title, description }, { onClose, timeout })
  },
  /** A failure. Stays until the user closes it. */
  error(title: string, { description, onClose }: ToastOptions = {}): void {
    queue.add({ variant: 'error', title, description }, { onClose })
  },
}

/** Close every toast. For tests; not exported from the package. */
export function clearToasts(): void {
  queue.clear()
}

/**
 * Landmark region that shows the toasts queued with `toasts.success` and
 * `toasts.error`, stacked at the bottom end of the viewport. F6 moves focus
 * into it; every toast has a close button.
 *
 * @usage Mount it once, at the app's root; never per page or per component.
 * @usage For transient feedback on an action (saved, failed to save); not for validation errors on a field, which belong on the field.
 * @usage Success toasts close themselves; error toasts stay until dismissed, so use `error` only for failures the user must notice.
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
        const { variant, title, description } = queued.content
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
            <Button slot="close" aria-label={closeLabel ?? t.close} className={variantSlots.close()}>
              <span aria-hidden="true">✕</span>
            </Button>
          </RACToast>
        )
      }}
    </RACToastRegion>
  )
}
