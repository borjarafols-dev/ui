import type { Meta, StoryObj } from '@storybook/react-vite'

import { SearchField } from './search-field'

const meta = {
  title: 'Components/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  args: { label: 'Search members', placeholder: 'Name or email' },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof SearchField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: 'maria' } }
