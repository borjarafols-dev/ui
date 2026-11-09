import type { ComponentMetadata } from '../../metadata/schema'
import type { DataTableProps } from './data-table'

export default {
  component: 'DataTable',
  sourceHash: 'sha256:ad5d4546045366ee83f92ac61d5786155f0c79227d1f2c241ff6981a2263efc8',
  category: 'data',
  summary:
    'A keyboard-navigable table whose rows TanStack Table builds from column definitions and data, with sortable headers, a Columns button, optional search, paging, nested rows, row links and held live rows.',
  whenToUse: [
    'Lists of records with several comparable fields that people scan, sort, search and page through, such as members, invoices or bookings.',
    'Lists paged by an API, with mode="server" rendering the fetched page and reporting sort, search and page changes.',
    'Operational lists read at a glance, such as logs, job runs or queues, with density="compact" for 28 px rows.',
    'Lists where each row opens its record, with getRowHref making the whole row a link.',
    'Lists that update while people read them, such as live job runs, with holdNewRows so new rows wait behind a "Show n new rows" button.',
  ],
  whenNotToUse: [
    'A handful of items with one or two fields: use a simple list or Cards.',
    'No rows yet: DataTable shows emptyMessage, but for a whole empty section use EmptyState.',
    'Deep hierarchies such as file trees: getSubRows is for one level of parent and children (a job and its steps), so use a tree.',
  ],
  alternatives: [
    { component: 'Card', when: 'Items are few and each needs its own actions or rich content.' },
    { component: 'EmptyState', when: 'The section has no data and needs a call to action.' },
  ],
  keyProps: ['columns', 'data', 'getRowId', 'aria-label', 'mode'],
  antiPatterns: [
    'Writing column objects by hand or keying rows by index; build columns with createDataTableColumnHelper and pass a getRowId that is unique across the whole tree.',
    'Putting the identifying column (name, title) anywhere but first or letting it hide; put it first with enableHiding: false, and give every hideable column a string header for its checkbox.',
    'Slicing, sorting or filtering an API page in the app and passing it in client mode; use mode="server" with rowCount and fetch on onSortingChange, onGlobalFilterChange and onPaginationChange.',
    'Adding an "Open" button or a link cell to every row; return the record URL from getRowHref instead.',
    'Turning on holdNewRows for a list that only changes after the user acts (saving, deleting); leave it off so the user sees their change at once.',
  ],
  accessibility: [
    'React Aria Table gives grid semantics, arrow-key cell navigation, row headers and sortable headers that sort on click or Enter and set aria-sort.',
    'With getSubRows the table is a treegrid whose parent rows expose aria-expanded and expand with Arrow Right or their named chevron button.',
    'With getRowHref, a click or Enter on a row navigates through the app’s RouterProvider while buttons in cells keep their own action.',
    'The Columns popover and the "Show n new rows" button work from the keyboard, and the held count and the page position are announced politely.',
    'Built-in labels are localised (en, es, ca), but the caller provides the accessible name (aria-label), string column headers and readable cell content.',
  ],
  example: `const column = createDataTableColumnHelper<Member>()
const columns = column.columns([
  column.accessor('name', { header: 'Name', enableHiding: false }),
  column.accessor('email', { header: 'Email' }),
  column.accessor('status', { header: 'Status', enableSorting: false, cell: (info) => <Badge>{info.getValue()}</Badge> }),
])

const [columnVisibility, setColumnVisibility] = useState<DataTableColumnVisibility>({ email: false })

<DataTable
  aria-label="Members"
  columns={columns}
  data={members}
  getRowId={(member) => member.id}
  getRowHref={(member) => \`/members/\${member.id}\`}
  enableSearch
  enablePagination
  columnVisibility={columnVisibility}
  onColumnVisibilityChange={setColumnVisibility}
/>`,
} satisfies ComponentMetadata<DataTableProps<Record<string, unknown>>>
