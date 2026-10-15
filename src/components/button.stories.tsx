import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button'

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    asChild: { control: false },
    onClick: { action: 'clicked' },
  },
  tags: ['autodocs'],
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    children: 'Button',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  tags: ['autodocs'],
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
}

export const Link: Story = {
  args: { variant: 'link', children: 'Learn more' },
}

export const Small: Story = {
  args: { size: 'sm', children: 'Small' },
}

export const Large: Story = {
  args: { size: 'lg', children: 'Large' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
}

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="https://example.com">Renders as an anchor</a>,
  },
}
