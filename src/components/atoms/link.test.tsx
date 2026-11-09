import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider, RouterProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { Link } from './link'

describe('Link', () => {
  it('is a link with its name and href', () => {
    render(<Link href="/projects/42">Apollo</Link>)

    const link = screen.getByRole('link', { name: 'Apollo' })
    expect(link).toHaveAttribute('href', '/projects/42')
    expect(link).toHaveAttribute('data-slot', 'link')
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('data-external')
  })

  it('defaults to inline, underlined at rest', () => {
    render(<Link href="/a">Docs</Link>)

    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toHaveAttribute('data-variant', 'inline')
    expect(link).toHaveClass('text-primary', 'underline')
  })

  it.each([
    ['plain', 'text-foreground'],
    ['muted', 'text-muted-foreground'],
  ] as const)('sets data-variant and token classes for %s', (variant, tokenClass) => {
    render(<Link href="/a" variant={variant}>Docs</Link>)

    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toHaveAttribute('data-variant', variant)
    expect(link).toHaveClass(tokenClass, 'hover:underline')
    expect(link).not.toHaveClass('text-primary')
  })

  it('lets className win over recipe classes', () => {
    render(<Link href="/a" className="text-destructive">Docs</Link>)

    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toHaveClass('text-destructive')
    expect(link).not.toHaveClass('text-primary')
  })

  it('opens an external link in a new tab and says so', () => {
    render(<Link href="https://example.com/docs" isExternal>Docs</Link>)

    const link = screen.getByRole('link', { name: 'Docs (opens in a new tab)' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('data-external', 'true')
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('lets an explicit target or rel win over isExternal', () => {
    render(
      <Link href="https://example.com" isExternal target="docs" rel="noopener">
        Docs
      </Link>,
    )

    const link = screen.getByRole('link', { name: /^Docs/ })
    expect(link).toHaveAttribute('target', 'docs')
    expect(link).toHaveAttribute('rel', 'noopener')
  })

  it.each([
    ['es-ES', 'Docs (se abre en una pestaña nueva)'],
    ['ca-ES', 'Docs (s’obre en una pestanya nova)'],
  ])('localises the new-tab cue in %s', (locale, name) => {
    render(
      <I18nProvider locale={locale}>
        <Link href="https://example.com" isExternal>Docs</Link>
      </I18nProvider>,
    )

    expect(screen.getByRole('link', { name })).toBeInTheDocument()
  })

  it('navigates through the RouterProvider instead of loading the page', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    const clicks: MouseEvent[] = []
    const record = (e: MouseEvent) => clicks.push(e)
    render(
      <RouterProvider navigate={navigate}>
        <Link href="/projects/42">Apollo</Link>
      </RouterProvider>,
    )

    document.addEventListener('click', record, true)
    try {
      await user.click(screen.getByRole('link', { name: 'Apollo' }))
    } finally {
      document.removeEventListener('click', record, true)
    }

    expect(navigate).toHaveBeenCalledWith('/projects/42', undefined)
    expect(clicks).toHaveLength(1)
    expect(clicks[0]!.defaultPrevented).toBe(true)
  })

  it('does not navigate when disabled', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    render(
      <RouterProvider navigate={navigate}>
        <Link href="/a" isDisabled>Docs</Link>
      </RouterProvider>,
    )

    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toHaveAttribute('data-disabled')
    await user.click(link)
    expect(navigate).not.toHaveBeenCalled()
  })
})
