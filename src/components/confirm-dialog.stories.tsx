import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from './button'
import { ConfirmDialog } from './confirm-dialog'

const meta = {
  title: 'Components/ConfirmDialog',
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
