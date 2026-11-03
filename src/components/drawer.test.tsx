import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogTrigger, I18nProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'
import { Drawer, type DrawerProps } from './drawer'

function renderWithTrigger(props: Partial<DrawerProps> = {}) {
  return render(
    <DialogTrigger>
      <Button>Edit</Button>
      <Drawer title="Edit project" {...props}>
        {props.children ?? <input aria-label="Name" />}
      </Drawer>
    </DialogTrigger>,
  )
}

describe('Drawer', () => {
  it('opens a dialog named by the title with focus inside', async () => {
    const user = userEvent.setup()
    renderWithTrigger()

    await user.click(screen.getByRole('button', { name: 'Edit' }))

    const dialog = screen.getByRole('dialog', { name: 'Edit project' })
    expect(dialog).toContainElement(document.activeElement as HTMLElement)
  })

  it('closes on Escape, returns focus to the trigger and calls onOpenChange(false)', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderWithTrigger({ onOpenChange })

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Edit' })).toHaveFocus())
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('is controlled by isOpen and reports onOpenChange', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { rerender } = render(
      <Drawer isOpen={false} onOpenChange={onOpenChange} title="Edit project">
        body
      </Drawer>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(
      <Drawer isOpen onOpenChange={onOpenChange} title="Edit project">
        body
      </Drawer>,
    )
    await user.keyboard('{Escape}')

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(screen.getByRole('dialog', { name: 'Edit project' })).toBeInTheDocument()
  })

  it('has a localised close button that closes the drawer', async () => {
    const user = userEvent.setup()
    render(
      <I18nProvider locale="es-ES">
        <DialogTrigger>
          <Button>Edit</Button>
          <Drawer title="Edit project">body</Drawer>
        </DialogTrigger>
      </I18nProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('takes a custom close label', async () => {
    const user = userEvent.setup()
    renderWithTrigger({ closeLabel: 'Hide panel' })

    await user.click(screen.getByRole('button', { name: 'Edit' }))

    expect(screen.getByRole('button', { name: 'Hide panel' })).toBeInTheDocument()
  })

  it('closes on an overlay click by default', async () => {
    const user = userEvent.setup()
    renderWithTrigger()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const overlay = screen.getByRole('dialog').parentElement!.parentElement!
    fireEvent.pointerDown(overlay)
    fireEvent.pointerUp(overlay)
    fireEvent.click(overlay)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('with isDismissable={false}, ignores an overlay click but closes on Escape', async () => {
    const user = userEvent.setup()
    renderWithTrigger({ isDismissable: false })

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    const overlay = screen.getByRole('dialog').parentElement!.parentElement!
    fireEvent.pointerDown(overlay)
    fireEvent.pointerUp(overlay)
    fireEvent.click(overlay)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('uses aria-label without a title and renders the footer', () => {
    render(
      <Drawer isOpen aria-label="Payload" footer={<Button>Save</Button>}>
        body
      </Drawer>,
    )

    expect(screen.getByRole('dialog', { name: 'Payload' })).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('passes close to function children', async () => {
    const user = userEvent.setup()
    renderWithTrigger({ children: ({ close }) => <Button onPress={close}>Done</Button> })

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    await user.click(screen.getByRole('button', { name: 'Done' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
