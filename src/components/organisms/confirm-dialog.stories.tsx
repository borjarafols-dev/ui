import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { userEvent, within } from 'storybook/test'

import { Button } from '../atoms/button'
import { ConfirmDialog } from './confirm-dialog'

const meta = {
  title: 'Organisms/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  args: {
    open: false,
    title: 'Delete this member?',
    message: 'Their history stays, but they lose access right away.',
    confirmLabel: 'Delete',
    onConfirm: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="destructive" onPress={() => setOpen(true)}>Delete member</Button>
        <ConfirmDialog {...args} open={open} onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </>
    )
  },
}

export const Pending: Story = { args: { open: true, isPending: true } }

export const ConfirmByName: Story = {
  args: {
    title: 'Delete project acme?',
    message: 'Its 4 repositories stay on GitHub. Runs and history are deleted.',
    confirmLabel: 'Delete project',
    confirmText: 'acme',
  },
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button variant="destructive" onPress={() => setOpen(true)}>Delete project</Button>
        <ConfirmDialog {...args} open={open} onConfirm={() => setOpen(false)} onCancel={() => setOpen(false)} />
      </>
    )
  },
}

// Pending disables the field, so the story types the name and confirms, and the action never settles.
export const ConfirmByNamePending: Story = {
  args: { ...ConfirmByName.args, open: true },
  render: (args) => {
    const [pending, setPending] = useState(false)
    return <ConfirmDialog {...args} isPending={pending} onConfirm={() => setPending(true)} />
  },
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.type(await body.findByRole('textbox'), 'acme')
    await userEvent.click(body.getByRole('button', { name: 'Delete project' }))
  },
}
