import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Button } from '../atoms/button'
import { Tooltip } from './tooltip'

// React Aria keeps a module-level warm-up timer between tooltips; fake timers
// let each test run it out so the next one starts cold.
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

afterEach(() => {
  act(() => {
    vi.runAllTimers()
  })
  vi.useRealTimers()
})

function iconButton(props: Partial<React.ComponentProps<typeof Tooltip>> = {}) {
  return (
    <Tooltip content="Copy link" {...props}>
      <Button aria-label="Copy link" variant="ghost">
        ⧉
      </Button>
    </Tooltip>
  )
}

describe('Tooltip', () => {
  it('shows after the delay on hover and describes the trigger', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(iconButton())

    const trigger = screen.getByRole('button', { name: 'Copy link' })
    // React Aria opens on hover only once the interaction modality is pointer.
    await user.click(document.body)
    await user.hover(trigger)
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(100)
    })
    const tip = screen.getByRole('tooltip')
    expect(tip).toHaveTextContent('Copy link')
    expect(tip).toHaveAttribute('data-slot', 'tooltip')
    expect(trigger).toHaveAttribute('aria-describedby', tip.id)
  })

  it('shows at once on Tab focus and hides on Escape', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(iconButton())

    await user.tab()
    expect(screen.getByRole('button', { name: 'Copy link' })).toHaveFocus()
    expect(screen.getByRole('tooltip')).toHaveTextContent('Copy link')

    await user.keyboard('{Escape}')
    act(() => {
      vi.runAllTimers()
    })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('makes plain text focusable with isTextTrigger', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(
      <Tooltip content="2026-11-03 14:02" isTextTrigger>
        <time dateTime="2026-11-03T14:02">3m ago</time>
      </Tooltip>,
    )

    const trigger = screen.getByText('3m ago').parentElement!
    expect(trigger).toHaveAttribute('tabIndex', '0')
    expect(trigger).toHaveAttribute('data-slot', 'tooltip-trigger')

    await user.tab()
    expect(trigger).toHaveFocus()
    const tip = screen.getByRole('tooltip')
    expect(tip).toHaveTextContent('2026-11-03 14:02')
    expect(trigger).toHaveAttribute('aria-describedby', tip.id)
  })

  it('never shows when isDisabled', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(iconButton({ isDisabled: true }))

    await user.click(document.body)
    await user.hover(screen.getByRole('button', { name: 'Copy link' }))
    act(() => {
      vi.runAllTimers()
    })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

    await user.tab()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('merges className on the tooltip', () => {
    render(iconButton({ defaultOpen: true, className: 'max-w-80' }))

    const tip = screen.getByRole('tooltip')
    expect(tip).toHaveClass('max-w-80', 'bg-foreground', 'text-background')
    expect(tip).not.toHaveClass('max-w-64')
  })
})
