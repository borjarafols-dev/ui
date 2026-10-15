import type { ComponentMetadata } from '../metadata/schema'
import type { DataTableProps } from './data-table'

export default {
  component: 'DataTable',
  sourceHash: 'sha256:49c455eab370a9ea1e218d0307764b5047629587b9eb432820a5f91e5bd67086',
  category: 'data',
  summary: 'A read-only, keyboard-navigable table rendered from columns and rows of data.',
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
  keyProps: ['columns', 'data', 'keyField', 'aria-label', 'emptyMessage'],
  antiPatterns: [
    'Leaving aria-label at its default "Data table"; name what the table lists ("Members").',
    'Putting the identifying column (name, title) anywhere but first; the first column is the row header.',
    'Formatting values inline in data; use a column render function, for example a Badge for status.',
  ],
  accessibility: [
    'Built on React Aria Table: grid semantics, arrow-key navigation and row headers.',
    'The caller provides the accessible name (aria-label) and readable cell content.',
  ],
  example: `<DataTable
  aria-label="Members"
  keyField="id"
  data={members}
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (v) => <Badge>{String(v)}</Badge> },
  ]}
/>`,
} satisfies ComponentMetadata<DataTableProps<object>>
