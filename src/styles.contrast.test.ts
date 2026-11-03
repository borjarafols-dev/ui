/// <reference types="vite/client" />
import { describe, expect, it } from 'vitest'

import stylesheet from './styles.css?raw'

type Rgba = { r: number; g: number; b: number; a: number }
type Theme = 'light' | 'dark'

/** A colour as a token name, optionally at a Tailwind opacity modifier (`destructive/90`). */
type Layer = string

type Pair = {
  name: string
  /** The text, or for a UI pair the edge or glyph. */
  text: Layer
  /** Painted bottom to top: the first entry must be opaque. */
  surface: Layer[]
}

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
]

function declarations(selector: string): Map<string, string> {
  const tokens = new Map<string, string>()
  const escaped = selector.replace(/[[\]()'.*]/g, '\\$&')
  for (const block of stylesheet.matchAll(new RegExp(`^${escaped}\\s*\\{([^}]*)\\}`, 'gm'))) {
    for (const [, name, value] of block[1]!.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
      tokens.set(name!, value!.trim())
    }
  }
  return tokens
}

function themeTokens(theme: Theme): Map<string, string> {
  const root = declarations(':root')
  return theme === 'light' ? root : new Map([...root, ...declarations("[data-theme='dark']")])
}

function resolve(tokens: Map<string, string>, name: string): string {
  const value = tokens.get(name)
  if (value === undefined) throw new Error(`unreachable: --${name} is not declared`)
  const reference = value.match(/^var\(--([\w-]+)\)$/)
  return reference ? resolve(tokens, reference[1]!) : value
}

const toSrgb = (linear: number) =>
  linear <= 0.0031308 ? 12.92 * linear : 1.055 * Math.pow(linear, 1 / 2.4) - 0.055
const toLinear = (srgb: number) => (srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4))
const clamp = (n: number) => Math.min(1, Math.max(0, n))

function parseColour(value: string): Rgba {
  const hex = value.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1]!, 16)
    return { r: (n >> 16) / 255, g: ((n >> 8) & 0xff) / 255, b: (n & 0xff) / 255, a: 1 }
  }
  const oklch = value.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/)
  if (!oklch) throw new Error(`unreachable: unsupported colour ${value}`)
  const [, l, c, h, alpha, percent] = oklch
  const L = Number(l)
  const hue = (Number(h) * Math.PI) / 180
  const A = Number(c) * Math.cos(hue)
  const B = Number(c) * Math.sin(hue)
  // OKLab -> linear sRGB (Björn Ottosson's reference matrices); out-of-gamut channels are clipped.
  const lms = [
    L + 0.3963377774 * A + 0.2158037573 * B,
    L - 0.1055613458 * A - 0.0638541728 * B,
    L - 0.0894841775 * A - 1.291485548 * B,
  ].map((x) => x ** 3) as [number, number, number]
  const [lc, mc, sc] = lms
  return {
    r: toSrgb(clamp(4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc)),
    g: toSrgb(clamp(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc)),
    b: toSrgb(clamp(-0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc)),
    a: alpha === undefined ? 1 : Number(alpha) / (percent ? 100 : 1),
  }
}

function colour(tokens: Map<string, string>, layer: Layer): Rgba {
  const [name, opacity] = layer.split('/')
  const parsed = parseColour(resolve(tokens, name!))
  return opacity === undefined ? parsed : { ...parsed, a: parsed.a * (Number(opacity) / 100) }
}

// Browsers composite in gamma-encoded sRGB, so blending happens there, not in linear light.
function over(top: Rgba, bottom: Rgba): Rgba {
  const mix = (t: number, b: number) => t * top.a + b * (1 - top.a)
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 }
}

function paint(tokens: Map<string, string>, layers: Layer[]): Rgba {
  const [base, ...rest] = layers.map((layer) => colour(tokens, layer))
  if (base!.a !== 1) throw new Error(`unreachable: ${layers[0]} is translucent, so it needs a surface below it`)
  return rest.reduce((bottom, top) => over(top, bottom), base!)
}

const luminance = ({ r, g, b }: Rgba) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

function contrast(tokens: Map<string, string>, pair: Pair): number {
  const surface = paint(tokens, pair.surface)
  const text = over(colour(tokens, pair.text), surface)
  const [hi, lo] = [luminance(text), luminance(surface)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}

describe.each<Theme>(['light', 'dark'])('%s theme token contrast', (theme) => {
  const tokens = themeTokens(theme)

  it.each(textPairs.map((pair) => [pair.name, pair] as const))(`text: %s is at least ${TEXT_MIN}:1`, (_, pair) => {
    expect(contrast(tokens, pair)).toBeGreaterThanOrEqual(TEXT_MIN)
  })

  it.each(uiPairs.map((pair) => [pair.name, pair] as const))(`UI: %s is at least ${UI_MIN}:1`, (_, pair) => {
    expect(contrast(tokens, pair)).toBeGreaterThanOrEqual(UI_MIN)
  })
})
