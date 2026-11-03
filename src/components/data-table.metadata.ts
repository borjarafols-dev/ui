import type { ComponentMetadata } from '../metadata/schema'
import type { DataTableProps } from './data-table'

export default {
  component: 'DataTable',
  sourceHash: 'sha256:aff0b20c3d57b3fd9edabc7fbc1fe9bc20ddbfeed679dcf7de4274f89e70f8f8',
  category: 'data',
  summary:
    'A keyboard-navigable table whose rows TanStack Table builds from column definitions and data, with a "Columns" button to hide and show columns and optional parent rows that expand to their children.',
  whenToUse: [
    'Lists of records with several comparable fields, such as members, invoices or bookings.',
    'Admin views where people scan rows and compare columns, and may hide the columns they don’t need.',
    'Operational lists read at a glance, such as logs, job runs or queues, with density="compact" for 28 px rows.',
    'One level of parent and child records, such as a job and its steps, with getSubRows.',
  ],
  whenNotToUse: [
    'A handful of items with one or two fields: use a simple list or Cards.',
    'No rows yet: DataTable shows emptyMessage, but for a whole empty section use EmptyState.',
    'Deep hierarchies such as file trees: nested rows are for one level of parent and children, so use a tree.',
    'Sorting or pagination: not supported yet, so request it in the library instead of wrapping another table.',
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
    'columnVisibility',
    'onColumnVisibilityChange',
    'getSubRows',
    'expanded',
    'onExpandedChange',
    'density',
    'emptyMessage',
  ],
  antiPatterns: [
    'Leaving aria-label at its generic localised default; name what the table lists ("Members").',
    'Putting the identifying column (name, title) anywhere but first, or letting it hide; put it first with enableHiding: false, since it is the row header.',
    'Giving a hideable column a non-string header, so its checkbox shows the column id; use a string header.',
    'Building a separate column picker or filtering columns out of `columns` to hide them; pass columnVisibility and onColumnVisibilityChange, for example to keep hidden columns in the URL.',
    'Writing column objects by hand, keying rows by index or reusing a parent id for a child; build columns with createDataTableColumnHelper and pass a getRowId unique across the whole tree.',
  ],
  accessibility: [
    'Rendered with React Aria Table: grid semantics, arrow-key cell navigation and row headers.',
    'The "Columns" button opens a labelled popover of checkboxes that works with Tab, Space and Escape and returns focus to the button.',
    'With getSubRows the table is a treegrid: parent rows expose aria-expanded, Arrow Right expands, Arrow Left collapses or moves to the parent, and the chevron button is named.',
    'The default name, empty message, "Columns" label and expand/collapse labels are localised (en, es, ca) from React Aria’s locale.',
    'The caller provides the accessible name (aria-label), string column headers and readable cell content.',
  ],
  example: `const column = createDataTableColumnHelper<Member>()
const columns = column.columns([
  column.accessor('name', { header: 'Name', enableHiding: false }),
  column.accessor('email', { header: 'Email' }),
  column.accessor('status', { header: 'Status', cell: (info) => <Badge>{info.getValue()}</Badge> }),
])

const [columnVisibility, setColumnVisibility] = useState<DataTableColumnVisibility>({ email: false })

<DataTable
  aria-label="Members"
  columns={columns}
  data={members}
  getRowId={(member) => member.id}
  columnVisibility={columnVisibility}
  onColumnVisibilityChange={setColumnVisibility}
/>`,
} satisfies ComponentMetadata<DataTableProps<Record<string, unknown>>>
