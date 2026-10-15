import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { SearchField } from './search-field'

describe('SearchField', () => {
  it('shows a clear button only while it has a value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchField label="Search" onChange={onChange} />)

    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'abc')
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onChange).toHaveBeenLastCalledWith('')
  })

  it('localises the clear button, unless clearLabel is given', () => {
    const { rerender } = render(
      <I18nProvider locale="es-ES">
        <SearchField label="Buscar" defaultValue="abc" />
      </I18nProvider>,
    )
    expect(screen.getByRole('button', { name: 'Borrar búsqueda' })).toBeInTheDocument()

    rerender(
      <I18nProvider locale="es-ES">
        <SearchField label="Buscar" defaultValue="abc" clearLabel="Limpiar" />
      </I18nProvider>,
    )
    expect(screen.getByRole('button', { name: 'Limpiar' })).toBeInTheDocument()
  })
})
