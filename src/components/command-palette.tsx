import * as React from 'react'
import {
  Autocomplete,
  Collection,
  Dialog,
  Header,
  Input,
  Menu,
  MenuItem as RACMenuItem,
  MenuLoadMoreItem,
  MenuSection as RACMenuSection,
  Modal,
  ModalOverlay,
  SearchField,
  useFilter,
  type Key,
  type MenuItemProps as RACMenuItemProps,
} from 'react-aria-components'

import { useStrings } from '../i18n/strings'
import { commandPalette } from '../recipes/command-palette'
import { menu } from '../recipes/menu'
import { Kbd } from './kbd'
import { Spinner } from './spinner'

export interface CommandPaletteProps {
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  /** Open and close with Mod+K (⌘K on Apple platforms, Ctrl+K elsewhere). Defaults to true. */
  isShortcutEnabled?: boolean
  /** Controlled input, for server results. */
  inputValue?: string
  onInputChange?: (value: string) => void
  /** Local filter. Defaults to a case-insensitive match on contained text. Pass null when every section is server-filtered. */
  filter?: ((textValue: string, inputValue: string) => boolean) | null
  /** Placeholder of the input. Defaults to a localised label. */
  placeholder?: string
  /** Name of the dialog. Defaults to a localised label. */
  'aria-label'?: string
  /** Shown when no item matches. Defaults to a localised message. */
  emptyMessage?: React.ReactNode
  /** Called with the key of the item run. Items with href navigate instead. The palette closes after either. */
  onAction?: (key: Key) => void
  className?: string
  /** CommandPaletteSection and CommandPaletteItem. */
  children: React.ReactNode
}

const FilterContext = React.createContext<(textValue: string) => boolean>(() => true)
const LinkKeysContext = React.createContext<React.RefObject<Set<Key>>>({ current: new Set() })

const LoadingContext = React.createContext<(id: string, isLoading: boolean) => void>(() => {})

const slots = commandPalette()

function isAppleLike() {
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
}

function isForeignTextField(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const editable = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
  return editable && !target.closest('[data-slot="command-palette"]')
}


/**
 * Keyboard-first dialog, opened with Mod+K, to find a page, a record or an action and run it with Enter.
 * Local sections are filtered by the palette; sections given `items` show what the caller loaded, unfiltered.
 *
 * @usage Mount one CommandPalette at the app root; register page-specific items through the app's own state, not a second palette.
 * @usage Every command in the palette must also be reachable without it (a link, a button or a menu).
 * @usage Item text uses the user's words (record names, issue keys), and keywords for synonyms.
 * @usage For server results, control inputValue, give the section items and isLoading, pass filter={null} on server-only palettes, and debounce in the app.
 */
export function CommandPalette({
  isOpen,
  onOpenChange,
  isShortcutEnabled = true,
  inputValue,
  onInputChange,
  filter,
  placeholder,
  'aria-label': ariaLabel,
  emptyMessage,
  onAction,
  className,
  children,
}: CommandPaletteProps) {
  const t = useStrings()
  const { contains } = useFilter({ sensitivity: 'base' })
  const [openState, setOpenState] = React.useState(false)
  const [inputState, setInputState] = React.useState('')
  const open = isOpen ?? openState
  const value = inputValue ?? inputState

  const setInput = (next: string) => {
    if (inputValue === undefined) setInputState(next)
    onInputChange?.(next)
  }
  const setOpen = (next: boolean) => {
    if (isOpen === undefined) setOpenState(next)
    onOpenChange?.(next)
    if (!next && value !== '') setInput('')
  }
  const linkKeys = React.useRef(new Set<Key>())
  const [loadingSections, setLoadingSections] = React.useState<ReadonlySet<string>>(new Set())
  const reportLoading = React.useCallback((id: string, isLoading: boolean) => {
    setLoadingSections((current) => {
      if (current.has(id) === isLoading) return current
      const next = new Set(current)
      if (isLoading) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])
  const toggle = React.useRef<() => void>(() => {})
  toggle.current = () => setOpen(!open)

  React.useEffect(() => {
    if (!isShortcutEnabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || event.altKey || event.shiftKey) return
      if (!(isAppleLike() ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey)) return
      if (isForeignTextField(event.target)) return
      event.preventDefault()
      toggle.current()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isShortcutEnabled])

  const matches = React.useCallback(
    (textValue: string) => (filter === null ? true : (filter ?? contains)(textValue, value)),
    [filter, contains, value],
  )

  return (
    <ModalOverlay isOpen={open} onOpenChange={setOpen} isDismissable className={slots.overlay()}>
      <Modal>
        <Dialog
          data-slot="command-palette"
          aria-label={ariaLabel ?? t.commandPalette}
          className={slots.dialog({ className })}
        >
          <Autocomplete inputValue={value} onInputChange={setInput}>
            <SearchField aria-label={ariaLabel ?? t.commandPalette} autoFocus className={slots.search()}>
              <Input placeholder={placeholder ?? t.commandPalettePlaceholder} className={slots.input()} />
            </SearchField>
            <FilterContext.Provider value={matches}>
              <LinkKeysContext.Provider value={linkKeys}>
              <LoadingContext.Provider value={reportLoading}>
              <Menu
                aria-label={ariaLabel ?? t.commandPalette}
                className={slots.list()}
                onAction={(key) => {
                  if (!linkKeys.current.has(key)) onAction?.(key)
                  setOpen(false)
                }}
                // The collection size counts items, not loaders: without this guard the
                // message shows next to the spinner until the server answers.
                renderEmptyState={
                  loadingSections.size > 0
                    ? undefined
                    : () => <div className={slots.empty()}>{emptyMessage ?? t.noResults}</div>
                }
              >
                {children}
              </Menu>
              </LoadingContext.Provider>
              </LinkKeysContext.Provider>
            </FilterContext.Provider>
          </Autocomplete>
        </Dialog>
      </Modal>
    </ModalOverlay>
  )
}

export interface CommandPaletteItemProps extends Omit<RACMenuItemProps, 'className' | 'children'> {
  children?: React.ReactNode
  /** Extra words that should match ("settings" for "Preferences"). Appended to textValue. */
  keywords?: string[]
  /** Shortcut shown at the end, rendered with Kbd. Display only. */
  shortcut?: string
  className?: string
}

function itemText({ textValue, children, keywords }: CommandPaletteItemProps) {
  const text = textValue ?? (typeof children === 'string' ? children : '')
  return [text, ...(keywords ?? [])].join(' ').trim()
}

export function CommandPaletteItem({ keywords, shortcut, children, className, ...props }: CommandPaletteItemProps) {
  const itemSlots = menu()
  const linkKeys = React.useContext(LinkKeysContext)
  const { id, href } = props
  React.useEffect(() => {
    if (id === undefined || !href) return
    const keys = linkKeys.current
    keys.add(id)
    return () => {
      keys.delete(id)
    }
  }, [linkKeys, id, href])
  return (
    <RACMenuItem
      data-slot="command-palette-item"
      {...props}
      textValue={itemText({ ...props, children, keywords })}
      className={itemSlots.item({ className })}
    >
      {children}
      {shortcut && (
        <Kbd size="sm" className={itemSlots.shortcut()}>
          {shortcut}
        </Kbd>
      )}
    </RACMenuItem>
  )
}

export interface CommandPaletteSectionProps<T> {
  title: string
  id?: Key
  /** Items the caller loaded. The palette shows them as given and never filters them. */
  items?: Iterable<T>
  /** The caller's results are loading: keeps the section mounted and shows a spinner. Needs `items`. */
  isLoading?: boolean
  /** Items, or with `items` a function that renders one. */
  children: React.ReactNode | ((item: T) => React.ReactElement)
  className?: string
}

/**
 * A group of results. Without `items`, its children must be `CommandPaletteItem`s placed directly
 * inside it: the palette filters them by reading their props, so wrapped items are never filtered.
 */
export function CommandPaletteSection<T extends object>({
  title,
  id,
  items,
  isLoading = false,
  children,
  className,
}: CommandPaletteSectionProps<T>) {
  const matches = React.useContext(FilterContext)
  const reportLoading = React.useContext(LoadingContext)
  const loadingId = React.useId()
  React.useEffect(() => {
    reportLoading(loadingId, isLoading)
    return () => reportLoading(loadingId, false)
  }, [reportLoading, loadingId, isLoading])
  const itemSlots = menu()

  let body: React.ReactNode
  if (items) {
    const hasItems = !(items[Symbol.iterator]().next().done ?? true)
    if (!hasItems && !isLoading) return null
    body = (
      <>
        <Collection items={items}>{children as (item: T) => React.ReactElement}</Collection>
        <MenuLoadMoreItem isLoading={isLoading} className={slots.loading()}>
          <Spinner size="sm" />
        </MenuLoadMoreItem>
      </>
    )
  } else {
    const visible = React.Children.toArray(children as React.ReactNode).filter(
      (child) => !React.isValidElement<CommandPaletteItemProps>(child) || matches(itemText(child.props)),
    )
    if (visible.length === 0) return null
    body = visible
  }

  return (
    <RACMenuSection id={id ?? title} data-slot="command-palette-section" className={className}>
      <Header className={itemSlots.sectionHeader()}>{title}</Header>
      {body}
    </RACMenuSection>
  )
}
