import {
  type CellData,
  type Column as TanStackColumn,
  type ColumnDef,
  type ColumnHelper,
  columnFilteringFeature,
  type ColumnVisibilityState,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  type ExpandedState,
  FlexRender,
  functionalUpdate,
  globalFilteringFeature,
  type PaginationState,
  type Row as TanStackRow,
  type RowData,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  type SortingState,
  tableFeatures,
  type Updater,
  useTable,
} from '@tanstack/react-table'
import * as React from 'react'
import {
  Button as AriaButton,
  Cell,
  Collection,
  Column,
  Dialog,
  DialogTrigger,
  type Key,
  Popover,
  Row,
  type SortDescriptor,
  Table,
  TableBody,
  TableHeader,
  useLocale,
} from 'react-aria-components'

import { useStrings } from '../i18n/strings'
import { table } from '../recipes/table'
import { Button } from './button'
import { Checkbox } from './checkbox'
import { SearchField } from './search-field'
import { Select } from './select'

const features = tableFeatures({
  columnVisibilityFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowExpandingFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic, datetime: sortFn_datetime, text: sortFn_text },
})

type DataTableFeatures = typeof features

type DataTableRow<T extends RowData> = TanStackRow<DataTableFeatures, T>

/** A TanStack column definition for `DataTable`. */
export type DataTableColumnDef<T extends RowData, TValue extends CellData = CellData> = ColumnDef<
  DataTableFeatures,
  T,
  TValue
>

/** A TanStack column helper typed for `DataTable`'s features. */
export type DataTableColumnHelper<T extends RowData> = ColumnHelper<DataTableFeatures, T>

/** TanStack's sorting state: the sorted column ids, in priority order. */
export type DataTableSorting = SortingState

/** TanStack's pagination state: a zero-based `pageIndex` and a `pageSize`. */
export type DataTablePagination = PaginationState

/** Visibility by column id; a column missing from the map is visible. */
export type DataTableColumnVisibility = ColumnVisibilityState

/** Expanded rows by row id, or `true` for every row. */
export type DataTableExpanded = ExpandedState

/**
 * Creates the column helper for `DataTable` rows of type `T`, so `accessor`
 * infers each cell's value type.
 */
export function createDataTableColumnHelper<T extends RowData>(): DataTableColumnHelper<T> {
  return createColumnHelper<DataTableFeatures, T>()
}

export interface DataTableProps<T extends RowData> {
  // `any`, as in TanStack's `helper.columns`: each column of one table has its own value type.
  columns: ReadonlyArray<DataTableColumnDef<T, any>>
  data: ReadonlyArray<T>
  /** Returns the row's stable id, used as its React Aria key. */
  getRowId: (row: T, index: number) => string
  /**
   * `client` sorts, searches and pages `data` itself. `server` renders `data`
   * as the current page and only reports state changes, for the app to fetch.
   */
  mode?: 'client' | 'server'
  /** Server mode: the total number of rows across every page. */
  rowCount?: number
  /** Sorted columns. Every header sorts; a column opts out with `enableSorting: false`. */
  sorting?: DataTableSorting
  onSortingChange?: (sorting: DataTableSorting) => void
  /** Shows a search field above the table, bound to `globalFilter`. */
  enableSearch?: boolean
  globalFilter?: string
  onGlobalFilterChange?: (globalFilter: string) => void
  /** Shows the paging footer and renders one page of rows. */
  enablePagination?: boolean
  pagination?: DataTablePagination
  onPaginationChange?: (pagination: DataTablePagination) => void
  /** Choices of the page-size select. The first one is the initial page size. */
  pageSizeOptions?: ReadonlyArray<number>
  /** Visible columns, controlled. Without it the table keeps its own state, starting with every column shown. */
  columnVisibility?: DataTableColumnVisibility
  onColumnVisibilityChange?: (columnVisibility: DataTableColumnVisibility) => void
  /** Child rows of a row. Turns the table into a tree; the first column holds the expand control. */
  getSubRows?: (row: T, index: number) => ReadonlyArray<T> | undefined
  /** Expanded rows, controlled. Without it the table keeps its own state, starting collapsed. */
  expanded?: DataTableExpanded
  onExpandedChange?: (expanded: DataTableExpanded) => void
  /** Row height and padding. Defaults to `'comfortable'`. */
  density?: 'comfortable' | 'compact'
  /** Hold rows with new ids while the pointer or focus is in the table, behind a button that shows them. */
  holdNewRows?: boolean
  /** Label of the button that shows held rows. Defaults to a localised "Show {n} new rows". */
  showNewRowsLabel?: (count: number) => string
  /** URL a row opens, navigated through the app's `RouterProvider`. Return undefined for rows that don't link. */
  getRowHref?: (row: T) => string | undefined
  /** Accessible name of the table. Defaults to a localised name. */
  'aria-label'?: string
  /** Shown when there are no rows. Defaults to a localised message. */
  emptyMessage?: React.ReactNode
  className?: string
}

const defaultPageSizeOptions = [10, 25, 50, 100]

function useControllableState<V>(
  value: V | undefined,
  initialValue: V,
  onChange: ((value: V) => void) | undefined,
): [V, (updater: Updater<V>) => void] {
  const [internal, setInternal] = React.useState(initialValue)
  const current = value === undefined ? internal : value
  const update = (updater: Updater<V>) => {
    const next = functionalUpdate(updater, current)
    if (value === undefined) setInternal(next)
    onChange?.(next)
  }
  return [current, update]
}

interface HeldRows<T extends RowData> {
  data: ReadonlyArray<T>
  getSubRows: ((row: T, index: number) => ReadonlyArray<T> | undefined) | undefined
  getRowId: (row: T, index: number) => string
  heldCount: number
  enter: (via: 'pointer' | 'focus') => void
  leave: (via: 'pointer' | 'focus') => void
  show: () => void
  /** The next `data` answers a change the user made, so its rows show instead of being held. */
  showNextData: () => void
}

function useHeldRows<T extends RowData>(
  data: ReadonlyArray<T>,
  getRowId: (row: T, index: number) => string,
  getSubRows: ((row: T, index: number) => ReadonlyArray<T> | undefined) | undefined,
  holdNewRows: boolean,
): HeldRows<T> {
  const inside = React.useRef({ pointer: false, focus: false })
  // Ids shown when the pointer or focus came in; null while nothing is held.
  const [shownIds, setShownIds] = React.useState<ReadonlySet<string> | null>(null)
  // The `data` on screen when the user changed the sort, search or page; the next `data` answers it.
  const [answered, setAnswered] = React.useState<ReadonlyArray<T> | null>(null)

  // Filtering shifts indexes, so ids are computed once against the full tree and TanStack gets them back.
  const idOf = new Map<T, string>()
  const collect = (rows: ReadonlyArray<T>) =>
    rows.forEach((row, index) => {
      idOf.set(row, getRowId(row, index))
      const subRows = getSubRows?.(row, index)
      if (subRows) collect(subRows)
    })
  collect(data)
  const allIds = () => new Set(idOf.values())

  if (!holdNewRows && shownIds !== null) setShownIds(null)
  if (answered !== null && data !== answered) {
    setAnswered(null)
    if (shownIds !== null) setShownIds(allIds())
  }

  // By id, not by `idOf`: `getSubRows` may build new child objects on every call.
  const isShown = (row: T, index: number) => shownIds === null || shownIds.has(getRowId(row, index))
  // A held parent counts once: its children arrive with it.
  const countHeld = (rows: ReadonlyArray<T>): number =>
    rows.reduce((count, row, index) => count + (isShown(row, index) ? countHeld(getSubRows?.(row, index) ?? []) : 1), 0)

  return {
    data: shownIds === null ? data : data.filter(isShown),
    getSubRows:
      shownIds === null || !getSubRows ? getSubRows : (row, index) => getSubRows(row, index)?.filter(isShown),
    getRowId: (row, index) => idOf.get(row) ?? getRowId(row, index),
    heldCount: shownIds === null ? 0 : countHeld(data),
    enter: (via) => {
      if (holdNewRows && !inside.current.pointer && !inside.current.focus) setShownIds(allIds())
      inside.current[via] = true
    },
    leave: (via) => {
      inside.current[via] = false
      if (!inside.current.pointer && !inside.current.focus) setShownIds(null)
    },
    show: () => setShownIds(allIds()),
    showNextData: () => setAnswered(data),
  }
}

function DataTableColumnsMenu<T extends RowData>({
  columns,
}: {
  columns: ReadonlyArray<TanStackColumn<DataTableFeatures, T, unknown>>
}) {
  const t = useStrings()
  const slots = table()
  return (
    <DialogTrigger>
      <Button variant="outline" size="sm" className={slots.columnsButton()}>
        {t.columns}
      </Button>
      <Popover placement="bottom end" className={slots.popover()}>
        <Dialog aria-label={t.columns} className={slots.columnList()}>
          {columns.map((column) => (
            <Checkbox
              key={column.id}
              label={typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
              isSelected={column.getIsVisible()}
              onChange={(isSelected) => column.toggleVisibility(isSelected)}
            />
          ))}
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}

interface DataTablePaginationFooterProps {
  pagination: DataTablePagination
  pageSizeOptions: ReadonlyArray<number>
  rowsOnPage: number
  total: number
  canPreviousPage: boolean
  canNextPage: boolean
  onPageSizeChange: (pageSize: number) => void
  onPreviousPage: () => void
  onNextPage: () => void
}

function DataTablePaginationFooter({
  pagination,
  pageSizeOptions,
  rowsOnPage,
  total,
  canPreviousPage,
  canNextPage,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
}: DataTablePaginationFooterProps) {
  const t = useStrings()
  const { locale } = useLocale()
  const slots = table()
  const format = new Intl.NumberFormat(locale)
  const first = rowsOnPage === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1
  const last = rowsOnPage === 0 ? 0 : first + rowsOnPage - 1
  return (
    <div data-slot="data-table-pagination" className={slots.footer()}>
      <Select
        label={t.pageSize}
        options={pageSizeOptions.map((size) => ({ value: String(size), label: format.format(size) }))}
        selectedKey={String(pagination.pageSize)}
        onSelectionChange={(key) => onPageSizeChange(Number(key))}
        className={slots.pageSize()}
      />
      <span aria-live="polite" className={slots.position()}>
        {t.pageRange(format.format(first), format.format(last), format.format(total))}
      </span>
      <div className={slots.pager()}>
        <Button variant="outline" size="sm" isDisabled={!canPreviousPage} onPress={onPreviousPage}>
          {t.previousPage}
        </Button>
        <Button variant="outline" size="sm" isDisabled={!canNextPage} onPress={onNextPage}>
          {t.nextPage}
        </Button>
      </div>
    </div>
  )
}

/**
 * Data table: TanStack Table computes the rows from `columns` and `data`
 * (sorting, global search, paging, column visibility), React Aria's `Table`
 * renders them (grid role, keyboard cell navigation, row headers,
 * `aria-sort`). Every state slice is uncontrolled by default and controlled
 * when its value prop is passed. The first column is the row header.
 * A Columns button above the table hides and shows columns; a column with
 * `enableHiding: false` always shows and has no checkbox. With `getSubRows`
 * the table is a tree grid: a parent row expands to its children with its
 * chevron or the arrow keys; sorting and search keep children under their
 * parent. With `getRowHref`, a press or Enter on a row opens its URL; buttons
 * in cells keep their own action.
 * With `holdNewRows`, rows with an unseen id wait behind a "Show n new rows"
 * button while the pointer or focus is in the table, so the row being read
 * doesn't move; rows already shown update in place and removed rows go at once.
 *
 * @usage Build `columns` with `createDataTableColumnHelper<Row>()` and give every row a stable id with `getRowId`.
 * @usage Put the column that identifies the row (name, title) first, and give it `enableHiding: false`.
 * @usage Give every hideable column a string `header`: it labels the column's checkbox (a non-string header falls back to the column id).
 * @usage For data paged by an API, use `mode="server"` with `rowCount` and fetch on `onSortingChange`, `onGlobalFilterChange` and `onPaginationChange`; pass the fetched page as `data`.
 * @usage To keep the table's state in the URL, pass `sorting`, `globalFilter`, `pagination` and `columnVisibility` with their change handlers.
 * @usage Compact density for operational lists read at a glance; comfortable for everything else.
 * @usage Nested rows for one level of parent and children (a job and its steps); not for deep file trees: use a tree.
 * @usage Child row ids from `getRowId` must be unique across the whole tree.
 * @usage getRowHref when the row opens a record; don't also put an "Open" button in the row.
 * @usage holdNewRows for lists that update while the user reads them; not for lists that only change after a user action.
 */
export function DataTable<T extends RowData>({
  columns,
  data,
  getRowId,
  mode = 'client',
  rowCount,
  sorting: sortingProp,
  onSortingChange,
  enableSearch = false,
  globalFilter: globalFilterProp,
  onGlobalFilterChange,
  enablePagination = false,
  pagination: paginationProp,
  onPaginationChange,
  pageSizeOptions = defaultPageSizeOptions,
  columnVisibility,
  onColumnVisibilityChange,
  getSubRows,
  expanded,
  onExpandedChange,
  density = 'comfortable',
  getRowHref,
  holdNewRows = false,
  showNewRowsLabel,
  'aria-label': ariaLabel,
  emptyMessage,
  className,
}: DataTableProps<T>) {
  const t = useStrings()
  const slots = table({ density })
  const [sorting, setSorting] = useControllableState(sortingProp, [], onSortingChange)
  const [globalFilter, setGlobalFilter] = useControllableState(globalFilterProp, '', onGlobalFilterChange)
  const [pagination, setPagination] = useControllableState(
    paginationProp,
    { pageIndex: 0, pageSize: pageSizeOptions[0] ?? defaultPageSizeOptions[0]! },
    onPaginationChange,
  )
  const [visibility, setVisibility] = useControllableState(columnVisibility, {}, onColumnVisibilityChange)
  const [expansion, setExpansion] = useControllableState<DataTableExpanded>(expanded, {}, onExpandedChange)
  const isServer = mode === 'server'

  const tableRef = React.useRef<HTMLTableElement>(null)
  const held = useHeldRows(data, getRowId, getSubRows, holdNewRows)
  const showNewRows = () => {
    tableRef.current?.focus()
    held.show()
  }
  const newRowsLabel = (showNewRowsLabel ?? t.newRows)(held.heldCount)

  // A new sort or search changes which rows exist, so the user goes back to
  // the first page. TanStack's own reset is off: it also fires on new `data`,
  // which in server mode is every page change.
  const toFirstPage = () => {
    if (enablePagination && pagination.pageIndex !== 0) setPagination({ ...pagination, pageIndex: 0 })
  }
  // In server mode the app answers a sort, search or page change with new rows, which aren't new to the user.
  const userChanged = () => {
    if (isServer) held.showNextData()
  }

  const instance = useTable({
    features,
    columns,
    data: held.data,
    getRowId: held.getRowId,
    getSubRows: held.getSubRows,
    state: { sorting, globalFilter, pagination, columnVisibility: visibility, expanded: expansion },
    onSortingChange: (updater) => {
      setSorting(updater)
      toFirstPage()
      userChanged()
    },
    onGlobalFilterChange: (updater) => {
      setGlobalFilter(updater)
      toFirstPage()
      userChanged()
    },
    onPaginationChange: (updater) => {
      setPagination(updater)
      userChanged()
    },
    onColumnVisibilityChange: setVisibility,
    onExpandedChange: setExpansion,
    enableMultiSort: false,
    manualSorting: isServer,
    manualFiltering: isServer,
    // A step that matches the search shows under its job, which would otherwise hide it.
    filterFromLeafRows: true,
    manualPagination: isServer || !enablePagination,
    autoResetPageIndex: false,
    // TanStack would collapse every row whenever `data` changes, such as on a refetch.
    autoResetExpanded: false,
    rowCount: isServer ? rowCount : undefined,
  })

  const headers = instance.getLeafHeaders()
  const firstColumnId = headers[0]?.column.id
  const isTree = getSubRows !== undefined
  const rows = instance.getRowModel().rows
  const expandedKeys = React.useMemo(() => {
    if (expansion !== true) return Object.keys(expansion).filter((id) => expansion[id])
    const parents: string[] = []
    const collect = (level: ReadonlyArray<DataTableRow<T>>) => {
      for (const row of level) {
        if (row.subRows.length === 0) continue
        parents.push(row.id)
        collect(row.subRows)
      }
    }
    collect(rows)
    return parents
  }, [expansion, rows])
  // React Aria renders the rows (the tree, keyboard and expand buttons) from the full tree; TanStack holds the state.
  const setExpandedKeys = (keys: Set<Key>) =>
    instance.setExpanded(Object.fromEntries([...keys].map((key) => [String(key), true])))
  const hideableColumns = instance.getAllLeafColumns().filter((column) => column.getCanHide())
  const [sorted] = sorting
  const sortDescriptor: SortDescriptor | undefined = sorted
    ? { column: sorted.id, direction: sorted.desc ? 'descending' : 'ascending' }
    : undefined

  // TanStack keeps the same row objects when only visibility changes, so React Aria would reuse their cells.
  const renderRow = (row: DataTableRow<T>) => {
    const href = getRowHref?.(row.original)
    return (
      <Row id={row.id} href={href} data-href={href} className={slots.row({ link: href !== undefined })}>
        <Collection items={row.getVisibleCells()} dependencies={[visibility]}>
          {(cell) => (
            <Cell id={cell.id} className={slots.cell()}>
              {({ isTreeColumn, hasChildItems, isExpanded, level }) =>
                isTreeColumn ? (
                  <div className={slots.treeCell({ nested: level > 1 })}>
                    {hasChildItems ? (
                      <AriaButton
                        slot="chevron"
                        aria-label={isExpanded ? t.collapseRow : t.expandRow}
                        className={slots.expand()}
                      >
                        <svg viewBox="0 0 12 12" className={slots.expandIcon()} aria-hidden="true">
                          <path
                            d="M4.5 2.5 8 6l-3.5 3.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </AriaButton>
                    ) : (
                      <span className={slots.expandSpacer()} />
                    )}
                    <FlexRender cell={cell} />
                  </div>
                ) : (
                  <FlexRender cell={cell} />
                )
              }
            </Cell>
          )}
        </Collection>
        {isTree && (
          <Collection items={row.subRows} dependencies={[visibility]}>
            {renderRow}
          </Collection>
        )}
      </Row>
    )
  }

  const grid = (
    <Table
      ref={tableRef}
      data-slot="data-table"
      data-density={density}
      data-held={held.heldCount > 0 || undefined}
      aria-label={ariaLabel ?? t.dataTable}
      sortDescriptor={sortDescriptor}
      onSortChange={(descriptor) => instance.getColumn(String(descriptor.column))?.toggleSorting()}
      treeColumn={isTree ? firstColumnId : undefined}
      expandedKeys={expandedKeys}
      onExpandedChange={setExpandedKeys}
      className={slots.root({ className })}
    >
      <TableHeader className={slots.header()} columns={headers}>
        {(header) => (
          <Column
            id={header.column.id}
            isRowHeader={header.column.id === firstColumnId}
            allowsSorting={header.column.getCanSort()}
            className={slots.column()}
          >
            {({ allowsSorting, sortDirection }) => (
              <span className={slots.columnContent()}>
                <FlexRender header={header} />
                {allowsSorting && (
                  <span aria-hidden="true" className={slots.sortIndicator()}>
                    {sortDirection === 'ascending' ? '▲' : sortDirection === 'descending' ? '▼' : '↕'}
                  </span>
                )}
              </span>
            )}
          </Column>
        )}
      </TableHeader>
      <TableBody
        items={rows}
        dependencies={[visibility]}
        renderEmptyState={() => <div className={slots.empty()}>{emptyMessage ?? t.noData}</div>}
      >
        {renderRow}
      </TableBody>
    </Table>
  )

  return (
    <div
      data-slot="data-table-container"
      className={slots.container()}
      onPointerEnter={() => held.enter('pointer')}
      onPointerLeave={() => held.leave('pointer')}
      onFocus={() => held.enter('focus')}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) held.leave('focus')
      }}
    >
      {holdNewRows && (
        <div role="status" className={slots.announcer()}>
          {held.heldCount > 0 && newRowsLabel}
        </div>
      )}
      {(enableSearch || hideableColumns.length > 0 || holdNewRows) && (
        <div className={slots.toolbar()}>
          {enableSearch && (
            <SearchField
              aria-label={t.search}
              placeholder={t.searchPlaceholder}
              value={globalFilter}
              onChange={(value) => instance.setGlobalFilter(value)}
              className={slots.search()}
            />
          )}
          {held.heldCount > 0 && (
            <AriaButton data-slot="data-table-new-rows" className={slots.newRows()} onPress={showNewRows}>
              {newRowsLabel}
            </AriaButton>
          )}
          {hideableColumns.length > 0 && <DataTableColumnsMenu columns={hideableColumns} />}
        </div>
      )}
      {grid}
      {enablePagination && (
        <DataTablePaginationFooter
          pagination={pagination}
          pageSizeOptions={pageSizeOptions}
          rowsOnPage={rows.length}
          total={instance.getRowCount()}
          canPreviousPage={instance.getCanPreviousPage()}
          canNextPage={instance.getCanNextPage()}
          onPageSizeChange={(pageSize) => instance.setPagination({ pageIndex: 0, pageSize })}
          onPreviousPage={() => instance.previousPage()}
          onNextPage={() => instance.nextPage()}
        />
      )}
    </div>
  )
}
