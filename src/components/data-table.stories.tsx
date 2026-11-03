import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Badge } from './badge'
import { createDataTableColumnHelper, DataTable, type DataTableColumnVisibility } from './data-table'

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

const column = createDataTableColumnHelper<Member>()

const columns = column.columns([
  column.accessor('name', { header: 'Name', enableHiding: false }),
  column.accessor('email', { header: 'Email' }),
  column.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <Badge variant={info.getValue() === 'active' ? 'primary' : 'secondary'}>{info.getValue()}</Badge>
    ),
  }),
])

const meta = {
  title: 'Components/DataTable',
  component: DataTable<Member>,
  tags: ['autodocs'],
  args: { columns, data: members, getRowId: (member) => member.id, 'aria-label': 'Members' },
} satisfies Meta<typeof DataTable<Member>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Empty: Story = { args: { data: [] } }

/** Starts with Email hidden; the Columns button lists Email and Status (Name can't hide). */
export const ControlledColumnVisibility: Story = {
  render: (args) => {
    const [columnVisibility, setColumnVisibility] = useState<DataTableColumnVisibility>({ email: false })
    return <DataTable {...args} columnVisibility={columnVisibility} onColumnVisibilityChange={setColumnVisibility} />
  },
}
