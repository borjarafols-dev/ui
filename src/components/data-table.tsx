import type * as React from 'react'
import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components'

import { useStrings } from '../i18n/strings'
import { table } from '../recipes/table'

export interface DataTableColumn<T> {
  key: keyof T & string
  header: string
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyField: keyof T & string
  /** Accessible name of the table. Defaults to a localised name. */
  'aria-label'?: string
  /** Shown when `data` is empty. Defaults to a localised message. */
  emptyMessage?: React.ReactNode
  className?: string
}

const slots = table()

/**
 * Read-only data table on React Aria's `Table` (keyboard navigation, row
 * headers). No sorting or pagination yet. The first column is the row header.
 *
 * @usage Put the column that identifies the row (name, title) first.
 */
export function DataTable<T extends object>({
  columns,
  data,
  keyField,
  'aria-label': ariaLabel,
  emptyMessage,
  className,
}: DataTableProps<T>) {
  const t = useStrings()
  return (
    <Table data-slot="data-table" aria-label={ariaLabel ?? t.dataTable} className={slots.root({ className })}>
      <TableHeader className={slots.header()} columns={columns}>
        {(column) => (
          <Column id={column.key} isRowHeader={column === columns[0]} className={slots.column()}>
            {column.header}
          </Column>
        )}
      </TableHeader>
      <TableBody items={data} renderEmptyState={() => <div className={slots.empty()}>{emptyMessage ?? t.noData}</div>}>
        {(row) => (
          <Row id={String(row[keyField])} columns={columns} className={slots.row()}>
            {(column) => (
              <Cell className={slots.cell()}>
                {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
              </Cell>
            )}
          </Row>
        )}
      </TableBody>
    </Table>
  )
}
