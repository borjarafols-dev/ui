import { render, screen } from '@testing-library/react'
import { TextField } from 'react-aria-components'
import { describe, expect, it } from 'vitest'

import { Input } from './input'
import { Label } from './label'

describe('Label', () => {
  it('names its control inside a React Aria field without htmlFor', () => {
    render(
      <TextField>
        <Label>Coupon code</Label>
        <Input />
      </TextField>,
    )

    const input = screen.getByLabelText('Coupon code')
    expect(input).toHaveAttribute('data-slot', 'input')
    expect(screen.getByText('Coupon code')).toHaveAttribute('data-slot', 'label')
  })
})
