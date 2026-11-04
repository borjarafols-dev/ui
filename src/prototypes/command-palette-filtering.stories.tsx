// Throwaway prototype for BOR-1190: how local and server-loaded sections share
// one SearchField and one Menu inside React Aria's Autocomplete. Not exported,
// not tested; the decision it led to lives on BOR-1184.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useCallback, useMemo, useState } from 'react'
import {
  Autocomplete,
  Collection,
  Header,
  Menu,
  MenuLoadMoreItem,
  MenuSection,
  useAsyncList,
  useFilter,
  type AutocompleteProps,
} from 'react-aria-components'

import { MenuItem } from '../components/menu'
import { SearchField } from '../components/search-field'
import { Spinner } from '../components/spinner'
import { menu } from '../recipes/menu'

type AutocompleteFilter = NonNullable<AutocompleteProps<object>['filter']>

interface Command {
  id: string
  label: string
}

interface ServerRecord {
  id: string
  key: string
  title: string
  owner: string
}

const PAGES: Command[] = [
  { id: 'page-dashboard', label: 'Dashboard' },
  { id: 'page-invoices', label: 'Invoices' },
  { id: 'page-settings', label: 'Settings' },
  { id: 'action-new-invoice', label: 'New invoice' },
  { id: 'action-invite', label: 'Invite a member' },
]

const RECORDS: ServerRecord[] = [
  { id: 'r1', key: 'INV-1001', title: 'Q3 retainer', owner: 'ada@example.com' },
  { id: 'r2', key: 'INV-1002', title: 'Hosting renewal', owner: 'grace@example.com' },
  { id: 'r3', key: 'INV-1003', title: 'Settings migration', owner: 'ada@example.com' },
  { id: 'r4', key: 'CUS-0042', title: 'Northwind', owner: 'linus@example.com' },
]

// The server matches on fields the item does not show (owner), as a real
// search endpoint does. That is what makes double filtering visible: "ada"
// returns "Q3 retainer", whose text has no "ada" in it.
function fakeSearch(query: string, delay: number, signal: AbortSignal): Promise<ServerRecord[]> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const q = query.toLowerCase()
      resolve(RECORDS.filter((r) => [r.key, r.title, r.owner].some((f) => f.toLowerCase().includes(q))))
    }, delay)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}

function useRecordSearch(delay: number) {
  return useAsyncList<ServerRecord>({
    async load({ signal, filterText = '' }) {
      if (!filterText) return { items: [] }
      return { items: await fakeSearch(filterText, delay, signal) }
    },
  })
}

const slots = menu()

function Palette({
  inputValue,
  onInputChange,
  filter,
  pages,
  records,
  isLoading,
}: {
  inputValue: string
  onInputChange: (value: string) => void
  filter?: AutocompleteFilter
  pages: Command[]
  records: ServerRecord[]
  isLoading: boolean
}) {
  return (
    <div className="w-96 rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg">
      <Autocomplete inputValue={inputValue} onInputChange={onInputChange} filter={filter}>
        <SearchField aria-label="Search" placeholder="Search pages and records" autoFocus />
        <Menu
          aria-label="Results"
          className={slots.menu({ className: 'mt-2 max-h-80' })}
          // collection.size counts items only, not loaders: without this guard
          // "No results" shows next to the spinner until the server answers.
          renderEmptyState={
            isLoading
              ? undefined
              : () => <p className="px-2 py-6 text-center text-sm text-muted-foreground">No results</p>
          }
        >
          {pages.length > 0 && (
            <MenuSection id="pages">
              <Header className={slots.sectionHeader()}>Pages</Header>
              <Collection items={pages}>{(page) => <MenuItem id={page.id}>{page.label}</MenuItem>}</Collection>
            </MenuSection>
          )}
          {(records.length > 0 || isLoading) && (
            <MenuSection id="records">
              <Header className={slots.sectionHeader()}>Records</Header>
              <Collection items={records}>
                {(record) => (
                  <MenuItem id={record.id} textValue={`${record.key} ${record.title}`}>
                    <span className="font-mono text-xs text-muted-foreground">{record.key}</span>
                    {record.title}
                  </MenuItem>
                )}
              </Collection>
              <MenuLoadMoreItem isLoading={isLoading} className="flex justify-center py-2">
                <Spinner size="sm" label="Loading records" />
              </MenuLoadMoreItem>
            </MenuSection>
          )}
        </Menu>
      </Autocomplete>
    </div>
  )
}

function NaiveSingleFilter({ delay }: { delay: number }) {
  const { contains } = useFilter({ sensitivity: 'base' })
  const records = useRecordSearch(delay)
  return (
    <Palette
      inputValue={records.filterText}
      onInputChange={records.setFilterText}
      filter={contains}
      pages={PAGES}
      records={records.items}
      isLoading={records.isLoading}
    />
  )
}

function PerSectionFilter({ delay }: { delay: number }) {
  const { contains } = useFilter({ sensitivity: 'base' })
  const records = useRecordSearch(delay)
  // Relies on node.parentKey being the section id: a server item nested one
  // level deeper, or a section renamed, silently falls back to local filtering.
  const filter = useCallback<AutocompleteFilter>(
    (textValue, inputValue, node) =>
      node.parentKey === 'records' || contains(textValue, inputValue),
    [contains],
  )
  return (
    <Palette
      inputValue={records.filterText}
      onInputChange={records.setFilterText}
      filter={filter}
      pages={PAGES}
      records={records.items}
      isLoading={records.isLoading}
    />
  )
}

function CallerPreFilter({ delay }: { delay: number }) {
  const { contains } = useFilter({ sensitivity: 'base' })
  const [inputValue, setInputValue] = useState('')
  const records = useRecordSearch(delay)
  const pages = useMemo(() => PAGES.filter((p) => contains(p.label, inputValue)), [contains, inputValue])
  return (
    <Palette
      inputValue={inputValue}
      onInputChange={(value) => {
        setInputValue(value)
        records.setFilterText(value)
      }}
      pages={pages}
      records={records.items}
      isLoading={records.isLoading}
    />
  )
}

const meta = {
  title: 'Prototypes/CommandPalette filtering',
  component: CallerPreFilter,
  args: { delay: 800 },
  argTypes: { delay: { control: { type: 'range', min: 0, max: 3000, step: 100 } } },
  parameters: {
    docs: {
      description: {
        component:
          'Throwaway. Type "ada": the server returns records owned by ada@example.com whose text has no "ada" in it.',
      },
    },
  },
} satisfies Meta<typeof CallerPreFilter>

export default meta
type Story = StoryObj<typeof meta>

/** One `filter` for the whole menu: server results are filtered a second time and "ada" loses its matches. */
export const Naive: Story = { render: (args) => <NaiveSingleFilter {...args} /> }

/** `filter` skips items whose parent is the records section. */
export const PerSection: Story = { render: (args) => <PerSectionFilter {...args} /> }

/** No `filter`; the caller filters local sections with `useFilter` and renders server items as returned. Chosen. */
export const PreFilter: Story = { render: (args) => <CallerPreFilter {...args} /> }
