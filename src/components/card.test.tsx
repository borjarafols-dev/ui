import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card, CardContent, CardHeader, CardTitle } from './card'

describe('Card', () => {
  it('renders its parts with data-slot attributes', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Plan</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    )

    expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card')
    expect(screen.getByText('Plan')).toHaveAttribute('data-slot', 'card-title')
    expect(screen.getByText('Body')).toHaveClass('p-6')
  })
})
