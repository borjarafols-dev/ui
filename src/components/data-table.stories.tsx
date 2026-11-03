import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Badge } from './badge'
import {
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnVisibility,
  type DataTablePagination,
  type DataTableSorting,
} from './data-table'

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

const firstNames = ['Maria', 'Jordi', 'Anna', 'Pau', 'Laia', 'Marc', 'Núria', 'Oriol']
const lastNames = ['Puig', 'Vila', 'Soler', 'Ferrer', 'Roca', 'Serra']

const roster: Member[] = Array.from({ length: 48 }, (_, index) => {
  const first = firstNames[index % firstNames.length]!
  const last = lastNames[index % lastNames.length]!
  return {
    id: String(index + 1),
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${index + 1}@example.com`,
    status: index % 3 === 0 ? 'paused' : 'active',
  }
})

const column = createDataTableColumnHelper<Member>()

const columns = column.columns([
  column.accessor('name', { header: 'Name', enableHiding: false }),
  column.accessor('email', { header: 'Email' }),
  column.accessor('status', {
    header: 'Status',
    enableSorting: false,
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

/** `mode="client"`: the table sorts, searches and pages all 48 members itself. */
export const SearchAndPaging: Story = {
  args: { data: roster, enableSearch: true, enablePagination: true, pageSizeOptions: [5, 10, 25] },
}

/** Stands in for an API: sorts, searches and pages the roster the way a server would. */
function fetchPage(sorting: DataTableSorting, search: string, { pageIndex, pageSize }: DataTablePagination) {
  const query = search.toLowerCase()
  const matching = roster.filter((member) => `${member.name} ${member.email}`.toLowerCase().includes(query))
  const [sort] = sorting
  if (sort) {
    const key = sort.id as keyof Member
    matching.sort((a, b) => a[key].localeCompare(b[key]) * (sort.desc ? -1 : 1))
  }
  return { rows: matching.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), total: matching.length }
}

/**
 * `mode="server"`: the app holds every state slice (here in React state; in an
 * app, often the URL), fetches the page and passes it with `rowCount`.
 */
export const ServerMode: Story = {
  render: (args) => {
    const [sorting, setSorting] = useState<DataTableSorting>([])
    const [search, setSearch] = useState('')
    const [pagination, setPagination] = useState<DataTablePagination>({ pageIndex: 0, pageSize: 10 })
    const page = fetchPage(sorting, search, pagination)
    return (
      <DataTable
        {...args}
        mode="server"
        data={page.rows}
        rowCount={page.total}
        enableSearch
        enablePagination
        sorting={sorting}
        onSortingChange={setSorting}
        globalFilter={search}
        onGlobalFilterChange={setSearch}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    )
  },
}

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
