import type { Meta, StoryObj } from '@storybook/react-vite'

import { button } from '../recipes/button'
import { Badge } from './badge'
import { DataTable, type DataTableColumn } from './data-table'
import { Link } from './link'

const meta = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  argTypes: { variant: { control: 'select', options: ['inline', 'plain', 'muted'] } },
  args: { href: '#', children: 'Project settings', variant: 'inline' },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Inline: Story = {
  render: (args) => (
    <p className="max-w-prose text-sm text-foreground">
      Members can change notifications in <Link {...args} />. Owners also see billing there.
    </p>
  ),
}

export const Plain: Story = { args: { variant: 'plain' } }

export const Muted: Story = { args: { variant: 'muted', children: 'Privacy policy' } }

export const External: Story = {
  args: { href: 'https://react-spectrum.adobe.com/react-aria/Link.html', isExternal: true, children: 'React Aria docs' },
}

export const Disabled: Story = { args: { isDisabled: true } }

export const AsButton: Story = {
  args: { children: 'New project', className: button({ variant: 'primary' }) },
}

interface Issue {
  id: string
  project: string
  key: string
  url: string
  status: string
}

const issues: Issue[] = [
  { id: '42', project: 'Apollo', key: 'ENG-128', url: 'https://example.com/issues/ENG-128', status: 'open' },
  { id: '43', project: 'Gemini', key: 'ENG-131', url: 'https://example.com/issues/ENG-131', status: 'closed' },
]

const columns: DataTableColumn<Issue>[] = [
  {
    key: 'project',
    header: 'Project',
    render: (value, row) => <Link href={`#/projects/${row.id}`} variant="plain">{String(value)}</Link>,
  },
  {
    key: 'key',
    header: 'Issue',
    render: (value, row) => <Link href={row.url} isExternal>{String(value)}</Link>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (value) => <Badge variant={value === 'open' ? 'primary' : 'secondary'}>{String(value)}</Badge>,
  },
]

export const InTable: Story = {
  render: () => <DataTable columns={columns} data={issues} keyField="id" aria-label="Issues" />,
}
