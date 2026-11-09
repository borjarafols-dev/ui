import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { clearToasts, ToastRegion, toasts } from './toast'

describe('ToastRegion', () => {
  // Testing Library waits on real timeouts between events, so the fake clock
  // also follows real time; the test still moves it past toast timeouts itself.
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    act(() => clearToasts())
    vi.useRealTimers()
  })

  it('renders queued toasts in a named landmark region, each styled by its variant', () => {
    render(<ToastRegion />)

    act(() => {
      toasts.success('Profile saved')
      toasts.error('Could not save')
    })

    const region = screen.getByRole('region', { name: 'Notifications' })
    const success = within(region).getByRole('alertdialog', { name: 'Profile saved' })
    expect(success).toHaveAttribute('data-variant', 'success')
    expect(success).toHaveClass('bg-success', 'text-success-foreground')
    const error = within(region).getByRole('alertdialog', { name: 'Could not save' })
    expect(error).toHaveAttribute('data-variant', 'error')
    expect(error).toHaveClass('bg-destructive', 'text-destructive-foreground')
  })

  it('closes a success toast after its timeout and keeps an error toast until it is closed', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ToastRegion />)

    act(() => {
      toasts.success('Profile saved')
      toasts.error('Could not save')
    })
    act(() => vi.advanceTimersByTime(5000))

    expect(screen.queryByText('Profile saved')).not.toBeInTheDocument()
    expect(screen.getByText('Could not save')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(60_000))
    expect(screen.getByText('Could not save')).toBeInTheDocument()

    const errorToast = screen.getByRole('alertdialog', { name: 'Could not save' })
    await user.click(within(errorToast).getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('Could not save')).not.toBeInTheDocument()
  })

  it('closes a toast from the keyboard', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onClose = vi.fn()
    render(<ToastRegion />)

    act(() => {
      toasts.error('Could not save', { onClose })
    })

    await user.tab()
    expect(screen.getByRole('alertdialog', { name: 'Could not save' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.queryByText('Could not save')).not.toBeInTheDocument()
    expect(onClose).toHaveBeenCalled()
  })

  it('renders info and warning toasts styled by their status tokens', () => {
    render(<ToastRegion />)

    act(() => {
      toasts.info('New version available')
      toasts.warning('Storage almost full')
    })

    const info = screen.getByRole('alertdialog', { name: 'New version available' })
    expect(info).toHaveAttribute('data-variant', 'info')
    expect(info).toHaveClass('bg-info', 'text-info-foreground')
    const warning = screen.getByRole('alertdialog', { name: 'Storage almost full' })
    expect(warning).toHaveAttribute('data-variant', 'warning')
    expect(warning).toHaveClass('bg-warning', 'text-warning-foreground')
  })

  it('closes an info toast after its timeout and keeps a warning toast', () => {
    render(<ToastRegion />)

    act(() => {
      toasts.info('New version available')
      toasts.warning('Storage almost full')
    })
    act(() => vi.advanceTimersByTime(5000))

    expect(screen.queryByText('New version available')).not.toBeInTheDocument()
    act(() => vi.advanceTimersByTime(60_000))
    expect(screen.getByText('Storage almost full')).toBeInTheDocument()
  })

  it('runs the action, then closes the toast', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const onAction = vi.fn()
    const onClose = vi.fn()
    render(<ToastRegion />)

    act(() => {
      toasts.success('Item deleted', { onClose, action: { label: 'Undo', onAction } })
    })

    const toast = screen.getByRole('alertdialog', { name: 'Item deleted' })
    const undo = within(toast).getByRole('button', { name: 'Undo' })
    expect(undo).toHaveAttribute('data-slot', 'toast-action')
    await user.click(undo)

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalled()
    expect(screen.queryByText('Item deleted')).not.toBeInTheDocument()
  })

  it('gives a success toast with an action 10 seconds by default', () => {
    render(<ToastRegion />)

    act(() => {
      toasts.success('Item deleted', { action: { label: 'Undo', onAction: () => {} } })
    })
    act(() => vi.advanceTimersByTime(5000))
    expect(screen.getByText('Item deleted')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(5000))
    expect(screen.queryByText('Item deleted')).not.toBeInTheDocument()
  })

  it('reaches the action before the close button with Tab', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ToastRegion />)

    act(() => {
      toasts.warning('Item archived', { action: { label: 'Undo', onAction: () => {} } })
    })

    await user.tab()
    expect(screen.getByRole('alertdialog', { name: 'Item archived' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Undo' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it('takes explicit labels over the localised defaults', () => {
    render(<ToastRegion aria-label="Messages" closeLabel="Dismiss" />)

    act(() => {
      toasts.error('Could not save')
    })

    expect(screen.getByRole('region', { name: 'Messages' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })
})
