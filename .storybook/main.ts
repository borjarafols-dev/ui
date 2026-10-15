import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite')
    const tailwindcss = (await import('@tailwindcss/vite')).default
    // Tailwind v4 processes src/styles.css (tokens + utilities, no preflight)
    // directly from source so token edits hot-reload in Storybook.
    return mergeConfig(config, {
      plugins: [tailwindcss()],
    })
  },
}

export default config
