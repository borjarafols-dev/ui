import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Meter } from './meter'

describe('Meter', () => {
  it('is a meter named by its label with its value', () => {
    render(<Meter label="Storage" value={40} />)

    const meter = screen.getByRole('meter', { name: 'Storage' })
    expect(meter).toHaveAttribute('aria-valuenow', '40')
    expect(meter).toHaveAttribute('data-slot', 'meter')
    expect(meter).toHaveAttribute('data-size', 'md')
    expect(screen.getByText('40%')).toBeInTheDocument()
  })

  it.each([
    [79, 'normal', 'bg-meter-fill'],
    [80, 'warning', 'bg-warning'],
    [95, 'destructive', 'bg-destructive'],
  ] as const)('at %i is %s with %s on the fill', (value, status, fillClass) => {
    const { container } = render(<Meter label="Quota" value={value} warningAt={80} destructiveAt={95} />)

    expect(screen.getByRole('meter')).toHaveAttribute('data-status', status)
    expect(container.querySelector('[data-slot="meter-fill"]')).toHaveClass(fillClass)
  })

  it('is normal without thresholds', () => {
    render(<Meter label="Quota" value={100} />)

    expect(screen.getByRole('meter')).toHaveAttribute('data-status', 'normal')
  })

  it('formats the value with formatOptions', () => {
    render(
      <Meter
        label="Budget"
        value={320}
        maxValue={500}
        formatOptions={{ style: 'currency', currency: 'EUR' }}
      />,
    )

    const meter = screen.getByRole('meter', { name: 'Budget' })
    expect(meter).toHaveAttribute('aria-valuetext', '€320.00')
    expect(screen.getByText('€320.00')).toBeInTheDocument()
  })

  it('shows valueLabel as the value text', () => {
    render(<Meter label="Storage" value={3.2} maxValue={5} valueLabel="3.2 of 5 GB" />)

    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '3.2 of 5 GB')
    expect(screen.getByText('3.2 of 5 GB')).toBeInTheDocument()
  })

  it('hides the value text but keeps aria-valuetext with showValue={false}', () => {
    render(<Meter label="Storage" value={40} showValue={false} />)

    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '40%')
    expect(screen.queryByText('40%')).not.toBeInTheDocument()
  })

  it('takes aria-label when there is no visible label', () => {
    render(<Meter aria-label="Monthly limit" value={10} showValue={false} />)

    expect(screen.getByRole('meter', { name: 'Monthly limit' })).toBeInTheDocument()
  })

  it('has a thinner track at size sm', () => {
    const { container } = render(<Meter label="Quota" value={10} size="sm" />)

    expect(screen.getByRole('meter')).toHaveAttribute('data-size', 'sm')
    const track = container.querySelector('[data-slot="meter-fill"]')!.parentElement
    expect(track).toHaveClass('h-1')
    expect(track).not.toHaveClass('h-2')
  })
})
