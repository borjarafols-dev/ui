import type { ComponentMetadata } from '../metadata/schema'
import type { BreadcrumbsProps } from './breadcrumbs'

export default {
  component: 'Breadcrumbs',
  sourceHash: 'sha256:e861b0fcbb73a588533a4661aa66651d99cf6e8576529e5d2e161ca9d7aee826',
  category: 'layout',
  summary: 'A trail of links from the top of a hierarchy down to the current page, such as Projects / acme / Settings.',
  whenToUse: [
    'A record or settings page two or more levels deep, so the user can see where it sits and go back up.',
    'The top of a page header, above the title.',
  ],
  whenNotToUse: [
    'A top-level page: it has no hierarchy above it to show.',
    'Steps in a flow such as a wizard: breadcrumbs show hierarchy, not progress.',
    'Switching between sibling views of the same page: use Tabs.',
  ],
  alternatives: [
    { component: 'Tabs', when: 'The choices are sibling views of one page, not levels above it.' },
    { component: 'Link', when: 'A single "Back to projects" link is enough.' },
  ],
  keyProps: ['children', 'aria-label', 'onAction', 'isDisabled', 'items'],
  antiPatterns: [
    'Giving the last Breadcrumb an href; the last item is the current page, so leave href off.',
    'Typing separators ("/" or ">") between crumbs; Breadcrumbs draws them and hides them from screen readers.',
    'Wrapping each crumb in its own Link or <a>; pass href and text to Breadcrumb, which renders the library Link.',
    'Using plain anchors with a custom onClick to route; mount React Aria\'s RouterProvider so the hrefs navigate in the app.',
  ],
  accessibility: [
    'Renders a <nav> landmark named by a localised "Breadcrumbs" label holding an ordered list; aria-label overrides the name.',
    'The last crumb gets aria-current="page" and is not focusable or followable; earlier crumbs are keyboard-reachable links.',
    'Separators are aria-hidden; the caller gives each crumb text that names its page.',
  ],
  example: `<Breadcrumbs>
  <Breadcrumb href="/projects">Projects</Breadcrumb>
  <Breadcrumb href={\`/projects/\${id}\`}>{name}</Breadcrumb>
  <Breadcrumb>Settings</Breadcrumb>
</Breadcrumbs>`,
} satisfies ComponentMetadata<BreadcrumbsProps<object>>
