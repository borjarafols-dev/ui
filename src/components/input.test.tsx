import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Input } from './input'
import { Label } from './label'

describe('Input + Label', () => {
  it('associates the label with the input via htmlFor/id', () => {
    render(
      <>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" />
      </>,
    )

    const input = screen.getByLabelText('Email address')

    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'email')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('marks disabled inputs with data-disabled', () => {
    render(<Input aria-label="Search" disabled />)

    const input = screen.getByLabelText('Search')

    expect(input).toBeDisabled()
    expect(input).toHaveAttribute('data-disabled')
  })
})
