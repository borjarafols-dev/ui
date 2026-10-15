import type { Meta, StoryObj } from '@storybook/react-vite'

import { NumberField } from './number-field'

const meta = {
  title: 'Components/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  args: { label: 'Seats', defaultValue: 3, minValue: 1 },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Year: Story = { args: { label: 'Year', defaultValue: 2026, formatOptions: { useGrouping: false } } }
export const WithError: Story = { args: { error: 'At least one seat is required.' } }
