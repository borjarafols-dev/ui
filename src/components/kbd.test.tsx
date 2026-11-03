import { render, screen } from '@testing-library/react'
import { Menu, MenuItem, Text } from 'react-aria-components'
import { describe, expect, it } from 'vitest'

import { Kbd } from './kbd'

describe('Kbd', () => {
  it('renders a kbd element with its text and the default md size', () => {
    render(<Kbd>Esc</Kbd>)

    const key = screen.getByText('Esc')
    expect(key.tagName).toBe('KBD')
    expect(key).toHaveAttribute('data-slot', 'kbd')
    expect(key).toHaveAttribute('data-size', 'md')
    expect(key).toHaveClass('h-5', 'min-w-5', 'text-xs')
  })

  it('applies the sm size classes', () => {
    render(<Kbd size="sm">K</Kbd>)

    const key = screen.getByText('K')
    expect(key).toHaveAttribute('data-size', 'sm')
    expect(key).toHaveClass('h-4', 'min-w-4', 'text-[0.625rem]')
    expect(key).not.toHaveClass('h-5', 'min-w-5', 'text-xs')
  })

  it('uses aria-label as its accessible name', () => {
    render(
      <p>
        Press <Kbd aria-label="Command">⌘</Kbd>
      </p>,
    )

    expect(screen.getByLabelText('Command')).toHaveTextContent('⌘')
  })

  it('merges className last', () => {
    render(<Kbd className="px-2">Tab</Kbd>)

    const key = screen.getByText('Tab')
    expect(key).toHaveClass('px-2', 'bg-muted')
    expect(key).not.toHaveClass('px-1')
  })

  it('fills the keyboard slot of a MenuItem', () => {
    render(
      <Menu aria-label="Actions">
        <MenuItem textValue="Copy">
          <Text slot="label">Copy</Text>
          <Kbd>C</Kbd>
        </MenuItem>
      </Menu>,
    )

    const key = screen.getByText('C')
    expect(key).toHaveAttribute('id')
    expect(screen.getByRole('menuitem').getAttribute('aria-describedby')).toContain(key.id)
  })
})
