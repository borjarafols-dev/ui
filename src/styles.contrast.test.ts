/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest'

import stylesheet from './styles.css?raw'
import { contrast, type Pair, type Theme, themeTokens } from './test/contrast'

const TEXT_MIN = 4.5
const UI_MIN = 3

const textPairs: Pair[] = [
  { name: 'foreground on background', text: 'foreground', surface: ['background'] },
  { name: 'card-foreground on card', text: 'card-foreground', surface: ['card'] },
  { name: 'popover-foreground on popover', text: 'popover-foreground', surface: ['popover'] },
  { name: 'primary-foreground on primary', text: 'primary-foreground', surface: ['primary'] },
  { name: 'secondary-foreground on secondary', text: 'secondary-foreground', surface: ['secondary'] },
  { name: 'muted-foreground on background', text: 'muted-foreground', surface: ['background'] },
  { name: 'muted-foreground on muted', text: 'muted-foreground', surface: ['muted'] },
  { name: 'accent-foreground on accent', text: 'accent-foreground', surface: ['accent'] },
  { name: 'destructive-foreground on destructive', text: 'destructive-foreground', surface: ['destructive'] },
  {
    name: 'destructive-foreground on destructive/90 over background',
    text: 'destructive-foreground',
    surface: ['background', 'destructive/90'],
  },
  {
    name: 'destructive-foreground on destructive/90 over card',
    text: 'destructive-foreground',
    surface: ['card', 'destructive/90'],
  },
  { name: 'success-foreground on success', text: 'success-foreground', surface: ['success'] },
  { name: 'warning-foreground on warning', text: 'warning-foreground', surface: ['warning'] },
  { name: 'info-foreground on info', text: 'info-foreground', surface: ['info'] },
  { name: 'button-primary-fg on button-primary-bg', text: 'button-primary-fg', surface: ['button-primary-bg'] },
  {
    name: 'button-primary-fg on button-primary-bg-hover',
    text: 'button-primary-fg',
    surface: ['button-primary-bg-hover'],
  },
]

const uiPairs: Pair[] = [
  { name: 'invalid field edge on background', text: 'destructive', surface: ['background'] },
  { name: 'invalid field edge on card', text: 'destructive', surface: ['card'] },
  { name: 'input on background', text: 'input', surface: ['background'] },
  { name: 'input on card', text: 'input', surface: ['card'] },
  { name: 'ring on background', text: 'ring', surface: ['background'] },
]

describe.each<Theme>(['light', 'dark'])('%s theme token contrast', (theme) => {
  const tokens = themeTokens(stylesheet, theme)

  it.each(textPairs.map((pair) => [pair.name, pair] as const))(`text: %s is at least ${TEXT_MIN}:1`, (_, pair) => {
    expect(contrast(tokens, pair)).toBeGreaterThanOrEqual(TEXT_MIN)
  })

  it.each(uiPairs.map((pair) => [pair.name, pair] as const))(`UI: %s is at least ${UI_MIN}:1`, (_, pair) => {
    expect(contrast(tokens, pair)).toBeGreaterThanOrEqual(UI_MIN)
  })
})
