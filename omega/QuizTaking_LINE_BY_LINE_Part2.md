# QuizTaking.jsx - Complete Line-by-Line Documentation (Part 2 of 2)

## Continuation from Part 1

This document continues the line-by-line analysis of QuizTaking.jsx, covering the submission logic, helper functions, and complex UI rendering.

---

### Submit Quiz to Backend Function (Lines 193-220)

```jsx
const submitQuizToBackend = async (showAlerts = true) => {
  try {
    // Prepare answers for submission
    const answerRequests = Object.values(answers)
      .filter(answer => answer.selectedOptionId || answer.textAnswer)
      .map(answer => ({
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        textAnswer: answer.textAnswer || null
      }));

    const submitData = {
      attemptId: attemptId,
      answers: answerRequests
    };

    const result = await candidateAPI.submitQuiz(submitData);
    
    // Show success message and navigate to results
    if (showAlerts) {
      alert('Quiz submitted successfully!');
    }
    
    // Navigate to results page
    navigate(`/candidate/results/${result.id}`);
    
  } catch (error) {
    console.error('Error submitting quiz:', error);
    if (showAlerts) {
      alert('Failed to submit quiz: ' + error.message);
    }
    setSubmitting(false);
  }
};
```

**Line 193: `const submitQuizToBackend = async (showAlerts = true) => {`**
- Actual submission logic
- `showAlerts`: Controls whether to show success/error alerts
- Default true for manual submission
- False for auto-submission (time expiry)

**Line 194: `try {`**
- Error handling block

**Lines 196-202: Prepare answers array**
```jsx
const answerRequests = Object.values(answers)
  .filter(answer => answer.selectedOptionId || answer.textAnswer)
  .map(answer => ({
    questionId: answer.questionId,
    selectedOptionId: answer.selectedOptionId,
    textAnswer: answer.textAnswer || null
  }));
```

**Line 196: `Object.values(answers)`**
- Converts answers object to array
- `answers` is object like: `{ 10: {...}, 11: {...} }`
- Becomes array: `[{...}, {...}]`

**Line 197: `.filter(answer => answer.selectedOptionId || answer.textAnswer)`**
- Only includes answered questions
- Filters out questions with no selection and no text
- Unanswered questions not sent to backend

**Lines 198-202: Transform to API format**
- Maps to simpler object structure
- Includes only necessary fields:
  - `questionId`: Which question this answers
  - `selectedOptionId`: For MCQ/TRUE_FALSE
  - `textAnswer`: For SHORT_ANSWER (null if not applicable)

**Lines 204-207: Prepare submission object**
```jsx
const submitData = {
  attemptId: attemptId,
  answers: answerRequests
};
```
- Combines attempt ID with answers array
- This is what the API expects

**Line 209: `const result = await candidateAPI.submitQuiz(submitData);`**
- Sends data to backend
- Backend calculates score, saves answers
- Returns attempt object with results

**Lines 212-214: Success alert (conditional)**
- Only shows if `showAlerts` is true
- User-initiated submission: shows alert
- Auto-submission: skips alert (less disruptive)

**Line 217: `navigate(`/candidate/results/${result.id}`);`**
- Redirects to results page
- Uses attempt ID from result
- Works for both manual and auto-submission

**Lines 219-226: Error handling**
- Logs error to console
- Shows alert only if `showAlerts` true
- **Line 225**: Resets submitting to false
  - Allows user to retry
  - Only on error (success navigates away)

---

### Format Time Helper Function (Lines 229-234)

```jsx
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
```

**Line 229: Time formatting utility**
- Converts seconds to HH:MM:SS format

**Line 230: Calculate hours**
- `Math.floor(seconds / 3600)`: Integer hours
- 3600 seconds per hour

**Line 231: Calculate minutes**
- `seconds % 3600`: Remaining seconds after hours removed
- Divide by 60 to get minutes
- `Math.floor`: Integer minutes

**Line 232: Calculate seconds**
- `seconds % 60`: Remaining seconds after minutes

**Line 233: Format string**
- `String(hours).padStart(2, '0')`: Convert to string, pad to 2 digits
- Example: 5 becomes "05"
- Joins with colons: "01:30:45"

---

### Get Question Status Helper (Lines 237-246)

```jsx
const getQuestionStatus = (question) => {
  const answer = answers[question.id];
  if (!answer) return 'not-visited';
  
  if (answer.selectedOptionId || answer.textAnswer) {
    return 'answered';
  } else if (answer.visited) {
    return 'unanswered';
  }
  return 'not-visited';
};
```

**Line 237: Determines question state**
- Used for color-coding in sidebar

**Line 238: Get answer for this question**

**Line 239: If no answer object**
- Shouldn't happen (initialized for all questions)
- Returns 'not-visited' as safe default

**Lines 241-242: Answered check**
- Has selectedOptionId OR textAnswer
- Returns 'answered' (green)

**Lines 243-244: Visited but unanswered**
- User viewed but didn't answer
- Returns 'unanswered' (red)

**Line 245: Default**
- Not visited yet
- Returns 'not-visited' (yellow)

---

### Get Status Color Helper (Lines 249-256)

```jsx
const getStatusColor = (status) => {
  switch (status) {
    case 'answered': return 'bg-green-500 text-white';
    case 'unanswered': return 'bg-red-500 text-white';
    case 'not-visited': return 'bg-yellow-400 text-gray-800';
    default: return 'bg-gray-300 text-gray-800';
  }
};
```

**Line 249: Maps status to Tailwind classes**
- Used in question grid buttons

**Lines 250-255: Switch statement**
- `answered`: Green background, white text
- `unanswered`: Red background, white text  
- `not-visited`: Yellow background, dark text (better contrast)
- `default`: Gray (shouldn't happen)

---

### Loading State Render (Lines 259-267)

```jsx
if (loading) {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-slate-600">Loading quiz...</p>
      </div>
    </div>
  );
}
```

**Line 259: Early return during loading**
- Shows before quiz data fetched
- Full screen centered spinner

**Line 262: Spinner element**
- Animated rotation
- Large (4rem x 4rem)

**Line 263: Loading message**

---

### No Quiz Data Error (Lines 270-282)

```jsx
if (!quiz) {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="text-center">
        <p className="text-lg text-rose-500">Quiz not found</p>
        <button
          onClick={() => navigate('/candidate')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
```

**Line 270: Quiz failed to load**
- After loading completes but quiz is null
- Edge case error handling

**Lines 271-281: Error UI**
- Shows "Quiz not found" error
- Provides back button
- User can return to dashboard

---

### Get Current Question and Answer (Lines 284-285)

```jsx
const currentQuestion = quiz.questions[currentQuestionIndex];
const currentAnswer = answers[currentQuestion.id];
```

**Line 284: Current question object**
- Extracted for cleaner JSX below

**Line 285: Current answer object**
- User's answer for current question
- May be empty/null if not answered yet

---

### Main JSX Return (Lines 287-290)

```jsx
return (
  <div className="flex flex-col h-screen bg-gray-100">
```

**Line 287: Main container**
- Flex column layout (header, then content)
- Full screen height
- Light gray background

---

### Header Section (Lines 292-308)

```jsx
<header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
  <div>
    <h1 className="text-base font-semibold text-gray-900">{quiz.title}</h1>
    <p className="text-sm text-gray-600">Candidate: {user?.name}</p>
  </div>
  <div className="flex items-center gap-3 bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-200 shadow-sm">
    <span className="material-symbols-outlined text-xl text-indigo-600">timer</span>
    <div>
      <p className="text-xs text-gray-600 font-medium">Time Left</p>
      <p className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-indigo-900'}`}>
        {formatTime(timeLeft)}
      </p>
    </div>
  </div>
</header>
```

**Line 292: Header with flex layout**
- Space between quiz info and timer

**Lines 293-296: Left section**
- **Line 294**: Quiz title
- **Line 295**: Candidate name
- Uses optional chaining for safety

**Lines 297-305: Timer display**
- Gradient background for visual emphasis
- Timer icon
- "Time Left" label
- **Lines 302-303**: Dynamic color
  - Red if less than 5 minutes (300 seconds)
  - Normal indigo otherwise
  - Creates urgency near end

---

### Main Content Layout (Lines 310-312)

```jsx
<div className="flex flex-1 overflow-hidden">
```

**Line 310: Flex container for question and sidebar**
- `flex-1`: Takes remaining height
- `overflow-hidden`: Prevents parent scroll
- Children will handle their own scrolling

---

### Question Display Section (Lines 314-315)

```jsx
<main className="flex-1 flex flex-col p-5 overflow-y-auto">
```

**Line 314: Main content area**
- `flex-1`: Takes available width (sidebar takes fixed)
- Flex column: question card, then buttons
- Scrollable if content overflows

---

### Question Card (Lines 317-358)

```jsx
<div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
  <div className="mb-5">
    <span className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-md">
      Question {currentQuestionIndex + 1} of {quiz.questions.length}
    </span>
    <span className="ml-3 inline-block bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-md border border-indigo-200">
      {currentQuestion.points} {currentQuestion.points === 1 ? 'pt' : 'pts'}
    </span>
  </div>

  <h2 className="text-base font-semibold mb-6 text-slate-900 leading-relaxed">{currentQuestion.questionText}</h2>
```

**Line 317: Question card container**
- White background, rounded, bordered
- Takes remaining height (above buttons)

**Lines 318-325: Question metadata**
- **Lines 319-321**: Question number badge
  - "Question 1 of 10" format
  - Gray gradient background

- **Lines 322-324**: Points badge
  - Shows point value
  - Singular/plural handling
  - Indigo color scheme

**Line 327: Question text**
- Semibold font
- Larger line height for readability

---

### Multiple Choice / True-False Options (Lines 330-350)

```jsx
{(currentQuestion.type === 'MULTIPLE_CHOICE' || currentQuestion.type === 'TRUE_FALSE') && (
  <div className="space-y-3">
    {currentQuestion.options.map((option) => (
      <label
        key={option.id}
        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-all duration-200 ${
          currentAnswer?.selectedOptionId === option.id 
            ? 'border-blue-500 bg-blue-50 shadow-sm' 
            : 'border-slate-200'
        }`}
      >
        <input
          type="radio"
          name={`question-${currentQuestion.id}`}
          className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
          checked={currentAnswer?.selectedOptionId === option.id}
          onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
        />
        <span className="ml-4 text-sm text-slate-900">{option.optionText}</span>
      </label>
    ))}
  </div>
)}
```

**Line 330: Type check**
- Only render for MCQ and TRUE_FALSE
- Both use same radio button UI

**Line 331: Vertical spacing container**

**Line 332: Map over options**

**Lines 333-341: Option label (clickable)**
- `key={option.id}`: React key for list
- **Dynamic styling based on selection:**
  - Selected: Blue border, blue background, shadow
  - Not selected: Gray border, no background
- Hover effect on all options
- Cursor pointer indicates clickable

**Lines 342-348: Radio input**
- `type="radio"`: Only one selection per question
- `name`: Groups radios by question ID
- `checked`: Controlled by state (current answer)
- `onChange`: Calls handleAnswerSelect
- Custom styling for larger, colored radio

**Line 349: Option text**
- Margin left for spacing from radio
- Small font size

---

### Short Answer Input (Lines 353-362)

```jsx
{currentQuestion.type === 'SHORT_ANSWER' && (
  <div>
    <textarea
      className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
      rows="6"
      placeholder="Type your answer here..."
      value={currentAnswer?.textAnswer || ''}
      onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
    />
  </div>
)}
```

**Line 353: Type check for SHORT_ANSWER**

**Lines 355-361: Textarea**
- Full width
- 6 rows height
- Non-resizable (`resize-none`)
- Placeholder text
- **Value**: Controlled by state
- **onChange**: Updates state via handleTextAnswer
- Focus styling: blue ring

---

### Action Buttons (Lines 366-387)

```jsx
<div className="mt-6 flex items-center gap-3">
  <button
    onClick={handleSaveAndNext}
    disabled={submitting}
    className="bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 text-sm"
  >
    <span className="material-symbols-outlined text-base">save</span>
    {currentQuestionIndex < quiz.questions.length - 1 ? 'Save & Next' : 'Save'}
  </button>

  <button
    onClick={handleClearResponse}
    disabled={submitting}
    className="bg-white border border-slate-300 text-slate-700 font-medium py-2.5 px-5 rounded-lg shadow-sm hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 text-sm"
  >
    Clear Response
  </button>

  <button
    onClick={handleSubmitQuiz}
    disabled={submitting}
    className="ml-auto bg-emerald-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
  >
    {submitting ? 'Submitting...' : 'Submit Quiz'}
  </button>
</div>
```

**Line 366: Button container**
- Flex row layout
- Gap between buttons

**Lines 367-374: Save & Next button**
- Blue primary action
- Save icon
- **Dynamic text:**
  - "Save & Next" if not last question
  - "Save" if last question
- Disabled during submission

**Lines 376-381: Clear Response button**
- Secondary action (white with border)
- Clears current answer
- Disabled during submission

**Lines 383-389: Submit Quiz button**
- Green color (success action)
- `ml-auto`: Pushes to right side
- **Dynamic text:**
  - "Submitting..." during submission
  - "Submit Quiz" normally
- Disabled and cursor-not-allowed during submission

---

### Sidebar Section (Lines 394-396)

```jsx
<aside className="w-80 bg-white border-l border-slate-200 p-6 flex-shrink-0 flex flex-col overflow-y-auto shadow-sm">
  <h3 className="text-base font-semibold mb-4 text-slate-900">Questions</h3>
```

**Line 394: Sidebar container**
- Fixed width: 320px (80 * 4)
- White background
- Left border
- `flex-shrink-0`: Doesn't shrink when space limited
- Flex column for vertical layout
- Scrollable if content overflows

**Line 395: Sidebar title**

---

### Question Grid Navigation (Lines 398-412)

```jsx
<div className="grid grid-cols-4 gap-2.5 mb-8">
  {quiz.questions.map((question, index) => {
    const status = getQuestionStatus(question);
    const isCurrent = index === currentQuestionIndex;
    
    return (
      <button
        key={question.id}
        onClick={() => handleQuestionNavigation(index)}
        disabled={submitting}
        className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold shadow-sm text-sm ${getStatusColor(status)} ${
          isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''
        } disabled:opacity-50 transition-all`}
      >
        {index + 1}
      </button>
    );
  })}
</div>
```

**Line 398: Grid layout**
- 4 columns of question buttons
- Gap of 0.625rem

**Line 399: Map over all questions**

**Line 400: Get status**
- Calls getQuestionStatus helper
- Returns 'answered', 'unanswered', or 'not-visited'

**Line 401: Check if current**
- Highlights currently displayed question

**Lines 403-415: Question button**
- `key={question.id}`: React key
- Click handler: Navigate to that question
- Disabled during submission
- **Dynamic styling:**
  - Background color from getStatusColor
  - Current question: Blue ring around button
  - Disabled: Reduced opacity
- **Content**: Question number (1-indexed)

---

### Progress Summary (Lines 416-434)

```jsx
<div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
  <h4 className="font-semibold mb-3 text-sm text-slate-900">Progress</h4>
  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-slate-600">Answered:</span>
      <span className="font-semibold text-emerald-600">
        {Object.values(answers).filter(a => a.selectedOptionId || a.textAnswer).length}
      </span>
    </div>
    <div className="flex justify-between">
      <span className="text-slate-600">Unanswered:</span>
      <span className="font-semibold text-rose-600">
        {Object.values(answers).filter(a => a.visited && !a.selectedOptionId && !a.textAnswer).length}
      </span>
    </div>
    <div className="flex justify-between">
      <span className="text-slate-600">Not Visited:</span>
      <span className="font-semibold text-amber-600">
        {Object.values(answers).filter(a => !a.visited).length}
      </span>
    </div>
  </div>
</div>
```

**Line 416: Progress card**
- Gray background for separation

**Line 417: Section title**

**Lines 419-431: Three progress metrics**

**Lines 420-424: Answered count**
- `Object.values(answers)`: Convert to array
- Filter: Has selection OR text answer
- `.length`: Count matches
- Green color (positive)

**Lines 425-429: Unanswered count**
- Filter: Visited AND no answer
- Red color (needs attention)

**Lines 430-434: Not Visited count**
- Filter: Not visited yet
- Amber color (warning)

---

### Legend Section (Lines 437-458)

```jsx
<div className="mt-auto pt-6 border-t border-slate-200">
  <h4 className="font-semibold mb-4 text-sm text-slate-900">Legend</h4>
  <div className="space-y-3">
    <div className="flex items-center">
      <span className="w-4 h-4 rounded-md bg-emerald-500 mr-3"></span>
      <span className="text-sm text-slate-700">Answered</span>
    </div>
    <div className="flex items-center">
      <span className="w-4 h-4 rounded-md bg-rose-500 mr-3"></span>
      <span className="text-sm text-slate-700">Unanswered</span>
    </div>
    <div className="flex items-center">
      <span className="w-4 h-4 rounded-md bg-amber-400 mr-3"></span>
      <span className="text-sm text-slate-700">Not Visited</span>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-md mr-3 flex items-center justify-center border-2 border-blue-500"></div>
      <span className="text-sm text-slate-700">Current Question</span>
    </div>
  </div>
</div>
```

**Line 437: Legend at bottom of sidebar**
- `mt-auto`: Pushes to bottom (remaining space)
- Top border for separation

**Lines 440-456: Four legend items**
- Each with colored square and label
- Matches question grid colors
- Helps users understand the coding

**Lines 441-444: Answered (green)**
**Lines 445-448: Unanswered (red)**
**Lines 449-452: Not Visited (amber)**
**Lines 453-456: Current Question**
- Shows blue ring indicator
- Uses border instead of background

---

### Export Statement (Line 464)

```jsx
export default QuizTaking;
```

---

## Key Technical Concepts

### 1. **Real-Time Timer Management**
- `setInterval` for countdown
- Cleanup in useEffect return
- Auto-submission at 0
- Timer stops during submission

### 2. **Ref Usage for Side Effects**
- `quizStartedRef`: Prevents duplicate quiz starts
- `timerRef`: Allows clearing interval from any function
- Refs persist across renders unlike state

### 3. **Complex State Management**
- Multiple interdependent state variables
- Answers object with nested structure
- Current question index for navigation
- Submitting flag prevents race conditions

### 4. **Functional State Updates**
- `setTimeLeft(prev => prev - 1)`: Ensures accuracy
- `setAnswers(prev => ({...prev, ...}))`: Preserves other answers
- Prevents stale state issues

### 5. **Conditional Rendering Patterns**
- Early returns for loading/error states
- Type-based rendering (MCQ vs SHORT_ANSWER)
- Dynamic text (Save vs Save & Next)

### 6. **Data Transformation**
- Answers object → array for submission
- Filter out unanswered questions
- Map to API format

### 7. **User Experience Optimization**
- Color coding for question status
- Progress tracking
- Warnings (time running out, last question)
- Confirmation before submission
- Disabled states during submission

---

## State Flow Diagram

```
Mount → useEffect (auth) → startQuizAttempt()
  ↓
Fetch quiz → Initialize answers → Start attempt → Set timer → Show UI
  ↓
Timer Effect → setInterval → Countdown every second
  ↓
User answers → handleAnswerSelect/handleTextAnswer → Update answers state
  ↓
User navigates → handleSaveAndNext/handleQuestionNavigation → Change question index
  ↓
Time expires OR user clicks submit → submitQuizToBackend()
  ↓
API call → Success → Navigate to results
```

---

## Answer State Structure

```javascript
{
  10: {  // questionId as key
    questionId: 10,
    selectedOptionId: 42,  // for MCQ/TRUE_FALSE
    textAnswer: '',         // for SHORT_ANSWER
    visited: true           // user viewed this question
  },
  11: {
    questionId: 11,
    selectedOptionId: null,
    textAnswer: 'My answer text',
    visited: true
  },
  12: {
    questionId: 12,
    selectedOptionId: null,
    textAnswer: '',
    visited: false  // not viewed yet
  }
}
```

---

## Critical Edge Cases Handled

1. **React 18 StrictMode**: quizStartedRef prevents double start
2. **Timer Cleanup**: Clears interval on unmount
3. **Double Submission**: submitting flag prevents
4. **Time Expiry During Submission**: Check submitting before auto-submit
5. **Missing Data**: Optional chaining throughout
6. **Last Question**: Different button text
7. **Unanswered Questions**: Filtered out in submission
8. **Quiz Not Found**: Error UI with navigation

---

## Performance Considerations

1. **Memoization**: Could add useMemo for filtered answer counts
2. **Callback Functions**: useCallback could prevent re-renders
3. **Timer Precision**: setInterval not perfect (can drift), but acceptable for quiz
4. **Large Question Lists**: Grid handles scrolling well

---

## Security Considerations

1. **Backend Validation**: Must re-verify all answers
2. **Time Limit Enforcement**: Backend checks start/end time
3. **Answer Tampering**: Backend ignores client-calculated scores
4. **Attempt Uniqueness**: attemptId ensures correct submission

---

## Testing Scenarios

1. Start quiz successfully
2. Answer all questions
3. Navigate between questions (linear and non-linear)
4. Clear responses
5. Submit manually
6. Time expiry (auto-submit)
7. Try to start same quiz twice
8. Submit with some questions unanswered
9. Submit with no questions answered
10. Network failure during submission
11. Timer reaching 0 during submission
12. Short answer questions
13. True/false questions
14. Very long quizzes (scrolling)
15. Rapid question navigation

---

## Integration Points

1. **candidateAPI.getQuiz(quizId)**: Fetch quiz data
2. **candidateAPI.startQuiz(quizId)**: Register attempt
3. **candidateAPI.submitQuiz(submitData)**: Submit answers
4. **React Router**: Navigation to results
5. **localStorage**: User authentication
6. **Browser Timer API**: setInterval/clearInterval
7. **Browser Dialog API**: window.confirm

---

## Accessibility Features

1. Semantic HTML (header, main, aside)
2. Labels for radio inputs
3. Keyboard navigation support
4. Focus states on all interactive elements
5. Disabled states clearly indicated
6. Color not sole indicator (text labels too)

---

## Future Enhancements

1. Save draft (periodic auto-save)
2. Review mode before submission
3. Bookmark questions
4. Notes/flags for questions
5. Keyboard shortcuts (next/previous)
6. Confirm before navigation away
7. Progress persistence (resume later)
8. Review flagged questions only
9. Time warnings at intervals
10. Show/hide legend toggle

---

## Component Complexity Metrics

- **Lines of Code**: ~482
- **State Variables**: 8
- **Refs**: 2
- **Effects**: 2
- **Helper Functions**: 6
- **Event Handlers**: 5
- **Conditional Renders**: Multiple levels
- **API Calls**: 3

This is the most complex component in the application, managing real-time interactions, state synchronization, and critical quiz-taking flow.
