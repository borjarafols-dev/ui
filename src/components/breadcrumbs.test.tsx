import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { I18nProvider, RouterProvider } from 'react-aria-components'
import { describe, expect, it, vi } from 'vitest'

import { Breadcrumb, Breadcrumbs } from './breadcrumbs'

function Trail(props: { 'aria-label'?: string }) {
  return (
    <Breadcrumbs {...props}>
      <Breadcrumb href="/projects">Projects</Breadcrumb>
      <Breadcrumb href="/projects/acme">acme</Breadcrumb>
      <Breadcrumb>Settings</Breadcrumb>
    </Breadcrumbs>
  )
}

describe('Breadcrumbs', () => {
  it('renders a navigation landmark named "Breadcrumbs" holding an ordered list', () => {
    render(<Trail />)

    const nav = screen.getByRole('navigation', { name: 'Breadcrumbs' })
    const list = within(nav).getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(list).not.toHaveAttribute('aria-label')
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
  })

  it('links the earlier crumbs and marks the last as the current page', () => {
    render(<Trail />)

    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'acme' })).toHaveAttribute('href', '/projects/acme')

    const current = screen.getByRole('link', { name: 'Settings' })
    expect(current).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Projects' })).not.toHaveAttribute('aria-current')
  })

  it('hides separators from screen readers and puts none after the last crumb', () => {
    render(<Trail />)

    const [first, second, last] = screen.getAllByRole('listitem')
    for (const item of [first!, second!]) {
      const separator = item.querySelector('[aria-hidden="true"]')
      expect(separator).toHaveTextContent('/')
    }
    expect(last!.querySelector('[aria-hidden="true"]')).toBeNull()
    expect(last).toHaveTextContent(/^Settings$/)
  })

  it('lets an aria-label win', () => {
    render(<Trail aria-label="Project path" />)

    expect(screen.getByRole('navigation', { name: 'Project path' })).toBeInTheDocument()
  })

  it.each([
    ['es-ES', 'Migas de pan'],
    ['ca-ES', 'Ruta de navegació'],
  ])('localises the landmark name in %s', (locale, name) => {
    render(
      <I18nProvider locale={locale}>
        <Trail />
      </I18nProvider>,
    )

    expect(screen.getByRole('navigation', { name })).toBeInTheDocument()
  })

  it('navigates through the RouterProvider', async () => {
    const user = userEvent.setup()
    const navigate = vi.fn()
    render(
      <RouterProvider navigate={navigate}>
        <Trail />
      </RouterProvider>,
    )

    await user.click(screen.getByRole('link', { name: 'acme' }))

    expect(navigate).toHaveBeenCalledWith('/projects/acme', undefined)
  })

  it('calls onAction with the crumb id', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    render(
      <Breadcrumbs onAction={onAction}>
        <Breadcrumb id="projects">Projects</Breadcrumb>
        <Breadcrumb id="settings">Settings</Breadcrumb>
      </Breadcrumbs>,
    )

    await user.click(screen.getByRole('link', { name: 'Projects' }))

    expect(onAction).toHaveBeenCalledWith('projects')
  })

  it('disables every crumb when isDisabled', () => {
    render(
      <Breadcrumbs isDisabled>
        <Breadcrumb href="/projects">Projects</Breadcrumb>
        <Breadcrumb>Settings</Breadcrumb>
      </Breadcrumbs>,
    )

    for (const link of screen.getAllByRole('link')) expect(link).toHaveAttribute('aria-disabled', 'true')
  })
})
