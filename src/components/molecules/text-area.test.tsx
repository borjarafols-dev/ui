import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TextArea } from './text-area'

describe('TextArea', () => {
  it('renders a multi-line control and emits the value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TextArea label="Notes" rows={4} onChange={onChange} />)

    const textarea = screen.getByLabelText('Notes')
    expect(textarea.tagName).toBe('TEXTAREA')
    expect(textarea).toHaveAttribute('rows', '4')
    await user.type(textarea, 'x')
    expect(onChange).toHaveBeenCalledWith('x')
  })

  it('shows the error', () => {
    render(<TextArea label="Notes" error="Too short" />)

    expect(screen.getByText('Too short')).toBeInTheDocument()
  })
})
