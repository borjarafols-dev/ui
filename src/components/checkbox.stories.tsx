import type { Meta, StoryObj } from '@storybook/react-vite'

import { Checkbox } from './checkbox'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Email me about updates' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Selected: Story = { args: { defaultSelected: true } }
export const Indeterminate: Story = { args: { isIndeterminate: true } }
export const Disabled: Story = { args: { isDisabled: true } }
