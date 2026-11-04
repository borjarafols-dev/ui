import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState } from 'react'
import { RouterProvider } from 'react-aria-components'

import { Button } from './button'
import { CommandPalette, CommandPaletteItem, CommandPaletteSection } from './command-palette'
import { Kbd } from './kbd'
import { useFakeLoader } from '../test/use-fake-loader'

const meta = {
  title: 'Components/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: { children: null },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

function Hint() {
  return (
    <p className="text-sm text-muted-foreground">
      Press <Kbd>Ctrl</Kbd> <Kbd>K</Kbd> (<Kbd>⌘</Kbd> <Kbd>K</Kbd> on Mac).
    </p>
  )
}

export const Basic: Story = {
  render: (args) => (
    <>
      <Hint />
      <CommandPalette {...args}>
        <CommandPaletteSection title="Pages">
          <CommandPaletteItem id="inbox">Inbox</CommandPaletteItem>
          <CommandPaletteItem id="projects">Projects</CommandPaletteItem>
          <CommandPaletteItem id="settings">Settings</CommandPaletteItem>
        </CommandPaletteSection>
        <CommandPaletteSection title="Actions">
          <CommandPaletteItem id="new-project">New project</CommandPaletteItem>
          <CommandPaletteItem id="theme">Toggle theme</CommandPaletteItem>
        </CommandPaletteSection>
      </CommandPalette>
    </>
  ),
}

export const WithShortcuts: Story = {
  render: (args) => (
    <CommandPalette {...args} isOpen>
      <CommandPaletteSection title="Actions">
        <CommandPaletteItem id="new-project" shortcut="N">New project</CommandPaletteItem>
        <CommandPaletteItem id="theme" shortcut="T">Toggle theme</CommandPaletteItem>
        <CommandPaletteItem id="help" shortcut="?">Keyboard help</CommandPaletteItem>
      </CommandPaletteSection>
    </CommandPalette>
  ),
}

export const WithLinks: Story = {
  render: (args) => {
    const [path, setPath] = useState('/')
    return (
      <RouterProvider navigate={setPath}>
        <p className="text-sm text-foreground">Current page: {path}</p>
        <CommandPalette {...args} isOpen>
          <CommandPaletteSection title="Pages">
            <CommandPaletteItem id="inbox" href="/">Inbox</CommandPaletteItem>
            <CommandPaletteItem id="runs" href="/admin/runs" keywords={['jobs']}>Runs</CommandPaletteItem>
          </CommandPaletteSection>
        </CommandPalette>
      </RouterProvider>
    )
  },
}

interface IssueRecord {
  id: string
  key: string
  title: string
}

const RECORDS: IssueRecord[] = [
  { id: 'r1', key: 'APP-101', title: 'Fix login redirect' },
  { id: 'r2', key: 'APP-102', title: 'Add invoice export' },
  { id: 'r3', key: 'APP-214', title: 'Slow project list' },
]

export const ServerResults: Story = {
  render: (args) => {
    const [query, setQuery] = useState('')
    const { items: records, isLoading } = useFakeLoader(
      query,
      (q) => RECORDS.filter((r) => `${r.key} ${r.title}`.toLowerCase().includes(q.toLowerCase())),
      400,
    )
    return (
      <CommandPalette {...args} isOpen inputValue={query} onInputChange={setQuery}>
        <CommandPaletteSection title="Pages">
          <CommandPaletteItem id="inbox">Inbox</CommandPaletteItem>
          <CommandPaletteItem id="projects">Projects</CommandPaletteItem>
        </CommandPaletteSection>
        <CommandPaletteSection title="Issues" items={records} isLoading={isLoading}>
          {(record: IssueRecord) => (
            <CommandPaletteItem id={record.id} textValue={`${record.key} ${record.title}`}>
              <span className="font-mono text-xs text-muted-foreground">{record.key}</span>
              {record.title}
            </CommandPaletteItem>
          )}
        </CommandPaletteSection>
      </CommandPalette>
    )
  },
}

export const Empty: Story = {
  render: (args) => (
    <CommandPalette {...args} isOpen inputValue="zzz" emptyMessage="Nothing matches “zzz”.">
      <CommandPaletteSection title="Pages">
        <CommandPaletteItem id="inbox">Inbox</CommandPaletteItem>
      </CommandPaletteSection>
    </CommandPalette>
  ),
}

export const KeywordMatch: Story = {
  render: (args) => (
    <CommandPalette {...args} isOpen inputValue="settings">
      <CommandPaletteSection title="Pages">
        <CommandPaletteItem id="prefs" keywords={['settings', 'options']}>Preferences</CommandPaletteItem>
        <CommandPaletteItem id="inbox">Inbox</CommandPaletteItem>
      </CommandPaletteSection>
    </CommandPalette>
  ),
}

export const InAnAppFrame: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false)
    const [theme, setTheme] = useState('light')
    const actions = useMemo(() => ({ theme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }), [])
    return (
      <div className="w-full max-w-2xl rounded-lg border border-border">
        <header className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-sm font-medium text-foreground">Acme</span>
          <Button variant="secondary" size="sm" onPress={() => setOpen(true)}>
            Search <Kbd size="sm">⌘K</Kbd>
          </Button>
        </header>
        <p className="p-4 text-sm text-muted-foreground">Theme: {theme}</p>
        <CommandPalette
          {...args}
          isOpen={open}
          onOpenChange={setOpen}
          onAction={(key) => key === 'theme' && actions.theme()}
        >
          <CommandPaletteSection title="Pages">
            <CommandPaletteItem id="inbox">Inbox</CommandPaletteItem>
            <CommandPaletteItem id="projects">Projects</CommandPaletteItem>
          </CommandPaletteSection>
          <CommandPaletteSection title="Actions">
            <CommandPaletteItem id="theme" shortcut="T">Toggle theme</CommandPaletteItem>
          </CommandPaletteSection>
        </CommandPalette>
      </div>
    )
  },
}
