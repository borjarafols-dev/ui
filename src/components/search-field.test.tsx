import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SearchField } from './search-field'

describe('SearchField', () => {
  it('shows a clear button only while it has a value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchField label="Search" onChange={onChange} />)

    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'abc')
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onChange).toHaveBeenLastCalledWith('')
  })
})
