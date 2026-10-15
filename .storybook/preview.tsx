import type { Decorator, Preview } from '@storybook/react-vite'

// Preflight (wrapped in @layer base) is included in the preview only, for
// consistent viewing between Storybook and a typical consumer app. It is NOT
// part of the shipped CSS. Must be imported before src/styles.css so the
// base layer is ordered below utilities.
import './preview.css'
import '../src/styles.css'

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as string | undefined) ?? 'light'
  // Popovers and modals portal to <body>, outside the story wrapper, so the
  // theme must also sit on <html> — as it does in a real app.
  document.documentElement.dataset.theme = theme
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
