import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './badge'
import { DataTable, type DataTableColumn } from './data-table'

interface Member {
  id: string
  name: string
  email: string
  status: string
}

const members: Member[] = [
  { id: '1', name: 'Maria Puig', email: 'maria@example.com', status: 'active' },
  { id: '2', name: 'Jordi Vila', email: 'jordi@example.com', status: 'paused' },
  { id: '3', name: 'Anna Soler', email: 'anna@example.com', status: 'active' },
]

const columns: DataTableColumn<Member>[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <Badge variant={value === 'active' ? 'primary' : 'secondary'}>{String(value)}</Badge>,
  },
]

const meta = {
  title: 'Components/DataTable',
  component: DataTable<Member>,
  tags: ['autodocs'],
  args: { columns, data: members, keyField: 'id', 'aria-label': 'Members' },
} satisfies Meta<typeof DataTable<Member>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { data: [] } }
