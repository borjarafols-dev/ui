import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'
import { Menu, MenuItem, MenuSeparator } from './menu'

function RowMenu(props: { onAction?: (key: React.Key) => void }) {
  return (
    <Menu trigger={<Button aria-label="Row actions">⋯</Button>} {...props}>
      <MenuItem id="rename" shortcut="R">Rename</MenuItem>
      <MenuItem id="duplicate">Duplicate</MenuItem>
      <MenuItem id="archive" isDisabled>Archive</MenuItem>
      <MenuSeparator />
      <MenuItem id="delete" variant="destructive">Delete</MenuItem>
    </Menu>
  )
}

describe('Menu', () => {
  it('opens a menu of menuitems when the trigger is pressed', async () => {
    const user = userEvent.setup()
    render(<RowMenu />)

    await user.click(screen.getByRole('button', { name: 'Row actions' }))

    const menu = screen.getByRole('menu')
    expect(menu).toHaveAttribute('data-slot', 'menu')
    expect(screen.getByRole('menuitem', { name: /Rename/ })).toHaveAttribute('data-slot', 'menu-item')
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
  })

  it.each(['{Enter}', '{ArrowDown}'])('opens with %s on the trigger', async (key) => {
    const user = userEvent.setup()
    render(<RowMenu />)

    await user.tab()
    await user.keyboard(key)

    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('moves with arrow keys and runs onAction with the key on Enter, then restores focus', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<RowMenu onAction={onAction} />)

    const trigger = screen.getByRole('button', { name: 'Row actions' })
    await user.tab()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: /Rename/ })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(onAction.mock.calls[0]?.[0]).toBe('duplicate')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('closes on Escape without calling onAction', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<RowMenu onAction={onAction} />)

    const trigger = screen.getByRole('button', { name: 'Row actions' })
    await user.click(trigger)
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(onAction).not.toHaveBeenCalled()
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('does not run a disabled item', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(<RowMenu onAction={onAction} />)

    await user.click(screen.getByRole('button', { name: 'Row actions' }))
    const archive = screen.getByRole('menuitem', { name: 'Archive' })
    expect(archive).toHaveAttribute('aria-disabled', 'true')
    await user.click(archive)

    expect(onAction).not.toHaveBeenCalled()
  })

  it('marks the destructive variant', async () => {
    const user = userEvent.setup()
    render(<RowMenu />)

    await user.click(screen.getByRole('button', { name: 'Row actions' }))

    const item = screen.getByRole('menuitem', { name: 'Delete' })
    expect(item).toHaveAttribute('data-variant', 'destructive')
    expect(item).toHaveClass('text-destructive')
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveAttribute('data-variant', 'default')
  })

  it('renders the shortcut in a kbd', async () => {
    const user = userEvent.setup()
    render(<RowMenu />)

    await user.click(screen.getByRole('button', { name: 'Row actions' }))

    const kbd = screen.getByRole('menuitem', { name: /Rename/ }).querySelector('kbd')
    expect(kbd).toHaveTextContent('R')
  })

  it('follows an href item through RouterProvider', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    render(
      <RouterProvider navigate={navigate}>
        <Menu trigger={<Button>Account</Button>}>
          <MenuItem href="/profile">Profile</MenuItem>
        </Menu>
      </RouterProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Account' }))
    await user.click(screen.getByRole('menuitem', { name: 'Profile' }))

    expect(navigate).toHaveBeenCalledWith('/profile', undefined)
  })
})
