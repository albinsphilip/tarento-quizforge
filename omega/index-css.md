# Technical Explanation: `index.css`

## Overview
The `index.css` file defines the global styles for the QuizForge frontend application. It uses Tailwind CSS for utility-first styling and includes custom styles for the base layer and components.

### Font Imports
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
```
- **Google Fonts**:
  - `Inter`: A modern sans-serif font used for typography.
  - `Material Symbols Outlined`: A font for displaying outlined material design icons.

### Tailwind CSS Directives
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
- **Tailwind CSS**:
  - `@tailwind base`: Includes Tailwind's base styles (e.g., resets and defaults).
  - `@tailwind components`: Includes pre-defined component styles.
  - `@tailwind utilities`: Includes utility classes for styling.

### Base Layer
```css
@layer base {
  body {
    @apply font-sans antialiased bg-gray-100 text-gray-900;
  }
}
```
- **Custom Base Styles**:
  - `@layer base`: Extends the base layer of Tailwind CSS.
  - `body`:
    - `font-sans`: Applies the default sans-serif font.
    - `antialiased`: Improves font rendering.
    - `bg-gray-100`: Sets a light gray background color.
    - `text-gray-900`: Sets a dark gray text color.

### Components Layer
```css
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply px-4 py-2 bg-white text-gray-700 font-medium rounded-md hover:bg-gray-50 border border-gray-300 transition-colors;
  }
  .btn-outline {
    @apply px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors;
  }
  .card {
    @apply bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow;
  }
  .input-field {
    @apply w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 transition-all;
  }
}
```
- **Custom Components**:
  - `.btn-primary`: Styles for primary buttons.
  - `.btn-secondary`: Styles for secondary buttons.
  - `.btn-outline`: Styles for outline buttons.
  - `.card`: Styles for card components.
  - `.input-field`: Styles for input fields.

---

## Key Points
- **Utility-First Styling**: Tailwind CSS provides a utility-first approach to styling, making it easy to customize components.
- **Custom Layers**: The `@layer` directive is used to extend Tailwind's base and component layers.
- **Responsive Design**: Tailwind's utility classes ensure the application is responsive by default.

---

Refer to the `App.css` documentation for component-specific styles.