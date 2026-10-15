import type { Meta, StoryObj } from '@storybook/react-vite'

import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  tags: ['autodocs'],
  args: {
    type: 'email',
    placeholder: 'you@example.com',
    disabled: false,
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="input-story-email">Email</Label>
      <Input id="input-story-email" {...args} />
    </div>
  ),
}

export const WithLabelAndHint: Story = {
  name: 'With label and hint',
  args: { type: 'text', placeholder: 'Acme Inc.' },
  render: (args) => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="input-story-company">Company</Label>
      <Input id="input-story-company" aria-describedby="input-story-company-hint" {...args} />
      <p id="input-story-company-hint" className="text-xs text-muted-foreground">
        This is how your organization will appear on invoices.
      </p>
    </div>
  ),
}

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="input-story-disabled">Email</Label>
      <Input id="input-story-disabled" {...args} />
    </div>
  ),
}
