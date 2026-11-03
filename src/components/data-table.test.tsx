import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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

  describe('live insert', () => {
    const gamma: Row = { id: 'c', name: 'Gamma', slug: 'gamma' }
    const live = (rows: Row[]) => <DataTable columns={columns} data={rows} getRowId={getRowId} holdNewRows />
    const bodyRowCount = () => screen.getAllByRole('row').length - 1

    it('holds new rows while the pointer is in the table, and shows them on press', async () => {
      const user = userEvent.setup()
      const { rerender } = render(live(data))

      await user.hover(screen.getByRole('rowheader', { name: 'Alpha' }))
      rerender(live([gamma, ...data]))

      expect(bodyRowCount()).toBe(2)
      expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
      expect(screen.getByRole('grid')).toHaveAttribute('data-held')
      const button = screen.getByRole('button', { name: 'Show 1 new row' })
      expect(button).toHaveAttribute('data-slot', 'data-table-new-rows')

      await user.click(button)
      expect(bodyRowCount()).toBe(3)
      expect(screen.getAllByRole('row')[1]).toHaveAttribute('data-key', 'c')
      expect(screen.queryByRole('button', { name: /new row/ })).not.toBeInTheDocument()
      expect(screen.getByRole('grid')).not.toHaveAttribute('data-held')
    })

    it('shows held rows when the pointer leaves', async () => {
      const user = userEvent.setup()
      const { rerender } = render(live(data))

      await user.hover(screen.getByRole('rowheader', { name: 'Alpha' }))
      rerender(live([gamma, ...data]))
      expect(bodyRowCount()).toBe(2)

      await user.unhover(screen.getByRole('rowheader', { name: 'Alpha' }))
      expect(bodyRowCount()).toBe(3)
    })

    it('holds new rows while focus is in the table, and shows them when focus leaves', async () => {
      const user = userEvent.setup()
      const { rerender } = render(
        <>
          {live(data)}
          <button type="button">Elsewhere</button>
        </>,
      )

      await user.tab()
      await user.tab()
      expect(screen.getByRole('grid')).toContainElement(document.activeElement as HTMLElement)
      rerender(
        <>
          {live([gamma, ...data])}
          <button type="button">Elsewhere</button>
        </>,
      )
      expect(bodyRowCount()).toBe(2)
      expect(screen.getByRole('button', { name: 'Show 1 new row' })).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Elsewhere' }))
      expect(bodyRowCount()).toBe(3)
    })

    it('presses the button from the keyboard and keeps focus in the table', async () => {
      const user = userEvent.setup()
      const { rerender } = render(live(data))

      await user.tab()
      await user.tab()
      rerender(live([gamma, ...data]))
      await user.tab({ shift: true })
      await user.tab({ shift: true })
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Show 1 new row' }))

      await user.keyboard('{Enter}')
      expect(bodyRowCount()).toBe(3)
      expect(screen.getByRole('grid')).toContainElement(document.activeElement as HTMLElement)
    })

    it('inserts new rows at once with pointer and focus outside', () => {
      const { rerender } = render(live(data))

      rerender(live([gamma, ...data]))

      expect(bodyRowCount()).toBe(3)
      expect(screen.queryByRole('button', { name: /new row/ })).not.toBeInTheDocument()
    })

    it('applies updates and removals to shown rows while rows are held', async () => {
      const user = userEvent.setup()
      const { rerender } = render(live(data))

      await user.hover(screen.getByRole('rowheader', { name: 'Alpha' }))
      rerender(live([gamma, { id: 'a', name: 'Alpha', slug: 'alpha-2' }]))

      expect(screen.getByText('alpha-2')).toBeInTheDocument()
      expect(screen.queryByText('Beta')).not.toBeInTheDocument()
      expect(screen.queryByText('Gamma')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Show 1 new row' })).toBeInTheDocument()
    })

    it('announces the held count politely', async () => {
      const user = userEvent.setup()
      const delta: Row = { id: 'd', name: 'Delta', slug: 'delta' }
      const { rerender } = render(live(data))
      expect(screen.getByRole('status')).toBeEmptyDOMElement()

      await user.hover(screen.getByRole('rowheader', { name: 'Alpha' }))
      rerender(live([delta, gamma, ...data]))

      expect(screen.getByRole('status')).toHaveTextContent('Show 2 new rows')
    })

    it('uses showNewRowsLabel and localises the default label', () => {
      const { rerender } = render(
        <I18nProvider locale="ca-ES">
          <DataTable columns={columns} data={data} getRowId={getRowId} holdNewRows />
        </I18nProvider>,
      )
      fireEvent.pointerEnter(screen.getByRole('grid'))
      rerender(
        <I18nProvider locale="ca-ES">
          <DataTable columns={columns} data={[gamma, ...data]} getRowId={getRowId} holdNewRows />
        </I18nProvider>,
      )
      expect(screen.getByRole('button', { name: 'Mostra 1 fila nova' })).toBeInTheDocument()

      rerender(
        <I18nProvider locale="ca-ES">
          <DataTable
            columns={columns}
            data={[gamma, ...data]}
            getRowId={getRowId}
            holdNewRows
            showNewRowsLabel={(count) => `${count} more`}
          />
        </I18nProvider>,
      )
      expect(screen.getByRole('button', { name: '1 more' })).toBeInTheDocument()
    })

    it('never holds without holdNewRows', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<DataTable columns={columns} data={data} getRowId={getRowId} />)

      await user.hover(screen.getByRole('rowheader', { name: 'Alpha' }))
      rerender(<DataTable columns={columns} data={[gamma, ...data]} getRowId={getRowId} />)

      expect(bodyRowCount()).toBe(3)
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })
})
