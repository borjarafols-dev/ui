import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card'

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

  it('pads the top of CardContent and CardFooter only when they come first', () => {
    render(
      <Card>
        <CardContent>Body</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>,
    )

    // pt-0 applies after another part; first:pt-6 restores it when first.
    expect(screen.getByText('Body')).toHaveClass('p-6', 'pt-0', 'first:pt-6')
    expect(screen.getByText('Body').matches(':first-child')).toBe(true)
    expect(screen.getByText('Actions')).toHaveClass('p-6', 'pt-0', 'first:pt-6')
    expect(screen.getByText('Actions').matches(':first-child')).toBe(false)
  })

  it('pads the top of a CardFooter that is the only child', () => {
    render(
      <Card>
        <CardFooter>Actions</CardFooter>
      </Card>,
    )

    expect(screen.getByText('Actions')).toHaveClass('first:pt-6')
    expect(screen.getByText('Actions').matches(':first-child')).toBe(true)
  })

  it('keeps the header and content flush when a header comes first', () => {
    render(
      <Card>
        <CardHeader>Head</CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    )

    expect(screen.getByText('Head')).toHaveClass('p-6')
    expect(screen.getByText('Body')).toHaveClass('pt-0')
    expect(screen.getByText('Body').matches(':first-child')).toBe(false)
  })
})
