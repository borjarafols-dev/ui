import type { Meta, StoryObj } from '@storybook/react-vite'

import { Kbd } from './kbd'

const meta = {
  title: 'Components/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { size: 'md', children: 'Esc' },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Single: Story = {}

export const Combination: Story = {
  render: () => (
    <span className="inline-flex items-center gap-1 text-sm text-foreground">
      <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>P</Kbd>
    </span>
  ),
}

export const Small: Story = {
  args: { size: 'sm', children: 'K' },
}

export const Symbols: Story = {
  render: () => (
    <p className="text-sm text-foreground">
      Press <Kbd aria-label="Command">⌘</Kbd> <Kbd>K</Kbd> to search, or <Kbd aria-label="Shift">⇧</Kbd>{' '}
      <Kbd aria-label="Option">⌥</Kbd> <Kbd>N</Kbd> for a new window.
    </p>
  ),
}

const shortcuts = [
  { keys: [{ text: '⌘', label: 'Command' }, { text: 'K' }], description: 'Open search' },
  { keys: [{ text: 'G' }, { text: 'H' }], description: 'Go to home' },
  { keys: [{ text: '?' }], description: 'Show keyboard shortcuts' },
  { keys: [{ text: 'Esc' }], description: 'Close dialog' },
] as const

export const ShortcutLegend: Story = {
  render: () => (
    <dl className="flex w-80 flex-col divide-y divide-border rounded-md border border-border">
      {shortcuts.map((shortcut) => (
        <div key={shortcut.description} className="flex items-center justify-between px-3 py-2 text-sm">
          <dt className="text-foreground">{shortcut.description}</dt>
          <dd className="flex gap-1">
            {shortcut.keys.map((key) => (
              <Kbd key={key.text} aria-label={'label' in key ? key.label : undefined}>
                {key.text}
              </Kbd>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  ),
}
