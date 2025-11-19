# Technical Explanation: `App.css`

## Overview
The `App.css` file contains component-specific styles for the QuizForge frontend. It defines the layout, typography, and design of various UI elements.

### General Layout
```css
.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.container {
  max-width: 800px;
  width: 100%;
}
```
- **`.app`**:
  - Ensures the application takes up the full viewport height (`min-height: 100vh`).
  - Centers content both vertically and horizontally using `flex`.
  - Adds padding around the content.
- **`.container`**:
  - Restricts the maximum width to `800px`.
  - Ensures the container spans the full width of its parent.

### Header
```css
.header {
  text-align: center;
  margin-bottom: 40px;
}
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
}
```
- **`.header`**: Centers the text and adds spacing below the header.
- **`.logo`**: Aligns logo elements horizontally and adds spacing between items.

### Typography
```css
.title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  letter-spacing: -1px;
}
.subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
}
```
- **`.title`**: Defines the main title with large, bold text and a shadow effect.
- **`.subtitle`**: Defines the subtitle with smaller, lighter text.

### Card
```css
.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.5s ease-out;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
- **`.card`**: Styles for card components, including background, padding, and shadow effects.
- **`@keyframes slideUp`**: Defines an animation for sliding the card into view.

### Features
```css
.features {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
}
.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.05rem;
  color: #2d3748;
}
```
- **`.features`**: Styles for the features section, including layout and spacing.
- **`.feature`**: Styles for individual feature items.

### Media Queries
```css
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  .card {
    padding: 25px;
  }
  .card-title {
    font-size: 1.5rem;
  }
}
```
- **Responsive Design**: Adjusts styles for smaller screens (widths below `768px`).

---

## Key Points
- **Component-Specific Styles**: Focuses on the layout and design of specific UI elements.
- **Animations**: Includes a `slideUp` animation for cards.
- **Responsive Design**: Ensures the application is mobile-friendly.

---

Refer to the `index.css` documentation for global styles.