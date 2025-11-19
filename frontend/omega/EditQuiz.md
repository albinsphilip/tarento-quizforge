# Edit Quiz Page

## Overview
The `EditQuiz` component allows administrators to edit existing quizzes. It fetches quiz data, populates the form, and updates the quiz details upon submission.

## Line-by-Line Explanation

### Imports
```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import QuizForm from '../components/QuizForm';
import LoadingSpinner from '../components/LoadingSpinner';
```
- `useState` and `useEffect`: React hooks for managing state and side effects.
- `useNavigate` and `useParams`: React Router hooks for navigation and accessing route parameters.
- `adminAPI`: Utility for making admin-related API calls.
- `QuizForm`: Reusable component for quiz forms.
- `LoadingSpinner`: Component for displaying a loading indicator.

### State Variables
```jsx
const [initialData, setInitialData] = useState(null);
const [loading, setLoading] = useState(true);
```
- `initialData`: Stores the fetched quiz data.
- `loading`: Indicates whether the quiz data is being fetched.

### `useEffect` Hook
```jsx
useEffect(() => {
  const userData = localStorage.getItem('user');
  if (!userData || JSON.parse(userData).role !== 'ADMIN') {
    navigate('/');
    return;
  }
  fetchQuiz();
}, [navigate, quizId]);
```
- Validates the user's role.
- Calls `fetchQuiz` to retrieve quiz data.

### `fetchQuiz` Function
```jsx
const fetchQuiz = async () => {
  try {
    const data = await adminAPI.getQuiz(quizId);
    setInitialData({
      quizData: { 
        title: data.title, 
        description: data.description, 
        duration: data.duration, 
        isActive: data.isActive 
      },
      questions: data.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        type: q.type,
        points: q.points,
        options: q.options.map(o => ({ 
          id: o.id, 
          optionText: o.optionText, 
          isCorrect: o.isCorrect 
        })),
        isNew: false
      }))
    });
    setLoading(false);
  } catch (error) {
    alert('Failed to load quiz: ' + error.message);
    navigate('/admin');
  }
};
```
- Fetches quiz data from the backend.
- Transforms the data into the required format for the form.

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
        id: q.isNew ? null : q.id,
        questionText: q.questionText,
        type: q.type,
        points: q.points,
        options: q.options.map(o => ({
          id: o.id > 1000000000000 ? null : o.id,
          optionText: o.optionText,
          isCorrect: o.isCorrect
        }))
      }))
    };

    await adminAPI.updateQuiz(quizId, payload);
    alert('Quiz updated successfully!');
    navigate('/admin');
  } catch (error) {
    alert('Failed to update quiz: ' + error.message);
  }
};
```
- Prepares the updated quiz data payload.
- Calls `adminAPI.updateQuiz` to submit the data.
- Alerts the user on success or failure.

### JSX Structure
#### Header
```jsx
<header>
  <button onClick={() => navigate('/admin')}>Back</button>
  <h1>Edit Quiz</h1>
</header>
```
- Displays the page title and a back button.

#### QuizForm
```jsx
<QuizForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Quiz" />
```
- Renders the `QuizForm` component with initial data and a submit handler.

## File Location
`src/pages/EditQuiz.jsx`