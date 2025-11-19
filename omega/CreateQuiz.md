# Create Quiz Page

## Overview
The `CreateQuiz` component allows administrators to create new quizzes. It provides a form for entering quiz details and questions, and submits the data to the backend.

## Line-by-Line Explanation

### Imports
```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import QuizForm from '../components/QuizForm';
```
- `useState` and `useEffect`: React hooks for managing state and side effects.
- `useNavigate`: React Router hook for navigation.
- `adminAPI`: Utility for making admin-related API calls.
- `QuizForm`: Reusable component for quiz forms.

### State Variables
```jsx
const [user, setUser] = useState(null);
```
- `user`: Stores the logged-in user details.

### `useEffect` Hook
```jsx
useEffect(() => {
  const userData = localStorage.getItem('user');
  if (!userData || JSON.parse(userData).role !== 'ADMIN') {
    navigate('/');
    return;
  }
  setUser(JSON.parse(userData));
}, [navigate]);
```
- Validates the user's role.
- Redirects non-admin users to the home page.

### `handleSubmit` Function
```jsx
const handleSubmit = async (data) => {
  try {
    const payload = {
      title: data.title,
      description: data.description,
      duration: data.duration,
      isActive: data.isActive,
      questions: data.questions.map(q => ({
        questionText: q.questionText,
        type: q.type,
        points: q.points,
        options: q.options.map(o => ({ optionText: o.optionText, isCorrect: o.isCorrect }))
      }))
    };

    await adminAPI.createQuiz(payload);
    alert('Quiz created successfully!');
    navigate('/admin');
  } catch (error) {
    alert('Failed to create quiz: ' + error.message);
  }
};
```
- Prepares the quiz data payload.
- Calls `adminAPI.createQuiz` to submit the data.
- Alerts the user on success or failure.

### JSX Structure
#### Header
```jsx
<header>
  <button onClick={() => navigate('/admin')}>Back</button>
  <h1>Create New Quiz</h1>
</header>
```
- Displays the page title and a back button.

#### QuizForm
```jsx
<QuizForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Create Quiz" />
```
- Renders the `QuizForm` component with initial data and a submit handler.

## File Location
`src/pages/CreateQuiz.jsx`