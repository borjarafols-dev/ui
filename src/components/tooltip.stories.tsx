import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button'
import { DataTable, type DataTableColumn } from './data-table'
import { Tooltip } from './tooltip'

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: { placement: { control: 'select', options: ['top', 'bottom', 'start', 'end'] } },
  args: {
    content: 'Copy link',
    children: (
      <Button aria-label="Copy link" variant="ghost" size="sm">
        ⧉
      </Button>
    ),
  },
  decorators: [(Story) => <div className="p-16">{Story()}</div>],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const OnIconButton: Story = {}

export const OnText: Story = {
  render: () => (
    <p className="text-sm">
      Started{' '}
      <Tooltip content="2026-11-03 14:02" isTextTrigger>
        <time dateTime="2026-11-03T14:02">3m ago</time>
      </Tooltip>
    </p>
  ),
}

export const Placements: Story = {
  render: () => (
    <div className="flex gap-4">
      {(['top', 'bottom', 'start', 'end'] as const).map((placement) => (
        <Tooltip key={placement} content={`Placed ${placement}`} placement={placement}>
          <Button variant="outline" size="sm">
            {placement}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
}

export const FocusOnly: Story = {
  args: {
    content: 'Shown on keyboard focus only',
    trigger: 'focus',
    children: <Button variant="outline">Tab to me</Button>,
  },
}

export const LongText: Story = {
  args: {
    content:
      'Archived runs are kept for 30 days and then deleted. Restore one before then to keep its logs and artifacts.',
    children: <Button variant="outline">Archive</Button>,
  },
}

interface Run {
  id: string
  name: string
  rows: number
  startedAt: string
  startedAgo: string
}

const runs: Run[] = [
  { id: '1', name: 'Nightly import', rows: 1214, startedAt: '2026-11-03 14:02', startedAgo: '3m ago' },
  { id: '2', name: 'Weekly report', rows: 86_430, startedAt: '2026-11-03 09:15', startedAgo: '5h ago' },
  { id: '3', name: 'Backfill', rows: 412, startedAt: '2026-11-02 18:40', startedAgo: '20h ago' },
]

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const exact = new Intl.NumberFormat('en')

const columns: DataTableColumn<Run>[] = [
  { key: 'name', header: 'Run' },
  {
    key: 'rows',
    header: 'Rows',
    render: (value) => (
      <Tooltip content={exact.format(Number(value))} isTextTrigger>
        <span>{compact.format(Number(value))}</span>
      </Tooltip>
    ),
  },
  {
    key: 'startedAgo',
    header: 'Started',
    render: (value, row) => (
      <Tooltip content={row.startedAt} isTextTrigger>
        <time dateTime={row.startedAt.replace(' ', 'T')}>{String(value)}</time>
      </Tooltip>
    ),
  },
]

export const TableRow: Story = {
  render: () => <DataTable aria-label="Runs" columns={columns} data={runs} keyField="id" />,
}
