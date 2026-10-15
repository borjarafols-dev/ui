import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { ConfirmDialog } from './confirm-dialog'

describe('ConfirmDialog', () => {
  it('fires onConfirm and onCancel from the buttons', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Delete?"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )

    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-variant', 'destructive')
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('disables both buttons while pending', () => {
    render(<ConfirmDialog open isPending title="Delete?" message="m" onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Working…' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  it.each([
    ['es-ES', 'Cancelar', 'Confirmar', 'Procesando…'],
    ['ca-ES', 'Cancel·la', 'Confirma', 'Processant…'],
    ['fr-FR', 'Cancel', 'Confirm', 'Working…'],
  ])('localises its default labels under %s', (locale, cancel, confirm, pending) => {
    const { rerender } = render(
      <I18nProvider locale={locale}>
        <ConfirmDialog open title="?" message="m" onConfirm={vi.fn()} onCancel={vi.fn()} />
      </I18nProvider>,
    )

    expect(screen.getByRole('button', { name: cancel })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: confirm })).toBeInTheDocument()

    rerender(
      <I18nProvider locale={locale}>
        <ConfirmDialog open isPending title="?" message="m" onConfirm={vi.fn()} onCancel={vi.fn()} />
      </I18nProvider>,
    )
    expect(screen.getByRole('button', { name: pending })).toBeDisabled()
  })

  it('lets explicit labels override the localised defaults', () => {
    render(
      <I18nProvider locale="ca-ES">
        <ConfirmDialog
          open
          title="?"
          message="m"
          cancelLabel="Tornar"
          confirmLabel="Elimina"
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />
      </I18nProvider>,
    )

    expect(screen.getByRole('button', { name: 'Tornar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Elimina' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel·la' })).not.toBeInTheDocument()
  })
})
