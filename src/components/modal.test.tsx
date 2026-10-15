import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from './modal'

describe('Modal', () => {
  it('renders the title and children when open', () => {
    render(
      <Modal open onClose={vi.fn()} title="Edit profile">
        <p>form body</p>
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Edit profile' })).toBeInTheDocument()
    expect(screen.getByText('form body')).toBeInTheDocument()
  })

  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Edit profile">
        <p>form body</p>
      </Modal>,
    )

    expect(screen.queryByText('form body')).not.toBeInTheDocument()
  })

  it('calls onClose on Escape', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Edit profile">
        <p>form body</p>
      </Modal>,
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalled()
  })
})
