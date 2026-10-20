import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button'
import { TextField } from './text-field'
import { ToastRegion, toasts } from './toast'

const meta = {
  title: 'Components/Toast',
  component: ToastRegion,
  tags: ['autodocs'],
} satisfies Meta<typeof ToastRegion>

export default meta
type Story = StoryObj<typeof meta>

export const SuccessToast: Story = {
  render: (args) => (
    <>
      <Button onPress={() => toasts.success('Profile saved')}>Show success</Button>
      <ToastRegion {...args} />
    </>
  ),
}

export const ErrorToast: Story = {
  render: (args) => (
    <>
      <Button
        variant="destructive"
        onPress={() => toasts.error('Could not save the profile', { description: 'Check your connection and try again.' })}
      >
        Show error
      </Button>
      <ToastRegion {...args} />
    </>
  ),
}

export const Stacked: Story = {
  render: (args) => (
    <>
      <Button
        variant="secondary"
        onPress={() => {
          toasts.success('Invoice sent')
          toasts.error('Could not attach the receipt', { description: 'The file is larger than 10 MB.' })
          toasts.success('Draft saved', { timeout: 10000 })
        }}
      >
        Show several
      </Button>
      <ToastRegion {...args} />
    </>
  ),
}

export const InAForm: Story = {
  render: (args) => (
    <>
      <form
        className="grid max-w-sm gap-4"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          const name = new FormData(event.currentTarget).get('name')
          if (name) toasts.success('Profile saved')
          else toasts.error('Could not save the profile', { description: 'The name is required.' })
        }}
      >
        <TextField label="Name" name="name" defaultValue="Maria" />
        <div className="flex justify-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
      <ToastRegion {...args} />
    </>
  ),
}
