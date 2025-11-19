# Edit Quiz Page

## Overview
The `EditQuiz` component allows administrators to edit existing quizzes. It fetches quiz data, populates the form, and updates the quiz details upon submission.

## Key Features
- **Data Fetching**: Retrieves quiz details from the backend.
- **Form Population**: Pre-fills the form with existing quiz data.
- **Form Submission**: Sends updated quiz data to the backend.
- **Role Validation**: Ensures only admins can access this page.

## Code Breakdown
### State Management
- `initialData`: Stores the fetched quiz data.
- `loading`: Indicates whether the quiz data is being fetched.

### Functions
- `fetchQuiz`: Fetches quiz data from the backend.
- `handleSubmit`: Handles form submission and sends updated data to the backend.

### API Integration
- Uses `adminAPI.getQuiz` to fetch quiz data.
- Uses `adminAPI.updateQuiz` to update quiz data.

### UI Components
- **Header**: Displays the page title and a back button.
- **QuizForm**: A reusable component for quiz forms.

## Dependencies
- `react-router-dom`: For navigation.
- `adminAPI`: For backend communication.
- `QuizForm`: A reusable component for quiz forms.

## Example Usage
```jsx
<EditQuiz />
```

## File Location
`src/pages/EditQuiz.jsx`