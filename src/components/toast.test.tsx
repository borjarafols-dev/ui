import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ToastRegion, toasts } from './toast'

describe('ToastRegion', () => {
  // Testing Library waits on real timeouts between events, so the fake clock
  // also follows real time; the test still moves it past toast timeouts itself.
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    act(() => toasts.clear())
    vi.useRealTimers()
  })

  it('renders queued toasts in a named landmark region', () => {
    render(<ToastRegion />)

    act(() => {
      toasts.success('Profile saved')
      toasts.error('Could not save', { description: 'Try again later.' })
    })

    const region = screen.getByRole('region', { name: 'Notifications' })
    expect(within(region).getByText('Profile saved')).toBeInTheDocument()
    expect(within(region).getByText('Could not save')).toBeInTheDocument()
    expect(within(region).getByText('Try again later.')).toBeInTheDocument()
    expect(within(region).getByRole('alertdialog', { name: 'Profile saved' })).toHaveAttribute('data-variant', 'success')
    expect(within(region).getByRole('alertdialog', { name: 'Could not save' })).toHaveAttribute('data-variant', 'error')
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

  it('takes explicit labels over the localised defaults', () => {
    render(<ToastRegion aria-label="Messages" closeLabel="Dismiss" />)

    act(() => {
      toasts.error('Could not save')
    })

    expect(screen.getByRole('region', { name: 'Messages' })).toHaveAttribute('data-slot', 'toast-region')
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })

  it('styles variants with status tokens', () => {
    render(<ToastRegion />)

    act(() => {
      toasts.success('Profile saved')
      toasts.error('Could not save')
    })

    expect(screen.getByRole('alertdialog', { name: 'Profile saved' })).toHaveClass('bg-success', 'text-success-foreground')
    expect(screen.getByRole('alertdialog', { name: 'Could not save' })).toHaveClass('bg-destructive', 'text-destructive-foreground')
  })
})
