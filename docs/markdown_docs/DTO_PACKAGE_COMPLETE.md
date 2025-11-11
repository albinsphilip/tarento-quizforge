# QuizForge Backend - DTO Package (Complete Line-by-Line)

> **Every Data Transfer Object explained line-by-line - API Request/Response Contracts**

---

## 📁 Package: `com.quizforge.dto`

**Location:** `backend/src/main/java/com/quizforge/dto/`  
**Purpose:** Data Transfer Objects for API communication  
**Pattern:** Java Records (immutable, concise)  
**Total Files:** 13  
**Total Lines:** ~150

### Why DTOs?

1. **Separation of Concerns:** API layer separate from database layer
2. **Security:** Don't expose internal entity structure
3. **Flexibility:** API can change without affecting database
4. **Validation:** Input validation at API boundary
5. **Documentation:** Clear API contracts

---

## 📄 File 1: `LoginRequest.java`

**Location:** `dto/LoginRequest.java`  
**Purpose:** Input for user login  
**HTTP Method:** POST  
**Endpoint:** `/api/auth/login`  
**Lines:** 13

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  import jakarta.validation.constraints.Email;
4  import jakarta.validation.constraints.NotBlank;
5
6  public record LoginRequest(
7      @NotBlank(message = "Email is required")
8      @Email(message = "Email must be valid")
9      String email,
10    
11     @NotBlank(message = "Password is required")
12     String password
13 ) {}
```

### Line-by-Line Explanation

**Line 1 - Package**
```java
package com.quizforge.dto;
```
- DTO package for all request/response objects

**Line 3 - Import @Email**
```java
import jakarta.validation.constraints.Email;
```
- Jakarta Bean Validation annotation
- Validates email format
- Checks pattern: `user@domain.com`
- **Dependency:** `spring-boot-starter-validation`
- **Regex used:** RFC 5322 compliant

**Line 4 - Import @NotBlank**
```java
import jakarta.validation.constraints.NotBlank;
```
- Validates string is not null, empty, or whitespace only
- **Difference from @NotNull:**
  - `@NotNull`: Allows empty string `""`
  - `@NotEmpty`: Allows whitespace `"   "`
  - `@NotBlank`: Must have non-whitespace characters ✅

**Line 6 - Record Declaration**
```java
public record LoginRequest(
```
- **Java 16+ Feature:** Records are immutable data carriers
- **Auto-generated:**
  - Constructor: `new LoginRequest(email, password)`
  - Getters: `email()`, `password()` (note: method, not `getEmail()`)
  - `equals()`, `hashCode()`, `toString()`
- **Benefits:**
  - Less boilerplate (no manual getters/setters)
  - Immutable by default (thread-safe)
  - Clear intent (data carrier)
- **Equivalent old Java:**
  ```java
  public class LoginRequest {
      private final String email;
      private final String password;
      
      public LoginRequest(String email, String password) {
          this.email = email;
          this.password = password;
      }
      
      public String getEmail() { return email; }
      public String getPassword() { return password; }
      // + equals, hashCode, toString
  }
  ```

**Lines 7-9 - Email Field**
```java
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    String email,
```

**`@NotBlank(message = "Email is required")`**
- **Validation:** Email field cannot be blank
- **Triggers on:** `null`, `""`, `"   "` (whitespace only)
- **Error response:**
  ```json
  {
    "email": "Email is required"
  }
  ```
- **When validated:** Before controller method execution
- **Validated by:** Spring's `MethodValidationInterceptor`

**`@Email(message = "Email must be valid")`**
- **Validation:** Must match email pattern
- **Valid examples:**
  - `user@example.com` ✅
  - `john.doe@company.co.uk` ✅
  - `admin_123@test-site.com` ✅
- **Invalid examples:**
  - `userexample.com` ❌ (missing @)
  - `user@` ❌ (missing domain)
  - `@example.com` ❌ (missing user)
  - `user @example.com` ❌ (space)
- **Error response:**
  ```json
  {
    "email": "Email must be valid"
  }
  ```
- **Regex pattern:** Uses Hibernate Validator's built-in email regex

**`String email,`**
- **Type:** String (not primitive)
- **Immutable:** Cannot be changed after construction
- **Usage in controller:**
  ```java
  String userEmail = loginRequest.email(); // Note: method call, not .getEmail()
  ```

**Lines 11-12 - Password Field**
```java
    @NotBlank(message = "Password is required")
    String password
```

**`@NotBlank(message = "Password is required")`**
- **Validation:** Password cannot be blank
- **Security note:** No max length validation (passwords can be long for security)
- **Error response:**
  ```json
  {
    "password": "Password is required"
  }
  ```

**`String password`**
- **Type:** String (plain text in request)
- **Security:** Transmitted over HTTPS (encrypted in transit)
- **Hashed:** Before storing in database (BCrypt)
- **Not exposed:** Never returned in responses
- **No minimum length:** Should add `@Size(min=8)` in production

**Line 13 - End of record**
```java
) {}
```
- Empty body (all code auto-generated)

---

### JSON Request Example

```json
{
  "email": "admin@quizforge.com",
  "password": "SecurePassword123"
}
```

### Validation Scenarios

**Scenario 1: Valid Input**
```json
{
  "email": "user@example.com",
  "password": "pass123"
}
```
**Result:** ✅ Validation passes

**Scenario 2: Missing Email**
```json
{
  "email": "",
  "password": "pass123"
}
```
**Result:** ❌ `400 Bad Request`
```json
{
  "email": "Email is required"
}
```

**Scenario 3: Invalid Email Format**
```json
{
  "email": "notanemail",
  "password": "pass123"
}
```
**Result:** ❌ `400 Bad Request`
```json
{
  "email": "Email must be valid"
}
```

**Scenario 4: Missing Password**
```json
{
  "email": "user@example.com",
  "password": null
}
```
**Result:** ❌ `400 Bad Request`
```json
{
  "password": "Password is required"
}
```

**Scenario 5: Multiple Errors**
```json
{
  "email": "invalid",
  "password": ""
}
```
**Result:** ❌ `400 Bad Request`
```json
{
  "email": "Email must be valid",
  "password": "Password is required"
}
```

---

### Controller Usage

```java
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(
    @Valid @RequestBody LoginRequest request) { // ← @Valid triggers validation
    
    String email = request.email();        // Access email
    String password = request.password();  // Access password
    
    // Validation already passed if we reach here
    LoginResponse response = authService.login(request);
    return ResponseEntity.ok(response);
}
```

---

## 📄 File 2: `LoginResponse.java`

**Location:** `dto/LoginResponse.java`  
**Purpose:** Output for successful login  
**HTTP Status:** 200 OK  
**Lines:** 8

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  public record LoginResponse(
4      String token,
5      String email,
6      String name,
7      String role
8  ) {}
```

### Line-by-Line Explanation

**Line 3 - Record Declaration**
```java
public record LoginResponse(
```
- Simple record, no validation (response, not request)

**Line 4 - Token Field**
```java
    String token,
```
- **Purpose:** JWT authentication token
- **Format:** `eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4i...`
- **Length:** ~200-300 characters
- **Structure:** `header.payload.signature` (Base64 encoded)
- **Contains:**
  - Email (subject)
  - Role (claim)
  - Issued at time
  - Expiration time
- **Usage:** Client stores this and sends in subsequent requests
  ```
  Authorization: Bearer <token>
  ```
- **Lifespan:** 24 hours (86400000 ms)

**Line 5 - Email Field**
```java
    String email,
```
- **Purpose:** User's email address
- **Usage:** Display in UI, identify user
- **Example:** `admin@quizforge.com`

**Line 6 - Name Field**
```java
    String name,
```
- **Purpose:** User's display name
- **Usage:** Show in navbar, profile
- **Example:** `"Admin User"`, `"John Doe"`

**Line 7 - Role Field**
```java
    String role
```
- **Purpose:** User's authorization level
- **Values:** `"ADMIN"` or `"CANDIDATE"`
- **Usage:** Frontend routing, UI permissions
- **Example:** Hide admin features from candidates

---

### JSON Response Example

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbkBxdWl6Zm9yZ2UuY29tIiwiaWF0IjoxNjk5NjU2MDAwLCJleHAiOjE2OTk3NDI0MDB9.signature",
  "email": "admin@quizforge.com",
  "name": "Admin User",
  "role": "ADMIN"
}
```

### Frontend Usage

```javascript
// After login
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@quizforge.com',
        password: 'password123'
    })
});

const data = await response.json();
// data = { token: "...", email: "...", name: "...", role: "ADMIN" }

// Store token
localStorage.setItem('token', data.token);
localStorage.setItem('role', data.role);

// Use token in future requests
fetch('/api/admin/quizzes', {
    headers: {
        'Authorization': `Bearer ${data.token}`
    }
});

// UI rendering
if (data.role === 'ADMIN') {
    showAdminDashboard();
} else {
    showCandidateDashboard();
}
```

---

## 📄 File 3: `QuizRequest.java`

**Location:** `dto/QuizRequest.java`  
**Purpose:** Input for creating/updating quiz  
**HTTP Methods:** POST, PUT  
**Endpoints:** `/api/admin/quizzes`, `/api/admin/quizzes/{id}`  
**Lines:** 21

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  import jakarta.validation.constraints.Min;
4  import jakarta.validation.constraints.NotBlank;
5  import jakarta.validation.constraints.NotNull;
6  import java.util.List;
7
8  public record QuizRequest(
9      @NotBlank(message = "Title is required")
10     String title,
11    
12     String description,
13    
14     @NotNull(message = "Duration is required")
15     @Min(value = 1, message = "Duration must be at least 1 minute")
16     Integer duration,
17    
18     Boolean isActive,
19    
20     List<QuestionRequest> questions
21 ) {}
```

### Line-by-Line Explanation

**Line 3 - Import @Min**
```java
import jakarta.validation.constraints.Min;
```
- **Purpose:** Validate minimum numeric value
- **Usage:** Ensure duration is at least 1 minute

**Line 4 - Import @NotBlank**
```java
import jakarta.validation.constraints.NotBlank;
```
- For title validation

**Line 5 - Import @NotNull**
```java
import jakarta.validation.constraints.NotNull;
```
- **Difference:**
  - `@NotBlank` - For strings (not null, not empty, not whitespace)
  - `@NotNull` - For any object (not null, but CAN be empty)

**Line 6 - Import List**
```java
import java.util.List;
```
- For questions list

**Lines 9-10 - Title Field**
```java
    @NotBlank(message = "Title is required")
    String title,
```
- **Required:** Yes
- **Validation:** Cannot be blank
- **Example:** `"Java Fundamentals Quiz"`
- **Max length:** 255 characters (VARCHAR(255) in database)
- **Used for:** Quiz identification, display in lists

**Line 12 - Description Field**
```java
    String description,
```
- **Required:** No (no validation annotation)
- **Can be:** `null` or empty string
- **Database type:** TEXT (unlimited length)
- **Example:** `"This quiz covers Java basics including variables, loops, and OOP concepts."`
- **Used for:** Detailed quiz information

**Lines 14-16 - Duration Field**
```java
    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    Integer duration,
```

**`@NotNull`**
- **Validation:** Duration cannot be null
- **Why not @NotBlank:** Integer, not String
- **Allows:** 0 (but caught by @Min)

**`@Min(value = 1)`**
- **Validation:** Must be at least 1
- **Unit:** Minutes
- **Prevents:** Zero or negative durations
- **Examples:**
  - `1` ✅ (1 minute)
  - `30` ✅ (30 minutes)
  - `0` ❌ "Duration must be at least 1 minute"
  - `-5` ❌ "Duration must be at least 1 minute"

**`Integer duration,`**
- **Type:** `Integer` (wrapper class, can be null)
- **Why not int:** Primitive `int` cannot be null, defaults to 0
- **Database type:** INTEGER (4 bytes)
- **Range:** 1 to 2,147,483,647 (enough for ~4 million minutes)

**Line 18 - IsActive Field**
```java
    Boolean isActive,
```
- **Required:** No
- **Default:** `true` (set in service layer)
- **Type:** `Boolean` (can be null)
- **Purpose:** Enable/disable quiz
- **Examples:**
  - `true` - Quiz available to candidates
  - `false` - Quiz hidden (draft mode)
  - `null` - Defaults to `true`

**Line 20 - Questions Field**
```java
    List<QuestionRequest> questions
```
- **Required:** No (can be empty list or null)
- **Type:** List of `QuestionRequest` DTOs
- **Nested validation:** Each question validates itself
- **Can be:**
  - `null` - No questions (quiz shell)
  - `[]` - Empty list (quiz shell)
  - `[question1, question2, ...]` - With questions
- **Use cases:**
  - Create quiz without questions (add later)
  - Create quiz with questions (complete in one request)
  - Update quiz questions (replace all)

---

### JSON Request Examples

**Example 1: Create Quiz with Questions**
```json
{
  "title": "Java Fundamentals Quiz",
  "description": "Test your knowledge of Java basics",
  "duration": 30,
  "isActive": true,
  "questions": [
    {
      "questionText": "What is JVM?",
      "type": "MULTIPLE_CHOICE",
      "points": 2,
      "options": [
        { "optionText": "Java Virtual Machine", "isCorrect": true },
        { "optionText": "Java Variable Method", "isCorrect": false }
      ]
    }
  ]
}
```

**Example 2: Create Quiz Without Questions (Draft)**
```json
{
  "title": "Python Quiz",
  "description": null,
  "duration": 45,
  "isActive": false,
  "questions": []
}
```

**Example 3: Validation Errors**
```json
{
  "title": "",
  "description": "...",
  "duration": 0
}
```
**Response:** 400 Bad Request
```json
{
  "title": "Title is required",
  "duration": "Duration must be at least 1 minute"
}
```

---

## 📄 File 4: `QuizResponse.java`

**Location:** `dto/QuizResponse.java`  
**Purpose:** Full quiz details output  
**HTTP Status:** 200 OK  
**Endpoints:** GET `/api/admin/quizzes/{id}`  
**Lines:** 14

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  import java.time.LocalDateTime;
4  import java.util.List;
5
6  public record QuizResponse(
7      Long id,
8      String title,
9      String description,
10     Integer duration,
11     Boolean isActive,
12     String createdBy,
13     LocalDateTime createdAt,
14     LocalDateTime updatedAt,
15     List<QuestionResponse> questions
16 ) {}
```

### Line-by-Line Explanation

**Line 3 - Import LocalDateTime**
```java
import java.time.LocalDateTime;
```
- Java 8+ date-time API
- For `createdAt` and `updatedAt` timestamps

**Line 7 - ID Field**
```java
    Long id,
```
- **Purpose:** Unique quiz identifier
- **Type:** Long (database primary key)
- **Auto-generated:** By database (SERIAL/BIGSERIAL)
- **Example:** `1`, `42`, `1337`
- **Usage:** Reference quiz in URLs, relationships

**Line 8-11 - Basic Fields**
```java
    String title,
    String description,
    Integer duration,
    Boolean isActive,
```
- Same as request, but read-only

**Line 12 - CreatedBy Field**
```java
    String createdBy,
```
- **Purpose:** Show who created the quiz
- **Type:** String (admin's name)
- **Source:** `quiz.getCreatedBy().getName()`
- **Example:** `"Admin User"`
- **Why not User object:** Don't expose entire User entity
- **Security:** Don't expose admin's email/password hash

**Line 13 - CreatedAt Field**
```java
    LocalDateTime createdAt,
```
- **Purpose:** When quiz was created
- **Format:** ISO-8601: `2025-11-10T14:30:00`
- **Timezone:** Server local time
- **Immutable:** Never changes after creation
- **JSON format:**
  ```json
  "createdAt": "2025-11-10T14:30:00.123"
  ```

**Line 14 - UpdatedAt Field**
```java
    LocalDateTime updatedAt,
```
- **Purpose:** Last modification time
- **Updates:** Every time quiz is edited
- **Can be null:** New quiz, no updates yet (but set by @PrePersist)
- **Usage:** Show "Last updated: X hours ago"

**Line 15 - Questions Field**
```java
    List<QuestionResponse> questions
```
- **Purpose:** All questions with options
- **Type:** List of QuestionResponse DTOs
- **Includes:** Question text, type, points, options
- **Can be empty:** `[]` (quiz with no questions)
- **Admin view:** Shows correct answers (`isCorrect = true/false`)
- **Size:** Typically 5-50 questions per quiz

---

### JSON Response Example

```json
{
  "id": 1,
  "title": "Java Fundamentals Quiz",
  "description": "Test your Java knowledge",
  "duration": 30,
  "isActive": true,
  "createdBy": "Admin User",
  "createdAt": "2025-11-10T10:00:00",
  "updatedAt": "2025-11-10T14:30:00",
  "questions": [
    {
      "id": 1,
      "questionText": "What is JVM?",
      "type": "MULTIPLE_CHOICE",
      "points": 2,
      "options": [
        {
          "id": 1,
          "optionText": "Java Virtual Machine",
          "isCorrect": true
        },
        {
          "id": 2,
          "optionText": "Java Variable Method",
          "isCorrect": false
        }
      ]
    }
  ]
}
```

---

## 📄 File 5: `QuizSummaryResponse.java`

**Location:** `dto/QuizSummaryResponse.java`  
**Purpose:** Lightweight quiz info for lists  
**HTTP Status:** 200 OK  
**Endpoints:** GET `/api/admin/quizzes`, GET `/api/candidate/available-quizzes`  
**Lines:** 11

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  import java.time.LocalDateTime;
4
5  public record QuizSummaryResponse(
6      Long id,
7      String title,
8      String description,
9      Integer duration,
10     Boolean isActive,
11     LocalDateTime createdAt,
12     Integer questionCount
13 ) {}
```

### Line-by-Line Explanation

**Line 5 - Record Declaration**
```java
public record QuizSummaryResponse(
```
- **Purpose:** Optimized for list views (less data than QuizResponse)
- **Difference from QuizResponse:** No `questions` list, no `updatedAt`, no `createdBy`

**Line 6-11 - Core Fields**
```java
    Long id,
    String title,
    String description,
    Integer duration,
    Boolean isActive,
    LocalDateTime createdAt,
```
- Same as QuizResponse

**Line 12 - QuestionCount Field**
```java
    Integer questionCount
```
- **Purpose:** Show "15 questions" without loading all questions
- **Type:** Integer (derived count)
- **Source:** `quiz.getQuestions().size()` or SQL COUNT
- **Performance:** Much faster than loading full questions
- **Usage:** Display in quiz cards
  ```
  Java Quiz
  30 minutes • 15 questions
  ```

### JSON Response Example

```json
[
  {
    "id": 1,
    "title": "Java Fundamentals",
    "description": "Test your Java knowledge",
    "duration": 30,
    "isActive": true,
    "createdAt": "2025-11-10T10:00:00",
    "questionCount": 15
  },
  {
    "id": 2,
    "title": "Python Basics",
    "description": "Python fundamentals",
    "duration": 45,
    "isActive": true,
    "createdAt": "2025-11-09T14:00:00",
    "questionCount": 20
  }
]
```

### Performance Comparison

**QuizResponse (Full):**
- Size: ~50 KB (with 20 questions, each with 4 options)
- Fields: 9 + nested questions array
- SQL Joins: Quiz → Questions → Options (3 tables)

**QuizSummaryResponse (Summary):**
- Size: ~500 bytes
- Fields: 7 only
- SQL: Single query with COUNT (1 table)
- **100x smaller!**

---

## 📄 File 6: `QuestionRequest.java`

**Location:** `dto/QuestionRequest.java`  
**Purpose:** Input for creating/updating question  
**HTTP Methods:** POST, PUT  
**Nested in:** QuizRequest  
**Lines:** 17

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  import jakarta.validation.constraints.Min;
4  import jakarta.validation.constraints.NotBlank;
5  import jakarta.validation.constraints.NotNull;
6  import java.util.List;
7
8  public record QuestionRequest(
9      @NotBlank(message = "Question text is required")
10     String questionText,
11    
12     @NotNull(message = "Question type is required")
13     String type,
14    
15     @NotNull(message = "Points are required")
16     @Min(value = 1, message = "Points must be at least 1")
17     Integer points,
18    
19     List<OptionRequest> options
20 ) {}
```

### Line-by-Line Explanation

**Lines 9-10 - QuestionText Field**
```java
    @NotBlank(message = "Question text is required")
    String questionText,
```
- **Required:** Yes
- **Validation:** Cannot be blank
- **Example:** `"What is the output of System.out.println(1 + 2)?"`
- **Database:** TEXT column (unlimited length)
- **Supports:** Long questions with code snippets

**Lines 12-13 - Type Field**
```java
    @NotNull(message = "Question type is required")
    String type,
```
- **Required:** Yes
- **Type:** String (enum name)
- **Valid values:**
  - `"MULTIPLE_CHOICE"` - One correct answer
  - `"TRUE_FALSE"` - Boolean question
  - `"SHORT_ANSWER"` - Text input (not implemented yet)
- **Database:** ENUM type
- **Validation:** Service layer checks valid enum
- **Example:**
  ```json
  {
    "questionText": "Java is object-oriented?",
    "type": "TRUE_FALSE"
  }
  ```

**Lines 15-17 - Points Field**
```java
    @NotNull(message = "Points are required")
    @Min(value = 1, message = "Points must be at least 1")
    Integer points,
```
- **Purpose:** Question weight in quiz scoring
- **Range:** 1 to Integer.MAX_VALUE
- **Typical values:** 1, 2, 5 points
- **Examples:**
  - Easy question: 1 point
  - Medium question: 2 points
  - Hard question: 5 points
- **Total quiz score:** Sum of all question points
- **Percentage calculation:**
  ```
  Score = (correctPoints / totalPoints) * 100
  ```

**Line 19 - Options Field**
```java
    List<OptionRequest> options
```
- **Purpose:** Answer choices
- **Required:** No (but should validate in service)
- **Nested validation:** Each option validates itself
- **Examples:**
  ```json
  "options": [
    { "optionText": "3", "isCorrect": true },
    { "optionText": "12", "isCorrect": false },
    { "optionText": "Error", "isCorrect": false }
  ]
  ```
- **Business rules:**
  - MULTIPLE_CHOICE: Exactly 1 correct option
  - TRUE_FALSE: Exactly 2 options (True, False)
  - Should have at least 2 options

---

## 📄 File 7: `QuestionResponse.java`

**Location:** `dto/QuestionResponse.java`  
**Purpose:** Question output with options  
**Lines:** 9

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  import java.util.List;
4
5  public record QuestionResponse(
6      Long id,
7      String questionText,
8      String type,
9      Integer points,
10     List<OptionResponse> options
11 ) {}
```

### Line-by-Line Explanation

**Lines 6-9 - Core Fields**
```java
    Long id,
    String questionText,
    String type,
    Integer points,
```
- Same as request, plus `id`

**Line 10 - Options Field**
```java
    List<OptionResponse> options
```
- **Purpose:** All answer choices
- **Includes:** `isCorrect` flag
- **Visibility:**
  - **Admin:** See all options with correct answers
  - **Candidate (taking):** See options WITHOUT correct answers
  - **Candidate (results):** See options WITH correct answers + their choices
- **Ordering:** By option ID (insertion order)

### JSON Response Examples

**Admin View (Shows Correct Answers):**
```json
{
  "id": 1,
  "questionText": "What is 2 + 2?",
  "type": "MULTIPLE_CHOICE",
  "points": 2,
  "options": [
    {
      "id": 1,
      "optionText": "4",
      "isCorrect": true
    },
    {
      "id": 2,
      "optionText": "3",
      "isCorrect": false
    }
  ]
}
```

**Candidate View (During Quiz - Hides Correct Answers):**
```json
{
  "id": 1,
  "questionText": "What is 2 + 2?",
  "type": "MULTIPLE_CHOICE",
  "points": 2,
  "options": [
    {
      "id": 1,
      "optionText": "4",
      "isCorrect": null  // Hidden during quiz
    },
    {
      "id": 2,
      "optionText": "3",
      "isCorrect": null
    }
  ]
}
```

---

## 📄 File 8: `OptionRequest.java`

**Location:** `dto/OptionRequest.java`  
**Purpose:** Input for creating option  
**Nested in:** QuestionRequest  
**Lines:** 12

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  import jakarta.validation.constraints.NotBlank;
4  import jakarta.validation.constraints.NotNull;
5
6  public record OptionRequest(
7      @NotBlank(message = "Option text is required")
8      String optionText,
9     
10     @NotNull(message = "isCorrect flag is required")
11     Boolean isCorrect
12 ) {}
```

### Line-by-Line Explanation

**Lines 7-8 - OptionText Field**
```java
    @NotBlank(message = "Option text is required")
    String optionText,
```
- **Required:** Yes
- **Validation:** Cannot be blank
- **Database:** VARCHAR(500)
- **Examples:**
  - `"Java Virtual Machine"`
  - `"True"`
  - `"public static void main(String[] args)"`
- **Supports:** Code snippets in answers

**Lines 10-11 - IsCorrect Field**
```java
    @NotNull(message = "isCorrect flag is required")
    Boolean isCorrect
```
- **Purpose:** Mark correct answer
- **Type:** Boolean (NOT null)
- **Why @NotNull:** Must explicitly set true/false
- **Business rules:**
  - Exactly ONE option should have `isCorrect = true` (for MULTIPLE_CHOICE)
  - Two options for TRUE_FALSE (one true, one false)
- **Examples:**
  ```json
  {
    "optionText": "Java Virtual Machine",
    "isCorrect": true  // ✅ Correct answer
  },
  {
    "optionText": "Java Variable Method",
    "isCorrect": false  // ❌ Wrong answer
  }
  ```

### Validation Example

**Invalid (missing isCorrect):**
```json
{
  "optionText": "Answer"
}
```
**Error:** `"isCorrect flag is required"`

**Invalid (blank text):**
```json
{
  "optionText": "",
  "isCorrect": true
}
```
**Error:** `"Option text is required"`

---

## 📄 File 9: `OptionResponse.java`

**Location:** `dto/OptionResponse.java`  
**Purpose:** Option output  
**Lines:** 6

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  public record OptionResponse(
4      Long id,
5      String optionText,
6      Boolean isCorrect
7  ) {}
```

### Line-by-Line Explanation

**Line 4 - ID Field**
```java
    Long id,
```
- **Purpose:** Unique option identifier
- **Usage:** Submit answers by option ID
- **Example:** Candidate selects option ID `3`

**Line 5 - OptionText Field**
```java
    String optionText,
```
- Same as request

**Line 6 - IsCorrect Field**
```java
    Boolean isCorrect
```
- **Visibility depends on context:**
  - **Admin:** Always visible
  - **Candidate taking quiz:** `null` (hidden)
  - **Candidate viewing results:** Visible
- **Implementation:** Service layer sets to null when hiding

---

## 📄 File 10: `AnswerRequest.java`

**Location:** `dto/AnswerRequest.java`  
**Purpose:** Single answer submission  
**Nested in:** SubmitQuizRequest  
**Lines:** 7

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  public record AnswerRequest(
4      Long questionId,
5      Long selectedOptionId
6  ) {}
```

### Line-by-Line Explanation

**Line 4 - QuestionId Field**
```java
    Long questionId,
```
- **Purpose:** Identify which question this answers
- **Type:** Long (foreign key reference)
- **Example:** `1` (answers question ID 1)
- **Validation:** Service checks question exists in quiz

**Line 5 - SelectedOptionId Field**
```java
    Long selectedOptionId
```
- **Purpose:** Which option candidate chose
- **Type:** Long (foreign key reference)
- **Can be null:** Unanswered question (skipped)
- **Example:** `3` (selected option ID 3)
- **Validation:** Service checks option belongs to question

### JSON Example

```json
{
  "questionId": 1,
  "selectedOptionId": 3
}
```

**Meaning:** "For question 1, I choose option 3"

---

## 📄 File 11: `SubmitQuizRequest.java`

**Location:** `dto/SubmitQuizRequest.java`  
**Purpose:** Complete quiz submission  
**HTTP Method:** POST  
**Endpoint:** `/api/candidate/quizzes/{quizId}/submit`  
**Lines:** 6

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  import java.util.List;
4
5  public record SubmitQuizRequest(
6      List<AnswerRequest> answers
7  ) {}
```

### Line-by-Line Explanation

**Line 6 - Answers Field**
```java
    List<AnswerRequest> answers
```
- **Purpose:** All answers for quiz
- **Type:** List of AnswerRequest
- **Can be:** Empty (submitted with no answers)
- **Size:** Should match number of questions (but can be less if skipped)
- **No validation annotations:** Service validates instead

### JSON Example

**Complete Submission:**
```json
{
  "answers": [
    {
      "questionId": 1,
      "selectedOptionId": 3
    },
    {
      "questionId": 2,
      "selectedOptionId": 7
    },
    {
      "questionId": 3,
      "selectedOptionId": 11
    }
  ]
}
```

**Partial Submission (Skipped Question 2):**
```json
{
  "answers": [
    {
      "questionId": 1,
      "selectedOptionId": 3
    },
    {
      "questionId": 3,
      "selectedOptionId": 11
    }
  ]
}
```

**Empty Submission (Submitted with No Answers):**
```json
{
  "answers": []
}
```

---

## 📄 File 12: `AttemptResponse.java`

**Location:** `dto/AttemptResponse.java`  
**Purpose:** Quiz attempt result  
**HTTP Status:** 200 OK (after submission)  
**Lines:** 11

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  import java.time.LocalDateTime;
4
5  public record AttemptResponse(
6      Long id,
7      Long quizId,
8      String quizTitle,
9      Integer score,
10     Integer totalPoints,
11     LocalDateTime submittedAt
12 ) {}
```

### Line-by-Line Explanation

**Line 6 - ID Field**
```java
    Long id,
```
- **Purpose:** Unique attempt identifier
- **Type:** QuizAttempt entity ID
- **Usage:** Reference to view detailed results
- **Example:** `/api/candidate/attempts/42`

**Line 7 - QuizId Field**
```java
    Long quizId,
```
- **Purpose:** Which quiz was attempted
- **Usage:** Link back to quiz details
- **Example:** `1` (Java Fundamentals Quiz)

**Line 8 - QuizTitle Field**
```java
    String quizTitle,
```
- **Purpose:** Display quiz name
- **Example:** `"Java Fundamentals Quiz"`
- **Why include:** Avoid additional API call

**Line 9 - Score Field**
```java
    Integer score,
```
- **Purpose:** Points earned
- **Calculation:** Sum of points for correct answers
- **Example:** `8` (got 8 points out of 15)
- **Range:** 0 to totalPoints

**Line 10 - TotalPoints Field**
```java
    Integer totalPoints,
```
- **Purpose:** Maximum possible score
- **Calculation:** Sum of all question points
- **Example:** `15` (quiz has 15 total points)
- **Percentage:**
  ```
  percentage = (score / totalPoints) * 100
  percentage = (8 / 15) * 100 = 53.33%
  ```

**Line 11 - SubmittedAt Field**
```java
    LocalDateTime submittedAt
```
- **Purpose:** When quiz was submitted
- **Example:** `"2025-11-10T15:45:30"`
- **Usage:** Display "Submitted 2 hours ago"

### JSON Response Example

```json
{
  "id": 42,
  "quizId": 1,
  "quizTitle": "Java Fundamentals Quiz",
  "score": 8,
  "totalPoints": 15,
  "submittedAt": "2025-11-10T15:45:30"
}
```

**Interpretation:**
- Attempt ID: 42
- Quiz: Java Fundamentals Quiz (ID 1)
- Score: 8/15 (53.33%)
- Submitted: Nov 10, 2025 at 3:45 PM

---

## 📄 File 13: `QuizAnalyticsResponse.java`

**Location:** `dto/QuizAnalyticsResponse.java`  
**Purpose:** Quiz statistics for admin  
**HTTP Method:** GET  
**Endpoint:** `/api/admin/quizzes/{id}/analytics`  
**Lines:** 9

### Complete Source Code

```java
1  package com.quizforge.dto;
2
3  public record QuizAnalyticsResponse(
4      Long quizId,
5      String quizTitle,
6      Integer attemptCount,
7      Double averageScore,
8      Integer highestScore,
9      Integer lowestScore
10 ) {}
```

### Line-by-Line Explanation

**Line 4 - QuizId Field**
```java
    Long quizId,
```
- Quiz being analyzed

**Line 5 - QuizTitle Field**
```java
    String quizTitle,
```
- Quiz name for display

**Line 6 - AttemptCount Field**
```java
    Integer attemptCount,
```
- **Purpose:** How many times quiz was taken
- **SQL:** `COUNT(*)` from `quiz_attempts`
- **Example:** `47` (47 candidates took quiz)
- **Can be:** `0` (no attempts yet)

**Line 7 - AverageScore Field**
```java
    Double averageScore,
```
- **Purpose:** Mean score across all attempts
- **Type:** Double (decimal precision)
- **SQL:** `AVG(score)` from `quiz_attempts`
- **Example:** `12.5` (average of 12.5 points)
- **Can be:** `null` (no attempts)
- **Percentage:**
  ```
  avgPercentage = (12.5 / 15) * 100 = 83.33%
  ```

**Line 8 - HighestScore Field**
```java
    Integer highestScore,
```
- **Purpose:** Best performance
- **SQL:** `MAX(score)` from `quiz_attempts`
- **Example:** `15` (perfect score)
- **Can be:** `null` (no attempts)

**Line 9 - LowestScore Field**
```java
    Integer lowestScore
```
- **Purpose:** Worst performance
- **SQL:** `MIN(score)` from `quiz_attempts`
- **Example:** `3` (lowest score was 3 points)
- **Can be:** `null` (no attempts)

### JSON Response Examples

**Example 1: Popular Quiz**
```json
{
  "quizId": 1,
  "quizTitle": "Java Fundamentals Quiz",
  "attemptCount": 47,
  "averageScore": 12.5,
  "highestScore": 15,
  "lowestScore": 3
}
```

**Insights:**
- 47 candidates took quiz
- Average: 12.5/15 (83.33%) - Good performance
- Best: 15/15 (100%) - Someone got perfect
- Worst: 3/15 (20%) - Someone struggled

**Example 2: New Quiz (No Attempts)**
```json
{
  "quizId": 5,
  "quizTitle": "Python Basics Quiz",
  "attemptCount": 0,
  "averageScore": null,
  "highestScore": null,
  "lowestScore": null
}
```

**Example 3: Single Attempt**
```json
{
  "quizId": 3,
  "quizTitle": "Database Quiz",
  "attemptCount": 1,
  "averageScore": 8.0,
  "highestScore": 8,
  "lowestScore": 8
}
```
- All scores same (only one attempt)

---

## 🎯 Complete DTO Package Summary

### All 13 DTOs Documented

| # | File | Lines | Purpose | HTTP Context |
|---|------|-------|---------|--------------|
| 1 | LoginRequest.java | 13 | Login input | POST /auth/login |
| 2 | LoginResponse.java | 8 | Login output | 200 OK |
| 3 | QuizRequest.java | 21 | Quiz create/update | POST/PUT /admin/quizzes |
| 4 | QuizResponse.java | 14 | Full quiz details | GET /admin/quizzes/{id} |
| 5 | QuizSummaryResponse.java | 11 | Quiz list item | GET /admin/quizzes |
| 6 | QuestionRequest.java | 17 | Question input | Nested in QuizRequest |
| 7 | QuestionResponse.java | 9 | Question output | Nested in QuizResponse |
| 8 | OptionRequest.java | 12 | Option input | Nested in QuestionRequest |
| 9 | OptionResponse.java | 6 | Option output | Nested in QuestionResponse |
| 10 | AnswerRequest.java | 7 | Answer submission | Nested in SubmitQuizRequest |
| 11 | SubmitQuizRequest.java | 6 | Quiz submission | POST /candidate/submit |
| 12 | AttemptResponse.java | 11 | Attempt result | 200 OK (after submit) |
| 13 | QuizAnalyticsResponse.java | 9 | Quiz statistics | GET /admin/analytics |

**Total Lines:** ~144

---

### Key Design Patterns

**1. Java Records**
- All DTOs use records (Java 16+)
- Immutable by default
- Auto-generated methods
- Less boilerplate

**2. Request/Response Pairs**
- LoginRequest → LoginResponse
- QuizRequest → QuizResponse
- QuestionRequest → QuestionResponse
- OptionRequest → OptionResponse

**3. Nested DTOs**
- QuizRequest contains List<QuestionRequest>
- QuestionRequest contains List<OptionRequest>
- SubmitQuizRequest contains List<AnswerRequest>

**4. Validation Annotations**
- @NotBlank - Strings cannot be empty
- @NotNull - Objects cannot be null
- @Email - Valid email format
- @Min - Minimum numeric value

**5. Summary vs Full**
- QuizSummaryResponse - List view (lightweight)
- QuizResponse - Detail view (complete)
- Performance optimization

---

### Validation Summary

| DTO | Required Fields | Optional Fields |
|-----|----------------|-----------------|
| LoginRequest | email, password | - |
| QuizRequest | title, duration | description, isActive, questions |
| QuestionRequest | questionText, type, points | options |
| OptionRequest | optionText, isCorrect | - |
| SubmitQuizRequest | - | answers (can be empty) |

---

### Data Flow Examples

**1. Create Quiz Flow**
```
Admin → QuizRequest (JSON)
     → Controller validates
     → Service processes
     → Entity saved
     → QuizResponse (JSON) → Admin
```

**2. Take Quiz Flow**
```
Candidate → GET /quizzes/{id}
         → QuizResponse (isCorrect = null)
         → SubmitQuizRequest
         → AttemptResponse → Candidate
```

**3. View Analytics Flow**
```
Admin → GET /analytics
      → QuizAnalyticsResponse
      → Display stats → Admin
```

---

## ✅ DTO Package Complete!

**Next Packages to Document:**
1. ✅ DTO (COMPLETE - 13 files, ~150 lines)
2. ⏳ Repository (5 files, ~56 lines)
3. ⏳ Service (3 files, ~380 lines)
4. ⏳ Controller (3 files, ~155 lines)
5. ⏳ Security (3 files, ~199 lines)
6. ⏳ Model (6 files, ~247 lines)
7. ⏳ Config (1 file, 27 lines)

**Total Progress:** 13 / 35 files documented (37%)
