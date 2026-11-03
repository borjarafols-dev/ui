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
import { Cell, Column, Dialog, DialogTrigger, Popover, Row, Table, TableBody, TableHeader } from 'react-aria-components'

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
  /** Accessible name of the table. Defaults to a localised name. */
  'aria-label'?: string
  /** Shown when `data` is empty. Defaults to a localised message. */
  emptyMessage?: React.ReactNode
  className?: string
}

const slots = table()

/**
 * Data table: TanStack Table builds the rows from `columns` and `data`, React
 * Aria's `Table` renders them (grid role, keyboard cell navigation, row
 * headers). No sorting or pagination yet. The first column is the row header.
 * A Columns button above the table hides and shows columns; a column with
 * `enableHiding: false` always shows and has no checkbox.
 *
 * @usage Build `columns` with `createDataTableColumnHelper<Row>()` and give every row a stable id with `getRowId`.
 * @usage Put the column that identifies the row (name, title) first, and give it `enableHiding: false`.
 * @usage Give every hideable column a string `header`: it labels the column's checkbox (a non-string header falls back to the column id).
 * @usage To keep hidden columns in the URL, pass `columnVisibility` and `onColumnVisibilityChange`.
 */
export function DataTable<T extends RowData>({
  columns,
  data,
  getRowId,
  columnVisibility,
  onColumnVisibilityChange,
  'aria-label': ariaLabel,
  emptyMessage,
  className,
}: DataTableProps<T>) {
  const t = useStrings()
  const [ownColumnVisibility, setOwnColumnVisibility] = React.useState<DataTableColumnVisibility>({})
  const visibility = columnVisibility ?? ownColumnVisibility
  const instance = useTable({
    features,
    columns,
    data,
    getRowId,
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
    <div className={slots.container()}>
      {hideableColumns.length > 0 && (
        <div className={slots.toolbar()}>
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
        </div>
      )}
      <Table data-slot="data-table" aria-label={ariaLabel ?? t.dataTable} className={slots.root({ className })}>
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
