import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Button } from '../atoms/button'
import { TextField } from './text-field'
import { ToastRegion, toasts } from './toast'

const meta = {
  title: 'Molecules/Toast',
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

export const InfoToast: Story = {
  render: (args) => (
    <>
      <Button variant="secondary" onPress={() => toasts.info('A new version is available')}>
        Show info
      </Button>
      <ToastRegion {...args} />
    </>
  ),
}

export const WarningToast: Story = {
  render: (args) => (
    <>
      <Button
        variant="secondary"
        onPress={() => toasts.warning('Storage almost full', { description: 'You have used 90% of your space.' })}
      >
        Show warning
      </Button>
      <ToastRegion {...args} />
    </>
  ),
}

function UndoList() {
  const [items, setItems] = useState(['Quarterly report', 'Team photo', 'Meeting notes'])
  const remove = (item: string) => {
    const index = items.indexOf(item)
    setItems((current) => current.filter((other) => other !== item))
    toasts.success('Item deleted', {
      description: item,
      action: {
        label: 'Undo',
        onAction: () =>
          setItems((current) => (current.includes(item) ? current : [...current.slice(0, index), item, ...current.slice(index)])),
      },
    })
  }
  return (
    <ul className="grid max-w-sm gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-center justify-between gap-4">
          <span>{item}</span>
          <Button variant="destructive" size="sm" onPress={() => remove(item)}>
            Delete
          </Button>
        </li>
      ))}
    </ul>
  )
}

export const WithUndo: Story = {
  render: (args) => (
    <>
      <UndoList />
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
          toasts.info('A new version is available')
          toasts.warning('Storage almost full')
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
