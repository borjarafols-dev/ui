import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'

describe('Button', () => {
  it('exposes variant and size as data attributes and token classes', () => {
    render(<Button variant="secondary" size="lg">Save</Button>)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveClass('bg-secondary', 'h-10')
    expect(button).toHaveAttribute('data-variant', 'secondary')
    expect(button).toHaveAttribute('data-size', 'lg')
  })

  it('defaults to primary / md', () => {
    render(<Button>Go</Button>)

    const button = screen.getByRole('button', { name: 'Go' })
    expect(button).toHaveAttribute('data-variant', 'primary')
    expect(button).toHaveClass('bg-button-primary')
  })

  it('calls onPress', async () => {
    const user = userEvent.setup()
    const onPress = vi.fn()
    render(<Button onPress={onPress}>Click me</Button>)

    await user.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('does not fire onPress when disabled', async () => {
    const user = userEvent.setup()
    const onPress = vi.fn()
    render(<Button isDisabled onPress={onPress}>Disabled</Button>)

    const button = screen.getByRole('button', { name: 'Disabled' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-disabled')
    await user.click(button)
    expect(onPress).not.toHaveBeenCalled()
  })

  it('lets className win over recipe classes', () => {
    render(<Button className="h-12">Tall</Button>)

    const button = screen.getByRole('button', { name: 'Tall' })
    expect(button).toHaveClass('h-12')
    expect(button).not.toHaveClass('h-9')
  })
})
