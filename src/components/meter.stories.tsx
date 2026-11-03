import type { Meta, StoryObj } from '@storybook/react-vite'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Meter } from './meter'

const meta = {
  title: 'Components/Meter',
  component: Meter,
  tags: ['autodocs'],
  argTypes: { size: { control: 'select', options: ['sm', 'md'] } },
  args: { label: 'Storage', value: 40, size: 'md' },
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof Meter>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const WithThresholds: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Meter label="Seats" value={42} warningAt={80} destructiveAt={95} />
      <Meter label="API calls" value={84} warningAt={80} destructiveAt={95} valueLabel="84%, near limit" />
      <Meter label="Build minutes" value={97} warningAt={80} destructiveAt={95} valueLabel="97%, at limit" />
    </div>
  ),
}

export const CustomValueLabel: Story = {
  args: { label: 'Storage', value: 3.2, maxValue: 5, valueLabel: '3.2 of 5 GB' },
}

export const NoVisibleLabel: Story = {
  args: { label: undefined, 'aria-label': 'Storage used', value: 65, showValue: false },
}

const limits = [
  { label: '5-hour limit', used: 38, limit: 50, reset: 'Resets in 2 h 14 min' },
  { label: 'Weekly limit', used: 410, limit: 500, reset: 'Resets Monday 09:00' },
  { label: 'Monthly budget', used: 96, limit: 100, reset: 'Resets on the 1st' },
]

export const QuotaCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Turns amber at 80% and red at 95% of each limit.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {limits.map(({ label, used, limit, reset }) => {
          const note = used >= limit * 0.95 ? ', at limit' : used >= limit * 0.8 ? ', near limit' : ''
          return (
            <div key={label} className="flex flex-col gap-1">
              <Meter
                label={label}
                value={used}
                maxValue={limit}
                warningAt={limit * 0.8}
                destructiveAt={limit * 0.95}
                size="sm"
                valueLabel={`${used} of ${limit}${note}`}
              />
              <p className="text-xs text-muted-foreground">{reset}</p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  ),
}
