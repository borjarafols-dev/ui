import type { Meta, StoryObj } from '@storybook/react-vite'

import { TextArea } from './text-area'

const meta = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  args: { label: 'Message', placeholder: 'How can we help?', rows: 4 },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithError: Story = { args: { error: 'Write at least 20 characters.' } }
