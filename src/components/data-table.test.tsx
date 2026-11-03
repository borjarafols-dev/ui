import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { createDataTableColumnHelper, DataTable, type DataTableColumnVisibility } from './data-table'

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

// `hidden`: the open Columns popover hides the rest of the page from the accessibility tree.
const headerTexts = () =>
  screen.getAllByRole('columnheader', { hidden: true }).map((header) => header.textContent)

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

  describe('column visibility', () => {
    const hideableColumns = column.columns([
      column.accessor('name', { header: 'Name', enableHiding: false }),
      column.accessor('slug', { header: 'Slug' }),
    ])

    it('lists only hideable columns, and unchecking one removes its header and cells', async () => {
      const user = userEvent.setup()
      render(<DataTable columns={hideableColumns} data={data} getRowId={getRowId} />)

      await user.click(screen.getByRole('button', { name: 'Columns' }))
      const list = await screen.findByRole('dialog', { name: 'Columns' })
      expect(within(list).getAllByRole('checkbox').map((box) => box.closest('label')?.textContent)).toEqual(['Slug'])

      await user.click(within(list).getByRole('checkbox', { name: 'Slug' }))
      expect(headerTexts()).toEqual(['Name'])
      expect(screen.queryByText('alpha')).not.toBeInTheDocument()
      expect(screen.getByRole('rowheader', { name: 'Alpha', hidden: true })).toBeInTheDocument()
    })

    it('has no Columns control when no column can hide', () => {
      render(
        <DataTable
          columns={[column.accessor('name', { header: 'Name', enableHiding: false })]}
          data={data}
          getRowId={getRowId}
        />,
      )

      expect(screen.queryByRole('button', { name: 'Columns' })).not.toBeInTheDocument()
    })

    it('renders the controlled state and reports changes without applying them', async () => {
      const user = userEvent.setup()
      const onColumnVisibilityChange = vi.fn()
      const { rerender } = render(
        <DataTable
          columns={columns}
          data={data}
          getRowId={getRowId}
          columnVisibility={{ slug: false }}
          onColumnVisibilityChange={onColumnVisibilityChange}
        />,
      )
      expect(headerTexts()).toEqual(['Name'])

      await user.click(screen.getByRole('button', { name: 'Columns' }))
      await user.click(await screen.findByRole('checkbox', { name: 'Slug' }))
      expect(onColumnVisibilityChange).toHaveBeenCalledWith({ slug: true })
      expect(headerTexts()).toEqual(['Name'])

      const visibility: DataTableColumnVisibility = { slug: true }
      rerender(
        <DataTable
          columns={columns}
          data={data}
          getRowId={getRowId}
          columnVisibility={visibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
        />,
      )
      expect(headerTexts()).toEqual(['Name', 'Slug'])
    })

    it('works from the keyboard', async () => {
      const user = userEvent.setup()
      render(<DataTable columns={columns} data={data} getRowId={getRowId} />)

      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Columns' }))
      await user.keyboard('{Enter}')
      await screen.findByRole('dialog', { name: 'Columns' })
      await user.tab()
      expect(document.activeElement).toBe(screen.getByRole('checkbox', { name: 'Name' }))
      await user.tab()
      await user.keyboard(' ')
      expect(screen.getByRole('checkbox', { name: 'Slug' })).not.toBeChecked()
      expect(headerTexts()).toEqual(['Name'])

      await user.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Columns' })))
    })

    it('localises the Columns label', () => {
      render(
        <I18nProvider locale="es-ES">
          <DataTable columns={columns} data={data} getRowId={getRowId} />
        </I18nProvider>,
      )

      expect(screen.getByRole('button', { name: 'Columnas' })).toBeInTheDocument()
    })
  })
})
