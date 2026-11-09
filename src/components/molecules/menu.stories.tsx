import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { Selection } from 'react-aria-components'

import { Button } from '../atoms/button'
import { ConfirmDialog } from '../organisms/confirm-dialog'
import { Menu, MenuItem, MenuSection, MenuSeparator } from './menu'

const meta = {
  title: 'Molecules/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: { trigger: <Button variant="outline">Actions</Button> },
  decorators: [(Story) => <div className="flex h-72 items-start justify-center p-4">{Story()}</div>],
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: (args) => (
    <Menu {...args}>
      <MenuItem id="rename">Rename</MenuItem>
      <MenuItem id="duplicate">Duplicate</MenuItem>
      <MenuItem id="archive">Archive</MenuItem>
    </Menu>
  ),
}

export const WithSections: Story = {
  render: (args) => (
    <Menu {...args}>
      <MenuSection title="Edit">
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
      </MenuSection>
      <MenuSeparator />
      <MenuSection title="Share">
        <MenuItem id="copy-link">Copy link</MenuItem>
        <MenuItem id="export">Export</MenuItem>
      </MenuSection>
    </Menu>
  ),
}

export const WithShortcuts: Story = {
  render: (args) => (
    <Menu {...args}>
      <MenuItem id="rename" shortcut="R">Rename</MenuItem>
      <MenuItem id="duplicate" shortcut="⌘D">Duplicate</MenuItem>
      <MenuItem id="archive" shortcut="E">Archive</MenuItem>
    </Menu>
  ),
}

export const WithLinks: Story = {
  args: { trigger: <Button variant="ghost">Account</Button> },
  render: (args) => (
    <Menu {...args}>
      <MenuItem href="#profile">Profile</MenuItem>
      <MenuItem href="#settings">Settings</MenuItem>
      <MenuSeparator />
      <MenuItem id="sign-out">Sign out</MenuItem>
    </Menu>
  ),
}

export const Destructive: Story = {
  render: (args) => (
    <Menu {...args}>
      <MenuItem id="rename">Rename</MenuItem>
      <MenuItem id="duplicate">Duplicate</MenuItem>
      <MenuSeparator />
      <MenuItem id="delete" variant="destructive" shortcut="⌫">Delete</MenuItem>
    </Menu>
  ),
}

export const DisabledItems: Story = {
  render: (args) => (
    <Menu {...args} disabledKeys={['archive']}>
      <MenuItem id="rename">Rename</MenuItem>
      <MenuItem id="duplicate" isDisabled>Duplicate</MenuItem>
      <MenuItem id="archive">Archive</MenuItem>
    </Menu>
  ),
}

export const SingleSelection: Story = {
  render: function Render() {
    const [sort, setSort] = useState<Selection>(new Set(['updated']))
    return (
      <Menu
        trigger={<Button variant="outline">Sort by</Button>}
        selectionMode="single"
        selectedKeys={sort}
        onSelectionChange={setSort}
      >
        <MenuItem id="name">Name</MenuItem>
        <MenuItem id="created">Date created</MenuItem>
        <MenuItem id="updated">Last updated</MenuItem>
      </Menu>
    )
  },
}

const files = [
  { id: '1', name: 'Quarterly report' },
  { id: '2', name: 'Onboarding checklist' },
  { id: '3', name: 'Release notes' },
]

export const RowOverflow: Story = {
  render: function Render() {
    const [rows, setRows] = useState(files)
    const [deleting, setDeleting] = useState<(typeof files)[number] | null>(null)
    return (
      <div className="w-96 divide-y divide-border rounded-md border border-border">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between px-3 py-2 text-sm">
            <span>{row.name}</span>
            <Menu
              trigger={
                <Button variant="ghost" size="sm" aria-label={`Actions for ${row.name}`}>
                  ⋯
                </Button>
              }
              onAction={(key) => key === 'delete' && setDeleting(row)}
            >
              <MenuItem id="rename" shortcut="R">Rename</MenuItem>
              <MenuItem id="duplicate">Duplicate</MenuItem>
              <MenuSeparator />
              <MenuItem id="delete" variant="destructive">Delete</MenuItem>
            </Menu>
          </div>
        ))}
        <ConfirmDialog
          open={deleting !== null}
          title={`Delete ${deleting?.name ?? ''}?`}
          message="The file is removed for everyone with access."
          confirmLabel="Delete file"
          onConfirm={() => {
            setRows((current) => current.filter((row) => row.id !== deleting?.id))
            setDeleting(null)
          }}
          onCancel={() => setDeleting(null)}
        />
      </div>
    )
  },
}
