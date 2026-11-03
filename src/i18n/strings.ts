import { useLocale } from 'react-aria-components'

// Built-in default labels, localised through React Aria's locale (an
// `I18nProvider` above the app, or the browser's language without one).
// An explicit prop on the component always wins over these.

const en = {
  clearSearch: 'Clear search',
  loading: 'Loading',
  dataTable: 'Data table',
  noData: 'No data available.',
  search: 'Search',
  searchPlaceholder: 'Search…',
  pageSize: 'Rows per page',
  pageRange: (first: string, last: string, total: string) => `${first}–${last} of ${total}`,
  previousPage: 'Previous',
  nextPage: 'Next',
  columns: 'Columns',
  expandRow: 'Expand row',
  collapseRow: 'Collapse row',
  newRows: (n: number) => (n === 1 ? 'Show 1 new row' : `Show ${n} new rows`),
  confirm: 'Confirm',
  cancel: 'Cancel',
  working: 'Working…',
  typeToConfirm: (text: string) => `Type ${text} to confirm`,
  notifications: 'Notifications',
  close: 'Close',
  opensInNewTab: '(opens in a new tab)',
}

export type Strings = typeof en

export const strings: Record<'en' | 'es' | 'ca', Strings> = {
  en,
  es: {
    clearSearch: 'Borrar búsqueda',
    loading: 'Cargando',
    dataTable: 'Tabla de datos',
    noData: 'No hay datos disponibles.',
    search: 'Buscar',
    searchPlaceholder: 'Buscar…',
    pageSize: 'Filas por página',
    pageRange: (first, last, total) => `${first}–${last} de ${total}`,
    previousPage: 'Anterior',
    nextPage: 'Siguiente',
    columns: 'Columnas',
    expandRow: 'Expandir fila',
    collapseRow: 'Contraer fila',
    newRows: (n) => (n === 1 ? 'Mostrar 1 fila nueva' : `Mostrar ${n} filas nuevas`),
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    working: 'Procesando…',
    typeToConfirm: (text) => `Escribe ${text} para confirmar`,
    notifications: 'Notificaciones',
    close: 'Cerrar',
    opensInNewTab: '(se abre en una pestaña nueva)',
  },
  ca: {
    clearSearch: 'Esborra la cerca',
    loading: 'Carregant',
    dataTable: 'Taula de dades',
    noData: 'No hi ha dades disponibles.',
    search: 'Cerca',
    searchPlaceholder: 'Cerca…',
    pageSize: 'Files per pàgina',
    pageRange: (first, last, total) => `${first}–${last} de ${total}`,
    previousPage: 'Anterior',
    nextPage: 'Següent',
    columns: 'Columnes',
    expandRow: 'Desplega la fila',
    collapseRow: 'Plega la fila',
    newRows: (n) => (n === 1 ? 'Mostra 1 fila nova' : `Mostra ${n} files noves`),
    confirm: 'Confirma',
    cancel: 'Cancel·la',
    working: 'Processant…',
    typeToConfirm: (text) => `Escriu ${text} per confirmar`,
    notifications: 'Notificacions',
    close: 'Tanca',
    opensInNewTab: '(s’obre en una pestanya nova)',
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
