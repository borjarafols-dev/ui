import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider, RouterProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './button'
import {
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnVisibility,
  type DataTableProps,
} from './data-table'

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
// The replace drops the sort indicator, which is aria-hidden but still text.
const headerTexts = () =>
  screen.getAllByRole('columnheader', { hidden: true }).map((header) => header.textContent?.replace(/[▲▼↕]/, ''))

describe('DataTable', () => {
  it('renders a row per datum, with the first column as row header', () => {
    render(<DataTable columns={columns} data={data} getRowId={getRowId} aria-label="Projects" />)

    const grid = screen.getByRole('grid', { name: 'Projects' })
    expect(grid).toHaveAttribute('data-slot', 'data-table')
    expect(screen.getAllByRole('columnheader').map((header) => header.getAttribute('data-key'))).toEqual([
      'name',
      'slug',
    ])
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
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

  describe('sorting', () => {
    const unsorted: Row[] = [
      { id: 'b', name: 'Beta', slug: 'beta' },
      { id: 'c', name: 'Gamma', slug: 'gamma' },
      { id: 'a', name: 'Alpha', slug: 'alpha' },
    ]

    const names = () => screen.getAllByRole('rowheader').map((cell) => cell.textContent)

    it('sorts on a header click and sets aria-sort', async () => {
      const user = userEvent.setup()
      render(<DataTable columns={columns} data={unsorted} getRowId={getRowId} />)

      const header = screen.getByRole('columnheader', { name: 'Name' })
      await user.click(header)
      expect(names()).toEqual(['Alpha', 'Beta', 'Gamma'])
      expect(header).toHaveAttribute('aria-sort', 'ascending')

      await user.click(header)
      expect(names()).toEqual(['Gamma', 'Beta', 'Alpha'])
      expect(header).toHaveAttribute('aria-sort', 'descending')
    })

    it('sorts with Enter on a focused header', async () => {
      const user = userEvent.setup()
      render(<DataTable columns={columns} data={unsorted} getRowId={getRowId} />)

      await user.tab()
      await user.tab()
      await user.keyboard('{ArrowUp}')
      expect(document.activeElement).toBe(screen.getByRole('columnheader', { name: 'Name' }))

      await user.keyboard('{Enter}')
      expect(names()).toEqual(['Alpha', 'Beta', 'Gamma'])
      expect(document.activeElement).toHaveAttribute('aria-sort', 'ascending')
    })

    it('lets a column opt out of sorting', async () => {
      const user = userEvent.setup()
      const unsortable = column.columns([
        column.accessor('name', { header: 'Name', enableSorting: false }),
        column.accessor('slug', { header: 'Slug' }),
      ])
      render(<DataTable columns={unsortable} data={unsorted} getRowId={getRowId} />)

      const header = screen.getByRole('columnheader', { name: 'Name' })
      await user.click(header)
      expect(names()).toEqual(['Beta', 'Gamma', 'Alpha'])
      expect(header).not.toHaveAttribute('aria-sort')
      expect(screen.getByRole('columnheader', { name: 'Slug' })).toHaveAttribute('aria-sort', 'none')
    })

    it('renders controlled sorting and only reports changes', async () => {
      const user = userEvent.setup()
      const onSortingChange = vi.fn()
      render(
        <DataTable
          columns={columns}
          data={unsorted}
          getRowId={getRowId}
          sorting={[{ id: 'name', desc: true }]}
          onSortingChange={onSortingChange}
        />,
      )

      const header = screen.getByRole('columnheader', { name: 'Name' })
      expect(names()).toEqual(['Gamma', 'Beta', 'Alpha'])
      expect(header).toHaveAttribute('aria-sort', 'descending')

      await user.click(header)
      expect(onSortingChange).toHaveBeenCalledWith([])
      expect(names()).toEqual(['Gamma', 'Beta', 'Alpha'])
    })

    it('leaves the rows in server mode', async () => {
      const user = userEvent.setup()
      const onSortingChange = vi.fn()
      render(
        <DataTable
          mode="server"
          columns={columns}
          data={unsorted}
          getRowId={getRowId}
          onSortingChange={onSortingChange}
        />,
      )

      const header = screen.getByRole('columnheader', { name: 'Name' })
      await user.click(header)
      expect(onSortingChange).toHaveBeenCalledWith([{ id: 'name', desc: false }])
      expect(header).toHaveAttribute('aria-sort', 'ascending')
      expect(names()).toEqual(['Beta', 'Gamma', 'Alpha'])
    })
  })

  describe('search', () => {
    it('filters rows in client mode and reports the filter', async () => {
      const user = userEvent.setup()
      const onGlobalFilterChange = vi.fn()
      render(
        <DataTable
          enableSearch
          columns={columns}
          data={data}
          getRowId={getRowId}
          onGlobalFilterChange={onGlobalFilterChange}
        />,
      )

      await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'bet')
      expect(onGlobalFilterChange).toHaveBeenLastCalledWith('bet')
      expect(screen.getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual(['Beta'])
    })

    it('only reports the filter in server mode', async () => {
      const user = userEvent.setup()
      const onGlobalFilterChange = vi.fn()
      render(
        <DataTable
          mode="server"
          enableSearch
          columns={columns}
          data={data}
          getRowId={getRowId}
          onGlobalFilterChange={onGlobalFilterChange}
        />,
      )

      await user.type(screen.getByRole('searchbox'), 'bet')
      expect(onGlobalFilterChange).toHaveBeenLastCalledWith('bet')
      expect(screen.getAllByRole('rowheader')).toHaveLength(2)
    })

    it('renders a controlled filter and only reports changes', async () => {
      const user = userEvent.setup()
      const onGlobalFilterChange = vi.fn()
      render(
        <DataTable
          enableSearch
          columns={columns}
          data={data}
          getRowId={getRowId}
          globalFilter="alp"
          onGlobalFilterChange={onGlobalFilterChange}
        />,
      )

      const search = screen.getByRole('searchbox')
      expect(search).toHaveValue('alp')
      expect(screen.getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual(['Alpha'])

      await user.type(search, 'x')
      expect(onGlobalFilterChange).toHaveBeenCalledWith('alpx')
      expect(search).toHaveValue('alp')
      expect(screen.getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual(['Alpha'])
    })

    it('localises the search field', () => {
      render(
        <I18nProvider locale="es-ES">
          <DataTable enableSearch columns={columns} data={data} getRowId={getRowId} />
        </I18nProvider>,
      )

      expect(screen.getByRole('searchbox', { name: 'Buscar' })).toHaveAttribute('placeholder', 'Buscar…')
    })
  })

  describe('pagination', () => {
    const many: Row[] = Array.from({ length: 12 }, (_, index) => ({
      id: String(index + 1),
      name: `Item ${String(index + 1).padStart(2, '0')}`,
      slug: `item-${index + 1}`,
    }))

    const names = () => screen.getAllByRole('rowheader').map((cell) => cell.textContent)

    it('shows one page and its position in client mode', async () => {
      const user = userEvent.setup()
      render(
        <DataTable enablePagination pageSizeOptions={[5, 10]} columns={columns} data={many} getRowId={getRowId} />,
      )

      expect(names()).toEqual(['Item 01', 'Item 02', 'Item 03', 'Item 04', 'Item 05'])
      expect(screen.getByText('1–5 of 12')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

      await user.click(screen.getByRole('button', { name: 'Next' }))
      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(names()).toEqual(['Item 11', 'Item 12'])
      expect(screen.getByText('11–12 of 12')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    })

    it('changes the page size from the select', async () => {
      const user = userEvent.setup()
      const onPaginationChange = vi.fn()
      render(
        <DataTable
          enablePagination
          pageSizeOptions={[5, 10]}
          columns={columns}
          data={many}
          getRowId={getRowId}
          onPaginationChange={onPaginationChange}
        />,
      )

      await user.click(screen.getByRole('button', { name: /Rows per page/ }))
      await user.click(screen.getByRole('option', { name: '10' }))
      expect(onPaginationChange).toHaveBeenCalledWith({ pageIndex: 0, pageSize: 10 })
      expect(names()).toHaveLength(10)
      expect(screen.getByText('1–10 of 12')).toBeInTheDocument()
    })

    it('goes back to the first page on a new search', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          enablePagination
          enableSearch
          pageSizeOptions={[5]}
          columns={columns}
          data={many}
          getRowId={getRowId}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Next' }))
      await user.type(screen.getByRole('searchbox'), 'item-1')
      expect(names()).toEqual(['Item 01', 'Item 10', 'Item 11', 'Item 12'])
      expect(screen.getByText('1–4 of 4')).toBeInTheDocument()
    })

    it('renders controlled pagination and only reports changes', async () => {
      const user = userEvent.setup()
      const onPaginationChange = vi.fn()
      render(
        <DataTable
          enablePagination
          columns={columns}
          data={many}
          getRowId={getRowId}
          pagination={{ pageIndex: 1, pageSize: 5 }}
          onPaginationChange={onPaginationChange}
        />,
      )

      expect(names()).toEqual(['Item 06', 'Item 07', 'Item 08', 'Item 09', 'Item 10'])
      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(onPaginationChange).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 5 })
      expect(screen.getByText('6–10 of 12')).toBeInTheDocument()
    })

    it('renders the given rows and uses rowCount in server mode', async () => {
      const user = userEvent.setup()
      const onPaginationChange = vi.fn()
      render(
        <DataTable
          mode="server"
          enablePagination
          columns={columns}
          data={many.slice(0, 3)}
          rowCount={42}
          getRowId={getRowId}
          pagination={{ pageIndex: 2, pageSize: 3 }}
          onPaginationChange={onPaginationChange}
        />,
      )

      expect(names()).toEqual(['Item 01', 'Item 02', 'Item 03'])
      expect(screen.getByText('7–9 of 42')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Next' }))
      expect(onPaginationChange).toHaveBeenCalledWith({ pageIndex: 3, pageSize: 3 })
    })

    it('localises the footer', () => {
      render(
        <I18nProvider locale="ca-ES">
          <DataTable enablePagination pageSizeOptions={[5]} columns={columns} data={many} getRowId={getRowId} />
        </I18nProvider>,
      )

      expect(screen.getByText('1–5 de 12')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Següent' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Files per pàgina/ })).toBeInTheDocument()
    })
  })

  it('defaults to comfortable density', () => {
    render(<DataTable columns={columns} data={data} getRowId={getRowId} />)

    expect(screen.getByRole('grid')).toHaveAttribute('data-density', 'comfortable')
    expect(screen.getByRole('rowheader', { name: 'Alpha' })).toHaveClass('px-6', 'py-4')
    expect(screen.getAllByRole('row')[1]).not.toHaveClass('h-7')
  })

  it('uses compact padding and 28 px rows with density="compact"', () => {
    render(<DataTable columns={columns} data={data} getRowId={getRowId} density="compact" />)

    expect(screen.getByRole('grid')).toHaveAttribute('data-density', 'compact')
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass('px-3', 'py-1.5')
    expect(screen.getByRole('rowheader', { name: 'Alpha' })).toHaveClass('px-3', 'py-1')
    expect(screen.getByRole('rowheader', { name: 'Alpha' })).not.toHaveClass('px-6')
    expect(screen.getAllByRole('row')[1]).toHaveClass('h-7')
  })

  describe('row links', () => {
    const getRowHref = (row: Row) => (row.id === 'a' ? `/projects/${row.slug}` : undefined)

    const renderLinked = (linkColumns: DataTableProps<Row>['columns'] = columns) => {
      const navigate = vi.fn()
      render(
        <RouterProvider navigate={navigate}>
          <DataTable columns={linkColumns} data={data} getRowId={getRowId} getRowHref={getRowHref} />
        </RouterProvider>,
      )
      return navigate
    }

    it('navigates to the row URL on click', async () => {
      const user = userEvent.setup()
      const navigate = renderLinked()

      await user.click(screen.getByRole('rowheader', { name: 'Alpha' }))
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate.mock.calls[0]?.[0]).toBe('/projects/alpha')
    })

    it('navigates with Enter on a focused row', async () => {
      const user = userEvent.setup()
      const navigate = renderLinked()

      await user.tab()
      await user.tab()
      expect(document.activeElement).toBe(screen.getAllByRole('row')[1])
      await user.keyboard('{Enter}')
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate.mock.calls[0]?.[0]).toBe('/projects/alpha')
    })

    it('marks and styles only rows with an href', () => {
      renderLinked()

      const [, linked, plain] = screen.getAllByRole('row')
      expect(linked).toHaveAttribute('data-href', '/projects/alpha')
      expect(linked).toHaveClass('cursor-pointer', 'hover:bg-muted')
      expect(plain).not.toHaveAttribute('data-href')
      expect(plain).not.toHaveClass('cursor-pointer')
    })

    it("doesn't navigate from a row without an href", async () => {
      const user = userEvent.setup()
      const navigate = renderLinked()

      await user.click(screen.getByRole('rowheader', { name: 'Beta' }))
      expect(navigate).not.toHaveBeenCalled()
    })

    it('lets a button in a cell run its own action', async () => {
      const user = userEvent.setup()
      const onArchive = vi.fn()
      const withButton = column.columns([
        column.accessor('name', { header: 'Name' }),
        column.display({
          id: 'actions',
          header: 'Actions',
          cell: (info) => (
            <Button size="sm" onPress={() => onArchive(info.row.original.id)}>
              Archive
            </Button>
          ),
        }),
      ])
      const navigate = renderLinked(withButton)

      await user.click(within(screen.getAllByRole('row')[1]!).getByRole('button', { name: 'Archive' }))
      expect(onArchive).toHaveBeenCalledWith('a')
      expect(navigate).not.toHaveBeenCalled()
    })

    it("doesn't make rows links without getRowHref", async () => {
      const user = userEvent.setup()
      const navigate = vi.fn()
      render(
        <RouterProvider navigate={navigate}>
          <DataTable columns={columns} data={data} getRowId={getRowId} />
        </RouterProvider>,
      )

      const [, first] = screen.getAllByRole('row')
      expect(first).not.toHaveAttribute('data-href')
      expect(first).not.toHaveClass('cursor-pointer')
      await user.click(screen.getByRole('rowheader', { name: 'Alpha' }))
      expect(navigate).not.toHaveBeenCalled()
    })
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
