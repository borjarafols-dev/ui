import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button'
import { EmptyState } from './empty-state'

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: { title: 'No members yet', description: 'Invite your first member to get started.' },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithAction: Story = { args: { action: <Button>Invite member</Button> } }
