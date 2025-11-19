# Technical Explanation: `App.jsx`

## Overview
The `App.jsx` file is the root component of the QuizForge frontend. It sets up the routing for the application using `react-router-dom`.

### Imports
```jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CandidateDashboard from './pages/CandidateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import QuizTaking from './pages/QuizTaking';
import QuizResults from './pages/QuizResults';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import CandidateProfile from './pages/CandidateProfile';
import QuizHistory from './pages/QuizHistory';
import Analytics from './pages/Analytics';
```
- **`react-router-dom`**: Provides routing capabilities.
  - `BrowserRouter`: Wraps the application to enable routing.
  - `Routes`: A container for route definitions.
  - `Route`: Defines individual routes.
  - `Navigate`: Redirects users programmatically.
- **Component Imports**: Each page component corresponds to a specific route.

### Component Definition
```jsx
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/quiz/:quizId" element={<QuizTaking />} />
        <Route path="/candidate/results/:attemptId" element={<QuizResults />} />
        <Route path="/candidate/*" element={<CandidateDashboard />} />
        <Route path="/candidate/history" element={<QuizHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/quiz/create" element={<CreateQuiz />} />
        <Route path="/admin/quiz/edit/:quizId" element={<EditQuiz />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
```
- **Routes**:
  - `/`: Renders the `Login` component.
  - `/candidate`: Renders the `CandidateDashboard`.
  - `/candidate/profile`: Renders the `CandidateProfile`.
  - `/candidate/quiz/:quizId`: Renders the `QuizTaking` component with a dynamic `quizId` parameter.
  - `/candidate/results/:attemptId`: Renders the `QuizResults` component with a dynamic `attemptId` parameter.
  - `/candidate/*`: Catch-all route for undefined candidate paths.
  - `/admin`: Renders the `AdminDashboard`.
  - `/admin/analytics`: Renders the `Analytics`.
  - `/admin/quiz/create`: Renders the `CreateQuiz`.
  - `/admin/quiz/edit/:quizId`: Renders the `EditQuiz` with a dynamic `quizId` parameter.
  - `/admin/*`: Catch-all route for undefined admin paths.
  - `*`: Redirects all undefined routes to `/`.

### Export
```jsx
export default App;
```
- Makes the `App` component available for use in other parts of the application.

---

## Key Points
- **Dynamic Routing**: Parameters like `:quizId` and `:attemptId` enable dynamic routing.
- **Fallbacks**: Catch-all routes ensure undefined paths are handled gracefully.
- **Separation of Concerns**: Each route corresponds to a specific page component, maintaining modularity.

---

Refer to the `main.jsx` documentation for details on how this component is rendered.