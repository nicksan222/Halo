import type { StorybookConfig } from '@storybook/react-vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), tsconfigPaths()];
    return config;
  }
};
export default config;
