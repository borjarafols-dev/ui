import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './badge'

describe('Badge', () => {
  it('renders the variant class and state attribute', () => {
    render(<Badge variant="destructive">Deprecated</Badge>)

    const badge = screen.getByText('Deprecated')
    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground')
    expect(badge).toHaveAttribute('data-variant', 'destructive')
  })

  it.each(['success', 'warning', 'info'] as const)('renders the %s status variant', (variant) => {
    render(<Badge variant={variant}>Status</Badge>)

    const badge = screen.getByText('Status')
    expect(badge).toHaveClass(`bg-${variant}`, `text-${variant}-foreground`)
    expect(badge).toHaveAttribute('data-variant', variant)
  })

  it('defaults to the primary variant', () => {
    render(<Badge>Default</Badge>)

    const badge = screen.getByText('Default')
    expect(badge).toHaveClass('bg-primary', 'text-primary-foreground')
    expect(badge).toHaveAttribute('data-variant', 'primary')
  })

  it('merges custom className', () => {
    render(<Badge className="uppercase">New</Badge>)

    expect(screen.getByText('New')).toHaveClass('uppercase', 'bg-primary')
  })
})
