import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { Key } from 'react-aria-components'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { SegmentedControl, SegmentedControlItem } from './segmented-control'

const meta = {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  argTypes: { size: { control: 'select', options: ['sm', 'md'] } },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {
  render: (args) => (
    <SegmentedControl {...args} aria-label="Time range" defaultSelectedKeys={['7d']}>
      <SegmentedControlItem id="24h">24h</SegmentedControlItem>
      <SegmentedControlItem id="7d">7d</SegmentedControlItem>
      <SegmentedControlItem id="30d">30d</SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const Multiple: Story = {
  render: () => (
    <SegmentedControl aria-label="Kind" selectionMode="multiple" defaultSelectedKeys={['bug']}>
      <SegmentedControlItem id="bug">Bugs</SegmentedControlItem>
      <SegmentedControlItem id="feature">Features</SegmentedControlItem>
      <SegmentedControlItem id="chore">Chores</SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const Small: Story = {
  render: () => (
    <SegmentedControl aria-label="Time range" size="sm" defaultSelectedKeys={['24h']}>
      <SegmentedControlItem id="24h">24h</SegmentedControlItem>
      <SegmentedControlItem id="7d">7d</SegmentedControlItem>
      <SegmentedControlItem id="30d">30d</SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const Disabled: Story = {
  render: () => (
    <SegmentedControl aria-label="Time range" isDisabled defaultSelectedKeys={['7d']}>
      <SegmentedControlItem id="24h">24h</SegmentedControlItem>
      <SegmentedControlItem id="7d">7d</SegmentedControlItem>
      <SegmentedControlItem id="30d">30d</SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const DisabledItem: Story = {
  render: () => (
    <SegmentedControl aria-label="View" defaultSelectedKeys={['list']}>
      <SegmentedControlItem id="list">List</SegmentedControlItem>
      <SegmentedControlItem id="board" isDisabled>
        Board
      </SegmentedControlItem>
      <SegmentedControlItem id="grid">Grid</SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <SegmentedControl aria-label="View" defaultSelectedKeys={['list']}>
      <SegmentedControlItem id="list">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" />
        </svg>
        List
      </SegmentedControlItem>
      <SegmentedControlItem id="grid">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="2" y="2" width="5" height="5" rx="1" />
          <rect x="9" y="2" width="5" height="5" rx="1" />
          <rect x="2" y="9" width="5" height="5" rx="1" />
          <rect x="9" y="9" width="5" height="5" rx="1" />
        </svg>
        Grid
      </SegmentedControlItem>
    </SegmentedControl>
  ),
}

export const Controlled: Story = {
  render: function Render() {
    const [kind, setKind] = useState<Key>('all')
    return (
      <div className="grid gap-4">
        <SegmentedControl
          aria-label="Kind"
          selectedKeys={[kind]}
          onSelectionChange={(keys) => setKind([...keys][0] ?? 'all')}
        >
          <SegmentedControlItem id="all">All</SegmentedControlItem>
          <SegmentedControlItem id="bug">Bugs</SegmentedControlItem>
          <SegmentedControlItem id="feature">Features</SegmentedControlItem>
        </SegmentedControl>
        <p className="text-sm text-muted-foreground">?kind={String(kind)}</p>
      </div>
    )
  },
}

const ranges = {
  '24h': [4, 6, 3, 8, 5, 9, 7],
  '7d': [12, 18, 9, 22, 16, 25, 20],
  '30d': [48, 62, 55, 70, 66, 81, 74],
} as const
type Range = keyof typeof ranges

export const ChartRangePicker: Story = {
  render: function Render() {
    const [range, setRange] = useState<Range>('7d')
    const values = ranges[range]
    const max = Math.max(...values)
    return (
      <Card className="w-[28rem]">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="grid gap-1">
            <CardTitle>Deployments</CardTitle>
            <CardDescription>{values.reduce((sum, value) => sum + value, 0)} in this period</CardDescription>
          </div>
          <SegmentedControl
            aria-label="Time range"
            size="sm"
            selectedKeys={[range]}
            onSelectionChange={(keys) => setRange([...keys][0] as Range)}
          >
            <SegmentedControlItem id="24h">24h</SegmentedControlItem>
            <SegmentedControlItem id="7d">7d</SegmentedControlItem>
            <SegmentedControlItem id="30d">30d</SegmentedControlItem>
          </SegmentedControl>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-end gap-2" aria-hidden="true">
            {values.map((value, index) => (
              <div key={index} className="flex-1 rounded-sm bg-primary" style={{ height: `${(value / max) * 100}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  },
}
