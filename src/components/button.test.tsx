import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  it('renders with variant and size classes plus state attributes', () => {
    render(<Button variant="secondary" size="lg">Save</Button>)

    const button = screen.getByRole('button', { name: 'Save' })

    expect(button).toHaveClass('bg-secondary', 'h-10')
    expect(button).toHaveAttribute('data-variant', 'secondary')
    expect(button).toHaveAttribute('data-size', 'lg')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Click me</Button>)
    await user.click(screen.getByRole('button', { name: 'Click me' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('forwards disabled state to attributes', () => {
    render(<Button disabled>Disabled</Button>)

    const button = screen.getByRole('button', { name: 'Disabled' })

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-disabled')
  })

  it('asChild renders the slotted element with button styling contract', () => {
    render(
      <Button asChild>
        <a href="/docs">Link button</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Link button' })

    expect(link).toHaveAttribute('href', '/docs')
    expect(link).toHaveAttribute('data-variant', 'primary')
  })
})
