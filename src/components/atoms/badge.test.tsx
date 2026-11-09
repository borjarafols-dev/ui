import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './badge'

describe('Badge', () => {
  it.each(['destructive', 'success', 'warning', 'info'] as const)(
    'renders the %s variant class and state attribute',
    (variant) => {
      render(<Badge variant={variant}>Status</Badge>)

      const badge = screen.getByText('Status')
      expect(badge).toHaveClass(`bg-${variant}`, `text-${variant}-foreground`)
      expect(badge).toHaveAttribute('data-variant', variant)
    },
  )

  it('merges custom className over the default primary variant', () => {
    render(<Badge className="uppercase">New</Badge>)

    const badge = screen.getByText('New')
    expect(badge).toHaveClass('uppercase', 'bg-primary')
    expect(badge).toHaveAttribute('data-variant', 'primary')
  })
})
