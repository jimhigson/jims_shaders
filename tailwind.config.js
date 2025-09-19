/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      // Storybook dark theme colors
      primary: "#FF4785",
      secondary: "#029CFD",
      background: "#222425",
      "background-content": "#1B1C1D",
      "background-bar": "#292C2E",
      border: "rgba(255,255,255,0.1)",
      text: "#C9CDCF",
      "text-inverse": "#222425",
      "text-muted": "#798186",
      "button-bg": "#222425",
      "button-border": "rgba(255,255,255,0.1)",
      "input-bg": "#1B1C1D",
      "input-border": "rgba(255,255,255,0.1)",

      // Additional colors for our components
      black: "#000000",
      white: "#ffffff",
      blue: "#0066ff",
      "blue-light": "#0084ff",
      transparent: "transparent",
    },
    zIndex: {
      splitter: "100",
      "media-selector": "200",
    },
  },
  plugins: [],
};
