import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { RouterProvider, type Key } from 'react-aria-components'

import { Badge } from '../atoms/badge'
import { Button } from '../atoms/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Checkbox } from '../atoms/checkbox'
import { Tab, TabList, TabPanel, Tabs } from './tabs'
import { TextField } from './text-field'

const meta = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Tabs className="w-96">
      <TabList aria-label="Review">
        <Tab id="queue">Queue</Tab>
        <Tab id="history">History</Tab>
      </TabList>
      <TabPanel id="queue" className="text-sm">
        3 items waiting for review.
      </TabPanel>
      <TabPanel id="history" className="text-sm">
        12 items reviewed this week.
      </TabPanel>
    </Tabs>
  ),
}

export const Controlled: Story = {
  render: function Render() {
    const [tab, setTab] = useState<Key>('activity')
    return (
      <div className="grid w-96 gap-4">
        <Tabs selectedKey={tab} onSelectionChange={setTab}>
          <TabList aria-label="Project">
            <Tab id="overview">Overview</Tab>
            <Tab id="activity">Activity</Tab>
          </TabList>
          <TabPanel id="overview" className="text-sm">
            Project summary.
          </TabPanel>
          <TabPanel id="activity" className="text-sm">
            Recent changes.
          </TabPanel>
        </Tabs>
        <p className="text-sm text-muted-foreground">?tab={String(tab)}</p>
      </div>
    )
  },
}

export const DisabledTab: Story = {
  render: () => (
    <Tabs className="w-96">
      <TabList aria-label="Project">
        <Tab id="overview">Overview</Tab>
        <Tab id="deployments" isDisabled>
          Deployments
        </Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <TabPanel id="overview" className="text-sm">
        Project overview.
      </TabPanel>
      <TabPanel id="deployments" className="text-sm">
        Deployments.
      </TabPanel>
      <TabPanel id="settings" className="text-sm">
        Project settings.
      </TabPanel>
    </Tabs>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Tabs orientation="vertical" className="w-[28rem]">
      <TabList aria-label="Account">
        <Tab id="profile">Profile</Tab>
        <Tab id="security">Security</Tab>
        <Tab id="notifications">Notifications</Tab>
      </TabList>
      <TabPanel id="profile" className="text-sm">
        Your name and email.
      </TabPanel>
      <TabPanel id="security" className="text-sm">
        Password and sessions.
      </TabPanel>
      <TabPanel id="notifications" className="text-sm">
        What we email you about.
      </TabPanel>
    </Tabs>
  ),
}

export const WithLinks: Story = {
  render: function Render() {
    const [path, setPath] = useState('/queue')
    return (
      <RouterProvider navigate={setPath}>
        <Tabs selectedKey={path} className="w-96">
          <TabList aria-label="Review">
            <Tab id="/queue" href="/queue">
              Queue
            </Tab>
            <Tab id="/history" href="/history">
              History
            </Tab>
          </TabList>
          <TabPanel id="/queue" className="text-sm">
            Route /queue.
          </TabPanel>
          <TabPanel id="/history" className="text-sm">
            Route /history.
          </TabPanel>
        </Tabs>
      </RouterProvider>
    )
  },
}

export const SettingsPage: Story = {
  render: () => (
    <div className="grid w-[36rem] gap-6">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <Tabs>
        <TabList aria-label="Settings">
          <Tab id="general">General</Tab>
          <Tab id="members">Members</Tab>
          <Tab id="billing">Billing</Tab>
        </TabList>
        <TabPanel id="general">
          <Card>
            <CardHeader>
              <CardTitle>Workspace</CardTitle>
              <CardDescription>Shown to everyone in the workspace.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <TextField label="Name" defaultValue="Acme" />
              <Checkbox label="Allow members to invite others" defaultSelected />
            </CardContent>
            <CardFooter className="justify-end">
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </TabPanel>
        <TabPanel id="members">
          <Card>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Ada Lovelace</span>
                <Badge>Owner</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Alan Turing</span>
                <Badge variant="secondary">Member</Badge>
              </div>
            </CardContent>
          </Card>
        </TabPanel>
        <TabPanel id="billing">
          <Card>
            <CardHeader>
              <CardTitle>Plan</CardTitle>
              <CardDescription>Your next invoice is due on 1 December.</CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
              <Button variant="secondary">Change plan</Button>
            </CardFooter>
          </Card>
        </TabPanel>
      </Tabs>
    </div>
  ),
}
