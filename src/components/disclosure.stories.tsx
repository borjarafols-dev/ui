import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { Key } from 'react-aria-components'

import { Badge } from './badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Checkbox } from './checkbox'
import { Disclosure, DisclosureGroup } from './disclosure'
import { TextField } from './text-field'

const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
  args: { title: 'Advanced settings', children: null },
} satisfies Meta<typeof Disclosure>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Disclosure title="Advanced settings" className="w-96">
      <div className="grid gap-3">
        <TextField label="Request timeout (seconds)" defaultValue="30" />
        <Checkbox label="Retry failed requests" />
      </div>
    </Disclosure>
  ),
}

export const DefaultExpanded: Story = {
  render: () => (
    <Disclosure title="Details" defaultExpanded className="w-96">
      Created 2 days ago. Last updated an hour ago.
    </Disclosure>
  ),
}

export const Controlled: Story = {
  render: function Render() {
    const [isExpanded, setExpanded] = useState(false)
    return (
      <div className="grid w-96 gap-2">
        <Disclosure title="Tool call details" isExpanded={isExpanded} onExpandedChange={setExpanded}>
          Called search with 3 arguments in 120 ms.
        </Disclosure>
        <p className="text-sm text-muted-foreground">isExpanded: {String(isExpanded)}</p>
      </div>
    )
  },
}

export const Disabled: Story = {
  render: () => (
    <Disclosure title="Billing history" isDisabled className="w-96">
      No invoices yet.
    </Disclosure>
  ),
}

export const Accordion: Story = {
  render: () => (
    <DisclosureGroup defaultExpandedKeys={['general']} className="w-96">
      <Disclosure id="general" title="General">
        Name, description and owner.
      </Disclosure>
      <Disclosure id="members" title="Members">
        Who can see and edit this project.
      </Disclosure>
      <Disclosure id="notifications" title="Notifications">
        What we email you about.
      </Disclosure>
    </DisclosureGroup>
  ),
}

export const AccordionMultiple: Story = {
  render: function Render() {
    const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set(['summary']))
    return (
      <div className="grid w-96 gap-2">
        <DisclosureGroup allowsMultipleExpanded expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
          <Disclosure id="summary" title="Summary">
            Three checks passed, one needs review.
          </Disclosure>
          <Disclosure id="inputs" title="Inputs">
            Two files and one URL.
          </Disclosure>
          <Disclosure id="outputs" title="Outputs">
            One report.
          </Disclosure>
        </DisclosureGroup>
        <p className="text-sm text-muted-foreground">Open: {[...expandedKeys].join(', ') || 'none'}</p>
      </div>
    )
  },
}

const evidence = `{
  "check": "response-time",
  "threshold_ms": 500,
  "samples": [312, 287, 640, 301],
  "result": "needs-review"
}`

export const ShowEvidence: Story = {
  name: 'Show evidence',
  render: () => (
    <Card className="w-[28rem]">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Response time</CardTitle>
          <Badge variant="warning">Needs review</Badge>
        </div>
        <CardDescription>One of four samples went over the 500 ms threshold.</CardDescription>
      </CardHeader>
      <CardContent>
        <Disclosure title="Show evidence" level={4}>
          <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs">{evidence}</pre>
        </Disclosure>
      </CardContent>
    </Card>
  ),
}
