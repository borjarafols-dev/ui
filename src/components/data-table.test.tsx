import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import {
  createDataTableColumnHelper,
  DataTable,
  type DataTableColumnVisibility,
  type DataTableExpanded,
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

  describe('nested rows', () => {
    interface Job {
      id: string
      name: string
      slug: string
      steps?: Job[]
    }

    const jobs: Job[] = [
      {
        id: 'build',
        name: 'Build',
        slug: 'build',
        steps: [
          { id: 'build-install', name: 'Install', slug: 'install' },
          { id: 'build-compile', name: 'Compile', slug: 'compile' },
        ],
      },
      { id: 'deploy', name: 'Deploy', slug: 'deploy' },
    ]

    const jobColumn = createDataTableColumnHelper<Job>()
    const jobColumns = jobColumn.columns([
      jobColumn.accessor('name', { header: 'Name', enableHiding: false }),
      jobColumn.accessor('slug', { header: 'Slug' }),
    ])

    const getJobId = (job: Job) => job.id
    const getSteps = (job: Job) => job.steps
    const rowOf = (name: string) => screen.getByRole('rowheader', { name: new RegExp(name) }).closest('[role="row"]')!

    it('is a tree grid whose parent rows expand to their children with the chevron', async () => {
      const user = userEvent.setup()
      render(<DataTable columns={jobColumns} data={jobs} getRowId={getJobId} getSubRows={getSteps} aria-label="Jobs" />)

      expect(screen.getByRole('treegrid', { name: 'Jobs' })).toBeInTheDocument()
      expect(rowOf('Build')).toHaveAttribute('aria-expanded', 'false')
      expect(rowOf('Deploy')).not.toHaveAttribute('aria-expanded')
      expect(screen.queryByRole('rowheader', { name: 'Install' })).not.toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: 'Expand row Build' })).toHaveLength(1)

      await user.click(screen.getByRole('button', { name: 'Expand row Build' }))
      expect(rowOf('Build')).toHaveAttribute('aria-expanded', 'true')
      expect(rowOf('Build')).toHaveAttribute('data-expanded', 'true')
      expect(rowOf('Install')).toHaveAttribute('data-level', '2')
      expect(screen.getAllByRole('rowheader').map((header) => header.textContent)).toEqual([
        'Build',
        'Install',
        'Compile',
        'Deploy',
      ])

      await user.click(screen.getByRole('button', { name: 'Collapse row Build' }))
      expect(rowOf('Build')).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('rowheader', { name: 'Install' })).not.toBeInTheDocument()
    })

    it('expands with Arrow Right and collapses with Arrow Left', async () => {
      const user = userEvent.setup()
      render(<DataTable columns={jobColumns} data={jobs} getRowId={getJobId} getSubRows={getSteps} />)

      await user.tab()
      await user.tab()
      expect(document.activeElement).toBe(rowOf('Build'))

      await user.keyboard('{ArrowRight}')
      expect(rowOf('Build')).toHaveAttribute('aria-expanded', 'true')
      expect(rowOf('Install')).toBeInTheDocument()

      await user.keyboard('{ArrowDown}{ArrowLeft}')
      expect(document.activeElement).toBe(rowOf('Build'))

      await user.keyboard('{ArrowLeft}')
      expect(rowOf('Build')).toHaveAttribute('aria-expanded', 'false')
      expect(screen.queryByRole('rowheader', { name: 'Install' })).not.toBeInTheDocument()
    })

    it('indents children in the tree column', () => {
      render(
        <DataTable
          columns={jobColumns}
          data={jobs}
          getRowId={getJobId}
          getSubRows={getSteps}
          expanded={{ build: true }}
        />,
      )

      const indent = (name: string) =>
        (screen.getByRole('rowheader', { name: new RegExp(name) }).firstElementChild as HTMLElement).style
          .paddingInlineStart
      expect(indent('Build')).toBe('calc(var(--spacing) * 5 * 0)')
      expect(indent('Install')).toBe('calc(var(--spacing) * 5 * 1)')
    })

    it('renders the controlled state and reports changes without applying them', async () => {
      const user = userEvent.setup()
      const onExpandedChange = vi.fn()
      const { rerender } = render(
        <DataTable
          columns={jobColumns}
          data={jobs}
          getRowId={getJobId}
          getSubRows={getSteps}
          expanded={{ build: true }}
          onExpandedChange={onExpandedChange}
        />,
      )
      expect(rowOf('Install')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Collapse row Build' }))
      expect(onExpandedChange).toHaveBeenCalledWith({})
      expect(rowOf('Install')).toBeInTheDocument()

      const expanded: DataTableExpanded = {}
      rerender(
        <DataTable
          columns={jobColumns}
          data={jobs}
          getRowId={getJobId}
          getSubRows={getSteps}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
        />,
      )
      expect(screen.queryByRole('rowheader', { name: 'Install' })).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Expand row Build' }))
      expect(onExpandedChange).toHaveBeenLastCalledWith({ build: true })
    })

    it('expands every parent with expanded={true}', () => {
      render(<DataTable columns={jobColumns} data={jobs} getRowId={getJobId} getSubRows={getSteps} expanded />)

      expect(rowOf('Build')).toHaveAttribute('aria-expanded', 'true')
      expect(rowOf('Compile')).toBeInTheDocument()
    })

    it('keeps rows expanded when data changes', async () => {
      const user = userEvent.setup()
      const { rerender } = render(
        <DataTable columns={jobColumns} data={jobs} getRowId={getJobId} getSubRows={getSteps} />,
      )
      await user.click(screen.getByRole('button', { name: 'Expand row Build' }))

      rerender(<DataTable columns={jobColumns} data={[...jobs]} getRowId={getJobId} getSubRows={getSteps} />)
      expect(rowOf('Install')).toBeInTheDocument()
    })

    it('hides a column of child rows too', async () => {
      const user = userEvent.setup()
      render(
        <DataTable
          columns={jobColumns}
          data={jobs}
          getRowId={getJobId}
          getSubRows={getSteps}
          expanded={{ build: true }}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Columns' }))
      await user.click(await screen.findByRole('checkbox', { name: 'Slug' }))
      expect(headerTexts()).toEqual(['Name'])
      expect(screen.queryByText('install')).not.toBeInTheDocument()
    })

    it('localises the expand button', () => {
      render(
        <I18nProvider locale="es-ES">
          <DataTable columns={jobColumns} data={jobs} getRowId={getJobId} getSubRows={getSteps} />
        </I18nProvider>,
      )

      expect(screen.getByRole('button', { name: 'Expandir fila Build' })).toBeInTheDocument()
    })
  })
})
