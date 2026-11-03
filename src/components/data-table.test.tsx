import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria-components'
import { describe, expect, it } from 'vitest'

import { createDataTableColumnHelper, DataTable } from './data-table'

interface Row {
  id: string
  name: string
  slug: string
}

const data: Row[] = [
  { id: 'a', name: 'Alpha', slug: 'alpha' },
  { id: 'b', name: 'Beta', slug: 'beta' },
]

const column = createDataTableColumnHelper<Row>()

const columns = column.columns([
  column.accessor('name', { header: 'Name' }),
  column.accessor('slug', {
    header: 'Slug',
    cell: (info) => <span data-testid="slug-cell">{info.getValue()}</span>,
  }),
])

const getRowId = (row: Row) => row.id

describe('DataTable', () => {
  it('renders a row per datum, with the first column as row header', () => {
    render(<DataTable columns={columns} data={data} getRowId={getRowId} aria-label="Projects" />)

    const grid = screen.getByRole('grid', { name: 'Projects' })
    expect(grid).toHaveAttribute('data-slot', 'data-table')
    expect(screen.getAllByRole('columnheader').map((header) => header.textContent)).toEqual(['Name', 'Slug'])
    expect(screen.getByRole('rowheader', { name: 'Alpha' })).toBeInTheDocument()
    expect(screen.getAllByTestId('slug-cell').map((cell) => cell.textContent)).toEqual(['alpha', 'beta'])
  })

  it('keys rows by getRowId', () => {
    render(<DataTable columns={columns} data={data} getRowId={getRowId} />)

    const [, first] = screen.getAllByRole('row')
    expect(first).toHaveAttribute('data-key', 'a')
  })

  it('moves between cells with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<DataTable columns={columns} data={data} getRowId={getRowId} />)

    await user.tab()
    expect(document.activeElement).toBe(screen.getAllByRole('row')[1])

    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(document.activeElement).toHaveTextContent('alpha')

    await user.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('beta')
  })

  it('shows the empty message', () => {
    render(<DataTable columns={columns} data={[]} getRowId={getRowId} emptyMessage="Nothing here." />)

    expect(screen.getByText('Nothing here.')).toBeInTheDocument()
  })

  it('shows the default empty message', () => {
    render(<DataTable columns={columns} data={[]} getRowId={getRowId} />)

    expect(screen.getByText('No data available.')).toBeInTheDocument()
  })

  it('localises its default name and empty message', () => {
    render(
      <I18nProvider locale="ca-ES">
        <DataTable columns={columns} data={[]} getRowId={getRowId} />
      </I18nProvider>,
    )

    expect(screen.getByRole('grid', { name: 'Taula de dades' })).toBeInTheDocument()
    expect(screen.getByText('No hi ha dades disponibles.')).toBeInTheDocument()
  })
})
