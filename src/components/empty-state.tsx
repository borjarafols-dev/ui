import type * as React from 'react'

import { emptyState } from '../recipes/empty-state'

export interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

const slots = emptyState()

/** Placeholder for a collection with no items. */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div data-slot="empty-state" className={slots.root({ className })}>
      <h3 className={slots.title()}>{title}</h3>
      {description && <p className={slots.description()}>{description}</p>}
      {action && <div className={slots.action()}>{action}</div>}
    </div>
  )
}
