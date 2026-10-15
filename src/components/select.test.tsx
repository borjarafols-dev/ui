import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Select } from './select'

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
]

describe('Select', () => {
  // Listbox + popover, not a native <select>: open the trigger, then click the option.
  it('opens the listbox and emits the chosen key', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(<Select label="Type" placeholder="Pick one" options={options} onSelectionChange={onSelectionChange} />)

    await user.click(screen.getByRole('button', { name: /type/i }))
    await user.click(await screen.findByRole('option', { name: 'Beta' }))
    expect(onSelectionChange).toHaveBeenCalledWith('b')
  })

  it('shows the error', () => {
    render(<Select label="Type" options={options} error="Pick a type" />)

    expect(screen.getByText('Pick a type')).toBeInTheDocument()
  })
})
