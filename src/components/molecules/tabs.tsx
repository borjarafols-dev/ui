import {
  composeRenderProps,
  SelectionIndicator,
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
  Tabs as RACTabs,
  type TabListProps as RACTabListProps,
  type TabPanelProps as RACTabPanelProps,
  type TabProps as RACTabProps,
  type TabsProps as RACTabsProps,
} from 'react-aria-components'

import { tabs } from '../../recipes/tabs'

export interface TabsProps extends Omit<RACTabsProps, 'className'> {
  className?: string
}

export interface TabListProps<T> extends Omit<RACTabListProps<T>, 'className'> {
  className?: string
}

export interface TabProps extends Omit<RACTabProps, 'className'> {
  className?: string
}

export interface TabPanelProps extends Omit<RACTabPanelProps, 'className'> {
  className?: string
}

const slots = tabs()

/**
 * Tabbed panels with an underline on the selected tab. Compose with TabList,
 * Tab and TabPanel; a Tab's `id` matches its TabPanel's `id`. Use
 * `selectedKey` / `onSelectionChange` to drive it from the URL, or give each
 * Tab an `href` to navigate through `RouterProvider`.
 *
 * @usage For switching panels of content within one page; not for filtering data in one view: use SegmentedControl.
 * @usage Not for site navigation between pages: use Link in a nav.
 * @usage Two to seven tabs with short labels; more than that needs a Select or a sidebar.
 * @usage When a tab should survive a reload, control selectedKey from the URL.
 */
export function Tabs({ className, ...props }: TabsProps) {
  return <RACTabs data-slot="tabs" {...props} className={slots.root({ className })} />
}

/** Needs an `aria-label` when no heading names it. */
export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return <RACTabList data-slot="tab-list" {...props} className={slots.list({ className })} />
}

export function Tab({ className, children, ...props }: TabProps) {
  return (
    <RACTab data-slot="tab" {...props} className={slots.tab({ className })}>
      {composeRenderProps(children, (children) => (
        <>
          {children}
          <SelectionIndicator data-slot="tab-indicator" className={slots.indicator()} />
        </>
      ))}
    </RACTab>
  )
}

export function TabPanel({ className, ...props }: TabPanelProps) {
  return <RACTabPanel data-slot="tab-panel" {...props} className={slots.panel({ className })} />
}
