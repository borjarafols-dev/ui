import type { Meta, StoryObj } from '@storybook/react-vite'

import { Badge } from './badge'

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'destructive', 'success', 'warning', 'info'],
    },
  },
  args: { variant: 'primary', children: 'Badge' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
}

export const StatusVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge variant="success">Operational</Badge>
      <Badge variant="warning">Degraded</Badge>
      <Badge variant="info">Maintenance</Badge>
      <Badge variant="destructive">Failed</Badge>
    </div>
  ),
}

const services = [
  { name: 'API gateway', status: 'Operational', variant: 'success' },
  { name: 'Background jobs', status: 'Degraded', variant: 'warning' },
  { name: 'Search index', status: 'Maintenance', variant: 'info' },
  { name: 'Email delivery', status: 'Failed', variant: 'destructive' },
  { name: 'File storage', status: 'Operational', variant: 'success' },
] as const

export const ServiceStatusList: Story = {
  render: () => (
    <ul className="flex w-80 flex-col divide-y divide-border rounded-md border border-border">
      {services.map((service) => (
        <li key={service.name} className="flex items-center justify-between px-3 py-2 text-sm text-foreground">
          {service.name}
          <Badge variant={service.variant}>{service.status}</Badge>
        </li>
      ))}
    </ul>
  ),
}
