import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it.each([
    ['text', ['h-4', 'rounded-sm']],
    ['block', ['rounded-md']],
    ['circle', ['aspect-square', 'rounded-full']],
  ] as const)('renders the %s shape hidden from assistive technology', (shape, classes) => {
    const { container } = render(<Skeleton shape={shape} />)

    const skeleton = container.firstElementChild
    expect(skeleton).toHaveAttribute('aria-hidden', 'true')
    expect(skeleton).toHaveAttribute('data-slot', 'skeleton')
    expect(skeleton).toHaveAttribute('data-shape', shape)
    expect(skeleton).toHaveClass(...classes)
  })

  it('defaults to the text shape', () => {
    const { container } = render(<Skeleton />)

    expect(container.firstElementChild).toHaveAttribute('data-shape', 'text')
  })

  it('merges className last', () => {
    const { container } = render(<Skeleton className="w-32" />)

    expect(container.firstElementChild).toHaveClass('w-32')
  })

  it('pulses on the muted token unless motion is reduced', () => {
    const { container } = render(<Skeleton />)

    expect(container.firstElementChild).toHaveClass('motion-safe:animate-pulse', 'bg-muted')
  })

  it('stays hidden when the caller passes aria-hidden', () => {
    const { container } = render(<Skeleton aria-hidden={false} />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
