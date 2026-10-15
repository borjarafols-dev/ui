import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EmptyState } from './empty-state'

describe('EmptyState', () => {
  it('renders title, description and action', () => {
    render(<EmptyState title="No projects" description="Create one to start." action={<button>New</button>} />)

    expect(screen.getByRole('heading', { name: 'No projects' })).toBeInTheDocument()
    expect(screen.getByText('Create one to start.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument()
  })
})
