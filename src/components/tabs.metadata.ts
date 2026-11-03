import type { ComponentMetadata } from '../metadata/schema'
import type { TabsProps } from './tabs'

export default {
  component: 'Tabs',
  sourceHash: 'sha256:c38964e4749831ae65cd81c76efe4d3c47711773479bbb9fe8c997a0921118b8',
  category: 'layout',
  summary: 'Underlined tabs that switch between panels of related content on one page, one panel at a time.',
  whenToUse: [
    'Switching between panels of related content within one page, such as Queue / History or General / Members / Billing.',
    'Two to seven sections with short labels.',
    'A section that should survive a reload or the back button: control selectedKey from the URL, or give each Tab an href.',
  ],
  whenNotToUse: [
    'Filtering data within one view: use SegmentedControl.',
    'Site navigation between pages: use Link in a nav.',
    'More than seven sections or long labels: use a Select or a sidebar.',
  ],
  alternatives: [{ component: 'Select', when: 'There are more than seven sections to choose from.' }],
  keyProps: ['selectedKey', 'defaultSelectedKey', 'onSelectionChange', 'disabledKeys', 'orientation', 'keyboardActivation'],
  antiPatterns: [
    'Giving a Tab and its TabPanel different ids; the Tab id must match the TabPanel id or the panel never shows.',
    'Keeping the selected tab in local state when it should survive a reload; control selectedKey from the URL and set it in onSelectionChange.',
    'Rendering an href Tab without a RouterProvider in a client-routed app; wrap the app in RouterProvider so tabs navigate through the router.',
    'Restyling the underline with palette classes through className; the look comes from tokens such as --primary and --border.',
  ],
  accessibility: [
    'Handles the tablist, tab and tabpanel roles, their aria-controls/aria-labelledby links, arrow keys, Home/End and skipping disabled tabs.',
    'The underline animation is turned off under prefers-reduced-motion.',
    'The caller must give TabList an aria-label when no heading names it.',
  ],
  example: `<Tabs selectedKey={tab} onSelectionChange={(key) => setSearchParam('tab', String(key))}>
  <TabList aria-label="Review">
    <Tab id="queue">Queue</Tab>
    <Tab id="history">History</Tab>
  </TabList>
  <TabPanel id="queue">…</TabPanel>
  <TabPanel id="history">…</TabPanel>
</Tabs>`,
} satisfies ComponentMetadata<TabsProps>
