import type * as React from 'react'
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

  describe('confirm by name', () => {
    function renderByName(props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) {
      const onConfirm = vi.fn()
      const ui = (open: boolean) => (
        <ConfirmDialog
          open={open}
          title="Delete project acme?"
          message="m"
          confirmLabel="Delete project"
          confirmText="acme"
          onConfirm={onConfirm}
          onCancel={vi.fn()}
          {...props}
        />
      )
      const view = render(ui(true))
      return { onConfirm, reopen: () => (view.rerender(ui(false)), view.rerender(ui(true))) }
    }

    it('focuses a labelled field and starts with confirm disabled', () => {
      renderByName()

      const input = screen.getByRole('textbox', { name: 'Type acme to confirm' })
      expect(input).toHaveFocus()
      expect(input).toHaveAttribute('autocomplete', 'off')
      expect(input).toHaveAttribute('spellcheck', 'false')
      expect(document.querySelector('[data-slot="confirm-dialog"]')).toHaveAttribute('data-confirm-by-name')
      expect(screen.getByRole('button', { name: 'Delete project' })).toBeDisabled()
    })

    it.each([
      ['acm', false],
      ['acme', true],
      ['  acme  ', true],
      ['ACME', false],
    ])('typing %j enables confirm: %s', async (value, enabled) => {
      const user = userEvent.setup()
      renderByName()

      await user.type(screen.getByRole('textbox'), value)
      const confirm = screen.getByRole('button', { name: 'Delete project' })
      if (enabled) expect(confirm).toBeEnabled()
      else expect(confirm).toBeDisabled()
    })

    it('confirms on Enter only when the text matches', async () => {
      const user = userEvent.setup()
      const { onConfirm } = renderByName()

      await user.type(screen.getByRole('textbox'), 'acm{Enter}')
      expect(onConfirm).not.toHaveBeenCalled()
      await user.type(screen.getByRole('textbox'), 'e{Enter}')
      expect(onConfirm).toHaveBeenCalledOnce()
    })

    it('does not confirm on Enter while pending', async () => {
      const user = userEvent.setup()
      const { onConfirm } = renderByName({ isPending: true })

      expect(screen.getByRole('textbox')).toBeDisabled()
      await user.type(screen.getByRole('textbox'), 'acme{Enter}')
      expect(onConfirm).not.toHaveBeenCalled()
    })

    it('clears the field when closed and reopened', async () => {
      const user = userEvent.setup()
      const { reopen } = renderByName()

      await user.type(screen.getByRole('textbox'), 'acme')
      reopen()
      expect(screen.getByRole('textbox')).toHaveValue('')
      expect(screen.getByRole('button', { name: 'Delete project' })).toBeDisabled()
    })

    it('takes an explicit label', () => {
      renderByName({ confirmTextLabel: 'Project name' })

      expect(screen.getByRole('textbox', { name: 'Project name' })).toBeInTheDocument()
    })

    it.each([
      ['es-ES', 'Escribe acme para confirmar'],
      ['ca-ES', 'Escriu acme per confirmar'],
    ])('localises the default label under %s', (locale, label) => {
      render(
        <I18nProvider locale={locale}>
          <ConfirmDialog open title="?" message="m" confirmText="acme" onConfirm={vi.fn()} onCancel={vi.fn()} />
        </I18nProvider>,
      )

      expect(screen.getByRole('textbox', { name: label })).toBeInTheDocument()
    })
  })

  it('renders no text field without confirmText', () => {
    render(<ConfirmDialog open title="Delete?" message="m" onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    expect(document.querySelector('[data-slot="confirm-dialog"]')).not.toHaveAttribute('data-confirm-by-name')
  })
})
