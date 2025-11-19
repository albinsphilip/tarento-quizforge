# Quiz Taking Page

## Overview
The `QuizTaking` component allows candidates to take a quiz. It manages the quiz state, tracks answers, and submits the quiz upon completion.

## Key Features
- **Quiz Navigation**: Allows users to navigate between questions.
- **Answer Tracking**: Tracks answers for each question.
- **Timer**: Displays a countdown timer for the quiz.
- **Auto-Submission**: Automatically submits the quiz when the timer runs out.

## Code Breakdown
### State Management
- `user`: Stores the logged-in user details.
- `quiz`: Stores the quiz data.
- `answers`: Tracks the user's answers.
- `timeLeft`: Tracks the remaining time for the quiz.
- `loading` and `submitting`: Indicate the loading and submission states.

### Functions
- `startQuizAttempt`: Initializes the quiz attempt and fetches quiz data.
- `handleAnswerSelect` and `handleTextAnswer`: Track the user's answers.
- `handleSaveAndNext`: Saves the current answer and navigates to the next question.
- `handleSubmitQuiz`: Submits the quiz to the backend.
- `submitQuizToBackend`: Handles the actual submission logic.
- `formatTime`: Formats the remaining time for display.

### API Integration
- Uses `candidateAPI.getQuiz` to fetch quiz data.
- Uses `candidateAPI.startQuiz` to start the quiz attempt.
- Uses `candidateAPI.submitQuiz` to submit the quiz.

### UI Components
- **Header**: Displays the quiz title, candidate name, and timer.
- **Question Card**: Displays the current question and answer options.
- **Sidebar**: Provides navigation for all questions.
- **Progress Summary**: Shows the number of answered, unanswered, and not visited questions.

## Dependencies
- `react-router-dom`: For navigation.
- `candidateAPI`: For backend communication.

## Example Usage
```jsx
<QuizTaking />
```

## File Location
`src/pages/QuizTaking.jsx`