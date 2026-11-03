import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SegmentedControl, SegmentedControlItem, type SegmentedControlProps } from './segmented-control'

function Range(props: Omit<SegmentedControlProps, 'children'>) {
  return (
    <SegmentedControl aria-label="Time range" defaultSelectedKeys={['24h']} {...props}>
      <SegmentedControlItem id="24h">24h</SegmentedControlItem>
      <SegmentedControlItem id="7d">7d</SegmentedControlItem>
      <SegmentedControlItem id="30d">30d</SegmentedControlItem>
    </SegmentedControl>
  )
}

describe('SegmentedControl', () => {
  it('renders a labelled radiogroup of radios with one checked', () => {
    render(<Range />)

    expect(screen.getByRole('radiogroup', { name: 'Time range' })).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(3)
    const first = screen.getByRole('radio', { name: '24h' })
    expect(first).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '7d' })).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onSelectionChange with a one-key set and moves data-selected', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(<Range onSelectionChange={onSelectionChange} />)

    await user.click(screen.getByRole('radio', { name: '7d' }))

    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['7d']))
    expect(screen.getByRole('radio', { name: '7d' })).toHaveAttribute('data-selected')
    expect(screen.getByRole('radio', { name: '24h' })).not.toHaveAttribute('data-selected')
  })

  it('does not deselect the selected item when it is clicked again', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(<Range onSelectionChange={onSelectionChange} />)

    await user.click(screen.getByRole('radio', { name: '24h' }))

    expect(onSelectionChange).not.toHaveBeenCalledWith(new Set())
    expect(screen.getByRole('radio', { name: '24h' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '24h' })).toHaveAttribute('data-selected')
  })

  it('renders toggle buttons with aria-pressed in multiple mode and adds and removes keys', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <SegmentedControl aria-label="Kind" selectionMode="multiple" onSelectionChange={onSelectionChange}>
        <SegmentedControlItem id="bug">Bugs</SegmentedControlItem>
        <SegmentedControlItem id="feature">Features</SegmentedControlItem>
      </SegmentedControl>,
    )

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument()
    const bugs = screen.getByRole('button', { name: 'Bugs' })
    expect(bugs).toHaveAttribute('aria-pressed', 'false')

    await user.click(bugs)
    await user.click(screen.getByRole('button', { name: 'Features' }))
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['bug', 'feature']))
    expect(bugs).toHaveAttribute('aria-pressed', 'true')

    await user.click(bugs)
    expect(onSelectionChange).toHaveBeenLastCalledWith(new Set(['feature']))
    expect(bugs).toHaveAttribute('aria-pressed', 'false')
  })

  it('moves focus between items with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<Range />)

    await user.tab()
    expect(screen.getByRole('radio', { name: '24h' })).toHaveFocus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '7d' })).toHaveFocus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: '24h' })).toHaveFocus()
  })

  it('skips a disabled item and marks it data-disabled', async () => {
    const user = userEvent.setup()
    render(
      <SegmentedControl aria-label="View" defaultSelectedKeys={['list']}>
        <SegmentedControlItem id="list">List</SegmentedControlItem>
        <SegmentedControlItem id="board" isDisabled>
          Board
        </SegmentedControlItem>
        <SegmentedControlItem id="grid">Grid</SegmentedControlItem>
      </SegmentedControl>,
    )

    await user.tab()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Board' })).toHaveAttribute('data-disabled')
  })
})
