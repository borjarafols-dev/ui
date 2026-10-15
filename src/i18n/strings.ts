import { useLocale } from 'react-aria-components'

// Built-in default labels, localised through React Aria's locale (an
// `I18nProvider` above the app, or the browser's language without one).
// An explicit prop on the component always wins over these.

const en = {
  clearSearch: 'Clear search',
  loading: 'Loading',
  dataTable: 'Data table',
  noData: 'No data available.',
  confirm: 'Confirm',
  cancel: 'Cancel',
  working: 'Working…',
}

export type Strings = typeof en

export const strings: Record<'en' | 'es' | 'ca', Strings> = {
  en,
  es: {
    clearSearch: 'Borrar búsqueda',
    loading: 'Cargando',
    dataTable: 'Tabla de datos',
    noData: 'No hay datos disponibles.',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    working: 'Procesando…',
  },
  ca: {
    clearSearch: 'Esborra la cerca',
    loading: 'Carregant',
    dataTable: 'Taula de dades',
    noData: 'No hi ha dades disponibles.',
    confirm: 'Confirma',
    cancel: 'Cancel·la',
    working: 'Processant…',
  },
}

/** Strings for a BCP 47 locale, matched by language (`ca-ES` → `ca`). Unsupported languages get English. */
export function stringsFor(locale: string): Strings {
  const language = locale.split('-')[0]!.toLowerCase()
  return Object.hasOwn(strings, language) ? strings[language as keyof typeof strings] : en
}

/** Built-in labels for React Aria's current locale. */
export function useStrings(): Strings {
  return stringsFor(useLocale().locale)
}
