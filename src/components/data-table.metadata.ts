import type { ComponentMetadata } from '../metadata/schema'
import type { DataTableProps } from './data-table'

export default {
  component: 'DataTable',
  sourceHash: 'sha256:823d01d59bab2f81785c906a40145a32cc20c4add8af57f9ab8214a0f1856c22',
  category: 'data',
  summary:
    'A keyboard-navigable table whose rows TanStack Table builds from column definitions and data, with sortable headers, an optional search field and an optional paging footer.',
  whenToUse: [
    'Lists of records with several comparable fields, such as members, invoices or bookings.',
    'Admin views where people scan, sort, search and page through rows.',
    'Lists paged by an API: mode="server" renders the fetched page and reports sort, search and page changes.',
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
    'emptyMessage',
  ],
  antiPatterns: [
    'Leaving aria-label at its generic localised default; name what the table lists ("Members").',
    'Putting the identifying column (name, title) anywhere but first; the first column is the row header.',
    'Writing column objects by hand or keying rows by index; build columns with createDataTableColumnHelper and pass getRowId.',
    'Slicing or sorting an API page in the app and passing it in client mode; use mode="server" with rowCount and fetch on onSortingChange, onGlobalFilterChange and onPaginationChange.',
    'Building a separate search input or pager around the table; turn on enableSearch and enablePagination, and pass sorting, globalFilter and pagination with their handlers to keep them in the URL.',
  ],
  accessibility: [
    'Rendered with React Aria Table: grid semantics, arrow-key cell navigation, row headers, and sortable headers that sort on click or Enter and set aria-sort.',
    'The default name, empty message, search label and paging labels are localised (en, es, ca) from React Aria’s locale, and the page position is announced politely.',
    'The caller provides the accessible name (aria-label) and readable cell content.',
  ],
  example: `const column = createDataTableColumnHelper<Member>()
const columns = column.columns([
  column.accessor('name', { header: 'Name' }),
  column.accessor('email', { header: 'Email' }),
  column.accessor('status', { header: 'Status', enableSorting: false, cell: (info) => <Badge>{info.getValue()}</Badge> }),
])

<DataTable
  aria-label="Members"
  columns={columns}
  data={members}
  getRowId={(member) => member.id}
  enableSearch
  enablePagination
/>`,
} satisfies ComponentMetadata<DataTableProps<Record<string, unknown>>>
