import * as React from 'react'

/** Stands in for a debounced server search: empty without a query, `delay` ms to answer with `search(query)`. */
export function useFakeLoader<T>(query: string, search: (query: string) => T[], delay: number) {
  const [items, setItems] = React.useState<T[]>([])
  const [isLoading, setLoading] = React.useState(false)
  const searchRef = React.useRef(search)
  searchRef.current = search

  React.useEffect(() => {
    if (!query) {
      setItems([])
      return
    }
    setLoading(true)
    const timer = setTimeout(() => {
      setItems(searchRef.current(query))
      setLoading(false)
    }, delay)
    return () => clearTimeout(timer)
  }, [query, delay])

  return { items, isLoading }
}
