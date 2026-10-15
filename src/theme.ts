export type ThemeVars = Record<string, string>

/** `CSSProperties`-compatible map of `--variable: value` entries. */
export type ThemeStyle = Record<string, string>

function normalizeVars(vars: ThemeVars): Array<[string, string]> {
  return Object.entries(vars).map(([key, value]) => [key.startsWith('--') ? key : `--${key}`, value])
}

/**
 * Apply token overrides to a DOM element at runtime — the JS theming path.
 * Defaults to `<html>`; pass any element to scope a themed subtree.
 *
 * ```ts
 * applyTheme({ '--primary': 'rebeccapurple' })
 * ```
 */
export function applyTheme(vars: ThemeVars, target: HTMLElement = document.documentElement): void {
  for (const [name, value] of normalizeVars(vars)) {
    target.style.setProperty(name, value)
  }
}

/** Build a style object (for `style={...}`) from token overrides. */
export function createTheme(vars: ThemeVars): ThemeStyle {
  return Object.fromEntries(normalizeVars(vars))
}

/** Build a CSS rule string from token overrides. */
export function createThemeCss(vars: ThemeVars, selector = ':root'): string {
  const declarations = normalizeVars(vars)
    .map(([name, value]) => `${name}: ${value};`)
    .join('\n  ')
  return `${selector} {\n  ${declarations}\n}`
}
