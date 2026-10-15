/**
 * Shape of `src/components/<name>.metadata.ts`.
 *
 * Metadata holds the judgement calls about a component (when to use it and
 * when not to, alternatives, pitfalls) for agents that build UI with the
 * library. Facts such as exports, props, variants and tokens are extracted by
 * `scripts/build-manifest.mjs` and never written here.
 *
 * The files are model-owned: the generator rewrites them whenever the
 * component's source hash changes. Don't edit them by hand. To steer the
 * output, write an `@usage` line in the component's JSDoc.
 *
 * Changing this file changes every component's source hash, so all metadata
 * is regenerated in the same PR.
 */

import type * as Library from '../index'

/** Every component the package exports. Used to type-check cross-references. */
export type ComponentName = Exclude<keyof typeof Library, 'cn' | 'applyTheme' | 'createTheme' | 'createThemeCss'>

export type ComponentCategory = 'action' | 'form' | 'feedback' | 'layout' | 'overlay' | 'data' | 'display'

export interface ComponentMetadata<Props = Record<string, unknown>> {
  /** The main export this file describes. */
  component: ComponentName
  /**
   * Hash of the generator inputs, written by `npm run metadata:stamp`.
   * `pending` until stamped.
   */
  sourceHash: string
  category: ComponentCategory
  /** One sentence: what it is, in the reader's terms. */
  summary: string
  /** Concrete situations, phrased as UI needs ("Confirming a destructive action"). */
  whenToUse: string[]
  /** Situations that look similar but call for something else; say what instead. */
  whenNotToUse: string[]
  /** Library alternatives and when each one wins. */
  alternatives: Array<{ component: ComponentName; when: string }>
  /** The props an agent most often needs. Type-checked against the component's props. */
  keyProps: Array<keyof Props & string>
  /** Mistakes to avoid, each with the correct approach. */
  antiPatterns: string[]
  /** What the component handles for you, and what the caller must still provide. */
  accessibility: string[]
  /** A short, realistic TSX usage example. */
  example: string
}
