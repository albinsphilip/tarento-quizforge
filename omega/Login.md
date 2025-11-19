# Login Page

## Overview
The `Login` component is responsible for handling user authentication. It provides a form for users to enter their email and password, validates the credentials, and redirects users based on their roles (ADMIN or CANDIDATE).

## Key Features
- **Form Handling**: Includes fields for email and password with validation.
- **Error Handling**: Displays error messages for invalid credentials.
- **Role-Based Redirection**: Redirects users to the appropriate dashboard based on their role.
- **Password Visibility Toggle**: Allows users to toggle the visibility of their password.

## Code Breakdown
### State Management
- `email` and `password`: Store user input.
- `error`: Stores error messages for display.
- `loading`: Indicates whether the login process is ongoing.
- `showPassword`: Toggles password visibility.

### Functions
- `handleSubmit`: Handles form submission, validates credentials, and redirects users.
- `setShowPassword`: Toggles the visibility of the password field.

### API Integration
- Uses `authAPI.login` to authenticate users.
- Stores the authentication token and user details in `localStorage`.

### UI Components
- **Form**: Includes fields for email and password.
- **Error Alert**: Displays error messages.
- **Submit Button**: Disabled during the login process.

## Dependencies
- `react-router-dom`: For navigation.
- `authAPI`: For backend authentication.

## Example Usage
```jsx
<Login />
```

## File Location
`src/pages/Login.jsx`