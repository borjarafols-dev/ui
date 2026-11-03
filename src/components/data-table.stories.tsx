import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'

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

export const Compact: Story = { args: { density: 'compact' } }

export const ComfortableVsCompact: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-6">
      <DataTable {...args} aria-label="Members, comfortable" density="comfortable" />
      <DataTable {...args} aria-label="Members, compact" density="compact" />
    </div>
  ),
}

/** A row arrives at the top every two seconds; hover or focus the table to hold them behind the "Show n new rows" button. */
export const LiveInsert: Story = {
  args: { density: 'compact', holdNewRows: true },
  render: (args) => {
    const [rows, setRows] = useState(members)
    useEffect(() => {
      const interval = setInterval(() => {
        setRows((current) => {
          const id = String(current.length + 1)
          return [{ id, name: `Member ${id}`, email: `member${id}@example.com`, status: 'active' }, ...current]
        })
      }, 2000)
      return () => clearInterval(interval)
    }, [])
    return <DataTable {...args} data={rows} />
  },
}
