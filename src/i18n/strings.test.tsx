/// <reference types="vite/client" />
import { render, screen } from '@testing-library/react'
import { I18nProvider } from 'react-aria-components'
import { describe, expect, it } from 'vitest'

import confirmDialog from '../components/confirm-dialog.tsx?raw'
import dataTable from '../components/data-table.tsx?raw'
import searchField from '../components/search-field.tsx?raw'
import spinner from '../components/spinner.tsx?raw'
import toast from '../components/toast.tsx?raw'
import { strings, stringsFor, useStrings } from './strings'

function Probe() {
  return <span>{useStrings().cancel}</span>
}

describe('strings', () => {
  it('has every key in every language', () => {
    const keys = Object.keys(strings.en).sort()
    for (const table of Object.values(strings)) expect(Object.keys(table).sort()).toEqual(keys)
  })

  it('matches a locale by language and falls back to English', () => {
    expect(stringsFor('ca-ES')).toBe(strings.ca)
    expect(stringsFor('es-MX')).toBe(strings.es)
    expect(stringsFor('en-GB')).toBe(strings.en)
    expect(stringsFor('fr-FR')).toBe(strings.en)
  })

  it('reads React Aria’s locale', () => {
    render(
      <I18nProvider locale="es-ES">
        <Probe />
      </I18nProvider>,
    )

    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('leaves no hard-coded English defaults in the components', () => {
    const sources = { confirmDialog, dataTable, searchField, spinner, toast }
    for (const [name, source] of Object.entries(sources)) {
      for (const english of Object.values(strings.en)) {
        expect(source.includes(`'${english}'`) || source.includes(`"${english}"`), `${name}: '${english}'`).toBe(false)
      }
    }
  })
})
