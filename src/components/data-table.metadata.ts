import type { ComponentMetadata } from '../metadata/schema'
import type { DataTableProps } from './data-table'

export default {
  component: 'DataTable',
  sourceHash: 'sha256:fc0df9ed1e6ac2c5e79ac04998e1fe253e0ad9c41470e79b5e5e5474e3694e68',
  category: 'data',
  summary:
    'A keyboard-navigable table whose rows TanStack Table builds from column definitions and data, with sortable headers, a "Columns" button to hide and show columns, an optional search field and an optional paging footer.',
  whenToUse: [
    'Lists of records with several comparable fields, such as members, invoices or bookings.',
    'Admin views where people scan, sort, search and page through rows, and may hide the columns they don’t need.',
    'Lists paged by an API: mode="server" renders the fetched page and reports sort, search and page changes.',
    'Operational lists read at a glance, such as logs, job runs or queues, with density="compact" for 28 px rows.',
  ],
  whenNotToUse: [
    'A handful of items with one or two fields: use a simple list or Cards.',
    'No rows yet: DataTable shows emptyMessage, but for a whole empty section use EmptyState.',
  ],
  alternatives: [
    { component: 'Card', when: 'Items are few and each needs its own actions or rich content.' },
    { component: 'EmptyState', when: 'The section has no data and needs a call to action.' },
  ],
  keyProps: [
    'columns',
    'data',
    'getRowId',
    'aria-label',
    'mode',
    'rowCount',
    'enableSearch',
    'enablePagination',
    'sorting',
    'globalFilter',
    'pagination',
    'columnVisibility',
    'onColumnVisibilityChange',
    'density',
    'emptyMessage',
  ],
  antiPatterns: [
    'Leaving aria-label at its generic localised default; name what the table lists ("Members").',
    'Putting the identifying column (name, title) anywhere but first, or letting it hide; put it first with enableHiding: false, since it is the row header.',
    'Giving a hideable column a non-string header, so its checkbox shows the column id; use a string header.',
    'Slicing or sorting an API page in the app and passing it in client mode; use mode="server" with rowCount and fetch on onSortingChange, onGlobalFilterChange and onPaginationChange.',
    'Building a separate search input, pager or column picker around the table; turn on enableSearch and enablePagination, and pass sorting, globalFilter, pagination and columnVisibility with their handlers to keep them in the URL.',
  ],
  accessibility: [
    'Rendered with React Aria Table: grid semantics, arrow-key cell navigation, row headers, and sortable headers that sort on click or Enter and set aria-sort.',
    'The "Columns" button opens a labelled popover of checkboxes that works with Tab, Space and Escape and returns focus to the button.',
    'The default name, empty message, search, paging and "Columns" labels are localised (en, es, ca) from React Aria’s locale, and the page position is announced politely.',
    'The caller provides the accessible name (aria-label), string column headers and readable cell content.',
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
  enableSearch
  enablePagination
  columnVisibility={columnVisibility}
  onColumnVisibilityChange={setColumnVisibility}
/>`,
} satisfies ComponentMetadata<DataTableProps<Record<string, unknown>>>
