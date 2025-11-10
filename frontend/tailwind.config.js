/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0D47A1",
        "background-light": "#f8f9fa",
        "background-dark": "#121212",
        "surface-light": "#ffffff",
        "surface-dark": "#1e1e1e",
        "text-primary-light": "#212529",
        "text-primary-dark": "#e0e0e0",
        "text-secondary-light": "#6c757d",
        "text-secondary-dark": "#a0a0a0",
        "border-light": "#dee2e6",
        "border-dark": "#424242",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
