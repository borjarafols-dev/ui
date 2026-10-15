import type * as React from 'react'

import { card } from '../recipes/card'

type DivProps = React.ComponentPropsWithRef<'div'>

const slots = card()

/** Presentational container. Compose with CardHeader / CardContent / CardFooter. */
export function Card({ className, ...props }: DivProps) {
  return <div data-slot="card" className={slots.root({ className })} {...props} />
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div data-slot="card-header" className={slots.header({ className })} {...props} />
}

export function CardTitle({ className, ...props }: React.ComponentPropsWithRef<'h3'>) {
  return <h3 data-slot="card-title" className={slots.title({ className })} {...props} />
}

export function CardDescription({ className, ...props }: React.ComponentPropsWithRef<'p'>) {
  return <p data-slot="card-description" className={slots.description({ className })} {...props} />
}

export function CardContent({ className, ...props }: DivProps) {
  return <div data-slot="card-content" className={slots.content({ className })} {...props} />
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div data-slot="card-footer" className={slots.footer({ className })} {...props} />
}
