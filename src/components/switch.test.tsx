import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Switch } from './switch'

const root = () => screen.getByRole('switch').closest('[data-slot="switch"]')
const track = () => [...(root()?.children ?? [])].find((child) => !child.contains(screen.getByRole('switch')))

describe('Switch', () => {
  it('renders a switch named by its label, unchecked by default', () => {
    render(<Switch>Email notifications</Switch>)

    const toggle = screen.getByRole('switch', { name: 'Email notifications' })
    expect(toggle).not.toBeChecked()
    expect(root()).not.toHaveAttribute('data-selected')
  })

  it('toggles on click and reports the new boolean', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch onChange={onChange}>Email notifications</Switch>)

    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole('switch')).toBeChecked()
    expect(root()).toHaveAttribute('data-selected', 'true')

    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenLastCalledWith(false)
    expect(root()).not.toHaveAttribute('data-selected')
  })

  it('toggles with Space', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Switch defaultSelected onChange={onChange}>
        Email notifications
      </Switch>,
    )

    await user.tab()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith(false)
    expect(screen.getByRole('switch')).not.toBeChecked()
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Switch isDisabled onChange={onChange}>
        Email notifications
      </Switch>,
    )

    await user.click(screen.getByRole('switch'))
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('switch')).toBeDisabled()
    expect(root()).toHaveAttribute('data-disabled', 'true')
  })

  it('does not toggle when read-only', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <Switch isReadOnly defaultSelected onChange={onChange}>
        Email notifications
      </Switch>,
    )

    await user.click(screen.getByRole('switch'))
    await user.keyboard(' ')
    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByRole('switch')).toBeChecked()
    expect(root()).toHaveAttribute('data-readonly', 'true')
  })

  it('keeps the description out of the name and exposes it as the description', () => {
    render(<Switch description="Sent when a run fails.">Email notifications</Switch>)

    const toggle = screen.getByRole('switch', { name: 'Email notifications' })
    expect(toggle).toHaveAccessibleDescription('Sent when a run fails.')
  })

  it('uses aria-label when there is no visible label', () => {
    render(<Switch aria-label="Provider enabled" />)

    expect(screen.getByRole('switch', { name: 'Provider enabled' })).toBeInTheDocument()
  })

  it('sets data-slot, the md size by default and the off track token', () => {
    render(<Switch>Email notifications</Switch>)

    const el = root()
    expect(el).toHaveAttribute('data-size', 'md')
    expect(track()).toHaveClass('h-5', 'w-9', 'bg-input')
    expect(track()?.firstElementChild).toHaveClass('size-4', 'group-selected/switch:translate-x-4')
  })

  it('applies the sm size classes', () => {
    render(<Switch size="sm">Email notifications</Switch>)

    const el = root()
    expect(el).toHaveAttribute('data-size', 'sm')
    expect(track()).toHaveClass('h-4', 'w-7')
    expect(track()?.firstElementChild).toHaveClass('size-3', 'group-selected/switch:translate-x-3')
  })

  it('merges className last', () => {
    render(<Switch className="gap-4">Email notifications</Switch>)

    expect(root()).toHaveClass('gap-4', 'group/switch')
    expect(root()).not.toHaveClass('gap-2')
  })
})
