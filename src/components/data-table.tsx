import {
  type CellData,
  type ColumnDef,
  type ColumnHelper,
  type ColumnVisibilityState,
  columnVisibilityFeature,
  createColumnHelper,
  type ExpandedState,
  FlexRender,
  functionalUpdate,
  type Row as TanStackRow,
  type RowData,
  rowExpandingFeature,
  tableFeatures,
  type Updater,
  useTable,
} from '@tanstack/react-table'
import * as React from 'react'
import {
  Button as RACButton,
  Cell,
  Collection,
  Column,
  Dialog,
  DialogTrigger,
  type Key,
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

const features = tableFeatures({ columnVisibilityFeature, rowExpandingFeature })

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
 * `enableHiding: false` always shows and has no checkbox. With `getSubRows`
 * the table is a tree grid: a parent row expands to its children with its
 * chevron or the arrow keys.
 *
 * @usage Build `columns` with `createDataTableColumnHelper<Row>()` and give every row a stable id with `getRowId`.
 * @usage Put the column that identifies the row (name, title) first, and give it `enableHiding: false`.
 * @usage Give every hideable column a string `header`: it labels the column's checkbox (a non-string header falls back to the column id).
 * @usage To keep hidden columns in the URL, pass `columnVisibility` and `onColumnVisibilityChange`.
 * @usage Compact density for operational lists read at a glance; comfortable for everything else.
 * @usage Nested rows for one level of parent and children (a job and its steps); not for deep file trees: use a tree.
 * @usage Child row ids from `getRowId` must be unique across the whole tree.
 */
export function DataTable<T extends RowData>({
  columns,
  data,
  getRowId,
  columnVisibility,
  onColumnVisibilityChange,
  getSubRows,
  expanded,
  onExpandedChange,
  density = 'comfortable',
  'aria-label': ariaLabel,
  emptyMessage,
  className,
}: DataTableProps<T>) {
  const t = useStrings()
  const slots = table({ density })
  const [ownColumnVisibility, setOwnColumnVisibility] = React.useState<DataTableColumnVisibility>({})
  const visibility = columnVisibility ?? ownColumnVisibility
  const [ownExpanded, setOwnExpanded] = React.useState<DataTableExpanded>({})
  const expansion = expanded ?? ownExpanded
  const instance = useTable({
    features,
    columns,
    data,
    getRowId,
    getSubRows,
    // TanStack would collapse every row whenever `data` changes, such as on a refetch.
    autoResetExpanded: false,
    state: { columnVisibility: visibility, expanded: expansion },
    onColumnVisibilityChange: (updater: Updater<DataTableColumnVisibility>) => {
      const next = functionalUpdate(updater, visibility)
      if (columnVisibility === undefined) setOwnColumnVisibility(next)
      onColumnVisibilityChange?.(next)
    },
    onExpandedChange: (updater: Updater<DataTableExpanded>) => {
      const next = functionalUpdate(updater, expansion)
      if (expanded === undefined) setOwnExpanded(next)
      onExpandedChange?.(next)
    },
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

  // TanStack keeps the same row objects when only visibility changes, so React Aria would reuse their cells.
  const renderRow = (row: DataTableRow<T>) => (
    <Row id={row.id} className={slots.row()}>
      <Collection items={row.getVisibleCells()} dependencies={[visibility]}>
        {(cell) => (
          <Cell id={cell.id} className={slots.cell()}>
            {({ isTreeColumn, hasChildItems, isExpanded, level }) =>
              isTreeColumn ? (
                <div
                  className={slots.treeCell()}
                  style={{ paddingInlineStart: `calc(var(--spacing) * 5 * ${level - 1})` }}
                >
                  {hasChildItems ? (
                    <RACButton
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
                    </RACButton>
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
      <Table
        data-slot="data-table"
        data-density={density}
        aria-label={ariaLabel ?? t.dataTable}
        treeColumn={isTree ? firstColumnId : undefined}
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
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
          items={rows}
          dependencies={[visibility]}
          renderEmptyState={() => <div className={slots.empty()}>{emptyMessage ?? t.noData}</div>}
        >
          {renderRow}
        </TableBody>
      </Table>
    </div>
  )
}
