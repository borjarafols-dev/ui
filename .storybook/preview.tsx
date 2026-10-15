import type { Decorator, Preview } from '@storybook/react-vite'

import '../src/styles.css'
// Preflight is included in the preview only, for consistent viewing between
// Storybook and a typical consumer app. It is NOT part of the shipped CSS.
import 'tailwindcss/preflight.css'

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string | undefined) ?? 'light'
  return (
    <div data-theme={theme} className="min-h-[100dvh] bg-background p-8 font-sans text-foreground">
      <Story />
    </div>
  )
}

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Global color theme, applied as data-theme on the story root',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
