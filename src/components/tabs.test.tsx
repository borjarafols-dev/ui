import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { Tab, TabList, TabPanel, Tabs, type TabsProps } from './tabs'

function Review(props: Omit<TabsProps, 'children'>) {
  return (
    <Tabs data-testid="tabs" {...props}>
      <TabList aria-label="Review">
        <Tab id="queue">Queue</Tab>
        <Tab id="archive" isDisabled>
          Archive
        </Tab>
        <Tab id="history">History</Tab>
      </TabList>
      <TabPanel id="queue">Queue panel</TabPanel>
      <TabPanel id="archive">Archive panel</TabPanel>
      <TabPanel id="history">History panel</TabPanel>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('renders a tablist with the first tab selected and a data-slot on each part', () => {
    render(<Review />)

    const list = screen.getByRole('tablist', { name: 'Review' })
    const queue = screen.getByRole('tab', { name: 'Queue' })
    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(queue).toHaveAttribute('aria-selected', 'true')
    expect(queue).toHaveAttribute('data-selected')
    expect(screen.getByTestId('tabs')).toHaveAttribute('data-slot', 'tabs')
    expect(list).toHaveAttribute('data-slot', 'tab-list')
    expect(queue).toHaveAttribute('data-slot', 'tab')
    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-slot', 'tab-panel')
    expect(queue.querySelector('[data-slot="tab-indicator"]')).toHaveClass('bg-primary', 'motion-reduce:transition-none')
  })

  it('selects the next enabled tab with ArrowRight, skipping a disabled one', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(<Review onSelectionChange={onSelectionChange} />)

    await user.click(screen.getByRole('tab', { name: 'Queue' }))
    await user.keyboard('{ArrowRight}')

    expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Archive' })).toHaveAttribute('data-disabled')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('History panel')
    expect(onSelectionChange).toHaveBeenLastCalledWith('history')
  })

  it('keeps a controlled selectedKey over clicks until the parent updates it', async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    const { rerender } = render(<Review selectedKey="queue" onSelectionChange={onSelectionChange} />)

    await user.click(screen.getByRole('tab', { name: 'History' }))
    expect(onSelectionChange).toHaveBeenCalledWith('history')
    expect(screen.getByRole('tab', { name: 'Queue' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Queue panel')

    rerender(<Review selectedKey="history" onSelectionChange={onSelectionChange} />)
    expect(screen.getByRole('tab', { name: 'History' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('History panel')
  })

  it('navigates href tabs through RouterProvider', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    render(
      <RouterProvider navigate={navigate}>
        <Tabs selectedKey="/providers">
          <TabList aria-label="Settings">
            <Tab id="/providers" href="/providers">
              Providers
            </Tab>
            <Tab id="/models" href="/models">
              Models
            </Tab>
          </TabList>
          <TabPanel id="/providers">Providers panel</TabPanel>
          <TabPanel id="/models">Models panel</TabPanel>
        </Tabs>
      </RouterProvider>,
    )

    await user.click(screen.getByRole('tab', { name: 'Models' }))
    expect(navigate).toHaveBeenCalledWith('/models', undefined)
  })
})
