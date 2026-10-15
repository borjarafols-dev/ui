import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { NumberField } from './number-field'

describe('NumberField', () => {
  it('emits a number on blur', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberField label="Year" formatOptions={{ useGrouping: false }} onChange={onChange} />)

    const input = screen.getByLabelText('Year')
    await user.type(input, '2024')
    await user.tab()
    expect(onChange).toHaveBeenCalledWith(2024)
    expect(input).toHaveValue('2024')
  })
})
