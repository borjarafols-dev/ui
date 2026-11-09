import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Switch } from './switch'

describe('Switch', () => {
  it('renders a switch named by its label, unchecked by default', () => {
    render(<Switch>Email notifications</Switch>)

    const toggle = screen.getByRole('switch', { name: 'Email notifications' })
    expect(toggle).not.toBeChecked()
  })

  it('toggles on click and reports the new boolean', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch onChange={onChange}>Email notifications</Switch>)

    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenLastCalledWith(true)
    expect(screen.getByRole('switch')).toBeChecked()

    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenLastCalledWith(false)
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
})
