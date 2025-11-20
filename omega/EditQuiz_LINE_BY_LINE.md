# EditQuiz.jsx - Complete Line-by-Line Documentation

## File Path
`frontend/src/pages/EditQuiz.jsx`

## Purpose
This component allows administrators to edit existing quizzes. It fetches quiz data from the backend, populates the form with existing values, and handles updates to the quiz.

---

## Complete Code Analysis

### Import Statements (Lines 1-5)

```jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import QuizForm from '../components/QuizForm';
import LoadingSpinner from '../components/LoadingSpinner';
```

**Line 1: `import { useState, useEffect } from 'react';`**
- Imports React hooks for state and side effects
- `useState`: Manages component state (initialData, loading)
- `useEffect`: Runs effects when component mounts (fetch quiz data)

**Line 2: `import { useNavigate, useParams } from 'react-router-dom';`**
- `useNavigate`: Hook for programmatic navigation
- `useParams`: Extracts route parameters from URL
- Route is `/admin/quiz/:quizId/edit`, so we need quizId

**Line 3: `import { adminAPI } from '../utils/api';`**
- Admin API utilities for backend communication
- Used to fetch quiz data and submit updates

**Line 4: `import QuizForm from '../components/QuizForm';`**
- Same reusable form component used in CreateQuiz
- Handles all quiz form UI and interactions

**Line 5: `import LoadingSpinner from '../components/LoadingSpinner';`**
- Loading indicator component
- Shown while fetching quiz data from backend
- Provides better UX during data loading

---

### Function Component Declaration (Line 7)

```jsx
const EditQuiz = () => {
```

**Line 7: `const EditQuiz = () => {`**
- Declares functional component using arrow function
- Similar structure to CreateQuiz but with data fetching

---

### Hook Initialization (Lines 8-10)

```jsx
const navigate = useNavigate();
const { quizId } = useParams();
const [initialData, setInitialData] = useState(null);
const [loading, setLoading] = useState(true);
```

**Line 8: `const navigate = useNavigate();`**
- Navigation function for redirects
- Used after successful update or on error

**Line 9: `const { quizId } = useParams();`**
- Extracts `quizId` parameter from URL
- Destructuring assignment from params object
- Example: URL `/admin/quiz/123/edit` gives quizId = "123"

**Line 10: `const [initialData, setInitialData] = useState(null);`**
- State for quiz data fetched from backend
- Initially `null` (not loaded)
- Will contain quiz details, questions, and options

**Line 11: `const [loading, setLoading] = useState(true);`**
- Loading state starts as `true`
- Shows spinner while fetching data
- Set to `false` after data loads or error occurs

---

### Authentication Effect (Lines 13-20)

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

**Line 13: `useEffect(() => {`**
- Runs when component mounts and when dependencies change
- Dependencies: `[navigate, quizId]`

**Line 14: `const userData = localStorage.getItem('user');`**
- Retrieves user data from localStorage
- Returns JSON string or null if not found

**Line 15: `if (!userData || JSON.parse(userData).role !== 'ADMIN') {`**
- Authorization check with two conditions:
  1. User data doesn't exist (not logged in)
  2. User role is not ADMIN (unauthorized)

**Line 16: `navigate('/');`**
- Redirects unauthorized users to home/login
- Protects admin-only edit functionality

**Line 17: `return;`**
- Exits useEffect early
- Prevents fetchQuiz() from running after redirect

**Line 19: `fetchQuiz();`**
- If authorization passes, fetches quiz data
- Calls async function defined below

**Line 20: `}, [navigate, quizId]);`**
- Dependencies array
- Re-runs effect if quizId changes (different quiz)
- Re-runs if navigate changes (rarely happens)

---

### Fetch Quiz Function (Lines 22-44)

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

**Line 22: `const fetchQuiz = async () => {`**
- Async function to fetch quiz data from backend
- No parameters needed (uses quizId from outer scope)
- Uses async/await for cleaner asynchronous code

**Line 23: `try {`**
- Begin try-catch for error handling
- Catches network errors, 404s, etc.

**Line 24: `const data = await adminAPI.getQuiz(quizId);`**
- Calls backend API to get quiz details
- `await`: Pauses until API responds
- `data`: Complete quiz object with questions and options

**Line 26: `setInitialData({`**
- Sets state with transformed quiz data
- Data structure matches QuizForm expectations

**Lines 27-31: Quiz metadata object**
```jsx
quizData: { 
  title: data.title, 
  description: data.description, 
  duration: data.duration, 
  isActive: data.isActive 
}
```
- Extracts top-level quiz properties
- Forms the quiz metadata section
- Separate from questions array

**Line 32: `questions: data.questions.map(q => ({`**
- Maps over questions array
- Transforms each question into form format
- `.map()` creates new array with transformed items

**Lines 33-37: Question properties**
```jsx
id: q.id,
questionText: q.questionText,
type: q.type,
points: q.points,
```
- `id`: Database ID (important for updates)
- `questionText`: The actual question
- `type`: MULTIPLE_CHOICE, TRUE_FALSE, or SHORT_ANSWER
- `points`: Point value for this question

**Lines 38-42: Options mapping**
```jsx
options: q.options.map(o => ({ 
  id: o.id, 
  optionText: o.optionText, 
  isCorrect: o.isCorrect 
})),
```
- Nested map over options array
- Preserves database IDs for updates
- Each option has text and correct flag

**Line 43: `isNew: false`**
- Custom property to mark existing questions
- Used in handleSubmit to determine update vs create
- Questions added in edit form will have `isNew: true`

**Line 47: `setLoading(false);`**
- Ends loading state
- Triggers re-render showing the form
- Loading spinner disappears

**Line 48: `} catch (error) {`**
- Catches any errors from try block
- Network errors, 404 (quiz not found), etc.

**Line 49: `alert('Failed to load quiz: ' + error.message);`**
- Shows error alert to user
- Includes specific error message for debugging

**Line 50: `navigate('/admin');`**
- Redirects to admin dashboard on error
- User can't edit if quiz doesn't load
- Better than showing empty form

---

### Submit Handler Function (Lines 53-77)

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
    alert('✅ Quiz updated successfully!');
    navigate('/admin');
  } catch (error) {
    alert('❌ Failed to update quiz: ' + error.message);
  }
};
```

**Line 53: `const handleSubmit = async (data) => {`**
- Handles form submission for quiz updates
- `data`: Form data from QuizForm component
- Async to handle API call

**Lines 55-71: Payload construction**
```jsx
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
```

**Lines 56-59: Quiz metadata**
- Direct copy from form data
- Title, description, duration, active status

**Line 60: `questions: data.questions.map(q => ({`**
- Maps questions array for API format
- Handles both existing and new questions

**Line 61: `id: q.isNew ? null : q.id,`**
- Critical logic for update vs create
- If `isNew` is true: sends `null` (backend creates new question)
- If `isNew` is false: sends existing ID (backend updates question)
- Allows adding new questions while editing

**Lines 62-64: Question properties**
- Standard question fields passed through

**Lines 65-68: Options mapping**
```jsx
options: q.options.map(o => ({
  id: o.id > 1000000000000 ? null : o.id,
  optionText: o.optionText,
  isCorrect: o.isCorrect
}))
```

**Line 66: `id: o.id > 1000000000000 ? null : o.id,`**
- Clever check for temporary vs database IDs
- `Date.now()` generates IDs > 1 trillion (temporary)
- Database IDs are typically small integers
- If ID is large (timestamp), it's new → send null
- If ID is small, it's existing → send actual ID

**Line 73: `await adminAPI.updateQuiz(quizId, payload);`**
- Calls backend API to update quiz
- Passes quizId and transformed payload
- PUT request to `/api/admin/quiz/{quizId}`

**Line 74: `alert('✅ Quiz updated successfully!');`**
- Success feedback to user
- Checkmark emoji for visual confirmation

**Line 75: `navigate('/admin');`**
- Returns to admin dashboard
- User can see updated quiz in list

**Line 76-77: Error handling**
- Catches and displays any errors
- User stays on page to retry

---

### Loading State Render (Lines 80-81)

```jsx
if (loading) return <LoadingSpinner message="Loading quiz..." />;
```

**Line 80: `if (loading) return <LoadingSpinner message="Loading quiz..." />;`**
- Conditional early return
- If still loading, shows spinner instead of form
- `message` prop customizes loading text
- Component won't render form until data is loaded
- Prevents showing empty form or errors

---

### JSX Return Statement (Lines 83-97)

```jsx
return (
  <div className="min-h-screen bg-slate-50">
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin')} 
          className="text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Edit Quiz</h1>
          <p className="text-sm text-slate-600 mt-1">Update quiz details and questions</p>
        </div>
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-6 py-8">
      <QuizForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Quiz" />
    </main>
  </div>
);
```

**Line 84: Main container**
- `min-h-screen`: Full viewport height
- `bg-slate-50`: Light slate gray background
- Slightly different color from CreateQuiz

**Line 85: Header**
- `bg-white`: White background
- `shadow-sm`: Small shadow for depth
- `border-b border-slate-200`: Bottom border separation

**Line 86: Header inner container**
- `max-w-7xl mx-auto`: Centered with max width
- `px-6 py-4`: Padding for spacing
- `flex items-center gap-4`: Horizontal layout with gap

**Lines 87-91: Back button**
- Navigates back to admin dashboard
- Material icon for back arrow
- Hover effect changes color
- `transition-colors`: Smooth color transition

**Lines 92-95: Header text**
- `text-xl font-bold`: Larger, bolder than CreateQuiz
- "Edit Quiz" title clearly indicates edit mode
- Subtitle explains purpose: "Update quiz details and questions"
- `text-slate-600`: Medium slate gray for subtitle

**Lines 97-99: Main content**
- `max-w-7xl mx-auto`: Centered container
- `px-6 py-8`: Padding for content
- Contains QuizForm component

**Line 98: QuizForm component**
```jsx
<QuizForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Quiz" />
```
- `initialData={initialData}`: Populated with fetched quiz data
- `onSubmit={handleSubmit}`: Update handler instead of create
- `submitLabel="Update Quiz"`: Different button text from CreateQuiz

---

### Export Statement (Line 104)

```jsx
export default EditQuiz;
```

**Line 104: Default export**
- Exports component for use in routing
- Imported in App.jsx for route configuration

---

## Key Technical Concepts

### 1. **Data Fetching on Mount**
- useEffect with fetchQuiz on component mount
- Shows loading state during fetch
- Handles errors gracefully

### 2. **Update vs Create Logic**
- Preserves existing IDs for updates
- Uses `isNew` flag for questions
- Timestamp check for options (> 1000000000000)

### 3. **Form Pre-population**
- Fetched data transformed into form format
- Questions and options mapped correctly
- Allows editing of existing content

### 4. **Error Handling**
- Try-catch for fetch and update operations
- User-friendly error messages
- Navigates away on critical errors

### 5. **Loading States**
- Loading spinner during data fetch
- Prevents rendering incomplete UI
- Better user experience

### 6. **Component Reusability**
- Same QuizForm as CreateQuiz
- Different initial data and submit logic
- Different submit button label

---

## Data Flow Diagram

```
Component Mount:
  1. useEffect runs
  2. Check authentication
  3. Call fetchQuiz()
  4. Show LoadingSpinner
  
fetchQuiz:
  1. API call: GET /api/admin/quiz/{quizId}
  2. Transform data to form format
  3. setInitialData(transformed)
  4. setLoading(false)
  5. Form renders with data

User Edits:
  1. User modifies quiz in QuizForm
  2. Can add/remove questions
  3. Can add/remove options
  4. Can change all quiz properties

User Submits:
  1. QuizForm calls onSubmit(formData)
  2. handleSubmit transforms data
     - Existing questions: keep ID
     - New questions: ID = null
     - Existing options: keep ID if < 1T
     - New options: ID = null
  3. API call: PUT /api/admin/quiz/{quizId}
  4. Success: Alert + navigate to /admin
  5. Error: Alert + stay on page
```

---

## Comparison: CreateQuiz vs EditQuiz

| Aspect | CreateQuiz | EditQuiz |
|--------|-----------|----------|
| Initial Data | Empty defaults | Fetched from backend |
| Loading State | No | Yes (during fetch) |
| Submit Handler | createQuiz() | updateQuiz() |
| ID Handling | No IDs needed | Preserves existing IDs |
| Button Label | "Create Quiz" | "Update Quiz" |
| Header Title | "Create New Quiz" | "Edit Quiz" |
| Route Param | None | :quizId |

---

## ID Management Strategy

### Questions
- **Existing**: Keep original database ID
- **New (added in edit)**: Mark as `isNew: true`, send `id: null`
- **Backend**: Creates new DB entry for null IDs, updates existing IDs

### Options
- **Existing**: Database IDs (small numbers like 1, 2, 3)
- **New**: Temporary IDs from `Date.now()` (large like 1700000000000)
- **Detection**: Check if `id > 1000000000000`
- **Backend**: Creates new for null, updates for existing

---

## Edge Cases Handled

1. **Quiz Not Found**: Catches error, alerts user, navigates away
2. **Unauthorized Access**: Redirects to home immediately
3. **Network Failure**: Shows error, allows retry
4. **No Questions**: Form handles empty questions array
5. **Mixed New/Old Questions**: ID logic handles correctly

---

## Security Considerations

1. **Client Auth Check**: Validates ADMIN role before rendering
2. **Backend Validation**: API must also verify admin privileges
3. **QuizId from URL**: Backend validates user owns this quiz
4. **No Direct DB IDs Exposed**: Only through authenticated API

---

## User Experience Features

1. **Loading Feedback**: Spinner during data fetch
2. **Pre-populated Form**: Shows existing data immediately
3. **Clear Navigation**: Back button always available
4. **Success Confirmation**: Alert on successful update
5. **Error Recovery**: Errors don't lose user's work
6. **Consistent UI**: Same form as create, familiar interface

---

## Integration Points

1. **adminAPI.getQuiz(quizId)**: Fetches quiz data
2. **adminAPI.updateQuiz(quizId, payload)**: Updates quiz
3. **QuizForm**: Reusable form component
4. **LoadingSpinner**: Reusable loading indicator
5. **React Router**: Provides quizId param and navigation

---

## Testing Considerations

1. Test loading existing quiz data
2. Test updating quiz metadata
3. Test adding new questions
4. Test editing existing questions
5. Test deleting questions/options
6. Test error handling (404, network error)
7. Test unauthorized access
8. Test ID preservation for existing items
9. Test ID null for new items
10. Test navigation after success

---

## Common Use Cases

1. **Fix Typo**: Admin loads quiz, fixes typo in question, saves
2. **Add Question**: Admin loads quiz, adds new question at end, saves
3. **Change Duration**: Admin loads quiz, changes time limit, saves
4. **Deactivate Quiz**: Admin loads quiz, unchecks isActive, saves
5. **Reorder Questions**: Admin loads quiz, reorders questions, saves

---

## State Management

```
Component State:
- initialData: null → Quiz object (after fetch)
- loading: true → false (after fetch or error)

URL Params:
- quizId: Extracted from route

Props to QuizForm:
- initialData: Fetched quiz data
- onSubmit: handleSubmit
- submitLabel: "Update Quiz"
```

---

## API Payload Example

### Fetch Response (what we receive)
```json
{
  "id": 5,
  "title": "JavaScript Basics",
  "description": "Test your JS knowledge",
  "duration": 30,
  "isActive": true,
  "questions": [
    {
      "id": 12,
      "questionText": "What is closure?",
      "type": "MULTIPLE_CHOICE",
      "points": 2,
      "options": [
        {"id": 45, "optionText": "A function", "isCorrect": false},
        {"id": 46, "optionText": "Inner function accessing outer scope", "isCorrect": true}
      ]
    }
  ]
}
```

### Update Payload (what we send)
```json
{
  "title": "JavaScript Basics",
  "description": "Test your JS knowledge",
  "duration": 30,
  "isActive": true,
  "questions": [
    {
      "id": 12,
      "questionText": "What is closure?",
      "type": "MULTIPLE_CHOICE",
      "points": 2,
      "options": [
        {"id": 45, "optionText": "A function", "isCorrect": false},
        {"id": 46, "optionText": "Inner function accessing outer scope", "isCorrect": true},
        {"id": null, "optionText": "New option added", "isCorrect": false}
      ]
    },
    {
      "id": null,
      "questionText": "New question",
      "type": "TRUE_FALSE",
      "points": 1,
      "options": [
        {"id": null, "optionText": "True", "isCorrect": true},
        {"id": null, "optionText": "False", "isCorrect": false}
      ]
    }
  ]
}
```

Notice:
- Existing question 12 keeps its ID
- New question has `id: null`
- Existing options (45, 46) keep IDs
- New option has `id: null`
