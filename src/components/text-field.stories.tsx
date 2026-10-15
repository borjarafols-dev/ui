import type { Meta, StoryObj } from '@storybook/react-vite'

import { TextField } from './text-field'

const meta = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Email', placeholder: 'you@example.com' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof TextField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithDescription: Story = { args: { description: 'We never share your email.' } }
export const WithError: Story = { args: { error: 'Enter a valid email address.' } }
export const Disabled: Story = { args: { isDisabled: true } }
