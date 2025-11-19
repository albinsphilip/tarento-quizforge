# Login Page

## Overview
The `Login` component is responsible for handling user authentication. It provides a form for users to enter their email and password, validates the credentials, and redirects users based on their roles (ADMIN or CANDIDATE).

## Line-by-Line Explanation

### Imports
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
```
- `useState`: React hook for managing component state.
- `useNavigate`: React Router hook for navigation.
- `authAPI`: Utility for making authentication-related API calls.

### State Variables
```jsx
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
```
- `email` and `password`: Store user input.
- `error`: Stores error messages for display.
- `loading`: Indicates whether the login process is ongoing.
- `showPassword`: Toggles password visibility.

### `handleSubmit` Function
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const data = await authAPI.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ 
      email: data.email, 
      name: data.name, 
      role: data.role 
    }));
    navigate(data.role === 'ADMIN' ? '/admin' : '/candidate');
  } catch (err) {
    setError(err.message || 'Login failed. Please check your credentials.');
  } finally {
    setLoading(false);
  }
};
```
- Prevents default form submission.
- Calls `authAPI.login` to authenticate the user.
- Stores the token and user details in `localStorage`.
- Redirects the user based on their role.
- Handles errors and updates the `error` state.

### JSX Structure
#### Form
```jsx
<form onSubmit={handleSubmit} className="space-y-4">
  <div>
    <label>Email Address</label>
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  </div>
  <div>
    <label>Password</label>
    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
  </div>
  <button type="submit">Sign In</button>
</form>
```
- Includes fields for email and password.
- Toggles password visibility.
- Submits the form via `handleSubmit`.

## File Location
`src/pages/Login.jsx`