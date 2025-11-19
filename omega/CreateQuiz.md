# Create Quiz Page

## Overview
The `CreateQuiz` component allows administrators to create new quizzes. It provides a form for entering quiz details and questions, and submits the data to the backend.

## Key Features
- **Form Initialization**: Prepares an empty form for quiz creation.
- **Form Submission**: Sends quiz data to the backend.
- **Role Validation**: Ensures only admins can access this page.

## Code Breakdown
### State Management
- `user`: Stores the logged-in user details.

### Functions
- `handleSubmit`: Handles form submission and sends data to the backend.
- `useEffect`: Validates the user's role and initializes the form.

### API Integration
- Uses `adminAPI.createQuiz` to submit quiz data.

### UI Components
- **Header**: Displays the page title and a back button.
- **QuizForm**: A reusable component for quiz creation.

## Dependencies
- `react-router-dom`: For navigation.
- `adminAPI`: For backend communication.
- `QuizForm`: A reusable component for quiz forms.

## Example Usage
```jsx
<CreateQuiz />
```

## File Location
`src/pages/CreateQuiz.jsx`