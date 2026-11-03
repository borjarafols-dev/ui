import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { DialogTrigger } from 'react-aria-components'

import { Badge } from './badge'
import { Button } from './button'
import { createDataTableColumnHelper, DataTable } from './data-table'
import { Drawer } from './drawer'
import { TextArea } from './text-area'
import { TextField } from './text-field'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { title: 'Edit project', children: null },
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => (
    <DialogTrigger>
      <Button variant="outline">Edit</Button>
      <Drawer {...args}>
        <p className="text-sm text-muted-foreground">Project details go here.</p>
      </Drawer>
    </DialogTrigger>
  ),
}

export const Controlled: Story = {
  render: (args) => {
    const [isOpen, setOpen] = useState(false)
    return (
      <>
        <Button onPress={() => setOpen(true)}>Open drawer</Button>
        <p className="mt-2 text-sm text-muted-foreground">Open: {String(isOpen)}</p>
        <Drawer {...args} isOpen={isOpen} onOpenChange={setOpen}>
          <p className="text-sm text-muted-foreground">Escape, the close button or a backdrop click closes it.</p>
        </Drawer>
      </>
    )
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex gap-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <DialogTrigger key={size}>
          <Button variant="outline">Open {size}</Button>
          <Drawer {...args} size={size} title={`Size ${size}`}>
            <p className="text-sm text-muted-foreground">A {size} drawer.</p>
          </Drawer>
        </DialogTrigger>
      ))}
    </div>
  ),
}

export const WithForm: Story = {
  render: (args) => {
    const [isOpen, setOpen] = useState(false)
    return (
      <>
        <Button variant="outline" onPress={() => setOpen(true)}>
          Edit project
        </Button>
        <Drawer
          {...args}
          isOpen={isOpen}
          onOpenChange={setOpen}
          footer={
            <>
              <Button variant="secondary" onPress={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onPress={() => setOpen(false)}>Save</Button>
            </>
          }
        >
          <div className="grid gap-4">
            <TextField label="Name" defaultValue="Website redesign" />
            <TextField label="Owner" defaultValue="Maria Puig" />
            <TextArea label="Description" rows={4} defaultValue="New landing pages and a lighter checkout." />
          </div>
        </Drawer>
      </>
    )
  },
}

export const LongContent: Story = {
  args: { title: 'Activity' },
  render: (args) => (
    <DialogTrigger>
      <Button variant="outline">Show activity</Button>
      <Drawer {...args} footer={<Button slot="close">Done</Button>}>
        <ol className="grid gap-3 text-sm">
          {Array.from({ length: 60 }, (_, index) => (
            <li key={index}>Event {index + 1}: status changed</li>
          ))}
        </ol>
      </Drawer>
    </DialogTrigger>
  ),
}

export const NoTitle: Story = {
  args: { title: undefined, 'aria-label': 'Quick view' },
  render: (args) => (
    <DialogTrigger>
      <Button variant="outline">Quick view</Button>
      <Drawer {...args} size="sm">
        <p className="text-sm text-muted-foreground">No visible title; aria-label names the dialog.</p>
      </Drawer>
    </DialogTrigger>
  ),
}

interface Delivery {
  id: string
  event: string
  status: 'delivered' | 'failed'
  payload: Record<string, unknown>
}

const deliveries: Delivery[] = [
  {
    id: 'evt_1',
    event: 'order.created',
    status: 'delivered',
    payload: { id: 'ord_481', total: 129.9, currency: 'EUR', items: [{ sku: 'TS-01', quantity: 2 }] },
  },
  {
    id: 'evt_2',
    event: 'order.refunded',
    status: 'failed',
    payload: { id: 'ord_377', amount: 49.5, reason: 'damaged' },
  },
]

const column = createDataTableColumnHelper<Delivery>()

export const RowPayload: Story = {
  name: 'Row opens its payload',
  render: () => {
    const [selected, setSelected] = useState<Delivery | null>(null)
    const columns = column.columns([
      column.accessor('event', { header: 'Event' }),
      column.accessor('status', {
        header: 'Status',
        cell: (info) => (
          <Badge variant={info.getValue() === 'delivered' ? 'primary' : 'secondary'}>{info.getValue()}</Badge>
        ),
      }),
      column.display({
        id: 'payload',
        header: 'Payload',
        cell: (info) => (
          <Button variant="ghost" size="sm" onPress={() => setSelected(info.row.original)}>
            View payload
          </Button>
        ),
      }),
    ])
    return (
      <>
        <DataTable aria-label="Deliveries" columns={columns} data={deliveries} getRowId={(row) => row.id} />
        <Drawer
          isOpen={selected !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelected(null)
          }}
          title={selected?.event}
          size="lg"
        >
          <pre className="overflow-auto rounded-md bg-muted p-4 font-mono text-xs">
            {JSON.stringify(selected?.payload, null, 2)}
          </pre>
        </Drawer>
      </>
    )
  },
}
