import type { Meta, StoryObj } from '@storybook/react-vite'

import { useStrings } from '../../i18n/strings'
import { table } from '../../recipes/table'
import { Card, CardContent } from '../molecules/card'
import { Skeleton } from './skeleton'

const meta = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: { shape: { control: 'select', options: ['text', 'block', 'circle'] } },
  args: { shape: 'text', className: 'w-48' },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
  render: () => (
    <div aria-busy="true" className="flex w-80 flex-col gap-2">
      <span className="sr-only">Loading description</span>
      <Skeleton className="w-full" />
      <Skeleton className="w-5/6" />
      <Skeleton className="w-1/2" />
    </div>
  ),
}

export const Block: Story = {
  render: () => (
    <div aria-busy="true" className="w-80">
      <span className="sr-only">Loading chart</span>
      <Skeleton shape="block" className="h-32 w-full" />
    </div>
  ),
}

export const Circle: Story = {
  render: () => (
    <div aria-busy="true" className="flex items-center gap-3">
      <span className="sr-only">Loading profile</span>
      <Skeleton shape="circle" className="w-10" />
      <Skeleton className="w-32" />
    </div>
  ),
}

export const CardList: Story = {
  render: () => (
    <div aria-busy="true" className="flex w-96 flex-col gap-3">
      <span className="sr-only">Loading projects</span>
      {[0, 1, 2].map((index) => (
        <Card key={index}>
          <CardContent className="flex items-start gap-3">
            <Skeleton shape="circle" className="w-10 shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="w-1/3" />
              <Skeleton className="w-full" />
              <Skeleton className="w-2/3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

function TableLoading() {
  const t = useStrings()
  const styles = table()
  const headers = ['Name', 'Email', 'Status']
  return (
    <div aria-busy="true" className={styles.container({ className: 'w-[40rem]' })}>
      <span className="sr-only">{t.loading}</span>
      <table className={styles.root()}>
        <thead className={styles.header()}>
          <tr>
            {headers.map((header) => (
              <th key={header} className={styles.column()}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3, 4].map((row) => (
            <tr key={row} className={styles.row()}>
              <td className={styles.cell()}>
                <Skeleton className="w-32" />
              </td>
              <td className={styles.cell()}>
                <Skeleton className="w-48" />
              </td>
              <td className={styles.cell()}>
                <Skeleton shape="block" className="h-5 w-14" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const TableLoadingState: Story = {
  name: 'Table loading state',
  render: () => <TableLoading />,
}
