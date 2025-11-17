# QuizForge Frontend - Simplified Documentation

## 📁 Project Structure

```
frontend/src/
├── pages/
│   ├── Login.jsx                 # Login page for both Admin & Candidate
│   ├── CandidateDashboard.jsx   # Candidate main page - shows available quizzes
│   ├── CandidateProfile.jsx     # Candidate profile information
│   ├── QuizTaking.jsx           # Quiz interface for taking tests
│   ├── AdminDashboard.jsx       # Admin main page - quiz management
│   ├── CreateQuiz.jsx           # Admin page to create new quiz
│   └── EditQuiz.jsx             # Admin page to edit existing quiz
├── App.jsx                      # Main app with routing
└── main.jsx                     # Entry point
```

## 🔄 Application Flow

### Candidate Flow:
1. **Login** (`/`) → Enter email/password
2. **Dashboard** (`/candidate`) → See available quizzes
3. **Profile** (`/candidate/profile`) → View profile info
4. **Take Quiz** (`/candidate/quiz/:id`) → Answer questions with timer
5. **Logout** → Return to login

### Admin Flow:
1. **Login** (`/`) → Enter email/password
2. **Dashboard** (`/admin`) → See all quizzes in table
3. **Create Quiz** (`/admin/quiz/create`) → Add new quiz
4. **Edit Quiz** (`/admin/quiz/edit/:id`) → Modify existing quiz
5. **Logout** → Return to login

## 🔌 API Endpoints Used

### Authentication
- `POST /api/auth/login` - Login (email, password)

### Candidate APIs
- `GET /api/candidate/quizzes` - Get available quizzes
- `POST /api/candidate/quizzes/:id/start` - Start quiz attempt
- `POST /api/candidate/quizzes/submit` - Submit answers

### Admin APIs
- `GET /api/admin/quizzes` - Get all quizzes
- `POST /api/admin/quizzes` - Create new quiz
- `GET /api/admin/quizzes/:id` - Get quiz details
- `PUT /api/admin/quizzes/:id` - Update quiz
- `DELETE /api/admin/quizzes/:id` - Delete quiz

## 📄 Page Breakdown

### 1. Login.jsx (SIMPLIFIED)
**Purpose**: Authenticate users
**Key Features**:
- Email & password fields
- API call to `/api/auth/login`
- Stores JWT token in localStorage
- Redirects based on role (ADMIN → /admin, CANDIDATE → /candidate)

**State**: `email`, `password`, `loading`, `error`

---

### 2. CandidateDashboard.jsx (SIMPLIFIED)
**Purpose**: Show available quizzes to candidates
**Key Features**:
- Sidebar: Dashboard, Profile, Logout buttons
- Main area: Grid of available quizzes
- Each quiz card: Title, description, questions count, duration, "Start Quiz" button

**State**: `user`, `availableQuizzes`, `loading`
**API Call**: `GET /api/candidate/quizzes`

**Navigation**:
- "Profile" → `/candidate/profile`
- "Start Quiz" → `/candidate/quiz/:id`
- "Logout" → `/`

---

### 3. CandidateProfile.jsx (SIMPLIFIED)
**Purpose**: Display candidate information
**Key Features**:
- Shows: Name, ID, Email, Role
- Back to Dashboard button
- Logout button

**State**: `user`
**No API calls** - Uses data from localStorage

---

### 4. QuizTaking.jsx
**Purpose**: Take quiz with timer
**Key Features**:
- Timer countdown (auto-submit when time ends)
- Question navigation (click question numbers)
- Answer selection (radio buttons for MCQ, textarea for short answer)
- Save & Next, Clear Response, Submit buttons
- Question status: Green (answered), Red (unanswered), Yellow (not visited)

**State**: `quiz`, `attemptId`, `currentQuestionIndex`, `answers`, `timeLeft`

**API Calls**:
- `POST /api/candidate/quizzes/:id/start` - Start attempt
- `GET /api/candidate/quizzes/:id` - Get quiz questions
- `POST /api/candidate/quizzes/submit` - Submit answers

---

### 5. AdminDashboard.jsx (SIMPLIFIED)
**Purpose**: Manage quizzes
**Key Features**:
- Sidebar: Dashboard, Create Quiz, Logout
- Stats cards: Total quizzes, Active quizzes
- Quiz table with columns: Title, Questions, Duration, Status, Created, Actions
- Actions: Analytics (view icon), Edit (pencil icon), Delete (trash icon)

**State**: `user`, `quizzes`, `stats`, `showDeleteModal`, `quizToDelete`

**API Calls**:
- `GET /api/admin/quizzes` - Get all quizzes
- `DELETE /api/admin/quizzes/:id` - Delete quiz

**Navigation**:
- "Create Quiz" button → `/admin/quiz/create`
- Edit icon → `/admin/quiz/edit/:id`

---

### 6. CreateQuiz.jsx
**Purpose**: Create new quiz
**Key Features**:
- Quiz details: Title, Description, Duration, Status
- Add/Remove questions
- Question types: Multiple Choice, True/False, Short Answer
- Add/Remove options for each question
- Mark correct answer (radio button)
- Validation before save

**State**: `quizData`, `questions`

**API Call**: `POST /api/admin/quizzes`

---

### 7. EditQuiz.jsx
**Purpose**: Edit existing quiz
**Key Features**:
- Same as CreateQuiz but loads existing data
- Pre-fills all fields with current values
- Can modify everything

**State**: `quizData`, `questions`, `originalQuestions`

**API Calls**:
- `GET /api/admin/quizzes/:id` - Load quiz
- `PUT /api/admin/quizzes/:id` - Save changes

## 🎨 Design System

### Colors
- **Primary**: `#007BFF` (blue) - buttons, active states
- **Background**: `#F8F9FA` (light gray)
- **Success**: Green - answered questions, save button
- **Danger**: Red - delete button, unanswered questions
- **Warning**: Yellow - not visited questions

### Fonts
- **Display**: Inter (Google Fonts)
- **Icons**: Material Symbols Outlined

### Common Components
- **Sidebar**: Left side navigation (64px width = `w-64`)
- **Cards**: White background, border, rounded corners
- **Buttons**: Primary (blue), Secondary (gray), Danger (red)

## 🔑 Key Functions

### Authentication Check (in every page)
```javascript
useEffect(() => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  if (!userData || !token) {
    navigate('/'); // Redirect to login
    return;
  }
  
  const parsedUser = JSON.parse(userData);
  if (parsedUser.role !== 'EXPECTED_ROLE') {
    navigate('/'); // Redirect if wrong role
    return;
  }
  
  setUser(parsedUser);
}, [navigate]);
```

### Logout Function
```javascript
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/');
};
```

### API Call Pattern
```javascript
const response = await fetch('http://localhost:8080/api/...', {
  method: 'GET', // or POST, PUT, DELETE
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data) // for POST/PUT only
});

if (response.ok) {
  const data = await response.json();
  // Use data
}
```

## 🐛 Common Issues & Fixes

### Issue: "Cannot read property 'name' of null"
**Fix**: Add null check: `{user?.name || 'N/A'}`

### Issue: Button not working
**Fix**: Check `onClick={() => navigate('/path')}` syntax

### Issue: API call fails
**Fix**: 
1. Check backend is running on `http://localhost:8080`
2. Check token is valid
3. Check API endpoint path matches backend

### Issue: Page shows blank/loading forever
**Fix**: Check authentication logic, ensure `setLoading(false)` is called

## 📝 How to Add New Feature

1. **Create new page** in `src/pages/NewPage.jsx`
2. **Add route** in `App.jsx`: `<Route path="/new" element={<NewPage />} />`
3. **Add navigation** in sidebar: `onClick={() => navigate('/new')}`
4. **Test** the complete flow

## 🚀 Running the App

1. **Backend**: `cd backend && mvn spring-boot:run`
2. **Frontend**: `cd frontend && npm run dev`
3. **Access**: http://localhost:5173

## 📊 Test Data

### Admin Login
- Email: (create in database)
- Password: (hashed password)
- Role: ADMIN

### Candidate Login
- Email: (create in database)
- Password: (hashed password)
- Role: CANDIDATE

## ✅ Simplified Changes Made

1. **Removed** unused buttons ("Assessments", "Analytics", "Manage Quizzes")
2. **Simplified** CandidateDashboard - only shows available quizzes
3. **Simplified** CandidateProfile - removed fake statistics
4. **Cleaned** AdminDashboard sidebar - only Dashboard and Create Quiz
5. **Added** clear comments in code
6. **Fixed** all navigation links to work properly

## 📖 Learning the Code

**Start here** (in order):
1. `App.jsx` - See all routes
2. `Login.jsx` - Understand authentication
3. `CandidateDashboard.jsx` - Simple list display
4. `AdminDashboard.jsx` - Table with actions
5. `QuizTaking.jsx` - Complex state management
6. `CreateQuiz.jsx` - Form handling
7. `EditQuiz.jsx` - Edit form

**Key Concepts**:
- `useState` - Store data that changes
- `useEffect` - Run code when component loads
- `useNavigate` - Change pages
- `fetch` - Call backend APIs
- `localStorage` - Store token/user data

---

Last Updated: November 9, 2025
