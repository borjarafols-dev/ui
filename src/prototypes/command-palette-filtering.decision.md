## Decision from the prototype

Prototype: `src/prototypes/command-palette-filtering.stories.tsx` (Storybook, "Prototypes/CommandPalette filtering"). It has one static section (pages and actions) and one async section (records from a fake loader with a delay you can set). The fake server also matches on a field the item doesn't show (owner), the way a real search endpoint does.

**Filtering: pass no `filter` to `Autocomplete`, control `inputValue`, and have the caller filter the local sections.** The Autocomplete owns the input but filters nothing. Local sections are filtered with `useFilter().contains` before they render. Async sections show what the server returned, as it returned it. Each item is filtered exactly once, by whoever owns it.

- *One `filter` for the whole menu* (rejected): it filters server results a second time. Typing "ada" returns records owned by ada@example.com, and then the menu filter hides all of them, so the user sees "No results".
- *Per-section `filter`* (`node.parentKey === 'records' || contains(…)`, rejected): it behaves the same as the chosen approach, but it depends on the section id and on items sitting directly under the section. If a section is renamed or an item is nested one level deeper, it quietly goes back to double filtering. It also means the palette would need an API to say which sections are "remote".

**Loading state of async sections.** Each async section renders a `MenuLoadMoreItem isLoading` with a `Spinner` after its items. The section stays mounted while it loads (`items.length > 0 || isLoading`), so the menu doesn't jump. `useAsyncList` keeps the previous items until the new response arrives, so results never flash empty between keystrokes. They are stale for one round trip, which is acceptable. The list aborts the request that was superseded.

**Empty state.** Use `renderEmptyState` on the `Menu`, but only when no section is loading. The Menu's collection size counts items, not loaders. Without the guard, "No results" shows next to the spinner until the server answers. A section with no items, and not loading, isn't rendered at all, so its header doesn't hang over nothing.

Observed (fake delay 100 ms): "ada": spinner → 2 records (single filter: "No results"); "zzz": spinner only → "No results"; "in" → "inv": the pages narrow at once, and the records stay until the new ones arrive.

```tsx
const { contains } = useFilter({ sensitivity: 'base' })
const [inputValue, setInputValue] = useState('')
const records = useAsyncList<Record>({
  async load({ signal, filterText = '' }) {
    return { items: filterText ? await search(filterText, signal) : [] }
  },
})
const pages = useMemo(() => allPages.filter((p) => contains(p.label, inputValue)), [contains, inputValue])

<Autocomplete
  inputValue={inputValue}
  onInputChange={(value) => {
    setInputValue(value)
    records.setFilterText(value)
  }}
>
  <SearchField aria-label="Search" autoFocus />
  <Menu renderEmptyState={records.isLoading ? undefined : () => <p>No results</p>}>
    {pages.length > 0 && (
      <MenuSection id="pages">
        <Header>Pages</Header>
        <Collection items={pages}>{(p) => <MenuItem id={p.id}>{p.label}</MenuItem>}</Collection>
      </MenuSection>
    )}
    {(records.items.length > 0 || records.isLoading) && (
      <MenuSection id="records">
        <Header>Records</Header>
        <Collection items={records.items}>{(r) => <MenuItem id={r.id} textValue={r.title}>{r.title}</MenuItem>}</Collection>
        <MenuLoadMoreItem isLoading={records.isLoading}>
          <Spinner size="sm" label="Loading records" />
        </MenuLoadMoreItem>
      </MenuSection>
    )}
  </Menu>
</Autocomplete>
```

For `CommandPalette` (BOR-1184), local sections take items, and the palette filters them with `useFilter`. Async sections take `items` and `isLoading` from the caller (for example, from a Query hook keyed on the input value), and the palette never filters them. The palette owns `inputValue` and exposes `onInputChange`, so the caller can drive its server search.
