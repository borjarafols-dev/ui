import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { RouterProvider } from 'react-aria-components'

import { Badge } from './badge'
import {
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnVisibility,
  type DataTableExpanded,
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

interface Job {
  id: string
  name: string
  status: 'succeeded' | 'running' | 'failed' | 'queued'
  duration: string
  steps?: Job[]
}

const jobs: Job[] = [
  {
    id: 'job-1',
    name: 'Nightly import',
    status: 'running',
    duration: '4m 12s',
    steps: [
      { id: 'job-1-fetch', name: 'Fetch sources', status: 'succeeded', duration: '1m 03s' },
      { id: 'job-1-parse', name: 'Parse records', status: 'running', duration: '3m 09s' },
      { id: 'job-1-index', name: 'Rebuild index', status: 'queued', duration: '—' },
    ],
  },
  {
    id: 'job-2',
    name: 'Weekly report',
    status: 'failed',
    duration: '58s',
    steps: [
      { id: 'job-2-query', name: 'Query totals', status: 'succeeded', duration: '41s' },
      { id: 'job-2-render', name: 'Render PDF', status: 'failed', duration: '17s' },
    ],
  },
  { id: 'job-3', name: 'Cache warm-up', status: 'succeeded', duration: '12s' },
]

const statusVariant = { succeeded: 'primary', running: 'secondary', failed: 'destructive', queued: 'outline' } as const

const jobColumn = createDataTableColumnHelper<Job>()

const jobColumns = jobColumn.columns([
  jobColumn.accessor('name', { header: 'Job', enableHiding: false }),
  jobColumn.accessor('status', {
    header: 'Status',
    cell: (info) => <Badge variant={statusVariant[info.getValue()]}>{info.getValue()}</Badge>,
  }),
  jobColumn.accessor('duration', { header: 'Duration' }),
])

const jobArgs = {
  'aria-label': 'Jobs',
  columns: jobColumns,
  data: jobs,
  getRowId: (job: Job) => job.id,
  getSubRows: (job: Job) => job.steps,
}

/** Parent rows expand to their steps with the chevron, or Arrow Right and Arrow Left. */
export const NestedRows: Story = {
  render: () => <DataTable {...jobArgs} />,
}

/** Starts with the first job expanded; the expanded rows are shown below the table. */
export const NestedRowsControlled: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<DataTableExpanded>({ 'job-1': true })
    return (
      <div className="flex flex-col gap-2">
        <DataTable {...jobArgs} expanded={expanded} onExpandedChange={setExpanded} />
        <p className="text-sm text-muted-foreground">Expanded: {JSON.stringify(expanded)}</p>
      </div>
    )
  },
}

/** A compact job list with nested steps and status badges, as on an operational screen. */
export const JobList: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<DataTableExpanded>({ 'job-1': true, 'job-2': true })
    return <DataTable {...jobArgs} density="compact" expanded={expanded} onExpandedChange={setExpanded} />
  },
}

/**
 * The whole row opens the member. The `RouterProvider` stands in for the app's
 * router and logs each navigation; Jordi's row returns no href, so it doesn't link.
 */
export const RowLinks: Story = {
  args: { getRowHref: (member) => (member.status === 'paused' ? undefined : `/members/${member.id}`) },
  render: (args) => {
    const [visited, setVisited] = useState<string[]>([])
    return (
      <RouterProvider navigate={(href) => setVisited((previous) => [...previous, href])}>
        <div className="flex flex-col gap-3">
          <DataTable {...args} />
          <output className="text-sm text-muted-foreground">Navigated to: {visited.join(', ') || 'nothing yet'}</output>
        </div>
      </RouterProvider>
    )
  },
}
