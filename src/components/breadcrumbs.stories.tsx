import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { RouterProvider } from 'react-aria-components'

import { Badge } from './badge'
import { Breadcrumb, Breadcrumbs } from './breadcrumbs'
import { Button } from './button'

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <Breadcrumb href="#/projects">Projects</Breadcrumb>
      <Breadcrumb href="#/projects/acme">acme</Breadcrumb>
      <Breadcrumb>Settings</Breadcrumb>
    </Breadcrumbs>
  ),
}

/** A deep path in a narrow column wraps onto further lines instead of overflowing. */
export const Long: Story = {
  render: (args) => (
    <div className="w-64">
      <Breadcrumbs {...args}>
        <Breadcrumb href="#/workspaces">Workspaces</Breadcrumb>
        <Breadcrumb href="#/workspaces/research">Research and development</Breadcrumb>
        <Breadcrumb href="#/workspaces/research/projects">Projects</Breadcrumb>
        <Breadcrumb href="#/workspaces/research/projects/acme">acme-platform</Breadcrumb>
        <Breadcrumb href="#/workspaces/research/projects/acme/environments">Environments</Breadcrumb>
        <Breadcrumb>Production settings</Breadcrumb>
      </Breadcrumbs>
    </div>
  ),
}

/** The `RouterProvider` stands in for the app's router; following a crumb moves the trail up. */
export const WithRouter: Story = {
  render: function Render(args) {
    const [path, setPath] = useState('/projects/acme/settings')
    const trail = [
      { href: '/projects', label: 'Projects' },
      { href: '/projects/acme', label: 'acme' },
      { href: '/projects/acme/settings', label: 'Settings' },
    ]
    const visible = trail.slice(0, trail.findIndex((crumb) => crumb.href === path) + 1)
    return (
      <RouterProvider navigate={setPath}>
        <div className="flex flex-col gap-3">
          <Breadcrumbs {...args}>
            {visible.map((crumb, index) => (
              <Breadcrumb key={crumb.href} href={index < visible.length - 1 ? crumb.href : undefined}>
                {crumb.label}
              </Breadcrumb>
            ))}
          </Breadcrumbs>
          <output className="text-sm text-muted-foreground">Route: {path}</output>
          <Button variant="secondary" size="sm" className="self-start" onPress={() => setPath('/projects/acme/settings')}>
            Reset
          </Button>
        </div>
      </RouterProvider>
    )
  },
}

/** A record page header: the trail above the title, actions on the right. */
export const PageHeader: Story = {
  render: (args) => (
    <header className="flex w-[40rem] items-end justify-between gap-4 border-b border-border pb-4">
      <div className="flex flex-col gap-2">
        <Breadcrumbs {...args}>
          <Breadcrumb href="#/runs">Runs</Breadcrumb>
          <Breadcrumb href="#/runs/run-1042">run-1042</Breadcrumb>
          <Breadcrumb>Session</Breadcrumb>
        </Breadcrumbs>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-foreground">Session</h1>
          <Badge variant="secondary">Running</Badge>
        </div>
      </div>
      <Button variant="secondary">Stop session</Button>
    </header>
  ),
}
