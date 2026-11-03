import type { ComponentMetadata } from '../metadata/schema'
import type { DataTableProps } from './data-table'

export default {
  component: 'DataTable',
  sourceHash: 'sha256:ffaa5bf3fc1c31317f05d12a3d3fe1ab6cd15f5e7f3f89d054c003ca699a49b6',
  category: 'data',
  summary: 'A read-only, keyboard-navigable table whose rows TanStack Table builds from column definitions and data.',
  whenToUse: [
    'Lists of records with several comparable fields, such as members, invoices or bookings.',
    'Admin views where people scan rows and compare columns.',
  ],
  whenNotToUse: [
    'A handful of items with one or two fields: use a simple list or Cards.',
    'No rows yet: DataTable shows emptyMessage, but for a whole empty section use EmptyState.',
    'Sorting or pagination: not supported yet, so request it in the library instead of wrapping another table.',
  ],
  alternatives: [
    { component: 'Card', when: 'Items are few and each needs its own actions or rich content.' },
    { component: 'EmptyState', when: 'The section has no data and needs a call to action.' },
  ],
  keyProps: ['columns', 'data', 'getRowId', 'aria-label', 'emptyMessage'],
  antiPatterns: [
    'Leaving aria-label at its generic localised default; name what the table lists ("Members").',
    'Putting the identifying column (name, title) anywhere but first; the first column is the row header.',
    'Formatting values inline in data; use the column’s cell function, for example a Badge for status.',
    'Writing column objects by hand or keying rows by index; build columns with createDataTableColumnHelper and pass getRowId.',
  ],
  accessibility: [
    'Rendered with React Aria Table: grid semantics, arrow-key cell navigation and row headers.',
    'The default name and empty message are localised (en, es, ca) from React Aria’s locale.',
    'The caller provides the accessible name (aria-label) and readable cell content.',
  ],
  example: `const column = createDataTableColumnHelper<Member>()
const columns = column.columns([
  column.accessor('name', { header: 'Name' }),
  column.accessor('email', { header: 'Email' }),
  column.accessor('status', { header: 'Status', cell: (info) => <Badge>{info.getValue()}</Badge> }),
])

<DataTable aria-label="Members" columns={columns} data={members} getRowId={(member) => member.id} />`,
} satisfies ComponentMetadata<DataTableProps<Record<string, unknown>>>
