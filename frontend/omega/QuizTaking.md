# Quiz Taking Page

## Overview
The `QuizTaking` component allows candidates to take a quiz. It manages the quiz state, tracks answers, and submits the quiz upon completion.

## Line-by-Line Explanation

### Imports
```jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { candidateAPI } from '../utils/api';
```
- `useState`, `useEffect`, `useCallback`, and `useRef`: React hooks for managing state, side effects, and references.
- `useNavigate` and `useParams`: React Router hooks for navigation and accessing route parameters.
- `candidateAPI`: Utility for making candidate-related API calls.

### State Variables
```jsx
const [user, setUser] = useState(null);
const [quiz, setQuiz] = useState(null);
const [answers, setAnswers] = useState({});
const [timeLeft, setTimeLeft] = useState(0);
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
```
- `user`: Stores the logged-in user details.
- `quiz`: Stores the quiz data.
- `answers`: Tracks the user's answers.
- `timeLeft`: Tracks the remaining time for the quiz.
- `loading` and `submitting`: Indicate the loading and submission states.

### `useEffect` Hook
```jsx
useEffect(() => {
  const userData = localStorage.getItem('user');
  if (!userData) {
    navigate('/');
    return;
  }
  const parsedUser = JSON.parse(userData);
  if (parsedUser.role !== 'CANDIDATE') {
    navigate('/');
    return;
  }
  setUser(parsedUser);
  startQuizAttempt();
}, []);
```
- Validates the user's role.
- Calls `startQuizAttempt` to initialize the quiz attempt.

### `startQuizAttempt` Function
```jsx
const startQuizAttempt = async () => {
  try {
    const quizData = await candidateAPI.getQuiz(quizId);
    setQuiz(quizData);
    const attemptData = await candidateAPI.startQuiz(quizId);
    setTimeLeft(quizData.duration * 60);
    setLoading(false);
  } catch (error) {
    navigate('/candidate');
  }
};
```
- Fetches quiz data and initializes the quiz attempt.
- Updates the `quiz` and `timeLeft` states.

### JSX Structure
#### Header
```jsx
<header>
  <h1>{quiz.title}</h1>
  <p>Time Left: {formatTime(timeLeft)}</p>
</header>
```
- Displays the quiz title and remaining time.

#### Question Card
```jsx
<div>
  <h2>{currentQuestion.questionText}</h2>
  <button onClick={handleSaveAndNext}>Save & Next</button>
</div>
```
- Displays the current question and a button to save and navigate to the next question.

## File Location
`src/pages/QuizTaking.jsx`