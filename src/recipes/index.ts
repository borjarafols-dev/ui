// Framework-agnostic style recipes (tailwind-variants). No React imports:
// safe in `.astro` files and any non-React markup. Classes resolve to the
// tokens in `@brafols/ui/styles.css`, which must be loaded.
export { button, type ButtonVariants } from './button'
export { badge, type BadgeVariants } from './badge'
export { card } from './card'
export { field } from './field'
export { checkbox } from './checkbox'
export { spinner, type SpinnerVariants } from './spinner'
export { emptyState } from './empty-state'
export { select } from './select'
export { modal } from './modal'
export { table } from './table'
