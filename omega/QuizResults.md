# Quiz Results Page

## Overview
The `QuizResults` component displays the results of a quiz attempt. It shows the user's score, percentage, and a detailed review of their answers.

## Key Features
- **Result Display**: Shows the user's score, percentage, and status (Passed/Failed).
- **Question Review**: Provides a detailed review of each question and the user's answers.
- **Error Handling**: Displays error messages if the results cannot be fetched.

## Code Breakdown
### State Management
- `attempt`: Stores the quiz attempt data.
- `loading`: Indicates whether the results are being fetched.
- `error`: Stores error messages.

### Functions
- `fetchAttemptResults`: Fetches the quiz attempt data from the backend.
- `getScorePercentage`: Calculates the user's score percentage.
- `getStatusColor` and `getStatusText`: Determine the status color and text based on the score.

### API Integration
- Uses `candidateAPI.getAttempt` to fetch quiz attempt data.

### UI Components
- **Header**: Displays the page title and a back button.
- **Score Card**: Shows the user's score, percentage, and status.
- **Question Review**: Lists each question with the user's answers and the correct answers.

## Dependencies
- `react-router-dom`: For navigation.
- `candidateAPI`: For backend communication.

## Example Usage
```jsx
<QuizResults />
```

## File Location
`src/pages/QuizResults.jsx`