import type { Meta, StoryObj } from '@storybook/react-vite'

import { Select } from './select'

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Membership',
    placeholder: 'Choose a plan',
    options: [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly' },
      { value: 'family', label: 'Family', isDisabled: true },
    ],
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: 'Choose a plan to continue.' } }
