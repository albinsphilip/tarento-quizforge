# QuizResults.jsx - Complete Line-by-Line Documentation

## File Path
`frontend/src/pages/QuizResults.jsx`

## Purpose
This component displays detailed results of a completed quiz attempt. It shows the candidate's score, percentage, time taken, and a comprehensive review of all questions with correct/incorrect answers highlighted.

---

## Complete Code Analysis

### Import Statements (Lines 1-3)

```jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI } from '../utils/api';
```

**Line 1: `import React, { useState, useEffect } from 'react';`**
- Imports React and hooks
- `useState`: Manages attempt, loading, and error state
- `useEffect`: Fetches attempt data when component mounts

**Line 2: `import { useParams, useNavigate } from 'react-router-dom';`**
- `useParams`: Extracts attemptId from URL
- `useNavigate`: Programmatic navigation back to dashboard
- Route format: `/candidate/results/:attemptId`

**Line 3: `import { candidateAPI } from '../utils/api';`**
- Candidate-specific API utilities
- Used to fetch attempt results data

---

### Function Component Declaration (Line 5)

```jsx
function QuizResults() {
```

**Line 5: Standard function declaration**
- Named export (later exported as default)
- Traditional function syntax instead of arrow function

---

### Hook Initialization (Lines 6-10)

```jsx
const { attemptId } = useParams();
const navigate = useNavigate();
const [attempt, setAttempt] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Line 6: `const { attemptId } = useParams();`**
- Extracts attemptId from URL parameters
- Destructuring from params object
- Example: URL `/candidate/results/42` gives attemptId = "42"

**Line 7: `const navigate = useNavigate();`**
- Navigation function for returning to dashboard
- Used in back buttons and error states

**Line 8: `const [attempt, setAttempt] = useState(null);`**
- Stores complete attempt data from backend
- Contains score, questions, answers, time, etc.
- Initially null (not loaded)

**Line 9: `const [loading, setLoading] = useState(true);`**
- Loading state starts true
- Shows spinner while fetching data
- Set to false after fetch completes

**Line 10: `const [error, setError] = useState(null);`**
- Stores error messages if fetch fails
- Initially null (no error)
- Used to show error screen

---

### Data Fetching Effect (Lines 12-14)

```jsx
useEffect(() => {
  fetchAttemptResults();
}, [attemptId]);
```

**Line 12: `useEffect(() => {`**
- Runs when component mounts and when attemptId changes
- Dependency array includes attemptId

**Line 13: `fetchAttemptResults();`**
- Calls async function to fetch data
- Defined below

**Line 14: `}, [attemptId]);`**
- Re-runs if attemptId changes (different result)
- eslint exhaustive-deps satisfied

---

### Fetch Attempt Results Function (Lines 16-27)

```jsx
const fetchAttemptResults = async () => {
  try {
    const data = await candidateAPI.getAttempt(attemptId);
    setAttempt(data);
  } catch (err) {
    console.error('Error fetching results:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Line 16: `const fetchAttemptResults = async () => {`**
- Async function to fetch attempt data
- No parameters (uses attemptId from outer scope)

**Line 17: `try {`**
- Begin try-catch for error handling

**Line 18: `const data = await candidateAPI.getAttempt(attemptId);`**
- Calls backend API to get attempt details
- Returns: score, totalPoints, quiz questions, candidate answers, time, etc.
- Pauses execution until API responds

**Line 19: `setAttempt(data);`**
- Stores fetched data in state
- Triggers re-render to show results

**Line 20: `} catch (err) {`**
- Catches any errors (404, network failure, etc.)

**Line 21: `console.error('Error fetching results:', err);`**
- Logs error to console for debugging
- Doesn't show in UI, only console

**Line 22: `setError(err.message);`**
- Stores error message in state
- Will show error screen to user

**Line 23: `} finally {`**
- Finally block runs regardless of success/failure

**Line 24: `setLoading(false);`**
- Ends loading state in all cases
- Hides spinner, shows content or error

---

### Score Percentage Calculator (Lines 29-32)

```jsx
const getScorePercentage = () => {
  if (!attempt || attempt.totalPoints === 0) return 0;
  return Math.round((attempt.score / attempt.totalPoints) * 100);
};
```

**Line 29: `const getScorePercentage = () => {`**
- Pure function to calculate percentage
- Called multiple times in render

**Line 30: `if (!attempt || attempt.totalPoints === 0) return 0;`**
- Guards against errors:
  - If attempt not loaded yet: return 0
  - If no points possible (division by zero): return 0

**Line 31: `return Math.round((attempt.score / attempt.totalPoints) * 100);`**
- Formula: (score / total) * 100
- `Math.round()`: Rounds to nearest integer
- Example: 75 / 100 * 100 = 75%

---

### Status Color Helper (Lines 34-39)

```jsx
const getStatusColor = () => {
  const percentage = getScorePercentage();
  if (percentage >= 70) return 'text-green-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-red-600';
};
```

**Line 34: Function declaration**

**Line 35: `const percentage = getScorePercentage();`**
- Gets calculated percentage

**Lines 36-38: Conditional color logic**
- ≥70%: Green (passed)
- 50-69%: Yellow (average)
- <50%: Red (failed)
- Returns Tailwind CSS class names

---

### Status Text Helper (Lines 41-46)

```jsx
const getStatusText = () => {
  const percentage = getScorePercentage();
  if (percentage >= 70) return 'Passed';
  if (percentage >= 50) return 'Average';
  return 'Failed';
};
```

**Line 41: Function declaration**

**Lines 42-45: Text based on percentage**
- ≥70%: "Passed"
- 50-69%: "Average"
- <50%: "Failed"
- Used in status card

---

### Loading State Render (Lines 48-56)

```jsx
if (loading) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading results...</p>
      </div>
    </div>
  );
}
```

**Line 48: `if (loading) {`**
- Early return if data still loading
- Prevents showing incomplete UI

**Line 50: Centered container**
- Full screen height with vertical centering

**Line 52: Spinner**
- `animate-spin`: Tailwind CSS rotation animation
- `rounded-full`: Makes circular
- `h-12 w-12`: 3rem x 3rem size
- `border-b-2 border-blue-600`: Creates spinning effect

**Line 53: Loading text**
- Shows "Loading results..." message

---

### Error State Render (Lines 58-70)

```jsx
if (error) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-rose-600 mb-4">Error: {error}</p>
        <button
          onClick={() => navigate('/candidate')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
```

**Line 58: `if (error) {`**
- Early return if error occurred during fetch

**Line 61: Error message**
- Shows specific error message
- Red color for errors

**Lines 62-68: Back button**
- Navigates to candidate dashboard
- User can't see results, but can go back

---

### No Attempt State (Lines 72-84)

```jsx
if (!attempt) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-600 mb-4">No results found</p>
        <button
          onClick={() => navigate('/candidate')}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
```

**Line 72: `if (!attempt) {`**
- Final guard: if attempt is still null after loading completes
- Shouldn't happen normally, but handles edge case

**Lines 73-83: Similar to error state**
- Shows "No results found" message
- Provides back button

---

### Calculate Percentage for Main Render (Line 86)

```jsx
const percentage = getScorePercentage();
```

**Line 86: Pre-calculate percentage**
- Used multiple times in JSX below
- Calculated once for efficiency

---

### Main Return JSX (Line 88-90)

```jsx
return (
  <div className="min-h-screen bg-gray-50">
```

**Line 88: Main container**
- Full screen height minimum
- Light gray background

---

### Header Section (Lines 92-110)

```jsx
<header className="bg-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/candidate')}
          className="text-gray-600 hover:text-gray-900"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Quiz Results</h1>
      </div>
      <button
        onClick={() => navigate('/candidate')}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm"
      >
        Back to Dashboard
      </button>
    </div>
  </div>
</header>
```

**Line 92: Header element**
- White background
- Bottom border for separation

**Line 93: Inner container**
- Max width with responsive padding
- `sm:px-6`: Larger padding on small screens and up

**Line 94: Flex container**
- Space between left and right sections

**Lines 95-102: Left section**
- Back arrow button
- Page title "Quiz Results"

**Lines 103-109: Right section**
- "Back to Dashboard" button
- Provides second way to navigate back

---

### Main Content Section (Lines 113-114)

```jsx
<main className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
```

**Line 113: Main content container**
- `max-w-4xl`: Maximum width of 56rem (896px)
- Narrower than typical max-w-7xl for better readability
- Centered with responsive padding

---

### Score Card (Lines 116-212)

```jsx
<div className="bg-white rounded-md border border-gray-200 p-6 mb-6">
  <div className="text-center">
    <h2 className="text-xl font-semibold text-gray-900 mb-2">
      {attempt.quiz?.title || 'Quiz'}
    </h2>
    <p className="text-gray-600 text-sm mb-5">
      Submitted on {new Date(attempt.submittedAt).toLocaleString()}
    </p>
```

**Line 116: Score card container**
- White card with border
- Padding and bottom margin

**Line 117: Center all content**

**Lines 118-120: Quiz title**
- Shows quiz name
- Optional chaining `?.` in case quiz is null
- Fallback to "Quiz" if no title

**Lines 121-123: Submission timestamp**
- Converts ISO string to readable format
- `toLocaleString()`: Shows date and time in user's locale
- Example: "11/20/2025, 2:30:15 PM"

---

### Circular Progress Indicator (Lines 126-158)

```jsx
<div className="flex items-center justify-center mb-6">
  <div className="relative">
    <svg className="w-48 h-48 transform -rotate-90">
      {/* Background circle */}
      <circle
        cx="96"
        cy="96"
        r="88"
        stroke="#e5e7eb"
        strokeWidth="12"
        fill="none"
      />
      {/* Progress circle */}
      <circle
        cx="96"
        cy="96"
        r="88"
        stroke={percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
        strokeWidth="12"
        fill="none"
        strokeDasharray={`${2 * Math.PI * 88}`}
        strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
        strokeLinecap="round"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className={`text-5xl font-bold ${getStatusColor()}`}>
        {percentage}%
      </span>
      <span className="text-gray-600 text-sm mt-1">Score</span>
    </div>
  </div>
</div>
```

**Line 126: Center container for circle**

**Line 127: Relative positioning for absolute child**

**Line 128: SVG canvas**
- 192px x 192px (48 * 4px)
- `-rotate-90`: Starts circle at top instead of right

**Lines 130-137: Background circle**
- `cx="96" cy="96"`: Center at (96, 96)
- `r="88"`: Radius of 88px
- `stroke="#e5e7eb"`: Light gray stroke
- `strokeWidth="12"`: 12px thick line
- `fill="none"`: No fill, just outline

**Lines 139-149: Progress circle**
- Same center and radius as background
- **Dynamic stroke color based on score:**
  - ≥70%: `#10b981` (green)
  - 50-69%: `#f59e0b` (amber)
  - <50%: `#ef4444` (red)

**Line 146: `strokeDasharray={`${2 * Math.PI * 88}`}`**
- Circumference of circle: 2πr
- With r=88: ≈553.1 pixels
- Creates dashed pattern with one dash = full circle

**Line 147: `strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}`**
- Offsets dash to create partial circle
- Formula: circumference * (1 - percentage/100)
- Example: 75% score → offset 25% of circumference
- Creates visual "fill" effect

**Line 148: `strokeLinecap="round"`**
- Rounds the ends of the progress arc

**Lines 151-157: Text overlay**
- Absolutely positioned in center of circle
- Shows percentage in large bold text
- Color matches circle stroke
- "Score" label below percentage

---

### Stats Grid (Lines 161-199)

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <p className="text-slate-600 text-sm mb-1 font-medium">Your Score</p>
    <p className="text-2xl font-bold text-slate-900">
      {attempt.score} / {attempt.totalPoints}
    </p>
  </div>
  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <p className="text-slate-600 text-sm mb-1 font-medium">Percentage</p>
    <p className={`text-2xl font-bold ${getStatusColor()}`}>
      {percentage}%
    </p>
  </div>
  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <p className="text-slate-600 text-sm mb-1 font-medium">Time Taken</p>
    <p className="text-2xl font-bold text-slate-900">
      {attempt.timeTakenMinutes ? `${attempt.timeTakenMinutes} min` : 'N/A'}
    </p>
    {attempt.exceededTimeLimit && (
      <p className="text-xs text-red-600 mt-1">⚠️ Exceeded time limit</p>
    )}
  </div>
  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <p className="text-slate-600 text-sm mb-1 font-medium">Status</p>
    <p className={`text-2xl font-bold ${getStatusColor()}`}>
      {getStatusText()}
    </p>
  </div>
</div>
```

**Line 161: Responsive grid**
- 1 column on mobile
- 2 columns on medium screens
- 4 columns on large screens
- Gap of 1rem between cards

**Lines 162-167: Your Score card**
- Shows "15 / 20" format
- Actual points earned vs total possible

**Lines 168-173: Percentage card**
- Shows percentage with color
- Uses getStatusColor() for dynamic color

**Lines 174-182: Time Taken card**
- Shows minutes taken
- "N/A" if time not recorded
- **Line 180-182**: Warning if time limit exceeded
  - Only shows if `exceededTimeLimit` is true
  - Red warning emoji and text

**Lines 183-188: Status card**
- Shows "Passed", "Average", or "Failed"
- Colored based on score

---

### Performance Message (Lines 200-211)

```jsx
<div className={`p-4 rounded-lg ${
  percentage >= 70 
    ? 'bg-emerald-50 border border-emerald-200' 
    : percentage >= 50 
    ? 'bg-amber-50 border border-amber-200' 
    : 'bg-rose-50 border border-rose-200'
}`}>
  <p className={`font-semibold text-sm ${
    percentage >= 70 
      ? 'text-emerald-800' 
      : percentage >= 50 
      ? 'text-amber-800' 
      : 'text-rose-800'
  }`}>
    {percentage >= 70 
      ? '🎉 Excellent! You passed with flying colors!' 
      : percentage >= 50 
      ? '👍 Good effort! Keep practicing to improve.' 
      : '💪 Don\'t give up! Review the material and try again.'}
  </p>
</div>
```

**Lines 200-206: Dynamic background color**
- Emerald (green) for ≥70%
- Amber (yellow) for 50-69%
- Rose (red) for <50%

**Lines 207-220: Dynamic message**
- Color matches background
- Encouraging messages with emojis:
  - ≥70%: "🎉 Excellent! You passed with flying colors!"
  - 50-69%: "👍 Good effort! Keep practicing to improve."
  - <50%: "💪 Don't give up! Review the material and try again."

---

### Question Review Section (Lines 216-332)

```jsx
{attempt.quiz?.questions && attempt.quiz.questions.length > 0 && (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
    <h3 className="text-lg font-bold text-slate-900 mb-4">
      Question Review
    </h3>
    <p className="text-slate-600 text-sm mb-4">
      Total Questions: {attempt.quiz.questions.length}
    </p>
```

**Line 216: Conditional rendering**
- Only shows if quiz has questions
- Optional chaining prevents errors
- Short-circuit evaluation with `&&`

**Lines 217-223: Section header**
- "Question Review" title
- Shows total number of questions

---

### Question List Loop (Lines 226-316)

```jsx
<div className="space-y-4">
  {attempt.quiz.questions.map((question, index) => {
    // Find the user's answer for this question
    const userAnswer = attempt.candidateAnswers?.find(
      ans => ans.question?.id === question.id
    );
    
    // Determine if answer is correct
    const isCorrect = userAnswer?.correct;

    return (
      <div
        key={question.id}
        className={`border-2 rounded-lg p-4 ${
          isCorrect === true
            ? 'border-emerald-200 bg-emerald-50'
            : isCorrect === false
            ? 'border-rose-200 bg-rose-50'
            : 'border-slate-200 bg-slate-50'
        }`}
      >
```

**Line 226: Container with vertical spacing**

**Line 227: Map over questions**
- Renders each question with its answer

**Lines 228-231: Find user's answer**
- Searches through candidateAnswers array
- Matches by question ID
- Uses optional chaining in case no answers

**Line 234: Determine correctness**
- Gets the `correct` boolean from user's answer
- Could be true, false, or undefined

**Lines 236-245: Question card styling**
- **Dynamic border and background:**
  - Correct: Emerald green
  - Incorrect: Rose red
  - Unanswered: Slate gray

---

### Question Content (Lines 246-263)

```jsx
<div className="flex items-start">
  <span className={`mr-3 mt-0.5 material-symbols-outlined text-xl ${
    isCorrect === true
      ? 'text-emerald-600'
      : isCorrect === false
      ? 'text-rose-600'
      : 'text-slate-400'
  }`}>
    {isCorrect === true
      ? 'check_circle'
      : isCorrect === false
      ? 'cancel'
      : 'help'}
  </span>
  <div className="flex-1">
    <p className="font-semibold text-slate-900 mb-2 text-sm">
      {index + 1}. {question.questionText}
    </p>
```

**Lines 246-259: Status icon**
- Flex layout with icon and content
- **Icon changes based on correctness:**
  - Correct: Green checkmark
  - Incorrect: Red X
  - Unanswered: Gray help icon

**Lines 261-263: Question text**
- Numbered: "1. What is...?"
- Semibold font for emphasis

---

### MCQ/True-False Options Display (Lines 266-299)

```jsx
{(question.questionType === 'MCQ' || question.questionType === 'TRUE_FALSE') && (
  <div className="space-y-2 mt-3">
    {question.options?.map((option) => {
      const isUserSelection = userAnswer?.selectedOption?.id === option.id;
      const isCorrectOption = option.correct;

      return (
        <div
          key={option.id}
          className={`p-2 rounded ${
            isCorrectOption
              ? 'bg-green-100 border border-green-300'
              : isUserSelection && !isCorrectOption
              ? 'bg-red-100 border border-red-300'
              : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-center">
            {isCorrectOption && (
              <span className="material-symbols-outlined text-green-600 mr-2 text-sm">
                check
              </span>
            )}
            {isUserSelection && !isCorrectOption && (
              <span className="material-symbols-outlined text-red-600 mr-2 text-sm">
                close
              </span>
            )}
            <span className={
              isCorrectOption || isUserSelection
                ? 'font-semibold'
                : ''
            }>
              {option.optionText}
            </span>
            {isUserSelection && (
              <span className="ml-2 text-sm text-gray-600">
                (Your answer)
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>
)}
```

**Line 266: Type check**
- Only for MCQ and TRUE_FALSE questions
- SHORT_ANSWER handled separately below

**Lines 268-270: Determine option status**
- `isUserSelection`: Did user choose this option?
- `isCorrectOption`: Is this the correct answer?

**Lines 274-280: Option styling**
- **Correct option: Green background**
- **User's wrong selection: Red background**
- **Other options: White background**

**Lines 283-291: Icons**
- Correct option: Green checkmark
- Wrong selection: Red X
- Others: No icon

**Lines 292-296: Option text**
- Bold if correct or user's selection
- Normal weight otherwise

**Lines 297-301: "Your answer" label**
- Shows next to user's selected option
- Helps identify what they chose

---

### Short Answer Display (Lines 302-314)

```jsx
{question.questionType === 'SHORT_ANSWER' && (
  <div className="mt-3">
    <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
    <p className="p-2 bg-white border border-gray-200 rounded">
      {userAnswer?.textAnswer || '(No answer provided)'}
    </p>
    {userAnswer?.textAnswer && (
      <p className="text-sm text-gray-500 mt-2">
        * Short answer questions require manual grading
      </p>
    )}
  </div>
)}
```

**Line 302: Type check for SHORT_ANSWER**

**Lines 304-307: Display user's text answer**
- Shows in bordered box
- Fallback if no answer provided

**Lines 308-312: Manual grading notice**
- Only shows if answer was provided
- Informs user that answer needs manual review
- Short answers can't be auto-graded

---

### Action Buttons (Lines 323-329)

```jsx
<div className="mt-8 flex justify-center space-x-4">
  <button
    onClick={() => navigate('/candidate')}
    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
  >
    Back to Dashboard
  </button>
</div>
```

**Lines 323-329: Center-aligned button**
- Returns to candidate dashboard
- Primary action for leaving results page

---

### Export Statement (Line 337)

```jsx
export default QuizResults;
```

**Line 337: Default export**

---

## Key Technical Concepts

### 1. **SVG Circular Progress**
- Uses `strokeDasharray` and `strokeDashoffset` for partial circle
- Mathematical calculation: 2πr for circumference
- Dynamic color based on score
- Transform rotate-90 for proper starting position

### 2. **Conditional Styling**
- Dynamic classes based on score percentage
- Three tiers: Pass (70+), Average (50-69), Fail (<50)
- Colors match across multiple elements

### 3. **Answer Matching Logic**
- Finds user's answer by matching question IDs
- Checks correctness flag from backend
- Handles missing answers gracefully

### 4. **Multiple Question Types**
- MCQ: Shows all options with correct/incorrect highlighting
- TRUE_FALSE: Same as MCQ (just two options)
- SHORT_ANSWER: Shows text with manual grading note

### 5. **Error Handling**
- Three states: Loading, Error, No Data
- Each has appropriate UI
- All provide navigation back to dashboard

### 6. **Data Safety**
- Optional chaining throughout (`?.`)
- Fallback values for missing data
- Guards against division by zero

---

## Data Structure Expected

### Attempt Object
```javascript
{
  id: 42,
  score: 15,
  totalPoints: 20,
  timeTakenMinutes: 25,
  exceededTimeLimit: false,
  submittedAt: "2025-11-20T14:30:00Z",
  quiz: {
    id: 5,
    title: "JavaScript Basics",
    questions: [
      {
        id: 10,
        questionText: "What is closure?",
        questionType: "MCQ",
        points: 2,
        options: [
          {id: 30, optionText: "A function", correct: false},
          {id: 31, optionText: "Inner function with outer scope", correct: true}
        ]
      }
    ]
  },
  candidateAnswers: [
    {
      id: 100,
      question: {id: 10},
      selectedOption: {id: 31},
      textAnswer: null,
      correct: true
    }
  ]
}
```

---

## Visual Design Elements

### Color Coding
- **Green/Emerald**: Passed (≥70%)
- **Yellow/Amber**: Average (50-69%)
- **Red/Rose**: Failed (<50%)
- **Gray/Slate**: Neutral/unanswered

### Typography Hierarchy
1. Large percentage (5xl): Primary focus
2. Stats (2xl): Secondary metrics
3. Section headers (lg-xl): Content organization
4. Body text (sm-base): Details

### Layout Strategy
- Centered narrow content (max-w-4xl) for readability
- Responsive grid for stats (1/2/4 columns)
- Vertical spacing between sections
- Consistent padding and margins

---

## User Experience Features

1. **Immediate Feedback**: Large circular progress immediately shows result
2. **Multiple Perspectives**: Score, percentage, time, status all shown
3. **Encouraging Messages**: Different message for each performance tier
4. **Detailed Review**: See every question with correct answers
5. **Visual Indicators**: Colors and icons make review quick to scan
6. **Clear Labels**: "Your answer" helps identify what was selected
7. **Time Warning**: Shows if time limit was exceeded
8. **Always Accessible**: Multiple back buttons to dashboard

---

## Accessibility Considerations

1. Semantic HTML (header, main)
2. Clear labels for all data points
3. Icons supplemented with text
4. Color not sole indicator (text also changes)
5. Keyboard navigation supported
6. Screen reader friendly structure

---

## Testing Scenarios

1. Perfect score (100%)
2. Passing score (70-99%)
3. Average score (50-69%)
4. Failing score (0-49%)
5. Mixed correct/incorrect answers
6. Unanswered questions
7. Time limit exceeded
8. Short answer questions
9. No questions in quiz
10. Attempt not found (404)
11. Network error during fetch
12. Long question text
13. Many questions (scrolling)

---

## Integration Points

1. **candidateAPI.getAttempt(attemptId)**: Fetches attempt data
2. **React Router**: Provides attemptId param
3. **Candidate Dashboard**: Destination for back button
4. **Backend**: Calculates correctness, stores answers
5. **Date/Time**: Browser locale for timestamp formatting
