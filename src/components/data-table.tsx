import {
  type CellData,
  type ColumnDef,
  type ColumnHelper,
  createColumnHelper,
  FlexRender,
  type RowData,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type * as React from 'react'
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components'

import { useStrings } from '../i18n/strings'
import { table } from '../recipes/table'

const features = tableFeatures({})

type DataTableFeatures = typeof features

/** A TanStack column definition for `DataTable`. */
export type DataTableColumnDef<T extends RowData, TValue extends CellData = CellData> = ColumnDef<
  DataTableFeatures,
  T,
  TValue
>

/** A TanStack column helper typed for `DataTable`'s features. */
export type DataTableColumnHelper<T extends RowData> = ColumnHelper<DataTableFeatures, T>

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
  /** Accessible name of the table. Defaults to a localised name. */
  'aria-label'?: string
  /** Shown when `data` is empty. Defaults to a localised message. */
  emptyMessage?: React.ReactNode
  className?: string
}

const slots = table()

/**
 * Read-only data table: TanStack Table builds the rows from `columns` and
 * `data`, React Aria's `Table` renders them (grid role, keyboard cell
 * navigation, row headers). No sorting or pagination yet. The first column is
 * the row header.
 *
 * @usage Build `columns` with `createDataTableColumnHelper<Row>()` and give every row a stable id with `getRowId`.
 * @usage Put the column that identifies the row (name, title) first.
 */
export function DataTable<T extends RowData>({
  columns,
  data,
  getRowId,
  'aria-label': ariaLabel,
  emptyMessage,
  className,
}: DataTableProps<T>) {
  const t = useStrings()
  const instance = useTable({ features, columns, data, getRowId })
  const headers = instance.getLeafHeaders()
  const firstColumnId = headers[0]?.column.id
  return (
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
        renderEmptyState={() => <div className={slots.empty()}>{emptyMessage ?? t.noData}</div>}
      >
        {(row) => (
          <Row id={row.id} columns={row.getAllCells()} className={slots.row()}>
            {(cell) => (
              <Cell id={cell.id} className={slots.cell()}>
                <FlexRender cell={cell} />
              </Cell>
            )}
          </Row>
        )}
      </TableBody>
    </Table>
  )
}
