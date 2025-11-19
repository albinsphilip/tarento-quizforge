# Quiz Results Page

## Overview
The `QuizResults` component displays the results of a quiz attempt. It shows the user's score, percentage, and a detailed review of their answers.

## Line-by-Line Explanation

### Imports
```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI } from '../utils/api';
```
- `useState` and `useEffect`: React hooks for managing state and side effects.
- `useParams` and `useNavigate`: React Router hooks for accessing route parameters and navigation.
- `candidateAPI`: Utility for making candidate-related API calls.

### State Variables
```jsx
const [attempt, setAttempt] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```
- `attempt`: Stores the quiz attempt data.
- `loading`: Indicates whether the results are being fetched.
- `error`: Stores error messages.

### `useEffect` Hook
```jsx
useEffect(() => {
  fetchAttemptResults();
}, [attemptId]);
```
- Calls `fetchAttemptResults` to retrieve the quiz attempt data.

### `fetchAttemptResults` Function
```jsx
const fetchAttemptResults = async () => {
  try {
    const data = await candidateAPI.getAttempt(attemptId);
    setAttempt(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```
- Fetches the quiz attempt data from the backend.
- Updates the `attempt` state with the fetched data.
- Handles errors and updates the `error` state.

### JSX Structure
#### Header
```jsx
<header>
  <button onClick={() => navigate('/candidate')}>Back</button>
  <h1>Quiz Results</h1>
</header>
```
- Displays the page title and a back button.

#### Score Card
```jsx
<div>
  <h2>{attempt.quiz?.title}</h2>
  <p>Score: {attempt.score} / {attempt.totalPoints}</p>
  <p>Percentage: {getScorePercentage()}%</p>
</div>
```
- Displays the quiz title, score, and percentage.

## File Location
`src/pages/QuizResults.jsx`