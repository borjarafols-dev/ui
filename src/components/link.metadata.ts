import type { ComponentMetadata } from '../metadata/schema'
import type { LinkProps } from './link'

export default {
  component: 'Link',
  sourceHash: 'sha256:04c387f53d70dcf7a32dc2c450393a3c3b35fc6e23bfa19f786ce8e63e6a15e4',
  category: 'action',
  summary: 'A text link to another page, in the app through its router or outside it in a new tab.',
  whenToUse: [
    'A link inside running text, with the default inline variant, which stays underlined.',
    'Linking to a record from a table cell, list or header, with variant="plain".',
    'Secondary links in footers or metadata, with variant="muted".',
    'Linking to another site such as an issue tracker or docs, with isExternal.',
  ],
  whenNotToUse: [
    'An action that changes data or opens a dialog: use Button.',
    'A link that must look like a button: put the button() recipe on Link as className, not a Button inside an <a>.',
  ],
  alternatives: [
    { component: 'Button', when: 'Pressing it runs an action on the current page instead of navigating.' },
  ],
  keyProps: ['href', 'variant', 'isExternal', 'routerOptions', 'target', 'rel', 'isDisabled'],
  antiPatterns: [
    'Leaving out isExternal on a link that leaves the app; set it so the link opens a new tab and says so.',
    'Setting target="_blank" by hand for an external link; use isExternal, which also adds rel and the "opens in a new tab" cue.',
    'Using plain or muted inside a paragraph; links in prose use the inline variant so they do not rely on colour alone.',
    'Wrapping Link in the router\'s own link component; mount React Aria\'s RouterProvider once at the app root instead.',
    'Using onClick for navigation side effects; use onPress, or href for navigation.',
  ],
  accessibility: [
    'Renders a link role with Enter activation, modifier clicks for new tabs, a focus-visible ring and the disabled state.',
    'isExternal adds an aria-hidden icon and a visually hidden, localised "(opens in a new tab)" at the end of the accessible name.',
    'The caller gives the link descriptive text; "click here" or a bare URL is not a useful name.',
  ],
  example: `<Link href={\`/projects/\${id}\`} variant="plain">{name}</Link>
<Link href={issue.url} isExternal>{issue.key}</Link>`,
} satisfies ComponentMetadata<LinkProps>
