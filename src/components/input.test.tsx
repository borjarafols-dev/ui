import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Input } from './input'
import { Label } from './label'

describe('Input + Label', () => {
  it('compose into a labelled control with token classes', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" />
      </>,
    )

    const input = screen.getByLabelText('Email')
    expect(input).toHaveClass('border-input', 'bg-background')
    expect(input).toHaveAttribute('data-slot', 'input')
  })
})
