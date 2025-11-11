# 🎓 Backend Workflow & Working Guide

> **Purpose:** Teach you HOW the backend actually works - not just WHAT the code does
> 
> **Reading Time:** 30-40 minutes
> 
> **Perfect for:** Understanding the big picture and workflow

---

## 🎯 What You'll Learn

By the end of this guide, you'll understand:
- ✅ How a request flows through the entire system
- ✅ Which files talk to which files
- ✅ Why things are organized this way
- ✅ The complete workflow from login to quiz submission
- ✅ How security protects everything

---

# Part 1: The Big Picture

## 🏗️ The Architecture (Simple View)

```
Frontend (React)
    ↓ HTTP Request
┌─────────────────────────────────────────┐
│         Spring Boot Backend              │
│                                          │
│  1. Controller  (receives request)      │
│        ↓                                 │
│  2. Security    (checks JWT token)      │
│        ↓                                 │
│  3. Service     (business logic)        │
│        ↓                                 │
│  4. Repository  (database queries)      │
│        ↓                                 │
│  5. Database    (PostgreSQL)            │
└─────────────────────────────────────────┘
    ↑
    Response (JSON)
```

## 📦 What Each Layer Does

### **Controllers** (The Receptionists)
- **Job:** Receive HTTP requests, send HTTP responses
- **Files:** `AuthController`, `AdminController`, `CandidateController`
- **They DON'T:** Do business logic or talk to database
- **They DO:** Validate input, call services, format responses

### **Services** (The Brain)
- **Job:** Business logic - "Should this happen? How should it work?"
- **Files:** `AuthService`, `AdminService`, `CandidateService`
- **They DON'T:** Know about HTTP or JSON
- **They DO:** Make decisions, coordinate operations, call repositories

### **Repositories** (The Librarians)
- **Job:** Talk to the database
- **Files:** `UserRepository`, `QuizRepository`, `QuestionRepository`, etc.
- **They DON'T:** Make business decisions
- **They DO:** Run queries, fetch/save data

### **Models** (The Data Structures)
- **Job:** Represent database tables as Java objects
- **Files:** `User`, `Quiz`, `Question`, `Option`, `QuizAttempt`, `Answer`
- **They ARE:** The actual data structure
- **They HAVE:** Relationships between entities

### **DTOs** (The Messengers)
- **Job:** Carry data between frontend and backend
- **Files:** `LoginRequest`, `QuizResponse`, etc. (13 total)
- **They DON'T:** Have business logic
- **They DO:** Shape the data for transport

### **Security** (The Bouncer)
- **Job:** Check who you are and what you can do
- **Files:** `SecurityConfig`, `JwtUtil`, `JwtRequestFilter`
- **They DON'T:** Handle business logic
- **They DO:** Verify JWT tokens, protect endpoints

---

# Part 2: Complete Workflow Examples

## 🔐 Workflow 1: User Login

Let's follow a login request step-by-step:

### Step 1: Frontend Sends Request
```javascript
// Frontend code
POST /api/auth/login
Body: {
  "email": "admin@quiz.com",
  "password": "admin123"
}
```

### Step 2: Request Hits Controller
```
File: AuthController.java
Method: login()

What happens:
1. Spring Boot receives POST request at /api/auth/login
2. Converts JSON to LoginRequest object
3. Passes to AuthService.login()
```

**Code Location:**
```java
// backend/src/main/java/com/quizforge/controller/AuthController.java
@PostMapping("/login")
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
}
```

### Step 3: Service Handles Business Logic
```
File: AuthService.java
Method: login()

What happens:
1. Calls AuthenticationManager to verify credentials
2. If valid, generates JWT token using JwtUtil
3. Fetches user details from database
4. Creates LoginResponse with token and user info
5. Returns response
```

**Code Location:**
```java
// backend/src/main/java/com/quizforge/service/AuthService.java
public LoginResponse login(LoginRequest request) {
    // Verify password
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getEmail(),
            request.getPassword()
        )
    );
    
    // Generate JWT token
    String token = jwtUtil.generateToken(request.getEmail());
    
    // Fetch user details
    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
    // Return response with token
    return new LoginResponse(token, user.getId(), user.getEmail(), user.getRole());
}
```

### Step 4: Repository Queries Database
```
File: UserRepository.java
Method: findByEmail()

What happens:
1. Spring Data JPA generates SQL query
2. Runs: SELECT * FROM users WHERE email = 'admin@quiz.com'
3. Returns User object
```

**Code Location:**
```java
// backend/src/main/java/com/quizforge/repository/UserRepository.java
Optional<User> findByEmail(String email);
```

### Step 5: Response Sent Back
```
Response: 200 OK
Body: {
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "userId": 1,
  "email": "admin@quiz.com",
  "role": "ADMIN"
}
```

### Step 6: Frontend Stores Token
```javascript
// Frontend stores token in localStorage
localStorage.setItem('token', response.token);

// All future requests include this token:
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR...'
}
```

---

## 📝 Workflow 2: Admin Creates Quiz

Now let's see a protected operation that requires authentication:

### Step 1: Frontend Sends Request (with JWT)
```javascript
POST /api/admin/quizzes
Headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR...'
}
Body: {
  "title": "Java Basics",
  "description": "Test your Java knowledge",
  "duration": 30,
  "passingScore": 70,
  "questions": [...]
}
```

### Step 2: Security Filter Intercepts
```
File: JwtRequestFilter.java
Method: doFilterInternal()

What happens:
1. Extract JWT token from Authorization header
2. Validate token using JwtUtil.validateToken()
3. Extract email from token
4. Load user details from database
5. Set authentication in SecurityContext
6. Pass request to controller
```

**Code Location:**
```java
// backend/src/main/java/com/quizforge/security/JwtRequestFilter.java
@Override
protected void doFilterInternal(HttpServletRequest request, 
                                HttpServletResponse response, 
                                FilterChain chain) {
    // Extract token
    String token = extractToken(request);
    
    if (token != null && jwtUtil.validateToken(token)) {
        // Get username from token
        String username = jwtUtil.extractUsername(token);
        
        // Load user and set authentication
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities()
            );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
    
    chain.doFilter(request, response);
}
```

### Step 3: Security Config Checks Role
```
File: SecurityConfig.java

What happens:
1. Spring Security checks if endpoint /api/admin/** requires role
2. Configuration says: only ADMIN role allowed
3. Current user has ADMIN role → Access granted
4. If user had CANDIDATE role → 403 Forbidden
```

**Code Location:**
```java
// backend/src/main/java/com/quizforge/config/SecurityConfig.java
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/admin/**").hasRole("ADMIN")  // ← Checks here
    .requestMatchers("/api/candidate/**").hasRole("CANDIDATE")
    .anyRequest().authenticated()
);
```

### Step 4: Controller Receives Request
```
File: AdminController.java
Method: createQuiz()

What happens:
1. Spring Boot routes request to createQuiz()
2. Validates CreateQuizRequest (checks required fields)
3. Gets authenticated user email from SecurityContext
4. Calls AdminService.createQuiz()
```

**Code Location:**
```java
// backend/src/main/java/com/quizforge/controller/AdminController.java
@PostMapping("/quizzes")
public ResponseEntity<QuizResponse> createQuiz(
    @Valid @RequestBody CreateQuizRequest request,
    @AuthenticationPrincipal UserDetails userDetails
) {
    QuizResponse response = adminService.createQuiz(request, userDetails.getUsername());
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

### Step 5: Service Creates Quiz
```
File: AdminService.java
Method: createQuiz()

What happens:
1. Fetch admin user from database
2. Create new Quiz object
3. Set quiz properties from request
4. Create Question objects for each question
5. Create Option objects for each option
6. Link everything together (relationships)
7. Save quiz to database (saves questions/options too - cascade)
8. Convert to QuizResponse DTO
9. Return response
```

**Code Location:**
```java
// backend/src/main/java/com/quizforge/service/AdminService.java
@Transactional
public QuizResponse createQuiz(CreateQuizRequest request, String adminEmail) {
    // 1. Get admin user
    User admin = userRepository.findByEmail(adminEmail)
        .orElseThrow(() -> new UsernameNotFoundException("Admin not found"));
    
    // 2. Create quiz
    Quiz quiz = new Quiz();
    quiz.setTitle(request.getTitle());
    quiz.setDescription(request.getDescription());
    quiz.setDuration(request.getDuration());
    quiz.setPassingScore(request.getPassingScore());
    quiz.setCreatedBy(admin);
    
    // 3. Create questions and options
    List<Question> questions = new ArrayList<>();
    for (QuestionRequest qReq : request.getQuestions()) {
        Question question = new Question();
        question.setText(qReq.getText());
        question.setPoints(qReq.getPoints());
        question.setQuiz(quiz);  // ← Link to quiz
        
        List<Option> options = new ArrayList<>();
        for (OptionRequest oReq : qReq.getOptions()) {
            Option option = new Option();
            option.setText(oReq.getText());
            option.setCorrect(oReq.isCorrect());
            option.setQuestion(question);  // ← Link to question
            options.add(option);
        }
        question.setOptions(options);
        questions.add(question);
    }
    quiz.setQuestions(questions);
    
    // 4. Save to database (cascade saves questions and options)
    Quiz savedQuiz = quizRepository.save(quiz);
    
    // 5. Convert to response DTO
    return convertToQuizResponse(savedQuiz);
}
```

### Step 6: Repository Saves to Database
```
File: QuizRepository.java

What happens:
1. Spring Data JPA generates INSERT statements
2. Saves Quiz first (gets ID)
3. Saves Questions (linking to Quiz via quiz_id)
4. Saves Options (linking to Question via question_id)
5. All in one transaction (all or nothing)
```

**SQL Generated:**
```sql
-- Insert Quiz
INSERT INTO quizzes (title, description, duration, passing_score, created_by_id, created_at)
VALUES ('Java Basics', 'Test your Java knowledge', 30, 70, 1, NOW());

-- Insert Questions
INSERT INTO questions (text, points, quiz_id)
VALUES ('What is Java?', 10, 1);

-- Insert Options
INSERT INTO options (text, is_correct, question_id)
VALUES ('A programming language', true, 1);
```

### Step 7: Response Sent Back
```
Response: 201 CREATED
Body: {
  "id": 1,
  "title": "Java Basics",
  "description": "Test your Java knowledge",
  "duration": 30,
  "passingScore": 70,
  "questions": [...],
  "createdAt": "2025-11-10T10:30:00"
}
```

---

## 🎯 Workflow 3: Candidate Takes Quiz

This is the most complex workflow - let's break it down:

### Step 1: Candidate Starts Quiz
```javascript
POST /api/candidate/quiz-attempts
Headers: { 'Authorization': 'Bearer <token>' }
Body: {
  "quizId": 1
}
```

### Step 2: Service Creates Quiz Attempt
```
File: CandidateService.java
Method: startQuiz()

What happens:
1. Fetch candidate user
2. Fetch quiz details
3. Create new QuizAttempt object
4. Set status = IN_PROGRESS
5. Set startTime = now
6. Save to database
7. Return quiz with questions
```

**Database State After Start:**
```sql
-- New record in quiz_attempts table
quiz_id: 1
candidate_id: 2
status: IN_PROGRESS
start_time: 2025-11-10 10:30:00
score: NULL
passed: NULL
```

### Step 3: Candidate Answers Questions
```javascript
// Candidate selects answers in frontend
// When done, submits all answers:
POST /api/candidate/quiz-attempts/1/submit
Body: {
  "answers": [
    { "questionId": 1, "selectedOptionId": 3 },
    { "questionId": 2, "selectedOptionId": 7 },
    { "questionId": 3, "selectedOptionId": 11 }
  ]
}
```

### Step 4: Service Grades Quiz
```
File: CandidateService.java
Method: submitQuiz()

What happens:
1. Fetch quiz attempt
2. Check if already submitted → Error if yes
3. Check time limit → Error if exceeded
4. For each answer:
   - Save Answer object
   - Check if correct option selected
   - Add points if correct
5. Calculate total score
6. Check if passed (score >= passingScore)
7. Update QuizAttempt:
   - status = COMPLETED
   - score = total
   - passed = true/false
   - endTime = now
8. Save everything
9. Return results
```

**Code Logic:**
```java
@Transactional
public QuizResultResponse submitQuiz(Long attemptId, SubmitQuizRequest request) {
    // 1. Get attempt
    QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
        .orElseThrow(() -> new RuntimeException("Attempt not found"));
    
    // 2. Validate
    if (attempt.getStatus() == AttemptStatus.COMPLETED) {
        throw new RuntimeException("Quiz already submitted");
    }
    
    // Check time
    long elapsedMinutes = Duration.between(
        attempt.getStartTime(), 
        LocalDateTime.now()
    ).toMinutes();
    if (elapsedMinutes > attempt.getQuiz().getDuration()) {
        throw new RuntimeException("Time limit exceeded");
    }
    
    // 3. Grade answers
    int totalScore = 0;
    List<Answer> answers = new ArrayList<>();
    
    for (AnswerRequest answerReq : request.getAnswers()) {
        // Fetch question and selected option
        Question question = questionRepository.findById(answerReq.getQuestionId())
            .orElseThrow(() -> new RuntimeException("Question not found"));
        
        Option selectedOption = optionRepository.findById(answerReq.getSelectedOptionId())
            .orElseThrow(() -> new RuntimeException("Option not found"));
        
        // Create answer record
        Answer answer = new Answer();
        answer.setQuizAttempt(attempt);
        answer.setQuestion(question);
        answer.setSelectedOption(selectedOption);
        
        // Check if correct
        if (selectedOption.isCorrect()) {
            totalScore += question.getPoints();
        }
        
        answers.add(answer);
    }
    
    // 4. Save all answers
    answerRepository.saveAll(answers);
    
    // 5. Update attempt
    attempt.setStatus(AttemptStatus.COMPLETED);
    attempt.setScore(totalScore);
    attempt.setPassed(totalScore >= attempt.getQuiz().getPassingScore());
    attempt.setEndTime(LocalDateTime.now());
    
    quizAttemptRepository.save(attempt);
    
    // 6. Return results
    return convertToResultResponse(attempt);
}
```

### Step 5: Database Final State
```sql
-- quiz_attempts table updated
id: 1
status: COMPLETED
score: 25
passed: true
end_time: 2025-11-10 10:55:00

-- answers table (new records)
id | quiz_attempt_id | question_id | selected_option_id
1  | 1               | 1           | 3
2  | 1               | 2           | 7
3  | 1               | 3           | 11
```

### Step 6: Response to Frontend
```json
{
  "attemptId": 1,
  "quizTitle": "Java Basics",
  "score": 25,
  "totalPoints": 30,
  "passingScore": 70,
  "passed": true,
  "timeTaken": 25,
  "answers": [
    {
      "questionText": "What is Java?",
      "selectedOption": "A programming language",
      "correctOption": "A programming language",
      "isCorrect": true,
      "points": 10
    },
    ...
  ]
}
```

---

# Part 3: Understanding Relationships

## 🔗 How Entities Connect

### Entity Relationship Map
```
User
  ↓ OneToMany (createdBy)
Quiz
  ↓ OneToMany (quiz)
Question
  ↓ OneToMany (question)
Option

User (candidate)
  ↓ OneToMany (candidate)
QuizAttempt
  ↓ OneToMany (quizAttempt)
Answer → ManyToOne → Question
Answer → ManyToOne → Option
```

### Example: Creating a Quiz Cascade

When you save a Quiz object:
```java
Quiz quiz = new Quiz();
quiz.setTitle("Java Basics");

Question q1 = new Question();
q1.setText("What is Java?");
q1.setQuiz(quiz);  // ← Link to parent

Option o1 = new Option();
o1.setText("A language");
o1.setQuestion(q1);  // ← Link to parent

quiz.setQuestions(List.of(q1));
q1.setOptions(List.of(o1));

quizRepository.save(quiz);  // ← Saves EVERYTHING (cascade)
```

Spring JPA automatically:
1. Inserts Quiz first (gets ID)
2. Inserts Question with quiz_id
3. Inserts Option with question_id

**Why this works:** `@OneToMany(cascade = CascadeType.ALL)` annotation

---

## 🔄 The Request-Response Cycle

### Complete Flow Diagram
```
Frontend                 Backend                    Database
   │                        │                          │
   │  1. HTTP Request      │                          │
   ├──────────────────────→│                          │
   │  (JSON + JWT)         │                          │
   │                        │                          │
   │                   2. Security Filter             │
   │                        │                          │
   │                   3. Validate JWT                │
   │                        │                          │
   │                   4. Controller                  │
   │                        │                          │
   │                   5. Service                     │
   │                        ├─────────────────────────→│
   │                        │  6. SQL Query            │
   │                        │←─────────────────────────┤
   │                        │  7. Data                 │
   │                        │                          │
   │                   8. Build Response              │
   │                        │                          │
   │  9. HTTP Response     │                          │
   │←──────────────────────┤                          │
   │  (JSON)               │                          │
```

---

# Part 4: Key Concepts Explained

## 🔑 1. DTOs vs Models

### Models (Entities)
```java
// User.java - Represents database table
@Entity
@Table(name = "users")
public class User {
    @Id
    private Long id;
    private String email;
    private String password;  // ← We DON'T want to send this!
    private Role role;
    
    // Relationships
    @OneToMany(mappedBy = "createdBy")
    private List<Quiz> createdQuizzes;
}
```

**Problem:** If we send this to frontend:
- Password is exposed! 🚨
- Circular references (Quiz → User → Quiz) cause infinite loop 🔄
- Too much unnecessary data

### DTOs (Data Transfer Objects)
```java
// UserResponse.java - Only what frontend needs
public class UserResponse {
    private Long id;
    private String email;
    private String role;
    // No password!
    // No relationships!
}
```

**Solution:** Convert Model → DTO before sending:
```java
public UserResponse convertToDTO(User user) {
    return new UserResponse(
        user.getId(),
        user.getEmail(),
        user.getRole().toString()
    );
}
```

---

## 🔑 2. Transactions Explained

### What is @Transactional?
```java
@Transactional
public QuizResponse createQuiz(CreateQuizRequest request) {
    // Multiple database operations
    Quiz quiz = quizRepository.save(quiz);        // Operation 1
    questionRepository.saveAll(questions);        // Operation 2
    optionRepository.saveAll(options);            // Operation 3
    
    // If ANY operation fails, ALL are rolled back
}
```

**Without @Transactional:**
- Quiz saved ✅
- Questions saved ✅
- Options failed ❌
- Result: Incomplete data in database! 🚨

**With @Transactional:**
- Quiz saved ✅
- Questions saved ✅
- Options failed ❌
- Result: Everything rolled back, database unchanged ✅

---

## 🔑 3. JWT Authentication Flow

### Initial Login
```
1. User sends email + password
2. Backend verifies credentials
3. Backend generates JWT token
4. Frontend stores token
```

### Authenticated Requests
```
1. Frontend sends request with token in header
2. JwtRequestFilter extracts token
3. JwtUtil validates token (signature, expiry)
4. If valid: Set authentication in SecurityContext
5. Controller method executes
6. If invalid: Return 401 Unauthorized
```

### What's Inside a JWT Token?
```json
{
  "sub": "admin@quiz.com",      // Subject (user email)
  "iat": 1699618200,             // Issued at timestamp
  "exp": 1699704600,             // Expiry timestamp
  "role": "ADMIN"                // User role
}
```

Token Structure:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header
.
eyJzdWIiOiJhZG1pbkBxdWl6LmNvbSIsImlh   ← Payload (data above)
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV    ← Signature (prevents tampering)
```

---

## 🔑 4. Dependency Injection

### What is @Autowired?
```java
@RestController
public class AdminController {
    
    @Autowired  // ← Spring automatically provides AdminService
    private AdminService adminService;
    
    // You DON'T write:
    // adminService = new AdminService();
    
    // Spring creates ONE instance and injects it
}
```

### Why This Matters
```
Without DI:
- Controller creates new Service
- Service creates new Repository
- Multiple instances, hard to manage

With DI:
- Spring creates ONE instance of each
- Injects where needed
- Easy to test (can inject mock)
- Easy to manage
```

---

## 🔑 5. Exception Handling

### How Errors are Handled
```java
// In Service
public QuizResponse getQuiz(Long id) {
    return quizRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Quiz not found"));
        // ← If not found, throw exception
}

// Spring catches exception and returns:
{
  "status": 500,
  "error": "Internal Server Error",
  "message": "Quiz not found"
}
```

### Better: Custom Exception Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(RuntimeException ex) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }
}
```

---

# Part 5: Common Patterns

## Pattern 1: Repository Pattern

```java
// Instead of writing SQL everywhere:
String sql = "SELECT * FROM users WHERE email = ?";

// Use Repository:
Optional<User> user = userRepository.findByEmail(email);
```

**Benefits:**
- No SQL code in service layer
- Spring generates queries automatically
- Easy to change database later

---

## Pattern 2: Service Pattern

```java
// Controller doesn't do business logic:
@PostMapping("/quizzes")
public ResponseEntity<QuizResponse> createQuiz(@RequestBody CreateQuizRequest request) {
    return ResponseEntity.ok(adminService.createQuiz(request));
    // ← Just delegates to service
}

// Service handles complexity:
public QuizResponse createQuiz(CreateQuizRequest request) {
    // Validate
    // Create objects
    // Save to database
    // Return response
}
```

**Benefits:**
- Controller stays simple
- Logic reusable
- Easy to test

---

## Pattern 3: DTO Pattern

```java
// Request comes in:
CreateQuizRequest (DTO) 
    ↓
// Convert to entity:
Quiz (Entity)
    ↓
// Save to database
    ↓
// Convert to response:
QuizResponse (DTO)
    ↓
// Send to frontend
```

**Benefits:**
- Frontend doesn't see database structure
- Can change database without breaking API
- Control what data is exposed

---

# Part 6: Putting It All Together

## 🎯 Complete System Flow

### Startup (What happens when you run the app)
```
1. Spring Boot starts
2. Reads application.properties
3. Connects to PostgreSQL database
4. Scans for @Component, @Service, @Repository
5. Creates singleton instances (Dependency Injection)
6. Configures security (JWT filters, role checks)
7. Registers API endpoints
8. Starts embedded Tomcat server on port 8080
9. Ready to accept requests!
```

### First Request (No Authentication)
```
POST /api/auth/register
    ↓
SecurityConfig: "/api/auth/**" → permitAll()
    ↓
AuthController.register()
    ↓
AuthService.register()
    ↓
UserRepository.save()
    ↓
Database: INSERT into users
    ↓
Response: { "message": "User registered" }
```

### Authenticated Request
```
GET /api/candidate/quizzes
    ↓
JwtRequestFilter: Extract and validate token
    ↓
SecurityConfig: "/api/candidate/**" → hasRole("CANDIDATE")
    ↓
Check user role from token
    ↓
✅ CANDIDATE role → Allow
❌ ADMIN role → 403 Forbidden
    ↓
CandidateController.getQuizzes()
    ↓
CandidateService.getAllQuizzes()
    ↓
QuizRepository.findAll()
    ↓
Database: SELECT * FROM quizzes
    ↓
Convert Quiz → QuizResponse (DTO)
    ↓
Response: [ { quiz1 }, { quiz2 }, ... ]
```

---

## 🏁 Summary: The Complete Picture

### Data Flow
```
JSON (Frontend)
    ↓ HTTP
Request DTO
    ↓ Controller
Service Layer
    ↓ Repository
Entity (Model)
    ↓ JPA
SQL
    ↓ Database
PostgreSQL Table
    ↑ Query Result
Entity (Model)
    ↑ Repository
Service Layer
    ↑ Conversion
Response DTO
    ↑ Controller
JSON (Frontend)
```

### Security Flow
```
Request with JWT Token
    ↓
JwtRequestFilter extracts token
    ↓
JwtUtil validates token
    ↓
Extract email and role from token
    ↓
Load UserDetails from database
    ↓
Set Authentication in SecurityContext
    ↓
SecurityConfig checks role requirements
    ↓
✅ Authorized → Continue to Controller
❌ Unauthorized → 403 Forbidden
```

### File Organization
```
controller/       ← HTTP endpoints
    ↓ calls
service/          ← Business logic
    ↓ calls
repository/       ← Database queries
    ↓ returns
model/            ← Entity objects
    ↓ converted to
dto/              ← Response objects
    ↓ sent as
JSON              ← Frontend receives
```

---

# Part 7: Quick Reference

## 🔍 "I Need To..." Guide

### "I need to add a new API endpoint"
1. Create DTO classes (request/response) in `dto/`
2. Add method in Controller with `@GetMapping/@PostMapping`
3. Implement logic in Service
4. Test with Postman/Frontend

### "I need to add a new database table"
1. Create Entity class in `model/` with `@Entity`
2. Add relationships with `@OneToMany/@ManyToOne`
3. Create Repository interface in `repository/`
4. Spring will create table automatically

### "I need to protect an endpoint"
1. Add endpoint pattern in `SecurityConfig`
2. Specify required role with `.hasRole("ADMIN")`
3. Ensure JWT token is sent from frontend
4. Test authorization

### "I need to run a custom query"
1. Add method in Repository with `@Query`
2. Write JPQL or native SQL
3. Call from Service

### "I need to validate input"
1. Add validation annotations to DTO:
   - `@NotNull`, `@NotBlank`, `@Email`, `@Size`
2. Use `@Valid` in Controller method parameter
3. Spring validates automatically

---

## 📊 Cheat Sheet: Annotations

| Annotation | Where | Purpose |
|------------|-------|---------|
| `@RestController` | Controller class | Makes class handle HTTP requests |
| `@Service` | Service class | Marks as business logic component |
| `@Repository` | Repository interface | Marks as data access component |
| `@Entity` | Model class | Marks as database table |
| `@Autowired` | Any class field | Inject dependency |
| `@GetMapping` | Controller method | Handle GET requests |
| `@PostMapping` | Controller method | Handle POST requests |
| `@RequestBody` | Method parameter | Extract JSON from request body |
| `@PathVariable` | Method parameter | Extract value from URL path |
| `@Valid` | Method parameter | Validate input |
| `@Transactional` | Service method | Wrap in database transaction |
| `@OneToMany` | Entity field | One-to-many relationship |
| `@ManyToOne` | Entity field | Many-to-one relationship |
| `@JoinColumn` | Entity field | Specify foreign key column |

---

## 🎓 Learning Path

### Level 1: Understand the Flow
1. Read this guide (you're here!)
2. Trace one complete workflow (login)
3. Look at actual code for that workflow

### Level 2: Understand Each Layer
1. Study Models (01_MODELS_LINE_BY_LINE.md)
2. Study DTOs (DTO_PACKAGE_COMPLETE.md)
3. Study Repositories (REPOSITORY_PACKAGE_COMPLETE.md)
4. Study Services (SERVICE_PACKAGE_COMPLETE.md)
5. Study Controllers (ALL_PACKAGES_COMPLETE.md)
6. Study Security (02_SECURITY_LINE_BY_LINE.md)

### Level 3: Make Changes
1. Add a new endpoint
2. Add a new field to entity
3. Add custom validation
4. Test everything

---

## 🚀 Next Steps

Now that you understand the workflow:

**For Implementation Details:**
- Models: Read `01_MODELS_LINE_BY_LINE.md`
- Security: Read `02_SECURITY_LINE_BY_LINE.md`
- DTOs: Read `DTO_PACKAGE_COMPLETE.md`
- Repositories: Read `REPOSITORY_PACKAGE_COMPLETE.md`
- Services: Read `SERVICE_PACKAGE_COMPLETE.md`
- Controllers: Read `ALL_PACKAGES_COMPLETE.md`

**For Quick Reference:**
- Master index: `INDEX.md`
- Navigation map: `NAVIGATION.md`
- Entry guide: `START_HERE.md`

---

## ❓ FAQ

**Q: Why do we need DTOs if we have Models?**
A: Models represent database structure (with passwords, relationships). DTOs represent API structure (safe, no circular references).

**Q: Why does security happen before controller?**
A: Filter chain processes request first. Security must check authentication before allowing controller to run.

**Q: What's the difference between @Autowired and new?**
A: `new` creates new instance each time. `@Autowired` uses Spring-managed singleton (one instance reused everywhere).

**Q: Why @Transactional?**
A: Ensures all database operations succeed together or fail together. Prevents incomplete data.

**Q: How does Spring know which method to call for an endpoint?**
A: Spring scans for `@GetMapping("/path")` and maps HTTP requests to methods.

**Q: What if two methods have same path?**
A: Different HTTP methods (GET vs POST) = different endpoints. Same path + method = error.

**Q: How do relationships work?**
A: `@OneToMany` means one Quiz has many Questions. Spring maintains foreign keys automatically.

---

## 🎉 Congratulations!

You now understand:
✅ How requests flow through the system
✅ What each layer does
✅ How security protects endpoints
✅ How data moves from frontend to database and back
✅ Why the code is organized this way
✅ Common patterns and best practices

**You're ready to read the detailed documentation files!**

---

*Created: November 10, 2025*  
*For: QuizForge Backend*  
*Reading Time: 30-40 minutes*
