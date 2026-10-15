import { render, screen } from '@testing-library/react'
import { I18nProvider } from 'react-aria-components'
import { describe, expect, it } from 'vitest'

import { Spinner } from './spinner'

describe('Spinner', () => {
  it('is an announced status with a size', () => {
    render(<Spinner size="lg" label="Loading results" />)

    const spinner = screen.getByRole('status', { name: 'Loading results' })
    expect(spinner).toHaveAttribute('data-size', 'lg')
    expect(spinner).toHaveClass('size-12')
  })

  it('localises its default label', () => {
    render(
      <I18nProvider locale="ca-ES">
        <Spinner />
      </I18nProvider>,
    )

    expect(screen.getByRole('status', { name: 'Carregant' })).toBeInTheDocument()
  })
})
