import type * as React from 'react'
import {
  Button as RACButton,
  Disclosure as RACDisclosure,
  DisclosureGroup as RACDisclosureGroup,
  DisclosurePanel as RACDisclosurePanel,
  Heading as RACHeading,
  type DisclosureGroupProps as RACDisclosureGroupProps,
  type DisclosureProps as RACDisclosureProps,
} from 'react-aria-components'

import { disclosure } from '../recipes/disclosure'

export interface DisclosureProps extends Omit<RACDisclosureProps, 'className' | 'children'> {
  /** The trigger's text. */
  title: React.ReactNode
  /** Heading level of the trigger. Defaults to 3. */
  level?: 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
}

export interface DisclosureGroupProps extends Omit<RACDisclosureGroupProps, 'className'> {
  className?: string
}

const slots = disclosure()

/**
 * A heading button that shows or hides a section below it. Use `isExpanded` /
 * `onExpandedChange` to control it; inside a DisclosureGroup give each one an
 * `id` for the group's `expandedKeys`.
 *
 * @usage For secondary content the user may want (details, advanced settings, raw data); never hide the main content or required fields.
 * @usage Not for switching between peer views: use Tabs.
 * @usage Set level so the trigger fits the page's heading outline.
 */
export function Disclosure({ title, level = 3, children, className, ...props }: DisclosureProps) {
  return (
    <RACDisclosure data-slot="disclosure" {...props} className={slots.root({ className })}>
      <RACHeading level={level} data-slot="disclosure-heading" className={slots.heading()}>
        <RACButton slot="trigger" data-slot="disclosure-trigger" className={slots.trigger()}>
          <svg viewBox="0 0 16 16" className={slots.chevron()} aria-hidden="true">
            <path
              d="M6 3.5 10.5 8 6 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {title}
        </RACButton>
      </RACHeading>
      <RACDisclosurePanel data-slot="disclosure-panel" className={slots.panel()}>
        <div className={slots.content()}>{children}</div>
      </RACDisclosurePanel>
    </RACDisclosure>
  )
}

/** Stacks Disclosures as an accordion: one open at a time unless `allowsMultipleExpanded`. */
export function DisclosureGroup({ className, ...props }: DisclosureGroupProps) {
  return <RACDisclosureGroup data-slot="disclosure-group" {...props} className={slots.group({ className })} />
}
