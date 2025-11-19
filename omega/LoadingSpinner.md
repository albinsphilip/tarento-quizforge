# Technical Explanation: `LoadingSpinner.jsx`

## Overview
The `LoadingSpinner.jsx` file defines a reusable React component for displaying a loading spinner with an optional message. It supports different sizes for the spinner.

### Component Definition
```jsx
const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
```
- **`LoadingSpinner` Component**:
  - A functional React component that displays a loading spinner with an optional message.
  - Props:
    - `message`: The message to display below the spinner. Defaults to `'Loading...'`.
    - `size`: The size of the spinner. Defaults to `'md'`.

### Spinner Size Classes
```jsx
const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16'
};
```
- **`sizeClasses`**:
  - An object mapping size options (`sm`, `md`, `lg`) to corresponding Tailwind CSS classes for height and width.
  - `sm`: Small spinner (`h-8 w-8`).
  - `md`: Medium spinner (`h-12 w-12`).
  - `lg`: Large spinner (`h-16 w-16`).

### JSX Structure
#### Outer Container
```jsx
<div className="flex items-center justify-center min-h-[400px]">
```
- **Outer Container**:
  - `flex`: Enables a flexbox layout.
  - `items-center`: Vertically centers the content.
  - `justify-center`: Horizontally centers the content.
  - `min-h-[400px]`: Sets a minimum height of 400px for the container.

#### Inner Container
```jsx
<div className="text-center">
```
- **Inner Container**:
  - `text-center`: Centers the text horizontally.

#### Spinner
```jsx
<div className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizeClasses[size]} mx-auto mb-4`}></div>
```
- **Spinner Element**:
  - `animate-spin`: Applies a spinning animation.
  - `rounded-full`: Makes the spinner circular.
  - `border-4`: Sets the border width to 4px.
  - `border-gray-200`: Sets the border color to light gray.
  - `border-t-blue-600`: Sets the top border color to blue, creating a spinning effect.
  - `${sizeClasses[size]}`: Dynamically applies the size class based on the `size` prop.
  - `mx-auto`: Centers the spinner horizontally.
  - `mb-4`: Adds a bottom margin for spacing.

#### Loading Message
```jsx
<p className="text-gray-600 text-lg">{message}</p>
```
- **Message Element**:
  - `text-gray-600`: Sets the text color to light gray.
  - `text-lg`: Sets the font size to large.
  - Displays the `message` prop, which defaults to `'Loading...'`.

### Export
```jsx
export default LoadingSpinner;
```
- **Export**: Makes the `LoadingSpinner` component available for use in other parts of the application.

---

## Key Points
- **Reusable Component**: The `LoadingSpinner` component can be used across the application to indicate loading states.
- **Customizable Sizes**: Supports small, medium, and large sizes via the `size` prop.
- **Styling**: Uses Tailwind CSS for consistent and responsive styling.

---

Refer to the `QuizForm.jsx` documentation for a more complex component.