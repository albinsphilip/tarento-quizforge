# Technical Explanation: `CandidateDashboard.jsx`

## Overview
The `CandidateDashboard.jsx` file defines the candidate dashboard page for the QuizForge application. It provides functionality for candidates to view available quizzes, track their progress, and start assessments.

---

## Imports
```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { candidateAPI } from '../utils/api';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
```
- **React Hooks**:
  - `useState`: Manages local state for user, quizzes, stats, and loading.
  - `useEffect`: Handles side effects, such as fetching data on component mount.
- **`react-router-dom`**:
  - `useNavigate`: Programmatically navigates between routes.
  - `useLocation`: Retrieves the current route location.
- **Custom Utilities**:
  - `candidateAPI`: Provides API methods for candidate operations (e.g., fetching quizzes and attempts).
- **Components**:
  - `Sidebar`: Displays the navigation menu for the candidate.
  - `LoadingSpinner`: Shows a loading indicator while data is being fetched.

---

## State Management
```jsx
const [user, setUser] = useState(null);
const [availableQuizzes, setAvailableQuizzes] = useState([]);
const [stats, setStats] = useState({ completed: 0, avgScore: 0, passed: 0 });
const [loading, setLoading] = useState(true);
```
- **`user`**: Stores the logged-in candidate's user data.
- **`availableQuizzes`**: Stores the list of quizzes available for the candidate.
- **`stats`**: Stores the candidate's progress statistics (e.g., completed quizzes, average score, passed quizzes).
- **`loading`**: Tracks whether data is being loaded.

---

## Authentication and Role Validation
```jsx
useEffect(() => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (!userData || !token) {
    navigate('/');
    return;
  }

  const parsedUser = JSON.parse(userData);
  if (parsedUser.role !== 'CANDIDATE') {
    navigate('/admin');
    return;
  }

  setUser(parsedUser);
  fetchData();
}, [navigate]);
```
- **Authentication**:
  - Retrieves `user` and `token` from `localStorage`.
  - Redirects to the login page (`/`) if authentication data is missing.
- **Role Validation**:
  - Redirects non-candidate users to the admin dashboard (`/admin`).

---

## Fetching Data
```jsx
const fetchData = async () => {
  try {
    const [quizzes, attempts] = await Promise.all([
      candidateAPI.getAvailableQuizzes(),
      candidateAPI.getMyAttempts()
    ]);
    
    setAvailableQuizzes(quizzes);
    
    // Calculate stats from attempts
    const completed = attempts.length;
    const avgScore = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, a) => sum + (a.totalPoints > 0 ? (a.score / a.totalPoints) * 100 : 0), 0) / attempts.length)
      : 0;
    const passed = attempts.filter(a => a.totalPoints > 0 && (a.score / a.totalPoints) * 100 >= 70).length;
    
    setStats({ completed, avgScore, passed });
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};
```
- Fetches available quizzes and the candidate's quiz attempts using `candidateAPI`.
- Calculates progress statistics:
  - **Completed Quizzes**: Total number of attempts.
  - **Average Score**: Average percentage score across all attempts.
  - **Passed Quizzes**: Number of attempts with a score ≥ 70%.

---

## Loading State
```jsx
if (loading) return <LoadingSpinner message="Loading dashboard..." />;
```
- Displays the `LoadingSpinner` component while data is being fetched.

---

## Dashboard Layout
### Sidebar
```jsx
<Sidebar role="CANDIDATE" currentPath={location.pathname} userName={user?.name} />
```
- Displays the `Sidebar` component with the candidate's name and current path.

### Header
```jsx
<div className="bg-white border-b border-gray-200">
  <div className="px-8 py-5">
    <h1 className="text-xl font-semibold text-gray-900">
      Welcome back, {user?.name || 'Candidate'}
    </h1>
    <p className="text-gray-600 text-sm mt-1">Ready to take on a new challenge?</p>
  </div>
</div>
```
- Displays a welcome message and a brief description of the dashboard.

### Stats Grid
```jsx
{stats.completed > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
    {/* Quizzes Completed */}
    {/* Average Score */}
    {/* Quizzes Passed */}
  </div>
)}
```
- Displays statistics about the candidate's progress, including completed quizzes, average score, and passed quizzes.

### Available Quizzes
```jsx
<section>
  <h2 className="text-lg font-semibold text-gray-900 mb-5">Available Assessments</h2>
  
  {availableQuizzes.length === 0 ? (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">assignment</span>
      <h3 className="text-base font-medium text-gray-700 mb-2">No Quizzes Available</h3>
      <p className="text-gray-500 text-sm">Check back later for new assessments</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {availableQuizzes.map((quiz) => (
        <div key={quiz.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all group">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-lg">quiz</span>
            </div>
          </div>
          
          <h3 className="text-base font-medium text-gray-900 mb-2 min-h-[2.5rem]">
            {quiz.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
            {quiz.description || 'No description available'}
          </p>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">list</span>
            <span>{quiz.totalQuestions||0} questions</span>
            </div>
            <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">timer</span>
            <span>{quiz.duration || 0} min</span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate(`/candidate/quiz/${quiz.id}`)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">play_arrow</span>
            Start Assessment
          </button>
        </div>
      ))}
    </div>
  )}
</section>
```
- Displays a list of available quizzes with details such as title, description, total questions, and duration.
- Includes a button to start each quiz.

---

## Export
```jsx
export default CandidateDashboard;
```
- Makes the `CandidateDashboard` component available for use in other parts of the application.

---

## Key Points
- **Dynamic Data**: Fetches quizzes and displays them dynamically.
- **Role-Based Access**: Ensures only candidates can access the dashboard.
- **Reusable Components**: Utilizes `Sidebar` and `LoadingSpinner` for consistent UI.

---

Refer to the `Sidebar.jsx` documentation for the navigation component used in this dashboard.