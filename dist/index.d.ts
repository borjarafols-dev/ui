import * as React from 'react';
import { ButtonProps as ButtonProps$1, CheckboxProps as CheckboxProps$1, InputProps as InputProps$1, LabelProps as LabelProps$1, NumberFieldProps as NumberFieldProps$1, SearchFieldProps as SearchFieldProps$1, SelectProps as SelectProps$1, TextFieldProps as TextFieldProps$1 } from 'react-aria-components';
import { ButtonVariants, BadgeVariants, SpinnerVariants } from './recipes.js';
import { ClassValue } from 'clsx';
import 'tailwind-variants';

interface ButtonProps extends Omit<ButtonProps$1, 'className'>, ButtonVariants {
    className?: string;
}
/**
 * Button on React Aria Components. Use `onPress` / `isDisabled`, not
 * `onClick` / `disabled`. For links styled as buttons, put the `button()`
 * recipe on a React Aria `Link` or your router's link.
 *
 * @usage One primary button per view or section; the rest secondary, outline or ghost.
 * @usage Not for navigation: links that look like buttons use the `button()` recipe on a link.
 */
declare function Button({ variant, size, className, ...props }: ButtonProps): React.JSX.Element;

interface BadgeProps extends React.ComponentPropsWithRef<'span'>, BadgeVariants {
}
/**
 * Static status label. Not interactive: use `Button` for actions.
 *
 * @usage Short status or category text (one or two words), never a sentence.
 */
declare function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element;

type DivProps = React.ComponentPropsWithRef<'div'>;
/** Presentational container. Compose with CardHeader / CardContent / CardFooter. */
declare function Card({ className, ...props }: DivProps): React.JSX.Element;
declare function CardHeader({ className, ...props }: DivProps): React.JSX.Element;
declare function CardTitle({ className, ...props }: React.ComponentPropsWithRef<'h3'>): React.JSX.Element;
declare function CardDescription({ className, ...props }: React.ComponentPropsWithRef<'p'>): React.JSX.Element;
declare function CardContent({ className, ...props }: DivProps): React.JSX.Element;
declare function CardFooter({ className, ...props }: DivProps): React.JSX.Element;

interface CheckboxProps extends Omit<CheckboxProps$1, 'className' | 'children'> {
    label: string;
    className?: string;
}
/** Labelled checkbox. `isSelected` / boolean `onChange`; supports `isIndeterminate`. */
declare function Checkbox({ label, className, ...props }: CheckboxProps): React.JSX.Element;

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: React.ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    /** Shown on the confirm button while `isPending`. */
    pendingLabel?: string;
    confirmVariant?: 'primary' | 'destructive';
    /** Disables both buttons and shows `pendingLabel` while the action runs. */
    isPending?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}
/**
 * "Are you sure?" prompt built on `Modal`. The confirm button is destructive by default.
 *
 * @usage Only for destructive or irreversible actions; don't confirm routine saves.
 * @usage The confirm label names the action ("Delete member"), never "OK" or "Yes".
 */
declare function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, pendingLabel, confirmVariant, isPending, onConfirm, onCancel, }: ConfirmDialogProps): React.JSX.Element;

interface DataTableColumn<T> {
    key: keyof T & string;
    header: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}
interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    keyField: keyof T & string;
    /** Accessible name of the table. */
    'aria-label'?: string;
    emptyMessage?: React.ReactNode;
    className?: string;
}
/**
 * Read-only data table on React Aria's `Table` (keyboard navigation, row
 * headers). No sorting or pagination yet. The first column is the row header.
 *
 * @usage Put the column that identifies the row (name, title) first.
 */
declare function DataTable<T extends object>({ columns, data, keyField, 'aria-label': ariaLabel, emptyMessage, className, }: DataTableProps<T>): React.JSX.Element;

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}
/** Placeholder for a collection with no items. */
declare function EmptyState({ title, description, action, className }: EmptyStateProps): React.JSX.Element;

interface InputProps extends Omit<InputProps$1, 'className'> {
    className?: string;
}
/**
 * Bare styled input for building custom fields. Prefer `TextField`, which
 * wires label, description and error for you.
 *
 * @usage Only when composing a custom field; always pair it with a Label.
 */
declare function Input({ className, ...props }: InputProps): React.JSX.Element;

interface LabelProps extends Omit<LabelProps$1, 'className'> {
    className?: string;
}
/** Styled label. Inside a React Aria field it links up automatically. */
declare function Label({ className, ...props }: LabelProps): React.JSX.Element;

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    /** Accessible name when there is no visible `title`. */
    'aria-label'?: string;
    /** Close when the backdrop is clicked. Escape always closes. */
    isDismissable?: boolean;
    className?: string;
    children: React.ReactNode;
}
/**
 * Modal dialog with focus trap, focus restore, scroll lock and Escape to close.
 *
 * @usage For short, focused tasks that block the page (an edit form, a decision); not for long content.
 */
declare function Modal({ open, onClose, title, 'aria-label': ariaLabel, isDismissable, className, children, }: ModalProps): React.JSX.Element;

interface NumberFieldProps extends Omit<NumberFieldProps$1, 'className' | 'children'> {
    label?: string;
    description?: string;
    error?: string;
    placeholder?: string;
    inputRef?: React.Ref<HTMLInputElement>;
    className?: string;
}
/**
 * Numeric field. Value-based numeric `onChange`. Pass
 * `formatOptions={{ useGrouping: false }}` for year-like values so `2024`
 * isn't shown as `2,024`.
 */
declare function NumberField({ label, description, error, placeholder, inputRef, className, isInvalid, ...props }: NumberFieldProps): React.JSX.Element;

interface SearchFieldProps extends Omit<SearchFieldProps$1, 'className' | 'children'> {
    label?: string;
    placeholder?: string;
    /** Accessible name of the clear button. */
    clearLabel?: string;
    className?: string;
}
/**
 * Search field. Value-based `onChange`; shows a clear button while it has a
 * value. Give it a `label` or an `aria-label`.
 */
declare function SearchField({ label, placeholder, clearLabel, className, ...props }: SearchFieldProps): React.JSX.Element;

interface SelectOption {
    value: string;
    label: string;
    isDisabled?: boolean;
}
interface SelectProps extends Omit<SelectProps$1<SelectOption>, 'className' | 'children'> {
    label?: string;
    error?: string;
    options: SelectOption[];
    className?: string;
}
/**
 * Accessible listbox in a popover, not a native `<select>`. Use `selectedKey`
 * / `onSelectionChange`. In tests, click the trigger and then the `option`;
 * `userEvent.selectOptions` does not work.
 *
 * @usage For 4+ options; with 2–3 options a set of buttons or checkboxes is often clearer.
 */
declare function Select({ label, error, options, className, isInvalid, ...props }: SelectProps): React.JSX.Element;

interface SpinnerProps extends SpinnerVariants {
    /** Accessible name announced to screen readers. */
    label?: string;
    className?: string;
}
/** Indeterminate loading indicator. */
declare function Spinner({ size, label, className }: SpinnerProps): React.JSX.Element;

interface TextAreaProps extends Omit<TextFieldProps$1, 'className' | 'children'> {
    label?: string;
    description?: string;
    error?: string;
    placeholder?: string;
    rows?: number;
    textAreaRef?: React.Ref<HTMLTextAreaElement>;
    className?: string;
}
/** Multi-line text field. Value-based `onChange`. `error` marks it invalid. */
declare function TextArea({ label, description, error, placeholder, rows, textAreaRef, className, isInvalid, ...props }: TextAreaProps): React.JSX.Element;

interface TextFieldProps extends Omit<TextFieldProps$1, 'className' | 'children'> {
    label?: string;
    description?: string;
    error?: string;
    placeholder?: string;
    inputRef?: React.Ref<HTMLInputElement>;
    className?: string;
}
/** Single-line text field. Value-based `onChange`. `error` marks it invalid. */
declare function TextField({ label, description, error, placeholder, inputRef, className, isInvalid, ...props }: TextFieldProps): React.JSX.Element;

declare function cn(...inputs: ClassValue[]): string;

type ThemeVars = Record<string, string>;
/** `CSSProperties`-compatible map of `--variable: value` entries. */
type ThemeStyle = Record<string, string>;
/**
 * Apply token overrides to a DOM element at runtime — the JS theming path.
 * Defaults to `<html>`; pass any element to scope a themed subtree.
 *
 * ```ts
 * applyTheme({ '--primary': 'rebeccapurple' })
 * ```
 */
declare function applyTheme(vars: ThemeVars, target?: HTMLElement): void;
/** Build a style object (for `style={...}`) from token overrides. */
declare function createTheme(vars: ThemeVars): ThemeStyle;
/** Build a CSS rule string from token overrides. */
declare function createThemeCss(vars: ThemeVars, selector?: string): string;

export { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, ConfirmDialog, DataTable, EmptyState, Input, Label, Modal, NumberField, SearchField, Select, Spinner, TextArea, TextField, applyTheme, cn, createTheme, createThemeCss };
export type { BadgeProps, ButtonProps, CheckboxProps, ConfirmDialogProps, DataTableColumn, DataTableProps, EmptyStateProps, InputProps, LabelProps, ModalProps, NumberFieldProps, SearchFieldProps, SelectOption, SelectProps, SpinnerProps, TextAreaProps, TextFieldProps, ThemeStyle, ThemeVars };
