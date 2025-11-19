# Technical Explanation: `QuizForm.jsx`

## Overview
The `QuizForm.jsx` file defines a comprehensive React component for creating or editing quizzes. It includes functionality for managing quiz metadata, questions, and options.

### Imports
```jsx
import { useState } from 'react';
```
- **`useState`**: A React hook used to manage state within the functional component.

### Component Definition
```jsx
const QuizForm = ({ initialData, onSubmit, submitLabel }) => {
```
- **`QuizForm` Component**:
  - Props:
    - `initialData`: Contains the initial quiz data and questions.
    - `onSubmit`: A callback function to handle form submission.
    - `submitLabel`: The label for the submit button.

### State Management
```jsx
const [quizData, setQuizData] = useState(initialData.quizData);
const [questions, setQuestions] = useState(initialData.questions);
const [loading, setLoading] = useState(false);
```
- **`quizData`**: Stores the quiz metadata (e.g., title, description, duration).
- **`questions`**: Stores the list of questions in the quiz.
- **`loading`**: Tracks the loading state during form submission.

### Helper Functions
#### Update Quiz Metadata
```jsx
const updateQuiz = (field, value) => setQuizData(prev => ({ ...prev, [field]: value }));
```
- Updates a specific field in the `quizData` object.

#### Update Question
```jsx
const updateQuestion = (id, field, value) => {
  setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
};
```
- Updates a specific field of a question identified by `id`.

#### Add/Remove Questions
```jsx
const addQuestion = () => {
  setQuestions(prev => [...prev, {
    id: Date.now(),
    questionText: '',
    type: 'MULTIPLE_CHOICE',
    points: 1,
    options: [{ id: Date.now() + 1, optionText: '', isCorrect: false }]
  }]);
};

const removeQuestion = (id) => setQuestions(prev => prev.filter(q => q.id !== id));
```
- Adds a new question or removes an existing one.

#### Validation
```jsx
const validate = () => {
  if (!quizData.title.trim()) return 'Quiz title is required';
  if (quizData.duration < 1) return 'Duration must be at least 1 minute';
  if (questions.length === 0) return 'At least one question is required';

  for (let q of questions) {
    if (!q.questionText.trim()) return 'All questions must have text';
    if (q.type !== 'SHORT_ANSWER') {
      if (q.options.length === 0) return 'All MCQ/True-False questions need options';
      if (!q.options.some(o => o.optionText.trim())) return 'All options must have text';
      if (!q.options.some(o => o.isCorrect)) return 'Each question must have a correct answer';
    }
  }
  return null;
};
```
- Validates the quiz data and questions before submission.

#### Handle Form Submission
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const error = validate();
  if (error) return alert(error);

  setLoading(true);
  try {
    await onSubmit({ ...quizData, questions });
  } finally {
    setLoading(false);
  }
};
```
- Validates the form and submits the data via the `onSubmit` callback.

### JSX Structure
#### Quiz Details Section
- Contains fields for the quiz title, description, duration, and status.
- Uses Tailwind CSS classes for styling.

#### Questions Section
- Displays a list of questions with fields for question text, type, points, and options.
- Includes buttons to add/remove questions and options.

#### Submit Section
- Contains buttons for submitting or canceling the form.
- The submit button displays a loading state when the form is being submitted.

### Export
```jsx
export default QuizForm;
```
- **Export**: Makes the `QuizForm` component available for use in other parts of the application.

---

## Key Points
- **Comprehensive Functionality**: Handles quiz metadata, questions, and options.
- **Validation**: Ensures the quiz data is complete and valid before submission.
- **Reusable Design**: Can be used for both creating and editing quizzes.
- **Styling**: Uses Tailwind CSS for consistent and responsive styling.

---

Refer to the other component documentation for additional reusable components.