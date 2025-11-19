# Technical Explanation: `AdminDashboard.jsx`

## Overview
The `AdminDashboard.jsx` file defines the admin dashboard page for the QuizForge application. It provides functionality for managing quizzes, including viewing, creating, editing, and deleting quizzes.

---

## Imports
```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
```
- **React Hooks**:
  - `useState`: Manages local state for user, quizzes, loading, and error.
  - `useEffect`: Handles side effects, such as fetching data on component mount.
- **`react-router-dom`**:
  - `useNavigate`: Programmatically navigates between routes.
  - `useLocation`: Retrieves the current route location.
- **Custom Utilities**:
  - `adminAPI`: Provides API methods for admin operations (e.g., fetching quizzes).
- **Components**:
  - `Sidebar`: Displays the navigation menu for the admin.
  - `LoadingSpinner`: Shows a loading indicator while data is being fetched.

---

## State Management
```jsx
const [user, setUser] = useState(null);
const [quizzes, setQuizzes] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
```
- **`user`**: Stores the logged-in admin's user data.
- **`quizzes`**: Stores the list of quizzes fetched from the backend.
- **`loading`**: Tracks whether data is being loaded.
- **`error`**: Stores error messages for display.

---

## Authentication and Role Validation
```jsx
useEffect(() => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (!userData || !token) {
    navigate('/');
    return;
  }
  const parsedUser = JSON.parse(userData);
  if (parsedUser.role !== 'ADMIN') {
    navigate('/candidate');
    return;
  }
  setUser(parsedUser);
  fetchQuizzes();
}, [navigate]);
```
- **Authentication**:
  - Retrieves `user` and `token` from `localStorage`.
  - Redirects to the login page (`/`) if authentication data is missing.
- **Role Validation**:
  - Redirects non-admin users to the candidate dashboard (`/candidate`).

---

## Fetching Quizzes
```jsx
const fetchQuizzes = async () => {
  try {
    setError('');
    const data = await adminAPI.getQuizzes();
    setQuizzes(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```
- Fetches the list of quizzes from the backend using `adminAPI.getQuizzes`.
- Updates the `quizzes` state with the fetched data.
- Handles errors by setting the `error` state.

---

## Deleting a Quiz
```jsx
const handleDelete = async (id, title) => {
  if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
  
  try {
    await adminAPI.deleteQuiz(id);
    setQuizzes(quizzes.filter(q => q.id !== id));
  } catch (err) {
    alert('Failed to delete quiz: ' + err.message);
  }
};
```
- Prompts the admin for confirmation before deleting a quiz.
- Calls `adminAPI.deleteQuiz` to delete the quiz.
- Updates the `quizzes` state to remove the deleted quiz.

---

## Loading State
```jsx
if (loading) return <LoadingSpinner message="Loading dashboard..." />;
```
- Displays the `LoadingSpinner` component while data is being fetched.

---

## Dashboard Layout
### Sidebar
```jsx
<Sidebar role="ADMIN" currentPath={location.pathname} userName={user?.name} />
```
- Displays the `Sidebar` component with the admin's name and current path.

### Header
```jsx
<div className="bg-white border-b border-gray-200">
  <div className="px-8 py-5">
    <h1 className="text-xl font-semibold text-gray-900">
      Welcome back, {user?.name || 'Admin'}
    </h1>
    <p className="text-gray-600 text-sm mt-1">Manage quizzes and monitor performance</p>
  </div>
</div>
```
- Displays a welcome message and a brief description of the dashboard.

### Error Message
```jsx
{error && (
  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-red-600 text-lg">error</span>
      <p className="text-sm text-red-700">{error}</p>
    </div>
  </div>
)}
```
- Displays an error message if the `error` state is set.

### Stats Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
  {/* Total Quizzes */}
  {/* Active Quizzes */}
  {/* Inactive Quizzes */}
  {/* Total Questions */}
</div>
```
- Displays statistics about quizzes, including total quizzes, active quizzes, inactive quizzes, and total questions.

### Quiz Management
```jsx
<div className="bg-white rounded-lg border border-gray-200 shadow-sm">
  <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
    <h2 className="text-lg font-semibold text-gray-900">Quiz Management</h2>
    <button 
      onClick={() => navigate('/admin/quiz/create')} 
      className="btn-primary inline-flex items-center gap-1.5"
    >
      <span className="material-symbols-outlined text-lg">add</span>
      Create Quiz
    </button>
  </div>
</div>
```
- Displays a table of quizzes with options to create, edit, or delete quizzes.

---

## Export
```jsx
export default AdminDashboard;
```
- Makes the `AdminDashboard` component available for use in other parts of the application.

---

## Key Points
- **Dynamic Data**: Fetches quizzes and displays them dynamically.
- **Role-Based Access**: Ensures only admins can access the dashboard.
- **Reusable Components**: Utilizes `Sidebar` and `LoadingSpinner` for consistent UI.

---

Refer to the `CandidateDashboard.jsx` documentation for the candidate's dashboard functionality.