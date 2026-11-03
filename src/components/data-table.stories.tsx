import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Badge } from './badge'
import {
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnVisibility,
  type DataTableExpanded,
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
