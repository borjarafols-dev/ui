import type * as React from 'react'

import type { ComponentMetadata } from '../metadata/schema'
import type { Card } from './card'

export default {
  component: 'Card',
  sourceHash: 'sha256:d0f6f0bb6ad1c3980153a8eb9d0d0aede652cea85b0a3acd13bc1b7521aefa6b',
  category: 'layout',
  summary: 'A bordered surface that groups related content, built from CardHeader, CardTitle, CardDescription, CardContent and CardFooter.',
  whenToUse: [
    'Grouping a form or a settings section on a page.',
    'A tile in a grid of items, such as plans, projects or stats.',
    'Framing a small self-contained flow, such as sign-in.',
  ],
  whenNotToUse: [
    'Content that must block the page until the user acts: use Modal.',
    'A list with no items: use EmptyState (inside a Card if the section needs the frame).',
    'Tabular data: use DataTable, optionally inside a Card.',
  ],
  alternatives: [
    { component: 'Modal', when: 'The content needs the user’s full attention and blocks the page.' },
    { component: 'EmptyState', when: 'The section exists but has nothing to show yet.' },
  ],
  keyProps: ['className', 'children'],
  antiPatterns: [
    'Putting content directly in Card and expecting padding; Card has none, so wrap content in CardContent or CardHeader.',
    'Restyling the surface with bg-*/border-* classes; override --card or --border tokens instead.',
    'Nesting cards inside cards for spacing; use layout (grid/gap) inside one CardContent.',
  ],
  accessibility: [
    'Purely presentational; CardTitle renders an <h3>, so make sure that heading level fits the page outline.',
  ],
  example: `<Card>
  <CardHeader>
    <CardTitle>Billing</CardTitle>
    <CardDescription>Your plan renews on 1 November.</CardDescription>
  </CardHeader>
  <CardContent className="grid gap-4">…</CardContent>
  <CardFooter className="justify-end">
    <Button>Update plan</Button>
  </CardFooter>
</Card>`,
} satisfies ComponentMetadata<React.ComponentProps<typeof Card>>
