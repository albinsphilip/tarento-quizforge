# Technical Explanation: `ErrorMessage.jsx`

## Overview
The `ErrorMessage.jsx` file defines a reusable React component for displaying error messages. It includes an optional retry button for handling errors gracefully.

### Component Definition
```jsx
const ErrorMessage = ({ message, onRetry }) => {
```
- **`ErrorMessage` Component**:
  - A functional React component that displays an error message.
  - Props:
    - `message`: The error message to display.
    - `onRetry`: A callback function to retry the operation.

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
<div className="text-center max-w-md">
```
- **Inner Container**:
  - `text-center`: Centers the text horizontally.
  - `max-w-md`: Restricts the maximum width to a medium size.

#### Error Icon
```jsx
<span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
```
- **Material Icon**:
  - `material-symbols-outlined`: Uses the Material Symbols Outlined font for the error icon.
  - `text-6xl`: Sets the font size to 6xl.
  - `text-red-500`: Applies a red color to the icon.
  - `mb-4`: Adds a bottom margin for spacing.

#### Error Title
```jsx
<h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
```
- **Error Title**:
  - `text-xl`: Sets the font size to extra-large.
  - `font-semibold`: Applies a semi-bold font weight.
  - `text-gray-900`: Sets the text color to dark gray.
  - `mb-2`: Adds a bottom margin for spacing.

#### Error Message
```jsx
<p className="text-gray-600 mb-6">{message || 'An unexpected error occurred'}</p>
```
- **Error Description**:
  - `text-gray-600`: Sets the text color to light gray.
  - `mb-6`: Adds a bottom margin for spacing.
  - Displays the `message` prop if provided; otherwise, defaults to `'An unexpected error occurred'`.

#### Retry Button
```jsx
{onRetry && (
  <button
    onClick={onRetry}
    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
    Try Again
  </button>
)}
```
- **Conditional Rendering**:
  - The retry button is rendered only if the `onRetry` prop is provided.
- **Button Styles**:
  - `px-6 py-2`: Adds padding to the button.
  - `bg-blue-600`: Sets a blue background color.
  - `text-white`: Sets the text color to white.
  - `rounded-lg`: Applies rounded corners.
  - `hover:bg-blue-700`: Changes the background color on hover.
  - `transition-colors`: Smoothens the color transition.

### Export
```jsx
export default ErrorMessage;
```
- **Export**: Makes the `ErrorMessage` component available for use in other parts of the application.

---

## Key Points
- **Reusable Component**: The `ErrorMessage` component can be used across the application to display error messages.
- **Optional Retry**: Includes an optional retry button for handling errors interactively.
- **Styling**: Uses Tailwind CSS for consistent and responsive styling.

---

Refer to the `LoadingSpinner.jsx` documentation for another reusable component.