import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Checkbox } from './checkbox'

describe('Checkbox', () => {
  it('toggles and reports the boolean value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Accept terms" onChange={onChange} />)

    await user.click(screen.getByRole('checkbox', { name: 'Accept terms' }))
    expect(onChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
