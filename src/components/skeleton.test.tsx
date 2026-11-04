import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './skeleton'

describe('Skeleton', () => {
  it('stays hidden from assistive technology even when the caller passes aria-hidden', () => {
    const { container } = render(<Skeleton aria-hidden={false} />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
