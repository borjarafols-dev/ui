import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Badge } from './badge'

describe('Badge', () => {
  it('renders the destructive variant class and state attribute', () => {
    render(<Badge variant="destructive">Deprecated</Badge>)

    const badge = screen.getByText('Deprecated')

    expect(badge).toHaveClass('bg-destructive', 'text-destructive-foreground')
    expect(badge).toHaveAttribute('data-variant', 'destructive')
  })

  it('merges custom className', () => {
    render(<Badge className="uppercase">New</Badge>)

    expect(screen.getByText('New')).toHaveClass('uppercase', 'bg-primary')
  })
})
