import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    expect(queue.querySelector('[data-slot="tab-indicator"]')).toBeInTheDocument()
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
})
