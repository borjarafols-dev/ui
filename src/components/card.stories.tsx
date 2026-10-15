import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { TextField } from './text-field'

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const SignIn: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use your work email.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <TextField label="Email" type="email" />
        <TextField label="Password" type="password" />
      </CardContent>
      <CardFooter className="justify-end">
        <Button>Continue</Button>
      </CardFooter>
    </Card>
  ),
}

export const ContentOnly: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <p className="text-sm">Your next invoice is due on 1 November.</p>
      </CardContent>
    </Card>
  ),
}

export const ContentAndFooter: Story = {
  render: () => (
    <Card className="w-96">
      <CardContent>
        <p className="text-sm">You have 3 unread messages.</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button>Open inbox</Button>
      </CardFooter>
    </Card>
  ),
}
