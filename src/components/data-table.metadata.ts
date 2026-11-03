import type { ComponentMetadata } from '../metadata/schema'
import type { DataTableProps } from './data-table'

export default {
  component: 'DataTable',
  sourceHash: 'sha256:b4c6c150784d9c5650b568d89051d014c6add1438be1f5e48998be7a8d228bb8',
  category: 'data',
  summary:
    'A keyboard-navigable table whose rows TanStack Table builds from column definitions and data, with sortable headers, a "Columns" button to hide and show columns, an optional search field, an optional paging footer and optional parent rows that expand to their children.',
  whenToUse: [
    'Lists of records with several comparable fields, such as members, invoices or bookings.',
    'Admin views where people scan, sort, search and page through rows, and may hide the columns they don’t need.',
    'Lists paged by an API: mode="server" renders the fetched page and reports sort, search and page changes.',
    'Operational lists read at a glance, such as logs, job runs or queues, with density="compact" for 28 px rows and getSubRows for one level of child records, such as a job and its steps.',
    'Lists where each row opens its record: getRowHref makes the whole row a link.',
  ],
  whenNotToUse: [
    'A handful of items with one or two fields: use a simple list or Cards.',
    'No rows yet: DataTable shows emptyMessage, but for a whole empty section use EmptyState.',
    'Deep hierarchies such as file trees: nested rows are for one level of parent and children, so use a tree.',
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
    'getSubRows',
    'expanded',
    'onExpandedChange',
    'density',
    'getRowHref',
    'emptyMessage',
  ],
  antiPatterns: [
    'Leaving aria-label at its generic localised default; name what the table lists ("Members").',
    'Putting the identifying column (name, title) anywhere but first, letting it hide, or giving a hideable column a non-string header; put the row header first with enableHiding: false, and give hideable columns string headers for their checkboxes.',
    'Slicing or sorting an API page in the app and passing it in client mode; use mode="server" with rowCount and fetch on onSortingChange, onGlobalFilterChange and onPaginationChange.',
    'Adding an "Open" button or a link cell to every row; return the record URL from getRowHref instead, and keep cell buttons for other actions.',
    'Building a separate search input, pager or column picker around the table; turn on enableSearch and enablePagination, and pass sorting, globalFilter, pagination and columnVisibility with their handlers to keep them in the URL.',
    'Writing column objects by hand, keying rows by index or reusing a parent id for a child; build columns with createDataTableColumnHelper and pass a getRowId unique across the whole tree.',
  ],
  accessibility: [
    'Rendered with React Aria Table: grid semantics, arrow-key cell navigation, row headers, and sortable headers that sort on click or Enter and set aria-sort; with getSubRows it is a treegrid where parent rows expose aria-expanded, Arrow Right expands, Arrow Left collapses or moves to the parent, and the chevron button is named.',
    'With getRowHref, a click or Enter on a row navigates through the app’s RouterProvider, modifier clicks open a new tab, and buttons in cells keep their own action.',
    'The "Columns" button opens a labelled popover of checkboxes that works with Tab, Space and Escape and returns focus to the button.',
    'The default name, empty message, search, paging, "Columns" and expand/collapse labels are localised (en, es, ca) from React Aria’s locale, and the page position is announced politely.',
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
  getRowHref={(member) => \`/members/\${member.id}\`}
  enableSearch
  enablePagination
  columnVisibility={columnVisibility}
  onColumnVisibilityChange={setColumnVisibility}
/>`,
} satisfies ComponentMetadata<DataTableProps<Record<string, unknown>>>
