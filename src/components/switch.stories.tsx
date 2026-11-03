import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Switch } from './switch'

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: { size: { control: 'select', options: ['sm', 'md'] } },
  args: { children: 'Email notifications', size: 'md' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {}

export const DefaultSelected: Story = { args: { defaultSelected: true } }

export const Small: Story = { args: { size: 'sm' } }

export const Disabled: Story = { args: { isDisabled: true } }

export const ReadOnly: Story = { args: { isReadOnly: true, defaultSelected: true } }

export const WithDescription: Story = {
  args: { description: 'Sent when a scheduled run fails.' },
}

export const NoVisibleLabel: Story = {
  args: { children: undefined, 'aria-label': 'Provider enabled', defaultSelected: true },
}

const initialSettings = [
  { id: 'notifications', label: 'Email notifications', description: 'Sent when a scheduled run fails.', enabled: true },
  { id: 'digest', label: 'Weekly digest', description: 'A summary of activity every Monday.', enabled: false },
  { id: 'beta', label: 'Beta features', description: 'Try features before they are released.', enabled: false },
]

function SettingsList() {
  const [settings, setSettings] = useState(initialSettings)
  const [pending, setPending] = useState<string | null>(null)

  const update = (id: string, enabled: boolean) => {
    setPending(id)
    setTimeout(() => {
      setSettings((current) => current.map((s) => (s.id === id ? { ...s, enabled } : s)))
      setPending(null)
    }, 1500)
  }

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Changes apply at once.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {settings.map((s) => (
          <Switch
            key={s.id}
            description={pending === s.id ? 'Saving…' : s.description}
            isSelected={pending === s.id ? !s.enabled : s.enabled}
            isDisabled={pending === s.id}
            onChange={(enabled) => update(s.id, enabled)}
          >
            {s.label}
          </Switch>
        ))}
      </CardContent>
    </Card>
  )
}

export const SettingsListWithPending: Story = { render: () => <SettingsList /> }
