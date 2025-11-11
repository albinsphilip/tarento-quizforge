# QuizForge Backend - Service Package (Complete Line-by-Line)

> **Every Business Logic Service explained line-by-line - Core Application Logic**

---

## 📁 Package: `com.quizforge.service`

**Location:** `backend/src/main/java/com/quizforge/service/`  
**Purpose:** Business logic layer between controllers and repositories  
**Pattern:** Service layer pattern  
**Total Files:** 3  
**Total Lines:** ~380

### Service Layer Responsibilities

1. **Business Logic:** Core application rules and workflows
2. **Transaction Management:** `@Transactional` for data consistency
3. **Data Transformation:** Entity ↔ DTO conversion
4. **Validation:** Business rule validation (beyond basic input validation)
5. **Orchestration:** Coordinate multiple repository operations

---

## 📄 File 1: `AuthService.java`

**Location:** `service/AuthService.java`  
**Purpose:** Authentication and authorization logic  
**Lines:** 47

### Complete Source Code

```java
1  package com.quizforge.service;
2
3  import com.quizforge.dto.LoginRequest;
4  import com.quizforge.dto.LoginResponse;
5  import com.quizforge.model.User;
6  import com.quizforge.repository.UserRepository;
7  import com.quizforge.security.JwtUtil;
8  import org.springframework.beans.factory.annotation.Autowired;
9  import org.springframework.security.crypto.password.PasswordEncoder;
10 import org.springframework.stereotype.Service;
11
12 @Service
13 public class AuthService {
14
15     @Autowired
16     private UserRepository userRepository;
17
18     @Autowired
19     private PasswordEncoder passwordEncoder;
20
21     @Autowired
22     private JwtUtil jwtUtil;
23
24     public LoginResponse login(LoginRequest request) {
25         // Dummy authentication logic
26         // admin@quizforge.com -> ADMIN role
27         // any other email -> CANDIDATE role
28         
29         User.Role role;
30         String name;
31         
32         if ("admin@quizforge.com".equals(request.email())) {
33             role = User.Role.ADMIN;
34             name = "Admin User";
35         } else {
36             role = User.Role.CANDIDATE;
37             name = "Candidate User";
38         }
39         
40         String token = jwtUtil.generateToken(request.email(), role.name());
41         
42         return new LoginResponse(token, request.email(), name, role.name());
43     }
44 }
```

### Line-by-Line Explanation

**Line 1 - Package**
```java
package com.quizforge.service;
```
- Service layer package

**Lines 3-10 - Imports**
```java
import com.quizforge.dto.LoginRequest;
import com.quizforge.dto.LoginResponse;
```
- **LoginRequest:** Input DTO (email, password)
- **LoginResponse:** Output DTO (token, email, name, role)

```java
import com.quizforge.model.User;
```
- **User entity:** For accessing User.Role enum

```java
import com.quizforge.repository.UserRepository;
```
- **UserRepository:** Database access (currently unused in dummy implementation)

```java
import com.quizforge.security.JwtUtil;
```
- **JwtUtil:** JWT token generation utility

```java
import org.springframework.beans.factory.annotation.Autowired;
```
- **@Autowired:** Dependency injection annotation
- **What it does:** Spring injects implementation at runtime
- **Alternatives:**
  ```java
  // Constructor injection (preferred in production):
  public AuthService(UserRepository userRepository, 
                     PasswordEncoder passwordEncoder,
                     JwtUtil jwtUtil) {
      this.userRepository = userRepository;
      this.passwordEncoder = passwordEncoder;
      this.jwtUtil = jwtUtil;
  }
  ```

```java
import org.springframework.security.crypto.password.PasswordEncoder;
```
- **PasswordEncoder:** BCrypt password hashing
- **Configured in:** SecurityConfig (BCryptPasswordEncoder bean)
- **Methods:**
  - `encode(String rawPassword)` - Hash password
  - `matches(String raw, String encoded)` - Verify password

```java
import org.springframework.stereotype.Service;
```
- **@Service:** Mark as Spring service bean
- **Effects:**
  - Component scanning registration
  - Transactional proxy creation
  - Exception translation

**Line 12 - @Service Annotation**
```java
@Service
```
- **Purpose:** Register as Spring bean
- **Bean name:** `authService` (default: class name with lowercase first letter)
- **Scope:** Singleton (one instance per application)
- **Lifecycle:** Created on application startup
- **Alternative annotations:**
  - `@Component` - Generic component
  - `@Service` - Service layer (semantic, same as @Component)
  - `@Repository` - Data access layer

**Line 13 - Class Declaration**
```java
public class AuthService {
```
- **Visibility:** Public (accessible to controllers)
- **Not final:** Can be proxied by Spring (for @Transactional, etc.)

**Lines 15-16 - UserRepository Dependency**
```java
    @Autowired
    private UserRepository userRepository;
```
- **@Autowired:** Spring injects UserRepository implementation
- **Injection time:** After constructor, before any method calls
- **Why private:** Encapsulation (only this class uses it)
- **Currently unused:** Dummy authentication doesn't query database
- **Real implementation would use:**
  ```java
  Optional<User> userOpt = userRepository.findByEmail(request.email());
  ```

**Lines 18-19 - PasswordEncoder Dependency**
```java
    @Autowired
    private PasswordEncoder passwordEncoder;
```
- **Purpose:** Hash and verify passwords
- **Implementation:** BCryptPasswordEncoder (configured in SecurityConfig)
- **Currently unused:** Dummy authentication skips password check
- **Real implementation would use:**
  ```java
  if (!passwordEncoder.matches(request.password(), user.getPassword())) {
      throw new RuntimeException("Invalid credentials");
  }
  ```
- **BCrypt details:**
  - Strength: 10 rounds (default)
  - Salt: Random, embedded in hash
  - Hash length: 60 characters
  - Example: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

**Lines 21-22 - JwtUtil Dependency**
```java
    @Autowired
    private JwtUtil jwtUtil;
```
- **Purpose:** Generate JWT tokens
- **Configured in:** security package
- **Method used:** `generateToken(String email, String role)`

**Line 24 - Login Method Signature**
```java
    public LoginResponse login(LoginRequest request) {
```
- **Visibility:** Public (called by AuthController)
- **Parameter:** `LoginRequest` DTO (email, password)
- **Return type:** `LoginResponse` DTO (token, email, name, role)
- **No @Transactional:** Read-only operation (in real implementation)
- **Called by:** `AuthController.login()`

**Lines 25-27 - Comment Block**
```java
        // Dummy authentication logic
        // admin@quizforge.com -> ADMIN role
        // any other email -> CANDIDATE role
```
- **Important:** This is simplified for development
- **Production implementation should:**
  1. Query database for user by email
  2. Check if user exists
  3. Verify password with BCrypt
  4. Handle failed login attempts
  5. Log authentication events

**Lines 29-30 - Variable Declarations**
```java
        User.Role role;
        String name;
```
- **role:** Enum type `User.Role` (ADMIN or CANDIDATE)
- **name:** User's display name
- **Why declare here:** Will be assigned in if-else block

**Lines 32-38 - Dummy Authentication Logic**
```java
        if ("admin@quizforge.com".equals(request.email())) {
            role = User.Role.ADMIN;
            name = "Admin User";
        } else {
            role = User.Role.CANDIDATE;
            name = "Candidate User";
        }
```

**Line 32 - Admin Check**
```java
        if ("admin@quizforge.com".equals(request.email())) {
```
- **Pattern:** Constant first (prevents NullPointerException)
  - ✅ `"admin@quizforge.com".equals(request.email())` - Safe
  - ❌ `request.email().equals("admin@quizforge.com")` - NPE if email is null
- **Logic:** Hardcoded admin email
- **Real implementation:**
  ```java
  Optional<User> userOpt = userRepository.findByEmail(request.email());
  
  if (userOpt.isEmpty()) {
      throw new RuntimeException("User not found");
  }
  
  User user = userOpt.get();
  
  if (!passwordEncoder.matches(request.password(), user.getPassword())) {
      throw new RuntimeException("Invalid password");
  }
  
  role = user.getRole();
  name = user.getName();
  ```

**Lines 33-34 - Admin Role Assignment**
```java
            role = User.Role.ADMIN;
            name = "Admin User";
```
- **role:** Set to ADMIN enum value
- **name:** Hardcoded admin display name

**Lines 35-37 - Candidate Role Assignment**
```java
        } else {
            role = User.Role.CANDIDATE;
            name = "Candidate User";
        }
```
- **Else branch:** Any other email is candidate
- **Security issue:** No password validation!
- **Anyone can login as anyone:** Just need any email

**Line 40 - Generate JWT Token**
```java
        String token = jwtUtil.generateToken(request.email(), role.name());
```
- **Method:** `JwtUtil.generateToken(String subject, String role)`
- **Parameters:**
  - `request.email()` - User identifier (subject claim)
  - `role.name()` - "ADMIN" or "CANDIDATE" (custom claim)
- **Returns:** JWT string (e.g., `eyJhbGciOiJIUzUxMiJ9...`)
- **Token structure:**
  ```json
  {
    "header": {
      "alg": "HS512",
      "typ": "JWT"
    },
    "payload": {
      "sub": "admin@quizforge.com",
      "role": "ADMIN",
      "iat": 1699656000,
      "exp": 1699742400
    },
    "signature": "..."
  }
  ```
- **Expiration:** 24 hours (86400000 ms)

**Line 42 - Return Response**
```java
        return new LoginResponse(token, request.email(), name, role.name());
```
- **Constructor call:** `new LoginResponse(String, String, String, String)`
- **Parameters:**
  1. `token` - JWT token for authentication
  2. `request.email()` - User's email
  3. `name` - Display name ("Admin User" or "Candidate User")
  4. `role.name()` - "ADMIN" or "CANDIDATE" (enum to String)
- **Returns to:** `AuthController.login()` → HTTP response body

---

### Real-World Implementation Example

**Production-ready login method:**

```java
public LoginResponse login(LoginRequest request) {
    // 1. Find user by email
    User user = userRepository.findByEmail(request.email())
        .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    
    // 2. Verify password
    if (!passwordEncoder.matches(request.password(), user.getPassword())) {
        // Log failed attempt
        log.warn("Failed login attempt for email: {}", request.email());
        throw new RuntimeException("Invalid credentials");
    }
    
    // 3. Check if account is active
    if (!user.isActive()) {
        throw new RuntimeException("Account is disabled");
    }
    
    // 4. Generate token
    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    
    // 5. Log successful login
    log.info("User logged in: {}", user.getEmail());
    
    // 6. Return response
    return new LoginResponse(
        token,
        user.getEmail(),
        user.getName(),
        user.getRole().name()
    );
}
```

---

### Testing Example

```java
@SpringBootTest
class AuthServiceTest {
    
    @Autowired
    private AuthService authService;
    
    @Test
    void testAdminLogin() {
        LoginRequest request = new LoginRequest(
            "admin@quizforge.com",
            "any-password"  // Not checked in dummy impl
        );
        
        LoginResponse response = authService.login(request);
        
        assertEquals("admin@quizforge.com", response.email());
        assertEquals("Admin User", response.name());
        assertEquals("ADMIN", response.role());
        assertNotNull(response.token());
        assertTrue(response.token().startsWith("eyJ"));  // JWT format
    }
    
    @Test
    void testCandidateLogin() {
        LoginRequest request = new LoginRequest(
            "candidate@example.com",
            "any-password"
        );
        
        LoginResponse response = authService.login(request);
        
        assertEquals("candidate@example.com", response.email());
        assertEquals("Candidate User", response.name());
        assertEquals("CANDIDATE", response.role());
        assertNotNull(response.token());
    }
}
```

---

### Summary: AuthService

**Purpose:** Handle user authentication

**Methods:** 1
- `login(LoginRequest)` - Authenticate user and generate JWT

**Dependencies:** 3
- `UserRepository` - User data access (unused in dummy)
- `PasswordEncoder` - Password verification (unused in dummy)
- `JwtUtil` - JWT token generation (used)

**Current Limitations:**
1. ❌ No database lookup
2. ❌ No password verification
3. ❌ Hardcoded admin email
4. ❌ Anyone can login
5. ❌ No error handling
6. ❌ No logging

**Required for Production:**
1. ✅ Database user lookup
2. ✅ BCrypt password verification
3. ✅ Failed login tracking
4. ✅ Account lockout after N failures
5. ✅ Audit logging
6. ✅ Custom exceptions
7. ✅ Rate limiting

---

## 📄 File 2: `AdminService.java`

**Location:** `service/AdminService.java`  
**Purpose:** Admin quiz management operations  
**Lines:** 176

### Complete Source Code

```java
1  package com.quizforge.service;
2
3  import com.quizforge.dto.*;
4  import com.quizforge.model.*;
5  import com.quizforge.repository.*;
6  import org.springframework.beans.factory.annotation.Autowired;
7  import org.springframework.stereotype.Service;
8  import org.springframework.transaction.annotation.Transactional;
9
10 import java.util.List;
11 import java.util.stream.Collectors;
12
13 @Service
14 public class AdminService {
15
16     @Autowired
17     private QuizRepository quizRepository;
18
19     @Autowired
20     private QuestionRepository questionRepository;
21
22     @Autowired
23     private UserRepository userRepository;
24
25     @Autowired
26     private QuizAttemptRepository attemptRepository;
27
28     public List<QuizSummaryResponse> getAllQuizzes() {
29         return quizRepository.findAll().stream()
30                 .map(this::toSummaryResponse)
31                 .collect(Collectors.toList());
32     }
33
34     public QuizResponse getQuizById(Long id) {
35         Quiz quiz = quizRepository.findById(id)
36                 .orElseThrow(() -> new RuntimeException("Quiz not found"));
37         return toDetailedResponse(quiz);
38     }
39
40     @Transactional
41     public QuizResponse createQuiz(QuizRequest request, String adminEmail) {
42         User admin = userRepository.findByEmail(adminEmail)
43                 .orElseGet(() -> {
44                     // Create dummy admin user if not exists
45                     User newAdmin = new User();
46                     newAdmin.setEmail(adminEmail);
47                     newAdmin.setName("Admin");
48                     newAdmin.setPassword("dummy");
49                     newAdmin.setRole(User.Role.ADMIN);
50                     return userRepository.save(newAdmin);
51                 });
52
53         Quiz quiz = new Quiz();
54         quiz.setTitle(request.title());
55         quiz.setDescription(request.description());
56         quiz.setDuration(request.duration());
57         quiz.setIsActive(request.isActive() != null ? request.isActive() : true);
58         quiz.setCreatedBy(admin);
59
60         if (request.questions() != null) {
61             for (QuestionRequest qReq : request.questions()) {
62                 Question question = new Question();
63                 question.setQuestionText(qReq.questionText());
64                 question.setType(Question.QuestionType.valueOf(qReq.type()));
65                 question.setPoints(qReq.points() != null ? qReq.points() : 1);
66                 question.setQuiz(quiz);
67
68                 if (qReq.options() != null) {
69                     for (OptionRequest oReq : qReq.options()) {
70                         Option option = new Option();
71                         option.setOptionText(oReq.optionText());
72                         option.setIsCorrect(oReq.isCorrect());
73                         option.setQuestion(question);
74                         question.getOptions().add(option);
75                     }
76                 }
77                 quiz.getQuestions().add(question);
78             }
79         }
80
81         quiz = quizRepository.save(quiz);
82         return toDetailedResponse(quiz);
83     }
84
85     @Transactional
86     public QuizResponse updateQuiz(Long id, QuizRequest request) {
87         Quiz quiz = quizRepository.findById(id)
88                 .orElseThrow(() -> new RuntimeException("Quiz not found"));
89
90         quiz.setTitle(request.title());
91         quiz.setDescription(request.description());
92         quiz.setDuration(request.duration());
93         if (request.isActive() != null) {
94             quiz.setIsActive(request.isActive());
95         }
96
97         // Clear existing questions and add new ones
98         quiz.getQuestions().clear();
99         
100        if (request.questions() != null) {
101            for (QuestionRequest qReq : request.questions()) {
102                Question question = new Question();
103                question.setQuestionText(qReq.questionText());
104                question.setType(Question.QuestionType.valueOf(qReq.type()));
105                question.setPoints(qReq.points() != null ? qReq.points() : 1);
106                question.setQuiz(quiz);
107
108                if (qReq.options() != null) {
109                    for (OptionRequest oReq : qReq.options()) {
110                        Option option = new Option();
111                        option.setOptionText(oReq.optionText());
112                        option.setIsCorrect(oReq.isCorrect());
113                        option.setQuestion(question);
114                        question.getOptions().add(option);
115                    }
116                }
117                quiz.getQuestions().add(question);
118            }
119        }
120
121        quiz = quizRepository.save(quiz);
122        return toDetailedResponse(quiz);
123    }
124
125    public void deleteQuiz(Long id) {
126        quizRepository.deleteById(id);
127    }
128
129    public QuizAnalyticsResponse getQuizAnalytics(Long quizId) {
130        Quiz quiz = quizRepository.findById(quizId)
131                .orElseThrow(() -> new RuntimeException("Quiz not found"));
132
133        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId).stream()
134                .filter(a -> a.getStatus() == QuizAttempt.AttemptStatus.EVALUATED)
135                .collect(Collectors.toList());
136
137        if (attempts.isEmpty()) {
138            return new QuizAnalyticsResponse(quizId, quiz.getTitle(), 0, 0.0, 0, 0);
139        }
140
141        int totalAttempts = attempts.size();
142        double averageScore = attempts.stream()
143                .mapToInt(QuizAttempt::getScore)
144                .average()
145                .orElse(0.0);
146        int highestScore = attempts.stream()
147                .mapToInt(QuizAttempt::getScore)
148                .max()
149                .orElse(0);
150        int lowestScore = attempts.stream()
151                .mapToInt(QuizAttempt::getScore)
152                .min()
153                .orElse(0);
154
155        return new QuizAnalyticsResponse(quizId, quiz.getTitle(), totalAttempts, 
156                averageScore, highestScore, lowestScore);
157    }
158
159    private QuizSummaryResponse toSummaryResponse(Quiz quiz) {
160        return new QuizSummaryResponse(
161                quiz.getId(),
162                quiz.getTitle(),
163                quiz.getDescription(),
164                quiz.getDuration(),
165                quiz.getIsActive(),
166                quiz.getCreatedBy().getName(),
167                quiz.getCreatedAt(),
168                quiz.getQuestions().size()
169        );
170    }
171
172    private QuizResponse toDetailedResponse(Quiz quiz) {
173        List<QuestionResponse> questions = quiz.getQuestions().stream()
174                .map(q -> new QuestionResponse(
175                        q.getId(),
176                        q.getQuestionText(),
177                        q.getType().name(),
178                        q.getPoints(),
179                        q.getOptions().stream()
180                                .map(o -> new OptionResponse(o.getId(), o.getOptionText(), o.getIsCorrect()))
181                                .collect(Collectors.toList())
182                ))
183                .collect(Collectors.toList());
184
185        return new QuizResponse(
186                quiz.getId(),
187                quiz.getTitle(),
188                quiz.getDescription(),
189                quiz.getDuration(),
190                quiz.getIsActive(),
191                quiz.getCreatedBy().getName(),
192                quiz.getCreatedAt(),
193                quiz.getUpdatedAt(),
194                questions
195        );
196    }
197 }
```

### Line-by-Line Explanation

**Lines 3-5 - Wildcard Imports**
```java
import com.quizforge.dto.*;
import com.quizforge.model.*;
import com.quizforge.repository.*;
```
- **dto.*:** All DTO classes (QuizRequest, QuizResponse, etc.)
- **model.*:** All entity classes (Quiz, Question, Option, etc.)
- **repository.*:** All repository interfaces
- **Note:** Wildcard imports acceptable here (many classes used)
- **Alternative:** Explicit imports (more verbose but clearer)

**Line 8 - Import @Transactional**
```java
import org.springframework.transaction.annotation.Transactional;
```
- **Purpose:** Database transaction management
- **Why needed:** Ensure data consistency for multi-step operations
- **What it does:**
  1. Begins transaction before method
  2. Commits if method succeeds
  3. Rolls back if exception thrown
  4. Manages entity lifecycle

**Lines 10-11 - Java Utilities**
```java
import java.util.List;
import java.util.stream.Collectors;
```
- **List:** Collection interface
- **Collectors:** Stream terminal operations (toList(), grouping, etc.)

**Lines 16-26 - Dependencies (5 repositories)**
```java
    @Autowired
    private QuizRepository quizRepository;
    
    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private QuizAttemptRepository attemptRepository;
```
- **QuizRepository:** Quiz CRUD operations
- **QuestionRepository:** Question operations (rarely used directly)
- **UserRepository:** Find admin user
- **QuizAttemptRepository:** Analytics data
- **Missing:** OptionRepository (options managed through Question cascade)

---

### Method 1: `getAllQuizzes()`

**Lines 28-32**
```java
    public List<QuizSummaryResponse> getAllQuizzes() {
        return quizRepository.findAll().stream()
                .map(this::toSummaryResponse)
                .collect(Collectors.toList());
    }
```

**Line 28 - Method Signature**
```java
    public List<QuizSummaryResponse> getAllQuizzes() {
```
- **Purpose:** Get all quizzes for admin dashboard
- **Return type:** List of summary DTOs (lightweight)
- **No parameters:** Returns ALL quizzes
- **No @Transactional:** Read-only operation

**Line 29 - Fetch All Quizzes**
```java
        return quizRepository.findAll().stream()
```
- **findAll():** JpaRepository method (SELECT * FROM quizzes)
- **Returns:** `List<Quiz>` entities
- **stream():** Convert to Java Stream for transformation
- **Performance concern:** Loads ALL quizzes (could be hundreds/thousands)
- **Better approach:**
  ```java
  // Paginated:
  Page<Quiz> quizzes = quizRepository.findAll(PageRequest.of(0, 20));
  
  // Or filter by admin:
  List<Quiz> myQuizzes = quizRepository.findByCreatedById(adminId);
  ```

**Line 30 - Transform Entities to DTOs**
```java
                .map(this::toSummaryResponse)
```
- **map():** Stream transformation (Quiz → QuizSummaryResponse)
- **this::toSummaryResponse:** Method reference (equivalent to `quiz -> toSummaryResponse(quiz)`)
- **Why DTO conversion:** Don't expose internal entity structure to API

**Line 31 - Collect to List**
```java
                .collect(Collectors.toList());
```
- **collect():** Terminal operation (executes stream)
- **Collectors.toList():** Accumulate into List
- **Returns:** `List<QuizSummaryResponse>`

---

### Method 2: `getQuizById()`

**Lines 34-38**
```java
    public QuizResponse getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        return toDetailedResponse(quiz);
    }
```

**Line 34 - Method Signature**
```java
    public QuizResponse getQuizById(Long id) {
```
- **Purpose:** Get full quiz details (for editing)
- **Parameter:** Quiz ID
- **Return:** QuizResponse (with questions and options)

**Lines 35-36 - Find Quiz or Throw**
```java
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
```
- **findById(id):** Returns `Optional<Quiz>`
- **orElseThrow():** Unwrap Optional or throw exception
- **Lambda:** `() -> new RuntimeException("Quiz not found")`
- **HTTP mapping:** Controller catches exception → 404 Not Found
- **Better exception:**
  ```java
  .orElseThrow(() -> new EntityNotFoundException("Quiz", id));
  ```

**Line 37 - Convert to DTO**
```java
        return toDetailedResponse(quiz);
```
- **Method call:** `toDetailedResponse(Quiz)` (private helper method)
- **Includes:** Questions, options, and correct answers

---

### Method 3: `createQuiz()` (Most Complex)

**Lines 40-83**
```java
    @Transactional
    public QuizResponse createQuiz(QuizRequest request, String adminEmail) {
        // ... 43 lines of logic
    }
```

**Line 40 - @Transactional Annotation**
```java
    @Transactional
```
- **Purpose:** Ensure atomic operation (all or nothing)
- **Transaction scope:**
  1. Find/create admin user
  2. Create quiz
  3. Create questions (loop)
  4. Create options (nested loop)
  5. Save quiz (cascades to all children)
- **Rollback triggers:**
  - Any RuntimeException
  - Any unchecked exception
  - Explicitly configured checked exceptions
- **Commit:** When method completes successfully
- **Isolation level:** Default (READ_COMMITTED)
- **Propagation:** Default (REQUIRED)

**Line 41 - Method Signature**
```java
    public QuizResponse createQuiz(QuizRequest request, String adminEmail) {
```
- **Parameter 1:** `QuizRequest` DTO (title, description, duration, questions)
- **Parameter 2:** `String adminEmail` (from JWT token)
- **Return:** `QuizResponse` (created quiz with ID)

**Lines 42-51 - Find or Create Admin User**
```java
        User admin = userRepository.findByEmail(adminEmail)
                .orElseGet(() -> {
                    // Create dummy admin user if not exists
                    User newAdmin = new User();
                    newAdmin.setEmail(adminEmail);
                    newAdmin.setName("Admin");
                    newAdmin.setPassword("dummy");
                    newAdmin.setRole(User.Role.ADMIN);
                    return userRepository.save(newAdmin);
                });
```

**Line 42 - Find User**
```java
        User admin = userRepository.findByEmail(adminEmail)
```
- **Method:** `findByEmail(String)` returns `Optional<User>`
- **Email source:** JWT token subject claim (from authenticated user)

**Line 43 - orElseGet with Lambda**
```java
                .orElseGet(() -> {
```
- **orElseGet():** Lazy evaluation (only executes if Optional is empty)
- **Difference from orElse():**
  - `orElse(createUser())` - ALWAYS executes createUser()
  - `orElseGet(() -> createUser())` - Only executes if empty
- **Lambda:** Multi-line supplier

**Lines 45-50 - Create New User**
```java
                    User newAdmin = new User();
                    newAdmin.setEmail(adminEmail);
                    newAdmin.setName("Admin");
                    newAdmin.setPassword("dummy");
                    newAdmin.setRole(User.Role.ADMIN);
                    return userRepository.save(newAdmin);
```
- **Why needed:** Dummy auth doesn't create users in database
- **Production:** Should never happen (user created at registration)
- **userRepository.save():** INSERT INTO users
- **Return:** Saved user (with auto-generated ID)

**Lines 53-58 - Create Quiz Entity**
```java
        Quiz quiz = new Quiz();
        quiz.setTitle(request.title());
        quiz.setDescription(request.description());
        quiz.setDuration(request.duration());
        quiz.setIsActive(request.isActive() != null ? request.isActive() : true);
        quiz.setCreatedBy(admin);
```

**Line 57 - Default Value Handling**
```java
        quiz.setIsActive(request.isActive() != null ? request.isActive() : true);
```
- **Ternary operator:** `condition ? ifTrue : ifFalse`
- **Logic:** If isActive not provided, default to true
- **Why needed:** DTO allows null, entity should have value

**Line 58 - Set Relationship**
```java
        quiz.setCreatedBy(admin);
```
- **Relationship:** @ManyToOne (Quiz → User)
- **Foreign key:** created_by_id column
- **Value:** User entity (JPA converts to ID)

**Lines 60-79 - Create Questions (If Provided)**
```java
        if (request.questions() != null) {
            for (QuestionRequest qReq : request.questions()) {
                // Create question and options...
            }
        }
```

**Line 60 - Null Check**
```java
        if (request.questions() != null) {
```
- **Why needed:** Quiz can be created without questions (draft mode)
- **Valid scenarios:**
  - `questions: null` - Skip this block
  - `questions: []` - Empty list, for loop doesn't execute
  - `questions: [...]` - Process each question

**Line 61 - Loop Through Questions**
```java
            for (QuestionRequest qReq : request.questions()) {
```
- **Enhanced for loop:** Iterates over List<QuestionRequest>
- **Variable:** `qReq` (each question DTO)

**Lines 62-66 - Create Question Entity**
```java
                Question question = new Question();
                question.setQuestionText(qReq.questionText());
                question.setType(Question.QuestionType.valueOf(qReq.type()));
                question.setPoints(qReq.points() != null ? qReq.points() : 1);
                question.setQuiz(quiz);
```

**Line 64 - Enum Conversion**
```java
                question.setType(Question.QuestionType.valueOf(qReq.type()));
```
- **valueOf():** String → Enum conversion
- **Input:** "MULTIPLE_CHOICE", "TRUE_FALSE"
- **Output:** Enum constant
- **Exception:** IllegalArgumentException if invalid string
- **Better approach:**
  ```java
  try {
      question.setType(Question.QuestionType.valueOf(qReq.type()));
  } catch (IllegalArgumentException e) {
      throw new RuntimeException("Invalid question type: " + qReq.type());
  }
  ```

**Line 65 - Default Points**
```java
                question.setPoints(qReq.points() != null ? qReq.points() : 1);
```
- **Default:** 1 point if not specified

**Line 66 - Bidirectional Relationship**
```java
                question.setQuiz(quiz);
```
- **Sets:** question.quiz = quiz
- **Also need:** quiz.questions.add(question) (line 77)
- **Why both:** JPA bidirectional relationship management

**Lines 68-76 - Create Options**
```java
                if (qReq.options() != null) {
                    for (OptionRequest oReq : qReq.options()) {
                        Option option = new Option();
                        option.setOptionText(oReq.optionText());
                        option.setIsCorrect(oReq.isCorrect());
                        option.setQuestion(question);
                        question.getOptions().add(option);
                    }
                }
```
- **Nested loop:** For each question, iterate options
- **Bidirectional:** Set both sides of relationship
  - `option.setQuestion(question)` - Child → Parent
  - `question.getOptions().add(option)` - Parent → Child

**Line 77 - Add Question to Quiz**
```java
                quiz.getQuestions().add(question);
```
- **Complete bidirectional setup:**
  - `question.setQuiz(quiz)` - Done on line 66
  - `quiz.getQuestions().add(question)` - Done here

**Line 81 - Save Quiz (Cascades to Children)**
```java
        quiz = quizRepository.save(quiz);
```
- **Single save operation:** Saves quiz + questions + options
- **How:** CascadeType.ALL on relationships
  ```java
  @Entity
  class Quiz {
      @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
      private List<Question> questions;
  }
  ```
- **SQL generated:**
  ```sql
  INSERT INTO quizzes (...) VALUES (...);  -- Returns ID 1
  INSERT INTO questions (quiz_id, ...) VALUES (1, ...);  -- Returns ID 1
  INSERT INTO questions (quiz_id, ...) VALUES (1, ...);  -- Returns ID 2
  INSERT INTO options (question_id, ...) VALUES (1, ...);
  INSERT INTO options (question_id, ...) VALUES (1, ...);
  INSERT INTO options (question_id, ...) VALUES (2, ...);
  -- etc.
  ```
- **Reassignment:** `quiz =` updates reference with generated IDs

**Line 82 - Convert to DTO and Return**
```java
        return toDetailedResponse(quiz);
```
- **Includes:** All questions and options with IDs

---

[Documentation continues with updateQuiz(), deleteQuiz(), getQuizAnalytics(), and helper methods...]

**Due to length, I'll create this in a separate part. Should I continue with the rest of AdminService and CandidateService?**