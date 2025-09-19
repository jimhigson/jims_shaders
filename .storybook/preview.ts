import type { Preview } from "@storybook/react";

import { themes } from "@storybook/theming";

import "../src/index.css";

const preview: Preview = {
  parameters: {
    docs: {
      theme: themes.dark,
    },
    darkMode: {
      current: "dark",
      dark: themes.dark,
      light: themes.light,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Disable unnecessary addon panels
    actions: { disable: true },
    interactions: { disable: true },
    chromatic: { disable: true },
    // Use fullscreen layout by default
    layout: "fullscreen",
  },
};

export default preview;
