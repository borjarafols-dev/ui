import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { I18nProvider, RouterProvider } from 'react-aria-components'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CommandPalette, CommandPaletteItem, CommandPaletteSection, type CommandPaletteProps } from './command-palette'

function Palette(props: Partial<CommandPaletteProps>) {
  return (
    <CommandPalette {...props}>
      <CommandPaletteSection title="Pages">
        <CommandPaletteItem id="inbox">Inbox</CommandPaletteItem>
        <CommandPaletteItem id="prefs" keywords={['settings']}>
          Preferences
        </CommandPaletteItem>
      </CommandPaletteSection>
      <CommandPaletteSection title="Actions">
        <CommandPaletteItem id="theme" shortcut="T">
          Toggle theme
        </CommandPaletteItem>
      </CommandPaletteSection>
    </CommandPalette>
  )
}

function mockPlatform(platform: string) {
  vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform)
}

afterEach(() => vi.restoreAllMocks())

describe('CommandPalette', () => {
  it('opens and closes with Cmd+K on macOS', async () => {
    mockPlatform('MacIntel')
    const user = userEvent.setup()
    render(<Palette />)

    await user.keyboard('{Meta>}k{/Meta}')
    const dialog = screen.getByRole('dialog', { name: 'Command palette' })
    expect(dialog).toHaveAttribute('data-slot', 'command-palette')
    expect(within(dialog).getByRole('searchbox')).toHaveFocus()

    await user.keyboard('{Meta>}k{/Meta}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('opens with Ctrl+K elsewhere and ignores Cmd+K', async () => {
    mockPlatform('Linux x86_64')
    const user = userEvent.setup()
    render(<Palette />)

    await user.keyboard('{Meta>}k{/Meta}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.keyboard('{Control>}k{/Control}')
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
  })

  it('does nothing when the shortcut is disabled', async () => {
    mockPlatform('Linux x86_64')
    const user = userEvent.setup()
    render(<Palette isShortcutEnabled={false} />)

    await user.keyboard('{Control>}k{/Control}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('ignores the shortcut while focus is in another text field', async () => {
    mockPlatform('Linux x86_64')
    const user = userEvent.setup()
    render(
      <>
        <input aria-label="Notes" />
        <Palette />
      </>,
    )

    await user.click(screen.getByLabelText('Notes'))
    await user.keyboard('{Control>}k{/Control}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is controlled through isOpen and onOpenChange', async () => {
    mockPlatform('Linux x86_64')
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    const { rerender } = render(<Palette isOpen={false} onOpenChange={onOpenChange} />)

    await user.keyboard('{Control>}k{/Control}')
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<Palette isOpen onOpenChange={onOpenChange} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it('filters items, matches keywords, hides empty sections and shows the empty message', async () => {
    const user = userEvent.setup()
    render(<Palette isOpen />)

    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
    expect(screen.getByRole('menuitem', { name: /Toggle theme/ })).toHaveAttribute('data-slot', 'command-palette-item')
    expect(screen.getByText('T', { selector: 'kbd' })).toBeInTheDocument()

    await user.keyboard('settings')
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['Preferences'])
    expect(screen.getByText('Pages')).toBeInTheDocument()
    expect(screen.queryByText('Actions')).not.toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox'))
    await user.keyboard('zzz')
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['No results.'])
  })

  it('shows a custom empty message', async () => {
    const user = userEvent.setup()
    render(<Palette isOpen emptyMessage="Nothing here" />)

    await user.keyboard('zzz')

    expect(screen.getByText('Nothing here')).toBeInTheDocument()
  })

  it('runs onAction with the key on ArrowDown then Enter and closes', async () => {
    mockPlatform('Linux x86_64')
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<Palette onAction={onAction} />)

    await user.keyboard('{Control>}k{/Control}')
    await user.keyboard('{ArrowDown}{Enter}')

    expect(onAction).toHaveBeenCalledWith('inbox')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('navigates through the RouterProvider for href items and closes', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    const onAction = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <RouterProvider navigate={navigate}>
        <CommandPalette isOpen onOpenChange={onOpenChange} onAction={onAction}>
          <CommandPaletteSection title="Pages">
            <CommandPaletteItem id="runs" href="/admin/runs">
              Runs
            </CommandPaletteItem>
          </CommandPaletteSection>
        </CommandPalette>
      </RouterProvider>,
    )

    await user.keyboard('{ArrowDown}{Enter}')

    expect(navigate).toHaveBeenCalledWith('/admin/runs', undefined)
    expect(onAction).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('clears the text on Escape, then closes and returns focus', async () => {
    mockPlatform('Linux x86_64')
    const user = userEvent.setup()
    render(
      <>
        <button>Before</button>
        <Palette />
      </>,
    )
    const before = screen.getByRole('button', { name: 'Before' })
    before.focus()

    await user.keyboard('{Control>}k{/Control}')
    await user.keyboard('inb')
    expect(screen.getByRole('searchbox')).toHaveValue('inb')

    await user.keyboard('{Escape}')
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(before).toHaveFocus())
  })

  it('shows exactly the items passed with a controlled inputValue and filter={null}', async () => {
    const user = userEvent.setup()
    render(
      <CommandPalette isOpen inputValue="ada" filter={null}>
        <CommandPaletteSection title="Records" items={[{ id: 'r1', title: 'Q3 retainer' }]}>
          {(record: { id: string; title: string }) => (
            <CommandPaletteItem id={record.id}>{record.title}</CommandPaletteItem>
          )}
        </CommandPaletteSection>
        <CommandPaletteSection title="Pages">
          <CommandPaletteItem id="inbox">Inbox</CommandPaletteItem>
        </CommandPaletteSection>
      </CommandPalette>,
    )

    expect(screen.getByRole('searchbox')).toHaveValue('ada')
    expect(screen.getAllByRole('menuitem').map((el) => el.textContent)).toEqual(['Q3 retainer', 'Inbox'])
    await user.keyboard('x')
    expect(screen.getAllByRole('menuitem')).toHaveLength(2)
  })

  it('mixes local sections with loaded sections without filtering the loaded ones again', async () => {
    const user = userEvent.setup()
    function Mixed() {
      const [query, setQuery] = React.useState('')
      const [records, setRecords] = React.useState<{ id: string; title: string }[]>([])
      const [isLoading, setLoading] = React.useState(false)
      React.useEffect(() => {
        if (!query) return setRecords([])
        setLoading(true)
        const timer = setTimeout(() => {
          setRecords([{ id: 'r1', title: 'Q3 retainer' }])
          setLoading(false)
        }, 20)
        return () => clearTimeout(timer)
      }, [query])
      return (
        <CommandPalette isOpen inputValue={query} onInputChange={setQuery}>
          <CommandPaletteSection title="Pages">
            <CommandPaletteItem id="inbox">Inbox</CommandPaletteItem>
          </CommandPaletteSection>
          <CommandPaletteSection title="Records" items={records} isLoading={isLoading}>
            {(record: { id: string; title: string }) => (
              <CommandPaletteItem id={record.id}>{record.title}</CommandPaletteItem>
            )}
          </CommandPaletteSection>
        </CommandPalette>
      )
    }
    render(<Mixed />)

    await user.keyboard('ada')
    expect(screen.queryByText('No results.')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(await screen.findByRole('menuitem', { name: 'Q3 retainer' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Inbox' })).not.toBeInTheDocument()
    await act(async () => {})
  })

  it('localises the default strings', () => {
    render(
      <I18nProvider locale="es-ES">
        <Palette isOpen />
      </I18nProvider>,
    )

    expect(screen.getByRole('dialog', { name: 'Paleta de comandos' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Busca o ejecuta un comando…')).toBeInTheDocument()
  })
})
