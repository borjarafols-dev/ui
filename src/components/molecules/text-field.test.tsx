import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { TextField } from './text-field'

describe('TextField', () => {
  it('links the label and emits the string value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<TextField label="Email" onChange={onChange} />)

    await user.type(screen.getByLabelText('Email'), 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('shows the error and marks the input invalid', () => {
    render(<TextField label="Email" error="Required" />)

    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<TextField label="Email" description="We never share it" />)

    expect(screen.getByLabelText('Email')).toHaveAccessibleDescription('We never share it')
  })
})
