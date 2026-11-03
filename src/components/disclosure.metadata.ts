import type { ComponentMetadata } from '../metadata/schema'
import type { DisclosureProps } from './disclosure'

export default {
  component: 'Disclosure',
  sourceHash: 'sha256:d55d08d29cd6050e0a299c9e9e3fadbf1aa237a0b985570bdf633a3af9bda939',
  category: 'layout',
  summary:
    'A heading button with a chevron that shows or hides a section below it; several in a DisclosureGroup form an accordion.',
  whenToUse: [
    'Secondary content the user may want on demand: details, advanced settings, raw data or tool call output.',
    'Raw evidence folded under a summary, such as a code block below a check result.',
    'A stack of sections where one, or several with allowsMultipleExpanded, stay open: wrap them in DisclosureGroup.',
  ],
  whenNotToUse: [
    'The main content of a page or required form fields: never hide them, render them directly.',
    'Switching between peer views of the same space: use Tabs.',
  ],
  alternatives: [
    { component: 'Tabs', when: 'The sections are peer views and exactly one is shown at a time in the same place.' },
    { component: 'Card', when: 'The content should always be visible as its own block.' },
  ],
  keyProps: ['title', 'level', 'defaultExpanded', 'isExpanded', 'onExpandedChange', 'isDisabled', 'id'],
  antiPatterns: [
    'Leaving level at its default of 3 under an h3 or deeper; set level so the trigger fits the page heading outline.',
    'Rendering Disclosures in a DisclosureGroup without an id; give each one an id so expandedKeys and defaultExpandedKeys can refer to it.',
    'Putting a button or link inside title; the title is already the trigger button, so keep it plain text.',
    'Restyling the trigger or chevron with palette classes through className; the look comes from tokens such as --foreground and --border.',
  ],
  accessibility: [
    'Renders a button with aria-expanded and aria-controls inside a heading; Enter and Space toggle it and it shows a focus ring.',
    'The panel is a group labelled by the trigger and hidden with hidden="until-found" where supported, so find-in-page opens it.',
    'The chevron is aria-hidden and its rotation is turned off under prefers-reduced-motion.',
    'The caller must pick a level that fits the page heading outline.',
  ],
  example: `<DisclosureGroup defaultExpandedKeys={['summary']}>
  <Disclosure id="summary" title="Summary">
    Three checks passed, one needs review.
  </Disclosure>
  <Disclosure id="evidence" title="Evidence">
    <pre className="font-mono text-xs">{evidence}</pre>
  </Disclosure>
</DisclosureGroup>`,
} satisfies ComponentMetadata<DisclosureProps>
