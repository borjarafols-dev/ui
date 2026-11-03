import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Disclosure, DisclosureGroup } from './disclosure'

describe('Disclosure', () => {
  it('renders a heading at the given level holding a collapsed trigger, with the panel hidden', () => {
    render(
      <Disclosure title="Evidence" level={4} data-testid="disclosure">
        Raw output
      </Disclosure>,
    )

    const heading = screen.getByRole('heading', { level: 4 })
    const trigger = screen.getByRole('button', { name: 'Evidence' })
    expect(heading).toContainElement(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Raw output')).not.toBeVisible()
    expect(screen.getByTestId('disclosure')).toHaveAttribute('data-slot', 'disclosure')
    expect(trigger).toHaveAttribute('data-slot', 'disclosure-trigger')
  })

  it('defaults to a level 3 heading', () => {
    render(<Disclosure title="Details">Body</Disclosure>)

    expect(screen.getByRole('heading', { level: 3, name: 'Details' })).toBeInTheDocument()
  })

  it('toggles with click and Enter and reports each change', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <Disclosure title="Evidence" onExpandedChange={onExpandedChange} data-testid="disclosure">
        Raw output
      </Disclosure>,
    )
    const trigger = screen.getByRole('button', { name: 'Evidence' })
    const root = screen.getByTestId('disclosure')

    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(root).toHaveAttribute('data-expanded')
    expect(screen.getByText('Raw output')).toBeVisible()
    expect(screen.getByRole('group', { name: 'Evidence' })).toHaveAttribute('data-slot', 'disclosure-panel')
    expect(onExpandedChange).toHaveBeenLastCalledWith(true)

    await user.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(root).not.toHaveAttribute('data-expanded')
    expect(screen.getByText('Raw output')).not.toBeVisible()
    expect(onExpandedChange).toHaveBeenLastCalledWith(false)
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <Disclosure title="Evidence" isDisabled onExpandedChange={onExpandedChange} data-testid="disclosure">
        Raw output
      </Disclosure>,
    )
    const trigger = screen.getByRole('button', { name: 'Evidence' })

    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByTestId('disclosure')).toHaveAttribute('data-disabled')
    expect(screen.getByText('Raw output')).not.toBeVisible()
    expect(onExpandedChange).not.toHaveBeenCalled()
  })
})

describe('DisclosureGroup', () => {
  function Sections(props: { allowsMultipleExpanded?: boolean }) {
    return (
      <DisclosureGroup data-testid="group" {...props}>
        <Disclosure id="summary" title="Summary">
          Summary panel
        </Disclosure>
        <Disclosure id="evidence" title="Evidence">
          Evidence panel
        </Disclosure>
      </DisclosureGroup>
    )
  }

  it('closes the open section when another opens', async () => {
    const user = userEvent.setup()
    render(<Sections />)

    expect(screen.getByTestId('group')).toHaveAttribute('data-slot', 'disclosure-group')
    await user.click(screen.getByRole('button', { name: 'Summary' }))
    await user.click(screen.getByRole('button', { name: 'Evidence' }))

    expect(screen.getByRole('button', { name: 'Summary' })).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByRole('button', { name: 'Evidence' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Summary panel')).not.toBeVisible()
    expect(screen.getByText('Evidence panel')).toBeVisible()
  })

  it('keeps several sections open with allowsMultipleExpanded', async () => {
    const user = userEvent.setup()
    render(<Sections allowsMultipleExpanded />)

    await user.click(screen.getByRole('button', { name: 'Summary' }))
    await user.click(screen.getByRole('button', { name: 'Evidence' }))

    expect(screen.getByRole('button', { name: 'Summary' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('button', { name: 'Evidence' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Summary panel')).toBeVisible()
    expect(screen.getByText('Evidence panel')).toBeVisible()
  })
})
