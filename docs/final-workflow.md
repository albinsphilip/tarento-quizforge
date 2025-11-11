# QuizForge - Internal Workflow Documentation
## Complete End-to-End Operation Flow

**Last Updated:** November 12, 2025
**Status:** Production Ready for Presentation

---

## Table of Contents
1. [User Authentication Workflow](#user-authentication-workflow)
2. [Admin Quiz Management Workflow](#admin-quiz-management-workflow)
3. [Candidate Quiz Taking Workflow](#candidate-quiz-taking-workflow)
4. [Results & Analytics Workflow](#results--analytics-workflow)
5. [Database Transactions](#database-transactions)
6. [Security & Authorization](#security--authorization)
7. [Error Handling](#error-handling)

---

## User Authentication Workflow

### 1. Login Process (Step-by-Step)

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOGIN WORKFLOW                               │
└─────────────────────────────────────────────────────────────────┘

FRONTEND (React)
    │
    ├─► User enters email & password
    │
    └─► POST /api/auth/login (LoginRequest)
            {
              "email": "candidate@example.com",
              "password": "candidate123"
            }
            │
            ▼
BACKEND CONTROLLER (AuthController)
    ├─► Receives @Valid @RequestBody LoginRequest
    │   - Validates email format using @Email annotation
    │   - Validates password not blank using @NotBlank annotation
    │   - If validation fails → MethodArgumentNotValidException → 400 Bad Request
    │
    └─► Calls authService.login(request)
            │
            ▼
SERVICE LAYER (AuthService)
    ├─► Step 1: Find user by email
    │   └─► userRepository.findByEmail(email)
    │       - Queries: SELECT * FROM users WHERE email = ?
    │       - If not found → throw RuntimeException("Invalid email or password")
    │       - Response: User object with encrypted password
    │
    ├─► Step 2: Verify password using BCrypt
    │   └─► passwordEncoder.matches(plainPassword, hashedPassword)
    │       - Takes plain password from request
    │       - Compares with stored BCrypt hash (60 chars)
    │       - BCrypt uses salt to prevent rainbow table attacks
    │       - If doesn't match → throw RuntimeException("Invalid email or password")
    │
    ├─► Step 3: Generate JWT token
    │   └─► jwtUtil.generateToken(email, role)
    │       - Creates token with 3 parts:
    │         • Header: {alg: "HS256", typ: "JWT"}
    │         • Payload: {email: "...", role: "...", iat: timestamp, exp: timestamp}
    │         • Signature: HMAC-SHA256(header.payload, secret_key)
    │       - Token expires in 24 hours (configurable)
    │
    └─► Return LoginResponse
            {
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              "email": "candidate@example.com",
              "name": "John Doe",
              "role": "CANDIDATE"
            }
            │
            ▼
FRONTEND (React)
    ├─► Stores token in localStorage: localStorage.setItem("jwt_token", token)
    ├─► Stores user info in React state
    └─► Redirects to dashboard (Admin or Candidate based on role)
```

### 2. Token Validation Flow

```
Every subsequent API request:

FRONTEND
    │
    └─► Adds Authorization header:
            Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                │
                ▼
BACKEND (JwtAuthenticationFilter)
    ├─► Extract token from Authorization header
    │
    ├─► Call jwtUtil.validateToken(token)
    │   └─► Verify JWT signature using secret key
    │       └─► If invalid → SecurityException
    │
    ├─► Extract email from token
    │   └─► email = jwtUtil.getEmailFromToken(token)
    │
    ├─► Create Authentication object
    │   └─► UsernamePasswordAuthenticationToken(email, null, authorities)
    │
    └─► Set in SecurityContext
            │
            ▼
CONTROLLER/SERVICE
    └─► Access via @AuthenticationPrincipal UserDetails
        └─► userDetails.getUsername() returns email
```

### 3. Password Hashing (DataSeeder)

```
When application starts:

DataSeeder.run()
    │
    ├─► Check if user already exists by email
    │
    ├─► If NOT exists:
    │   ├─► Create User object
    │   ├─► passwordEncoder.encode(plainPassword)
    │   │   └─► BCrypt algorithm:
    │   │       1. Generate random salt (10 rounds)
    │   │       2. Hash password with salt multiple times
    │   │       3. Return: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
    │   │          (60 character string)
    │   │
    │   └─► Save to database
    │
    └─► Log: "✅ User seeded: email@example.com"

Result in Database:
    users table:
    ┌──────┬──────────────────────────┬──────────────────────────────────────────────────────┐
    │ id   │ email                    │ password                                             │
    ├──────┼──────────────────────────┼──────────────────────────────────────────────────────┤
    │ 1    │ admin@quizforge.com      │ $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad... │
    │ 2    │ candidate@example.com    │ $2a$10$XyZaBcDeFgHiJkLmNoPqRsTuVwXyZ1a2bCdEfGhI... │
    └──────┴──────────────────────────┴──────────────────────────────────────────────────────┘
```

---

## Admin Quiz Management Workflow

### 1. Create Quiz Workflow

```
┌──────────────────────────────────────────────────────────────────┐
│              ADMIN CREATE QUIZ WORKFLOW                          │
└──────────────────────────────────────────────────────────────────┘

FRONTEND (Admin Dashboard)
    │
    ├─► Admin fills form:
    │   ├─ Quiz Title: "Java Fundamentals"
    │   ├─ Description: "Test your Java knowledge"
    │   ├─ Duration: 30 minutes
    │   ├─ Questions:
    │   │  ├─ Q1: "What is JVM?" (MCQ, 5 points)
    │   │  │   ├─ Option 1: "Java Virtual Machine" ✓ (correct)
    │   │  │   └─ Option 2: "Java Verification Module"
    │   │  └─ Q2: "Define polymorphism" (TEXT, 10 points)
    │   │
    │   └─► Click "Create Quiz"
    │       │
    │       └─► POST /api/admin/quizzes
    │           Content-Type: application/json
    │           Authorization: Bearer <admin_token>
    │           {
    │             "title": "Java Fundamentals",
    │             "description": "...",
    │             "duration": 30,
    │             "isActive": true,
    │             "questions": [
    │               {
    │                 "text": "What is JVM?",
    │                 "type": "MCQ",
    │                 "points": 5,
    │                 "options": [
    │                   {"text": "Java Virtual Machine", "isCorrect": true},
    │                   {"text": "Java Verification Module", "isCorrect": false}
    │                 ]
    │               }
    │             ]
    │           }
    │           │
    │           ▼
BACKEND CONTROLLER (AdminController)
    ├─► Method: createQuiz(@Valid @RequestBody QuizRequest, @AuthenticationPrincipal UserDetails)
    │
    ├─► Extract admin email from JWT token
    │   └─► adminEmail = userDetails.getUsername()
    │
    ├─► Validate request @Valid
    │   ├─► @NotBlank title
    │   ├─► @NotNull duration
    │   ├─► @Min(1) duration
    │   ├─► @Valid questions (nested validation)
    │   └─► If fails → 400 Bad Request with field errors
    │
    └─► Call adminService.createQuiz(request, adminEmail)
            │
            ▼
SERVICE LAYER (AdminService)
    ├─► @Transactional annotation (ensures ACID properties)
    │
    ├─► Step 1: Find admin user
    │   └─► User admin = userRepository.findByEmail(adminEmail)
    │       ├─► Query: SELECT * FROM users WHERE email = ?
    │       ├─► If not found → throw RuntimeException("Admin user not found")
    │       └─► If found → continue
    │
    ├─► Step 2: Create Quiz entity
    │   ├─► quiz = new Quiz()
    │   ├─► quiz.setTitle("Java Fundamentals")
    │   ├─► quiz.setDescription("...")
    │   ├─► quiz.setDuration(30)
    │   ├─► quiz.setIsActive(true)
    │   ├─► quiz.setCreatedBy(admin)
    │   ├─► quiz.setCreatedAt(LocalDateTime.now())
    │   └─► quiz.setStatus(QuizStatus.DRAFT)
    │
    ├─► Step 3: Create Question entities
    │   │
    │   └─► For each question in request:
    │       ├─► question = new Question()
    │       ├─► question.setText("What is JVM?")
    │       ├─► question.setType(QuestionType.MCQ)
    │       ├─► question.setPoints(5)
    │       ├─► question.setQuiz(quiz)
    │       │
    │       └─► Step 3a: Create Option entities
    │           │
    │           └─► For each option:
    │               ├─► option = new QuestionOption()
    │               ├─► option.setText("Java Virtual Machine")
    │               ├─► option.setIsCorrect(true)
    │               ├─► option.setQuestion(question)
    │               └─► question.getOptions().add(option)
    │
    ├─► Step 4: Save to database (due to @Transactional)
    │   │
    │   └─► quiz = quizRepository.save(quiz)
    │       └─► SQL Operations:
    │           1. INSERT INTO quizzes (title, description, duration, ...)
    │              VALUES (?, ?, ?, ...)
    │              → Returns quiz with generated ID
    │           2. INSERT INTO questions (text, type, points, quiz_id)
    │              VALUES (?, ?, ?, ?)
    │              → For each question
    │           3. INSERT INTO question_options (text, is_correct, question_id)
    │              VALUES (?, ?, ?)
    │              → For each option
    │
    ├─► Step 5: Convert to response DTO
    │   └─► QuizResponse toDetailedResponse(quiz)
    │       ├─► Extract quiz info
    │       ├─► Extract all questions
    │       ├─► Extract all options for each question
    │       └─► Return populated QuizResponse
    │
    └─► Return to controller
            │
            ▼
BACKEND CONTROLLER
    │
    └─► ResponseEntity.status(HttpStatus.CREATED).body(response)
            HTTP 201 Created
            {
              "id": 7,
              "title": "Java Fundamentals",
              "description": "...",
              "duration": 30,
              "isActive": true,
              "createdAt": "2025-11-12T10:30:00",
              "questions": [
                {
                  "id": 101,
                  "text": "What is JVM?",
                  "type": "MCQ",
                  "points": 5,
                  "options": [...]
                }
              ]
            }
            │
            ▼
FRONTEND
    └─► Display success message
        └─► Redirect to quiz list or update dashboard
```

### 2. Update Quiz Workflow

```
Admin clicks "Edit Quiz"

FRONTEND
    │
    ├─► Loads quiz details
    │
    ├─► Admin modifies fields:
    │   ├─ Changes title
    │   ├─ Changes description
    │   ├─ Modifies questions
    │   └─ Clicks "Save"
    │
    └─► PUT /api/admin/quizzes/{quiz_id}
            Authorization: Bearer <admin_token>
            {
              "title": "Java Advanced",
              "description": "Updated description",
              ...
            }
            │
            ▼
BACKEND SERVICE (AdminService)
    ├─► @Transactional
    │
    ├─► Step 1: Find quiz by ID
    │   └─► Quiz quiz = quizRepository.findById(id)
    │       └─► If not found → throw RuntimeException("Quiz not found")
    │
    ├─► Step 2: Update only modified fields
    │   ├─► quiz.setTitle(request.title())
    │   ├─► quiz.setDescription(request.description())
    │   └─► quiz.setUpdatedAt(LocalDateTime.now())
    │
    ├─► Step 3: Save changes
    │   └─► quizRepository.save(quiz)
    │       └─► SQL: UPDATE quizzes SET title = ?, description = ? WHERE id = ?
    │
    └─► Return updated QuizResponse
            │
            ▼
FRONTEND
    └─► Show success toast notification
```

### 3. Delete Quiz Workflow

```
Admin clicks "Delete Quiz"

FRONTEND
    │
    ├─► Show confirmation dialog: "Delete this quiz?"
    │
    ├─► If confirmed:
    │   └─► DELETE /api/admin/quizzes/{quiz_id}
    │       Authorization: Bearer <admin_token>
    │
    └─► If cancelled: Do nothing
            │
            ▼
BACKEND CONTROLLER
    │
    └─► deleteQuiz(Long id, @AuthenticationPrincipal UserDetails)
            │
            ▼
BACKEND SERVICE (AdminService)
    ├─► @Transactional
    │
    ├─► Step 1: Find quiz
    │   └─► Quiz quiz = quizRepository.findById(id)
    │
    ├─► Step 2: Check if quiz has attempts (referential integrity)
    │   └─► Check if any QuizAttempt references this quiz
    │       └─► If yes → Optional: Soft delete (mark as deleted)
    │       └─► If no → Proceed to hard delete
    │
    ├─► Step 3: Delete all dependent entities (cascade)
    │   ├─► DELETE questions WHERE quiz_id = ?
    │   ├─► DELETE question_options WHERE question_id IN (SELECT id FROM questions WHERE quiz_id = ?)
    │   └─► DELETE answers WHERE attempt_id IN (SELECT id FROM quiz_attempts WHERE quiz_id = ?)
    │
    ├─► Step 4: Delete quiz
    │   └─► quizRepository.deleteById(id)
    │       └─► DELETE FROM quizzes WHERE id = ?
    │
    └─► Return 204 No Content
            │
            ▼
FRONTEND
    └─► Remove quiz from list
        └─► Show "Quiz deleted successfully"
```

### 4. Get Quiz Analytics Workflow

```
Admin clicks "Analytics" button on quiz

FRONTEND
    │
    └─► GET /api/admin/quizzes/{quiz_id}/analytics
            Authorization: Bearer <admin_token>
            │
            ▼
BACKEND CONTROLLER
    │
    └─► getQuizAnalytics(Long quizId, @AuthenticationPrincipal UserDetails)
            │
            ▼
SERVICE LAYER (AdminService)
    ├─► Step 1: Find quiz
    │   └─► Quiz quiz = quizRepository.findById(quizId)
    │
    ├─► Step 2: Fetch all attempts for this quiz
    │   └─► List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId)
    │       └─► SELECT * FROM quiz_attempts WHERE quiz_id = ?
    │
    ├─► Step 3: Calculate analytics
    │   │
    │   ├─► totalAttempts = attempts.size()
    │   │
    │   ├─► averageScore = attempts.stream()
    │   │       .mapToInt(QuizAttempt::getScore)
    │   │       .average()
    │   │       .orElse(0.0)
    │   │   └─► Calculate mean of all scores
    │   │
    │   ├─► highestScore = attempts.stream()
    │   │       .mapToInt(QuizAttempt::getScore)
    │   │       .max()
    │   │       .orElse(0)
    │   │   └─► Find maximum score
    │   │
    │   ├─► lowestScore = attempts.stream()
    │   │       .mapToInt(QuizAttempt::getScore)
    │   │       .min()
    │   │       .orElse(0)
    │   │   └─► Find minimum score
    │   │
    │   ├─► passPercentage = (passCount / totalAttempts) * 100
    │   │   └─► Count attempts where score >= passingScore
    │   │
    │   └─► For each question:
    │       ├─► correctAttempts = Count attempts with correct answer
    │       ├─► successRate = (correctAttempts / totalAttempts) * 100
    │       └─► Store per-question statistics
    │
    └─► Return QuizAnalyticsResponse
            {
              "quizId": 7,
              "quizTitle": "Java Fundamentals",
              "totalAttempts": 15,
              "averageScore": 75.5,
              "highestScore": 95,
              "lowestScore": 40,
              "passPercentage": 80.0,
              "questionStatistics": [
                {
                  "questionId": 101,
                  "questionText": "What is JVM?",
                  "correctAttempts": 14,
                  "successRate": 93.3
                }
              ]
            }
            │
            ▼
FRONTEND
    └─► Display charts and statistics
        ├─► Bar chart: Score distribution
        ├─► Pie chart: Pass/Fail ratio
        ├─► Line graph: Question difficulty
        └─► Summary statistics
```

---

## Candidate Quiz Taking Workflow

### 1. View Available Quizzes Workflow

```
Candidate logs in and lands on dashboard

FRONTEND (Candidate Dashboard)
    │
    └─► useEffect: GET /api/candidate/quizzes
            Authorization: Bearer <candidate_token>
            │
            ▼
BACKEND CONTROLLER (CandidateController)
    │
    └─► getAvailableQuizzes(@AuthenticationPrincipal UserDetails)
            │
            ▼
SERVICE LAYER (CandidateService)
    ├─► Step 1: Fetch all active quizzes
    │   └─► List<Quiz> quizzes = quizRepository.findByIsActive(true)
    │       └─► SELECT * FROM quizzes WHERE is_active = TRUE
    │
    ├─► Step 2: For each quiz, check candidate status
    │   │
    │   └─► For each quiz:
    │       ├─► Check if candidate already attempted
    │       │   └─► attemptRepository.findByQuizIdAndCandidateEmail(quizId, email)
    │       │       └─► If exists → Mark as "Completed" / "In Progress"
    │       │       └─► If not exists → Mark as "Available"
    │       │
    │       └─► Get candidate's score if completed
    │           └─► if (attempt != null && attempt.status == EVALUATED)
    │               └─► score = attempt.score / attempt.totalPoints * 100
    │
    ├─► Step 3: Convert to response
    │   └─► List<QuizSummaryResponse> responses
    │       ├─► id, title, description, duration
    │       ├─► status (AVAILABLE / IN_PROGRESS / COMPLETED)
    │       └─► score (if completed)
    │
    └─► Return to frontend
            {
              "quizzes": [
                {
                  "id": 7,
                  "title": "Java Fundamentals",
                  "description": "...",
                  "duration": 30,
                  "status": "AVAILABLE",
                  "score": null
                },
                {
                  "id": 5,
                  "title": "Spring Boot Basics",
                  "description": "...",
                  "duration": 45,
                  "status": "COMPLETED",
                  "score": 85.5
                }
              ]
            }
            │
            ▼
FRONTEND
    └─► Render quiz cards
        ├─► Available quizzes → "Start Quiz" button
        ├─► In Progress quizzes → "Resume Quiz" button
        ├─► Completed quizzes → "View Results" button
        └─► Show score badge if completed
```

### 2. Start Quiz Workflow

```
Candidate clicks "Start Quiz"

FRONTEND
    │
    ├─► Store quiz_id: 7
    │
    └─► POST /api/candidate/quizzes/{quiz_id}/start
            Authorization: Bearer <candidate_token>
            │
            ▼
BACKEND CONTROLLER (CandidateController)
    │
    └─► startQuiz(@PathVariable Long quizId, @AuthenticationPrincipal UserDetails)
            │
            ▼
SERVICE LAYER (CandidateService)
    ├─► Extract candidate email from token
    │   └─► candidateEmail = userDetails.getUsername()
    │
    ├─► Step 1: Find quiz
    │   └─► Quiz quiz = quizRepository.findById(quizId)
    │       └─► If not found → throw RuntimeException("Quiz not found")
    │
    ├─► Step 2: Check if quiz is active
    │   └─► if (!quiz.getIsActive())
    │       └─► throw RuntimeException("Quiz is not active")
    │
    ├─► Step 3: Check for duplicate attempt
    │   └─► Optional<QuizAttempt> existing = 
    │           attemptRepository.findByQuizIdAndCandidateEmailAndStatus(
    │               quizId, candidateEmail, IN_PROGRESS
    │           )
    │       └─► SELECT * FROM quiz_attempts 
    │           WHERE quiz_id = ? AND candidate_email = ? AND status = 'IN_PROGRESS'
    │       └─► If exists → Return existing attempt (Resume)
    │       └─► If not exists → Create new
    │
    ├─► Step 4: Create new QuizAttempt
    │   ├─► attempt = new QuizAttempt()
    │   ├─► attempt.setQuiz(quiz)
    │   ├─► attempt.setCandidate(candidate)
    │   ├─► attempt.setStartedAt(LocalDateTime.now())
    │   ├─► attempt.setStatus(QuizAttempt.AttemptStatus.IN_PROGRESS)
    │   ├─► attempt.setScore(null) // Not evaluated yet
    │   └─► attempt.setSubmittedAt(null) // Not submitted yet
    │
    ├─► Step 5: Save attempt to database
    │   └─► attempt = attemptRepository.save(attempt)
    │       └─► INSERT INTO quiz_attempts (quiz_id, candidate_id, started_at, status)
    │           VALUES (?, ?, ?, ?)
    │
    ├─► Step 6: Fetch quiz with all questions and options
    │   └─► Load full quiz hierarchy:
    │       {
    │         "id": 7,
    │         "title": "Java Fundamentals",
    │         "duration": 30,
    │         "questions": [
    │           {
    │             "id": 101,
    │             "text": "What is JVM?",
    │             "type": "MCQ",
    │             "points": 5,
    │             "options": [
    │               {"id": 201, "text": "Java Virtual Machine"},
    │               {"id": 202, "text": "Java Verification Module"}
    │             ]
    │           }
    │         ]
    │       }
    │
    └─► Return AttemptResponse
            {
              "id": 35,          // Attempt ID
              "quizId": 7,
              "quizTitle": "Java Fundamentals",
              "startedAt": "2025-11-12T10:30:00",
              "submittedAt": null,
              "score": null,
              "totalPoints": 15,
              "status": "IN_PROGRESS"
            }
            │
            ▼
FRONTEND
    ├─► Save attemptId to state/context
    │   └─► setAttemptId(35)
    │
    ├─► Start timer
    │   ├─► Timer duration: quiz.duration * 60 (convert to seconds)
    │   ├─► Countdown timer displayed
    │   └─► When timer reaches 0 → Auto-submit
    │
    └─► Render quiz questions
        └─► For each question:
            ├─ Display question text
            ├─ For MCQ → Show radio buttons
            ├─ For TEXT → Show textarea
            └─ Store user selections in state
```

### 3. Submit Quiz Workflow

```
Candidate clicks "Submit Quiz" or timer ends

FRONTEND
    │
    ├─► Collect all answers from form state:
    │   {
    │     "answers": [
    │       {"questionId": 101, "selectedOptionId": 201, "textAnswer": null},
    │       {"questionId": 102, "selectedOptionId": null, "textAnswer": "..."}
    │     ]
    │   }
    │
    └─► POST /api/candidate/quizzes/submit
            Authorization: Bearer <candidate_token>
            Content-Type: application/json
            {
              "attemptId": 35,
              "answers": [
                {
                  "questionId": 101,
                  "selectedOptionId": 201,
                  "textAnswer": null
                },
                {
                  "questionId": 102,
                  "selectedOptionId": null,
                  "textAnswer": "Java is a high-level programming language"
                }
              ]
            }
            │
            ▼
BACKEND CONTROLLER (CandidateController)
    │
    └─► submitQuiz(@Valid @RequestBody SubmitRequest request,
                     @AuthenticationPrincipal UserDetails userDetails)
            │
            ▼
SERVICE LAYER (CandidateService)
    ├─► @Transactional (ensures atomic operation)
    │
    ├─► Extract candidate email from token
    │   └─► candidateEmail = userDetails.getUsername()
    │
    ├─► Step 1: Find attempt by ID
    │   └─► QuizAttempt attempt = attemptRepository.findById(request.attemptId())
    │       └─► If not found → throw RuntimeException("Attempt not found")
    │
    ├─► Step 2: Verify candidate ownership
    │   └─► if (!attempt.getCandidate().getId().equals(candidate.getId()))
    │       └─► throw RuntimeException("Unauthorized: Not your attempt")
    │       └─► This prevents candidate X from submitting attempt of candidate Y
    │
    ├─► Step 3: Check attempt status
    │   └─► if (attempt.getStatus() != IN_PROGRESS)
    │       └─► throw RuntimeException("Attempt already submitted")
    │
    ├─► Step 4: Initialize scoring
    │   ├─► totalScore = 0
    │   └─► totalPoints = quiz.questions.sum(q.points)
    │
    ├─► Step 5: Process each answer
    │   │
    │   └─► For each AnswerRequest in request.answers():
    │       │
    │       ├─► Find question by questionId
    │       │   └─► Question question = findQuestionById(answerReq.questionId())
    │       │
    │       ├─► Create Answer entity
    │       │   └─► Answer answer = new Answer()
    │       │       ├─► answer.setAttempt(attempt)
    │       │       └─► answer.setQuestion(question)
    │       │
    │       ├─► If MCQ type:
    │       │   │
    │       │   ├─► Find selected option
    │       │   │   └─► QuestionOption option = question.getOptions().stream()
    │       │   │       .filter(opt -> opt.getId() == answerReq.selectedOptionId)
    │       │   │       .findFirst()
    │       │   │
    │       │   ├─► answer.setSelectedOption(option)
    │       │   │
    │       │   ├─► Check if correct
    │       │   │   └─► if (option.getIsCorrect())
    │       │   │       ├─► totalScore += question.getPoints()
    │       │   │       └─► Example: +5 points
    │       │   │
    │       │   └─► Save answer to attempt
    │       │       └─► attempt.getAnswers().add(answer)
    │       │
    │       └─► If TEXT type:
    │           ├─► answer.setTextAnswer(answerReq.textAnswer())
    │           ├─► TEXT answers not auto-graded (manual review)
    │           └─► attempt.getAnswers().add(answer)
    │
    ├─► Step 6: Mark attempt as evaluated
    │   ├─► attempt.setScore(totalScore)
    │   ├─► attempt.setTotalPoints(totalPoints)
    │   ├─► attempt.setStatus(QuizAttempt.AttemptStatus.EVALUATED)
    │   └─► attempt.setSubmittedAt(LocalDateTime.now())
    │
    ├─► Step 7: Save all to database
    │   └─► @Transactional ensures:
    │       1. INSERT INTO answers (attempt_id, question_id, selected_option_id, ...)
    │       2. UPDATE quiz_attempts SET score = ?, status = 'EVALUATED', submitted_at = ?
    │       3. All-or-nothing: if any insert fails, all rollback
    │
    └─► Return ResultResponse
            {
              "attemptId": 35,
              "quizTitle": "Java Fundamentals",
              "score": 10,           // Correct answers * points
              "totalPoints": 15,
              "percentage": 66.67,   // (10/15)*100
              "startedAt": "2025-11-12T10:30:00",
              "submittedAt": "2025-11-12T11:00:00"
            }
            │
            ▼
FRONTEND
    ├─► Hide quiz form
    ├─► Show results page
    ├─► Display:
    │   ├─ Score: 10/15
    │   ├─ Percentage: 66.67%
    │   ├─ Pass/Fail badge
    │   └─ Time taken: 30 minutes
    └─► Show "View Detailed Results" link
```

---

## Results & Analytics Workflow

### 1. View Results Workflow

```
Candidate clicks "View Results"

FRONTEND
    │
    └─► GET /api/candidate/attempts/{attempt_id}
            Authorization: Bearer <candidate_token>
            │
            ▼
BACKEND SERVICE (CandidateService)
    ├─► Step 1: Find attempt
    │   └─► QuizAttempt attempt = attemptRepository.findById(attemptId)
    │
    ├─► Step 2: Verify ownership
    │   └─► if (!attempt.getCandidate().getEmail().equals(candidateEmail))
    │       └─► throw RuntimeException("Unauthorized")
    │
    ├─► Step 3: Check if evaluated
    │   └─► if (attempt.getStatus() != EVALUATED)
    │       └─► throw RuntimeException("Results not yet available")
    │
    ├─► Step 4: Load attempt with answers
    │   └─► fetch attempt.getAnswers()
    │       └─► Lazy loading triggers: SELECT answers WHERE attempt_id = ?
    │
    ├─► Step 5: Build response with question review
    │   │
    │   └─► For each answer:
    │       ├─► Get question details
    │       ├─► Get candidate's answer
    │       ├─► Get correct answer
    │       ├─► Show explanation (if MCQ)
    │       └─► Mark as correct/incorrect
    │
    └─► Return ResultDetailsResponse
            {
              "attemptId": 35,
              "quizTitle": "Java Fundamentals",
              "score": 10,
              "totalPoints": 15,
              "percentage": 66.67,
              "answers": [
                {
                  "questionId": 101,
                  "questionText": "What is JVM?",
                  "type": "MCQ",
                  "candidateAnswer": "Java Virtual Machine",
                  "correctAnswer": "Java Virtual Machine",
                  "isCorrect": true,
                  "points": 5,
                  "explanation": "JVM is the runtime environment that executes Java bytecode"
                },
                {
                  "questionId": 102,
                  "questionText": "Define polymorphism",
                  "type": "TEXT",
                  "candidateAnswer": "Ability to take multiple forms",
                  "isCorrect": null,  // Manual review needed
                  "points": 10
                }
              ]
            }
            │
            ▼
FRONTEND
    └─► Display results review page
        ├─► Show overall score
        ├─► Question-by-question breakdown
        ├─► Green checkmark for correct
        ├─► Red X for incorrect
        ├─► Show correct answer if wrong
        └─► Show explanations
```

### 2. View Attempt History Workflow

```
Candidate clicks "My Attempts" / "History"

FRONTEND
    │
    └─► GET /api/candidate/attempts
            Authorization: Bearer <candidate_token>
            │
            ▼
BACKEND SERVICE (CandidateService)
    ├─► Step 1: Find all attempts for candidate
    │   └─► List<QuizAttempt> attempts = attemptRepository.findByCandidateEmail(email)
    │       └─► SELECT * FROM quiz_attempts WHERE candidate_id = ? ORDER BY started_at DESC
    │
    ├─► Step 2: For each attempt, get:
    │   ├─► Quiz title
    │   ├─► Score (if evaluated)
    │   ├─► Status (IN_PROGRESS / EVALUATED)
    │   ├─► Started date
    │   ├─► Submitted date (if evaluated)
    │   └─► Time spent = submittedAt - startedAt
    │
    └─► Return List<AttemptHistoryResponse>
            [
              {
                "attemptId": 35,
                "quizId": 7,
                "quizTitle": "Java Fundamentals",
                "status": "EVALUATED",
                "score": 10,
                "totalPoints": 15,
                "percentage": 66.67,
                "startedAt": "2025-11-12T10:30:00",
                "submittedAt": "2025-11-12T11:00:00",
                "timeTaken": "30 minutes"
              },
              {
                "attemptId": 34,
                "quizId": 5,
                "quizTitle": "Spring Boot Basics",
                "status": "EVALUATED",
                "score": 18,
                "totalPoints": 20,
                "percentage": 90.0,
                "startedAt": "2025-11-10T14:00:00",
                "submittedAt": "2025-11-10T14:45:00",
                "timeTaken": "45 minutes"
              }
            ]
            │
            ▼
FRONTEND
    └─► Display attempts table/cards
        ├─► Quiz name
        ├─ Score with progress bar
        ├─ Status badge
        ├─ Attempt date
        └─ "View Results" button for each
```

---

## Database Transactions

### 1. Transaction Isolation

```
@Transactional on submitQuiz method:

Timeline of events:

T0: Transaction starts
    ├─► Attempt lock acquired (SELECT FOR UPDATE)
    │
T1: Read attempt from database
    └─► Load: attemptId=35, status=IN_PROGRESS, score=null
    
T2: Process answers (in-memory calculations)
    ├─► Calculate totalScore = 10
    └─► Calculate totalPoints = 15
    
T3: Modify attempt object
    ├─► attempt.setScore(10)
    ├─► attempt.setStatus(EVALUATED)
    └─► attempt.setSubmittedAt(now)
    
T4: Insert answers
    └─► INSERT INTO answers (...) VALUES (...) × 3 (for 3 answers)
    
T5: Update attempt
    └─► UPDATE quiz_attempts SET score=10, status='EVALUATED' WHERE id=35
    
T6: If all successful → COMMIT transaction
    └─► All changes persisted to database
    
T7: If any error → ROLLBACK transaction
    └─► All changes reverted to pre-transaction state
    └─► Database remains consistent
    └─► No orphaned records

Benefits:
✅ No partial updates (all-or-nothing)
✅ No duplicate submissions (pessimistic locking)
✅ ACID guarantees maintained
✅ Data consistency ensured
```

### 2. Referential Integrity

```
When deleting a quiz:

Database constraints (Foreign Keys):

quizzes
    ├── id (Primary Key)
    └── ...

questions
    ├── id (Primary Key)
    └── quiz_id → quizzes.id (Foreign Key)

question_options
    ├── id (Primary Key)
    └── question_id → questions.id (Foreign Key)

quiz_attempts
    ├── id (Primary Key)
    ├── quiz_id → quizzes.id (Foreign Key)
    └── candidate_id → users.id (Foreign Key)

answers
    ├── id (Primary Key)
    ├── attempt_id → quiz_attempts.id (Foreign Key)
    └── question_id → questions.id (Foreign Key)

Cascading Delete:
DELETE FROM quizzes WHERE id = 7
    │
    ├─► CASCADE: DELETE FROM questions WHERE quiz_id = 7
    │   │
    │   ├─► CASCADE: DELETE FROM question_options WHERE question_id IN (...)
    │   │
    │   └─► CASCADE: DELETE FROM answers WHERE question_id IN (...)
    │
    └─► CASCADE: DELETE FROM quiz_attempts WHERE quiz_id = 7
        │
        └─► CASCADE: DELETE FROM answers WHERE attempt_id IN (...)

Result: Complete cleanup, no orphaned records
```

---

## Security & Authorization

### 1. Authentication Flow

```
Login Request:
┌──────────────────────────────────────┐
│ POST /api/auth/login                 │
│ {email, password}                    │
└──────────────────────────────────────┘
           │
           ▼
AuthService.login(request)
    ├─► userRepository.findByEmail(email)
    │   └─► Query database for user
    │
    ├─► passwordEncoder.matches(plain, hashed)
    │   └─► BCrypt comparison
    │
    └─► jwtUtil.generateToken(email, role)
        └─► Create JWT with:
            • Header: {alg: HS256, typ: JWT}
            • Payload: {email, role, iat, exp}
            • Signature: HMAC-SHA256(secret)
            │
            ▼
Return JWT token
    │
    ▼
Frontend stores in localStorage
    │
    ▼
Subsequent requests include:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Authorization Flow

```
Protected Endpoint: GET /api/admin/quizzes

Incoming Request:
Authorization: Bearer <jwt_token>
    │
    ▼
JwtAuthenticationFilter
    ├─► Extract token from header
    │
    ├─► jwtUtil.validateToken(token)
    │   ├─► Verify signature using secret key
    │   ├─► Check expiration time
    │   └─► If invalid → throw SecurityException
    │
    ├─► Extract claims from token
    │   ├─► email = jwtUtil.getEmailFromToken(token)
    │   └─► role = jwtUtil.getRoleFromToken(token)
    │
    └─► Set SecurityContext
        └─► Create Authentication object with:
            • Principal: email (username)
            • Authorities: [ROLE_ADMIN]
            │
            ▼
SecurityConfig Authorization Rules
    │
    ├─► Check if path matches pattern
    │   └─► /api/admin/** requires ROLE_ADMIN
    │
    ├─► Check if user has required role
    │   └─► If user.role == "ADMIN" → Allow
    │   └─► If user.role == "CANDIDATE" → Deny (403 Forbidden)
    │
    └─► If authorized → Pass to Controller
        └─► @AuthenticationPrincipal UserDetails gives access to user info

Role-Based Access Control (RBAC):
┌──────────────────────────────────────────────┐
│ /api/admin/**                                │
│ → hasRole("ADMIN")                           │
│ → Only email with ADMIN role can access      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ /api/candidate/**                            │
│ → hasRole("CANDIDATE")                       │
│ → Only email with CANDIDATE role can access  │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ /api/auth/**                                 │
│ → permitAll()                                │
│ → Public endpoints, no authentication needed │
└──────────────────────────────────────────────┘
```

### 3. Data-Level Authorization

```
Example: Candidate submitting quiz answers

Authorization check in CandidateService.submitQuiz():

QuizAttempt attempt = attemptRepository.findById(attemptId)  // Assume id=35
    └─► Loaded: attempt.candidateId = 2

Candidate from token: candidate@example.com
    └─► userRepository.findByEmail(email)  
    └─► user.id = 2

Check:
if (!attempt.getCandidate().getId().equals(candidate.getId()))
    // attempt.candidateId = 2
    // candidate.id = 2
    // 2 == 2 ✓ PASS

Result: Candidate CAN submit their own attempt

Alternative scenario:
    Candidate A (id=2) trying to submit Candidate B's (id=5) attempt:
    // attempt.candidateId = 5
    // candidate.id = 2
    // 5 != 2 ✗ FAIL
    
    Result: throw RuntimeException("Unauthorized")
    Response: 403 Forbidden
```

---

## Error Handling

### 1. Validation Error Flow

```
Invalid Request:

POST /api/admin/quizzes
{
  "title": "",                    ← @NotBlank validation fails
  "description": "...",
  "duration": -5,                 ← @Min(1) validation fails
  "questions": []
}
    │
    ▼
Spring validates @Valid annotation
    │
    ├─► @NotBlank on title → FAIL
    │   └─► Error: "Title is required"
    │
    ├─► @Min(1) on duration → FAIL
    │   └─► Error: "Duration must be at least 1 minute"
    │
    └─► Throws MethodArgumentNotValidException
        │
        ▼
If GlobalExceptionHandler exists:
    │
    └─► handleValidationErrors(exception)
        └─► Return:
            {
              "status": 400,
              "message": "Validation failed",
              "errors": [
                "title: Title is required",
                "duration: Duration must be at least 1 minute"
              ]
            }

If no exception handler:
    │
    └─► Spring default: Generic 400 response
```

### 2. Business Logic Error Flow

```
Attempt to submit already-submitted quiz:

POST /api/candidate/quizzes/submit
{
  "attemptId": 35,
  "answers": [...]
}
    │
    ▼
CandidateService.submitQuiz()
    │
    ├─► QuizAttempt attempt = attemptRepository.findById(35)
    │   └─► Found: status = "EVALUATED"  (already submitted)
    │
    ├─► Check attempt status
    │   │
    │   └─► if (attempt.getStatus() != IN_PROGRESS)
    │       └─► throw RuntimeException("This attempt has already been submitted")
    │           │
    │           ▼
    │       Spring catches RuntimeException
    │           │
    │           ├─► If GlobalExceptionHandler: Return 400 with message
    │           └─► If no handler: Return 500 Internal Server Error
    │
    └─► Response:
        {
          "status": 400,
          "message": "This attempt has already been submitted"
        }
```

### 3. Authorization Error Flow

```
Candidate trying to access admin API:

GET /api/admin/quizzes
Authorization: Bearer <candidate_token>
    │
    ▼
JwtAuthenticationFilter
    │
    ├─► Extract and validate token
    │   └─► Success: token is valid
    │
    ├─► Extract claims
    │   ├─► email: candidate@example.com
    │   └─► role: CANDIDATE
    │
    └─► Set SecurityContext
        └─► Authentication with authorities: [ROLE_CANDIDATE]
            │
            ▼
SecurityConfig Authorization Check
    │
    ├─► Request path: /api/admin/quizzes
    │   └─► Requires: hasRole("ADMIN")
    │
    ├─► User authorities: [ROLE_CANDIDATE]
    │   └─► Doesn't have ROLE_ADMIN
    │
    └─► Deny access
        │
        ▼
Spring throws AccessDeniedException
    │
    └─► Response: 403 Forbidden
        {
          "status": 403,
          "message": "Access Denied"
        }
```

### 4. Authentication Error Flow

```
Missing or invalid JWT token:

GET /api/admin/quizzes
[No Authorization header]
    │
    ▼
JwtAuthenticationFilter
    │
    ├─► token = null
    │   └─► Skip token processing
    │
    └─► SecurityContext remains unauthenticated
            │
            ▼
Request reaches protected endpoint
    │
    └─► Security filter chain checks: authenticated()
        └─► User not authenticated
            │
            ▼
Spring throws AuthenticationException
    │
    └─► Response: 401 Unauthorized
        {
          "status": 401,
          "message": "Unauthorized - Please login"
        }
```

---

## Performance Optimization Points

### 1. N+1 Query Problem Prevention

```
Bad (N+1 queries):
List<Quiz> quizzes = quizRepository.findAll();
for (Quiz quiz : quizzes) {
    System.out.println(quiz.getCreatedBy().getName());  ← Triggers N queries
}
// Result: 1 query for quizzes + N queries for each creator

Good (Eager loading):
@Query("SELECT q FROM Quiz q JOIN FETCH q.createdBy")
List<Quiz> findAllWithCreator();
// Result: 1 query with JOIN

Or with annotation:
@ManyToOne(fetch = FetchType.EAGER)
private User createdBy;
```

### 2. Caching Strategy

```
Could implement caching for:

@Cacheable("quizzes")
public List<QuizSummaryResponse> getAllQuizzes() {
    // Cache result for 1 hour
    // Subsequent calls return cached value
}

@CacheEvict("quizzes")
public QuizResponse createQuiz(...) {
    // Invalidate cache when new quiz created
}
```

### 3. Pagination for Large Datasets

```
Instead of loading all quizzes:
GET /api/candidate/quizzes
// Could return 1000+ quizzes

Better with pagination:
GET /api/candidate/quizzes?page=0&size=10
// Returns only 10 quizzes per page
```

---

## Complete Request-Response Cycle Example

### Login → Quiz Taking → Submit → Results

```
┌────────────────────────────────────────────────────────────┐
│ COMPLETE USER JOURNEY                                      │
└────────────────────────────────────────────────────────────┘

TIME 10:00 AM
───────────

1️⃣ LOGIN
   Frontend: POST /api/auth/login
   Payload:  {email: "candidate@example.com", password: "candidate123"}
   
   Backend: AuthService.login()
   ├─► Find user by email: SELECT * FROM users WHERE email = ?
   ├─► Verify password: BCrypt.matches("candidate123", "$2a$10$...")
   ├─► Generate JWT: "eyJhbGc...HS256..."
   └─► Return token
   
   Frontend: Store token in localStorage
            Redirect to /candidate/dashboard

───────────

TIME 10:05 AM
───────────

2️⃣ VIEW AVAILABLE QUIZZES
   Frontend: GET /api/candidate/quizzes
            Authorization: Bearer eyJhbGc...
   
   Backend: CandidateService.getAvailableQuizzes()
   ├─► Query: SELECT * FROM quizzes WHERE is_active = true
   ├─► Check each quiz:
   │   ├─► SELECT * FROM quiz_attempts 
   │   │   WHERE quiz_id = 7 AND candidate_id = 2
   │   ├─► Status: "AVAILABLE" (not attempted)
   │   └─► Score: null
   └─► Return list of quizzes
   
   Frontend: Display quiz cards with "Start Quiz" buttons

───────────

TIME 10:10 AM
───────────

3️⃣ START QUIZ
   Frontend: POST /api/candidate/quizzes/7/start
            Authorization: Bearer eyJhbGc...
   
   Backend: CandidateService.startQuiz()
   ├─► Verify quiz exists and is active
   ├─► Check no IN_PROGRESS attempt exists
   ├─► Create: INSERT INTO quiz_attempts
   │   (quiz_id: 7, candidate_id: 2, status: 'IN_PROGRESS', started_at: now)
   ├─► Fetch quiz with questions: SELECT q FROM Quiz q JOIN FETCH q.questions
   └─► Return: attemptId=35, questions=[...]
   
   Frontend: Start 30-minute timer
            Display quiz form with questions

───────────

TIME 10:40 AM
───────────

4️⃣ SUBMIT QUIZ
   Frontend: Collect all answers from form
            Collect: Q1→Option1, Q2→"Text Answer", Q3→Option3
            POST /api/candidate/quizzes/submit
            {
              "attemptId": 35,
              "answers": [
                {"questionId": 101, "selectedOptionId": 201},
                {"questionId": 102, "textAnswer": "..."},
                {"questionId": 103, "selectedOptionId": 303}
              ]
            }
   
   Backend: @Transactional submitQuiz()
   ├─► BEGIN TRANSACTION
   ├─► Find attempt: SELECT * FROM quiz_attempts WHERE id = 35
   ├─► Verify candidate: 35.candidate_id (2) == current_user_id (2) ✓
   ├─► Check status: "IN_PROGRESS" ✓
   ├─► Initialize: totalScore = 0, totalPoints = 15
   ├─► Process each answer:
   │   ├─► Q1: Find option 201, check isCorrect=true → score += 5
   │   ├─► Q2: TEXT answer, store as-is
   │   └─► Q3: Find option 303, check isCorrect=false → score += 0
   ├─► INSERT INTO answers (3 records)
   ├─► UPDATE quiz_attempts SET score=5, status='EVALUATED', submitted_at=now
   ├─► COMMIT TRANSACTION
   └─► Return: score=5, totalPoints=15, percentage=33.3%
   
   Frontend: Hide timer
            Show results page: "Score: 5/15 (33.3%)"
            Show "View Detailed Results" button

───────────

TIME 10:41 AM
───────────

5️⃣ VIEW RESULTS
   Frontend: GET /api/candidate/attempts/35
            Authorization: Bearer eyJhbGc...
   
   Backend: CandidateService.getAttemptDetails()
   ├─► Find attempt and verify ownership
   ├─► Load answers: SELECT a FROM Answer a WHERE attempt_id = 35
   ├─► For each answer:
   │   ├─► Get question details
   │   ├─► Compare answer with correct answer
   │   └─► Mark correct/incorrect
   └─► Return: detailed results with explanations
   
   Frontend: Display review page:
            ├─► Q1: "What is JVM?" → Your answer: "Java Virtual Machine" ✓
            ├─► Q2: "Define OOP" → Your answer: "..." (not graded - text)
            └─► Q3: "Inheritance is..." → Your answer: "Wrong" ✗

───────────

TIME 10:42 AM
───────────

6️⃣ VIEW ATTEMPT HISTORY
   Frontend: GET /api/candidate/attempts
            Authorization: Bearer eyJhbGc...
   
   Backend: CandidateService.getAttemptHistory()
   ├─► Query: SELECT a FROM QuizAttempt a 
   │          WHERE candidate_id = 2
   │          ORDER BY started_at DESC
   ├─► For each:
   │   ├─► Get quiz title
   │   ├─► Get score if evaluated
   │   └─► Calculate time spent
   └─► Return: List of attempts
   
   Frontend: Display history table:
            [Attempt 35] Java Quiz - Score: 5/15 - Started: 10:10 - Submitted: 10:40

```

---

## Summary for Project Review

### ✅ Implemented Features

1. **Authentication**
   - ✅ User login with email/password
   - ✅ BCrypt password hashing
   - ✅ JWT token generation
   - ✅ Token validation on protected routes

2. **Admin Features**
   - ✅ Create quizzes with questions and options
   - ✅ Update quiz details
   - ✅ Delete quizzes
   - ✅ View quiz analytics
   - ✅ Get all quizzes

3. **Candidate Features**
   - ✅ View available quizzes
   - ✅ Start quiz (create attempt)
   - ✅ Submit answers
   - ✅ View results with score
   - ✅ View attempt history
   - ✅ View detailed results

4. **Security**
   - ✅ Role-based access control (ADMIN/CANDIDATE)
   - ✅ JWT authentication
   - ✅ Authorization checks
   - ✅ Data-level authorization (users can only see their own data)

5. **Database**
   - ✅ Transactional operations
   - ✅ Referential integrity (Foreign keys)
   - ✅ Cascading deletes
   - ✅ Proper indexing

### ⚠️ Not Fully Implemented

1. **Manual Grading for Text Questions** - AUTO disabled
2. **Question Difficulty Tracking** - Not stored
3. **Quiz Categories/Tags** - Not implemented
4. **Question Import/Export** - Not implemented
5. **Quiz Scheduling** - Not time-based, manual only
6. **Email Notifications** - Not implemented
7. **File Uploads** - Not implemented
8. **Question Bank** - Not implemented
9. **Leaderboards** - Not implemented
10. **Quiz Previews** - Not implemented

