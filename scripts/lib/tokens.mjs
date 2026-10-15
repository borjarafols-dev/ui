// Which design tokens a piece of source consumes, read from its Tailwind
// classes and the `@theme inline` color bridge in src/styles.css.

const COLOR_UTILITIES =
  /^(?:bg|text|border(?:-[trblxyse])?|ring-offset|ring|outline|fill|stroke|divide|shadow|accent|caret|decoration|placeholder|from|via|to)-(.+)$/

/** `{ 'button-primary': '--button-primary-bg', primary: '--primary', … }` from `--color-X: var(--Y)`. */
export function colorBridge(css) {
  const map = {}
  for (const m of css.matchAll(/--color-([\w-]+):\s*var\((--[\w-]+)\)/g)) map[m[1]] = m[2]
  return map
}

/** Sorted CSS custom properties the source's classes resolve to. */
export function tokensUsed(source, bridge) {
  const tokens = new Set()
  for (const raw of source.split(/[\s'"`{}(),]+/)) {
    if (!raw) continue
    // Drop variant prefixes (`hover:`, `dark:`, `[&_svg]:`) and the opacity modifier.
    const utility = raw.slice(raw.lastIndexOf(':') + 1).replace(/^!/, '').replace(/\/\d+$/, '')
    const m = COLOR_UTILITIES.exec(utility)
    if (m && bridge[m[1]]) tokens.add(bridge[m[1]])
  }
  if (/\bfont-sans\b/.test(source)) tokens.add('--font-sans')
  if (/\brounded(?:-(?:sm|md|lg|xl))?\b/.test(source)) tokens.add('--radius')
  return [...tokens].sort()
}
