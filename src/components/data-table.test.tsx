import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DataTable, type DataTableColumn } from './data-table'

interface Row {
  id: string
  name: string
  slug: string
}

const data: Row[] = [
  { id: '1', name: 'Alpha', slug: 'alpha' },
  { id: '2', name: 'Beta', slug: 'beta' },
]

const columns: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name' },
  { key: 'slug', header: 'Slug', render: (value) => <span data-testid="slug-cell">{String(value)}</span> },
]

describe('DataTable', () => {
  it('renders a row per datum, with the first column as row header', () => {
    render(<DataTable columns={columns} data={data} keyField="id" aria-label="Projects" />)

    expect(screen.getByRole('grid', { name: 'Projects' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Alpha' })).toBeInTheDocument()
    expect(screen.getAllByTestId('slug-cell')).toHaveLength(2)
  })

  it('shows the empty message', () => {
    render(<DataTable columns={columns} data={[]} keyField="id" />)

    expect(screen.getByText('No data available.')).toBeInTheDocument()
  })
})
