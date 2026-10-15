import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from './button'
import { Modal } from './modal'
import { TextField } from './text-field'

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: { open: false, onClose: () => {}, title: 'Edit profile', children: null },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onPress={() => setOpen(true)}>Edit profile</Button>
        <Modal {...args} open={open} onClose={() => setOpen(false)}>
          <div className="grid gap-4">
            <TextField label="Name" defaultValue="Maria" />
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onPress={() => setOpen(false)}>Cancel</Button>
              <Button onPress={() => setOpen(false)}>Save</Button>
            </div>
          </div>
        </Modal>
      </>
    )
  },
}
