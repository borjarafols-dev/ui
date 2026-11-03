import {
  type CellData,
  type ColumnDef,
  type ColumnHelper,
  type ColumnVisibilityState,
  columnVisibilityFeature,
  createColumnHelper,
  FlexRender,
  functionalUpdate,
  type RowData,
  tableFeatures,
  type Updater,
  useTable,
} from '@tanstack/react-table'
import * as React from 'react'
import {
  Button as AriaButton,
  Cell,
  Column,
  Dialog,
  DialogTrigger,
  Popover,
  Row,
  Table,
  TableBody,
  TableHeader,
} from 'react-aria-components'

import { useStrings } from '../i18n/strings'
import { table } from '../recipes/table'
import { Button } from './button'
import { Checkbox } from './checkbox'

const features = tableFeatures({ columnVisibilityFeature })

type DataTableFeatures = typeof features

/** A TanStack column definition for `DataTable`. */
export type DataTableColumnDef<T extends RowData, TValue extends CellData = CellData> = ColumnDef<
  DataTableFeatures,
  T,
  TValue
>

/** A TanStack column helper typed for `DataTable`'s features. */
export type DataTableColumnHelper<T extends RowData> = ColumnHelper<DataTableFeatures, T>

/** Visibility by column id; a column missing from the map is visible. */
export type DataTableColumnVisibility = ColumnVisibilityState

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
  /** Visible columns, controlled. Without it the table keeps its own state, starting with every column shown. */
  columnVisibility?: DataTableColumnVisibility
  onColumnVisibilityChange?: (columnVisibility: DataTableColumnVisibility) => void
  /** Row height and padding. Defaults to `'comfortable'`. */
  density?: 'comfortable' | 'compact'
  /** Hold rows with new ids while the pointer or focus is in the table, behind a button that shows them. */
  holdNewRows?: boolean
  /** Label of the button that shows held rows. Defaults to a localised "Show {n} new rows". */
  showNewRowsLabel?: (count: number) => string
  /** Accessible name of the table. Defaults to a localised name. */
  'aria-label'?: string
  /** Shown when `data` is empty. Defaults to a localised message. */
  emptyMessage?: React.ReactNode
  className?: string
}

/**
 * Data table: TanStack Table builds the rows from `columns` and `data`, React
 * Aria's `Table` renders them (grid role, keyboard cell navigation, row
 * headers). No sorting or pagination yet. The first column is the row header.
 * A Columns button above the table hides and shows columns; a column with
 * `enableHiding: false` always shows and has no checkbox. With `holdNewRows`,
 * rows with an unseen id wait behind a "Show n new rows" button while the
 * pointer or focus is in the table, so the row being read doesn't move; rows
 * already shown update in place and removed rows go at once.
 *
 * @usage Build `columns` with `createDataTableColumnHelper<Row>()` and give every row a stable id with `getRowId`.
 * @usage Put the column that identifies the row (name, title) first, and give it `enableHiding: false`.
 * @usage Give every hideable column a string `header`: it labels the column's checkbox (a non-string header falls back to the column id).
 * @usage To keep hidden columns in the URL, pass `columnVisibility` and `onColumnVisibilityChange`.
 * @usage Compact density for operational lists read at a glance; comfortable for everything else.
 * @usage holdNewRows for lists that update while the user reads them; not for lists that only change after a user action.
 */
export function DataTable<T extends RowData>({
  columns,
  data,
  getRowId,
  columnVisibility,
  onColumnVisibilityChange,
  density = 'comfortable',
  holdNewRows = false,
  showNewRowsLabel,
  'aria-label': ariaLabel,
  emptyMessage,
  className,
}: DataTableProps<T>) {
  const t = useStrings()
  const slots = table({ density })
  const [ownColumnVisibility, setOwnColumnVisibility] = React.useState<DataTableColumnVisibility>({})
  const visibility = columnVisibility ?? ownColumnVisibility
  const tableRef = React.useRef<HTMLTableElement>(null)
  const inside = React.useRef({ pointer: false, focus: false })
  // Ids shown when the pointer or focus came in; null while nothing is held.
  const [shownIds, setShownIds] = React.useState<ReadonlySet<string> | null>(null)
  if (!holdNewRows && shownIds !== null) setShownIds(null)
  const ids = data.map(getRowId)
  const rows = shownIds === null ? data : data.filter((_, index) => shownIds.has(ids[index]!))
  const heldCount = data.length - rows.length
  // Filtering shifts indexes, so TanStack gets back the id computed against the full `data`.
  const idOf = new Map(data.map((row, index) => [row, ids[index]!]))
  const enter = (via: 'pointer' | 'focus') => {
    if (holdNewRows && !inside.current.pointer && !inside.current.focus) setShownIds(new Set(ids))
    inside.current[via] = true
  }
  const leave = (via: 'pointer' | 'focus') => {
    inside.current[via] = false
    if (!inside.current.pointer && !inside.current.focus) setShownIds(null)
  }
  const showNewRows = () => {
    tableRef.current?.focus()
    setShownIds(new Set(ids))
  }
  const newRowsLabel = (showNewRowsLabel ?? t.newRows)(heldCount)
  const instance = useTable({
    features,
    columns,
    data: rows,
    getRowId: (row, index) => idOf.get(row) ?? getRowId(row, index),
    state: { columnVisibility: visibility },
    onColumnVisibilityChange: (updater: Updater<DataTableColumnVisibility>) => {
      const next = functionalUpdate(updater, visibility)
      if (columnVisibility === undefined) setOwnColumnVisibility(next)
      onColumnVisibilityChange?.(next)
    },
  })
  const headers = instance.getLeafHeaders()
  const firstColumnId = headers[0]?.column.id
  const hideableColumns = instance.getAllLeafColumns().filter((column) => column.getCanHide())
  return (
    <div
      className={slots.container()}
      onPointerEnter={() => enter('pointer')}
      onPointerLeave={() => leave('pointer')}
      onFocus={() => enter('focus')}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) leave('focus')
      }}
    >
      {holdNewRows && (
        <div role="status" className={slots.announcer()}>
          {heldCount > 0 && newRowsLabel}
        </div>
      )}
      {(hideableColumns.length > 0 || holdNewRows) && (
        <div className={slots.toolbar()}>
          {heldCount > 0 && (
            <AriaButton data-slot="data-table-new-rows" className={slots.newRows()} onPress={showNewRows}>
              {newRowsLabel}
            </AriaButton>
          )}
          {hideableColumns.length > 0 && (
            <DialogTrigger>
              <Button variant="outline" size="sm">
                {t.columns}
              </Button>
              <Popover placement="bottom end" className={slots.popover()}>
                <Dialog aria-label={t.columns} className={slots.columnList()}>
                  {hideableColumns.map((column) => (
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
          )}
        </div>
      )}
      <Table
        ref={tableRef}
        data-slot="data-table"
        data-density={density}
        data-held={heldCount > 0 || undefined}
        aria-label={ariaLabel ?? t.dataTable}
        className={slots.root({ className })}
      >
        <TableHeader className={slots.header()} columns={headers}>
          {(header) => (
            <Column id={header.column.id} isRowHeader={header.column.id === firstColumnId} className={slots.column()}>
              <FlexRender header={header} />
            </Column>
          )}
        </TableHeader>
        <TableBody
          items={instance.getRowModel().rows}
          // TanStack keeps the same row objects when only visibility changes, so React Aria would reuse their cells.
          dependencies={[visibility]}
          renderEmptyState={() => <div className={slots.empty()}>{emptyMessage ?? t.noData}</div>}
        >
          {(row) => (
            <Row id={row.id} columns={row.getVisibleCells()} className={slots.row()}>
              {(cell) => (
                <Cell id={cell.id} className={slots.cell()}>
                  <FlexRender cell={cell} />
                </Cell>
              )}
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
