import { useLocale } from 'react-aria-components'

// Built-in default labels, localised through React Aria's locale (an
// `I18nProvider` above the app, or the browser's language without one).
// An explicit prop on the component always wins over these.

const en = {
  clearSearch: 'Clear search',
  loading: 'Loading',
  dataTable: 'Data table',
  noData: 'No data available.',
  columns: 'Columns',
  newRows: (n: number) => (n === 1 ? 'Show 1 new row' : `Show ${n} new rows`),
  confirm: 'Confirm',
  cancel: 'Cancel',
  working: 'Working…',
  notifications: 'Notifications',
  close: 'Close',
}

export type Strings = typeof en

export const strings: Record<'en' | 'es' | 'ca', Strings> = {
  en,
  es: {
    clearSearch: 'Borrar búsqueda',
    loading: 'Cargando',
    dataTable: 'Tabla de datos',
    noData: 'No hay datos disponibles.',
    columns: 'Columnas',
    newRows: (n) => (n === 1 ? 'Mostrar 1 fila nueva' : `Mostrar ${n} filas nuevas`),
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    working: 'Procesando…',
    notifications: 'Notificaciones',
    close: 'Cerrar',
  },
  ca: {
    clearSearch: 'Esborra la cerca',
    loading: 'Carregant',
    dataTable: 'Taula de dades',
    noData: 'No hi ha dades disponibles.',
    columns: 'Columnes',
    newRows: (n) => (n === 1 ? 'Mostra 1 fila nova' : `Mostra ${n} files noves`),
    confirm: 'Confirma',
    cancel: 'Cancel·la',
    working: 'Processant…',
    notifications: 'Notificacions',
    close: 'Tanca',
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
