/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design system
        alabaster: "#FAFAFA", // base background
        gunmetal: "#2B343A", // primary text
        pine: {
          DEFAULT: "#4A7C59", // accent / links / active states (AA on alabaster)
          dark: "#3E6B4C", // accent text on surface backgrounds (AA on slate)
          tint: "#EDF3EF", // very light pine wash for subtle emphasis
        },
        surface: "#EAECEE", // soft slate card backgrounds
        muted: "#55636C", // secondary text (AA on alabaster and surface)
        edge: "#D9DEE2", // hairline borders
      },
      fontFamily: {
        sans: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        content: "800px",
      },
    },
  },
  plugins: [],
};
