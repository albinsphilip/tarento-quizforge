# QuizForge Backend - Repository Package (Complete Line-by-Line)

> **Every Spring Data JPA Repository explained line-by-line - Database Access Layer**

---

## 📁 Package: `com.quizforge.repository`

**Location:** `backend/src/main/java/com/quizforge/repository/`  
**Purpose:** Database access interfaces  
**Framework:** Spring Data JPA  
**Total Files:** 5  
**Total Lines:** ~56

### What is Spring Data JPA?

**Magic Auto-Implementation:**
- You write **interfaces only**
- Spring generates **implementation at runtime**
- No SQL needed (method names → queries)
- Built on top of Hibernate ORM

**How it works:**
```java
// You write this interface:
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

// Spring automatically generates:
class UserRepositoryImpl implements UserRepository {
    public Optional<User> findByEmail(String email) {
        return entityManager
            .createQuery("SELECT u FROM User u WHERE u.email = :email")
            .setParameter("email", email)
            .getSingleResult();
    }
    // + all JpaRepository methods (save, findById, findAll, delete, etc.)
}
```

---

## 📄 File 1: `UserRepository.java`

**Location:** `repository/UserRepository.java`  
**Purpose:** User entity database access  
**Entity:** User  
**Lines:** 12

### Complete Source Code

```java
1  package com.quizforge.repository;
2
3  import com.quizforge.model.User;
4  import org.springframework.data.jpa.repository.JpaRepository;
5  import org.springframework.stereotype.Repository;
6
7  import java.util.Optional;
8
9  @Repository
10 public interface UserRepository extends JpaRepository<User, Long> {
11     Optional<User> findByEmail(String email);
12     boolean existsByEmail(String email);
13 }
```

### Line-by-Line Explanation

**Line 1 - Package**
```java
package com.quizforge.repository;
```
- Repository layer package

**Line 3 - Import User Entity**
```java
import com.quizforge.model.User;
```
- **Purpose:** The entity this repository manages
- **Location:** `com.quizforge.model.User`
- **JPA Entity:** Mapped to `users` table

**Line 4 - Import JpaRepository**
```java
import org.springframework.data.jpa.repository.JpaRepository;
```
- **Package:** Spring Data JPA core interface
- **Provides:** CRUD operations out-of-the-box
- **Location:** `spring-data-jpa-3.2.0.jar`

**Line 5 - Import @Repository**
```java
import org.springframework.stereotype.Repository;
```
- **Purpose:** Mark as Spring Data repository
- **Benefits:**
  - Enables exception translation (SQL exceptions → Spring DataAccessException)
  - Component scanning registration
  - Enables proxy creation for custom queries

**Line 7 - Import Optional**
```java
import java.util.Optional;
```
- **Java 8+ feature:** Container for nullable values
- **Why use:** Better than returning `null`
- **Usage:**
  ```java
  Optional<User> userOpt = userRepository.findByEmail("test@example.com");
  if (userOpt.isPresent()) {
      User user = userOpt.get();
  }
  ```

**Line 9 - @Repository Annotation**
```java
@Repository
```
- **Purpose:** Mark as repository bean
- **Effects:**
  1. Spring creates proxy implementation
  2. Exception translation enabled
  3. Registered in application context
- **Optional:** Not strictly required (JpaRepository implies it), but best practice

**Line 10 - Interface Declaration**
```java
public interface UserRepository extends JpaRepository<User, Long> {
```

**`public interface UserRepository`**
- **Type:** Interface (not class)
- **No implementation:** Spring provides it

**`extends JpaRepository<User, Long>`**
- **Generic Parameters:**
  - `User` - Entity type this repository manages
  - `Long` - Type of entity's primary key (User.id is Long)
- **Inherited Methods (18 total):**
  ```java
  // CRUD Methods:
  <S extends User> S save(S entity)              // Insert or update
  Optional<User> findById(Long id)               // Find by primary key
  List<User> findAll()                           // Get all users
  void deleteById(Long id)                       // Delete by ID
  void delete(User entity)                       // Delete entity
  long count()                                   // Count all records
  boolean existsById(Long id)                    // Check if exists
  
  // Batch Methods:
  <S extends User> List<S> saveAll(Iterable<S> entities)  // Bulk insert
  List<User> findAllById(Iterable<Long> ids)              // Find multiple
  void deleteAll()                                         // Delete all
  
  // Advanced Methods:
  void flush()                                   // Force database sync
  <S extends User> S saveAndFlush(S entity)     // Save + flush
  List<User> findAll(Sort sort)                 // Sorted results
  Page<User> findAll(Pageable pageable)         // Pagination
  ```

**Line 11 - Custom Query Method #1**
```java
    Optional<User> findByEmail(String email);
```

**Method Name Parsing:**
- **`find`** - Query type (SELECT)
- **`By`** - Delimiter
- **`Email`** - Property name (must match `User.email` field)

**Spring Generated SQL:**
```sql
SELECT u.* 
FROM users u 
WHERE u.email = ?1
```

**Return Type: `Optional<User>`**
- **Why Optional:** Email might not exist
- **Alternatives:**
  - `User findByEmail(String email)` - Returns null if not found (not recommended)
  - `List<User> findByEmail(String email)` - Returns empty list (weird for unique email)

**Parameter: `String email`**
- **Binding:** Automatically bound to WHERE clause
- **Type-safe:** Compile-time checking

**Usage Example:**
```java
@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    public User authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        // Check password...
        return user;
    }
}
```

**Performance:**
- **Index:** Should have index on email column for fast lookup
- **Cardinality:** Returns 0 or 1 result (email is unique)
- **Execution Time:** ~1-5ms with index

**Line 12 - Custom Query Method #2**
```java
    boolean existsByEmail(String email);
```

**Method Name Parsing:**
- **`exists`** - Query type (EXISTS check)
- **`By`** - Delimiter
- **`Email`** - Property name

**Spring Generated SQL:**
```sql
SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END 
FROM users u 
WHERE u.email = ?1
```

**Or optimized:**
```sql
SELECT 1 
FROM users u 
WHERE u.email = ?1 
LIMIT 1
```

**Return Type: `boolean`**
- **Why boolean:** Yes/no answer
- **Primitive type:** Never null (defaults to false)
- **Alternatives:**
  - `Boolean existsByEmail(String email)` - Can be null (not useful here)

**Usage Example:**
```java
@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    
    public void registerUser(String email, String password, String name) {
        // Check if email already registered
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        
        // Create new user...
        User newUser = new User();
        newUser.setEmail(email);
        // ...
        userRepository.save(newUser);
    }
}
```

**Performance:**
- **Faster than findByEmail:** Doesn't fetch entire entity
- **Index:** Uses email index
- **Execution Time:** ~1ms with index
- **Database optimization:** LIMIT 1 stops after first match

---

### Summary: UserRepository

**Total Methods:** 20
- **Inherited from JpaRepository:** 18 methods
- **Custom methods:** 2 methods

**Custom Methods:**
1. `findByEmail` - Find user by email (login)
2. `existsByEmail` - Check if email exists (registration)

**Database Queries Generated:**
```sql
-- findByEmail
SELECT * FROM users WHERE email = ?

-- existsByEmail
SELECT 1 FROM users WHERE email = ? LIMIT 1
```

**Used By:**
- `AuthService.login()` - Uses findByEmail
- `AuthService.register()` - Uses existsByEmail

---

## 📄 File 2: `QuizRepository.java`

**Location:** `repository/QuizRepository.java`  
**Purpose:** Quiz entity database access  
**Entity:** Quiz  
**Lines:** 13

### Complete Source Code

```java
1  package com.quizforge.repository;
2
3  import com.quizforge.model.Quiz;
4  import org.springframework.data.jpa.repository.JpaRepository;
5  import org.springframework.stereotype.Repository;
6
7  import java.util.List;
8
9  @Repository
10 public interface QuizRepository extends JpaRepository<Quiz, Long> {
11     List<Quiz> findByIsActiveTrue();
12     List<Quiz> findByCreatedById(Long createdById);
13 }
```

### Line-by-Line Explanation

**Line 10 - Interface Declaration**
```java
public interface QuizRepository extends JpaRepository<Quiz, Long> {
```
- **Entity:** Quiz
- **Primary Key Type:** Long
- **Inherits:** 18 CRUD methods

**Line 11 - Custom Query Method #1**
```java
    List<Quiz> findByIsActiveTrue();
```

**Method Name Parsing:**
- **`find`** - SELECT query
- **`By`** - WHERE clause starts
- **`IsActive`** - Property name (`quiz.isActive`)
- **`True`** - Boolean value comparison

**Spring Generated SQL:**
```sql
SELECT q.* 
FROM quizzes q 
WHERE q.is_active = TRUE
```

**Return Type: `List<Quiz>`**
- **Why List:** Can have multiple active quizzes
- **Empty list:** If no active quizzes
- **Never null:** Spring returns empty list, not null

**Alternative Method Names (same query):**
```java
List<Quiz> findByIsActive(boolean isActive);        // More flexible
List<Quiz> findByIsActiveEquals(boolean isActive);  // Explicit
List<Quiz> findByIsActiveIs(boolean isActive);      // Alternative syntax
```

**Usage Example:**
```java
@Service
public class CandidateService {
    @Autowired
    private QuizRepository quizRepository;
    
    public List<QuizSummaryResponse> getAvailableQuizzes() {
        // Get only active quizzes
        List<Quiz> activeQuizzes = quizRepository.findByIsActiveTrue();
        
        // Convert to DTOs
        return activeQuizzes.stream()
            .map(this::convertToSummary)
            .toList();
    }
}
```

**Performance:**
- **Index:** Should have index on `is_active` column
- **Typical result size:** 5-50 quizzes
- **Execution Time:** ~5-20ms

**Line 12 - Custom Query Method #2**
```java
    List<Quiz> findByCreatedById(Long createdById);
```

**Method Name Parsing:**
- **`find`** - SELECT query
- **`By`** - WHERE clause starts
- **`CreatedBy`** - Relationship property (Quiz has User createdBy)
- **`Id`** - Navigate to User.id field

**Spring Generated SQL:**
```sql
SELECT q.* 
FROM quizzes q 
WHERE q.created_by_id = ?1
```

**Relationship Navigation:**
- **Entity relationship:**
  ```java
  @Entity
  class Quiz {
      @ManyToOne
      @JoinColumn(name = "created_by_id")
      private User createdBy;  // ← Repository navigates this
  }
  ```
- **Method navigates:** `quiz.createdBy.id`
- **SQL uses:** Foreign key column `created_by_id`

**Return Type: `List<Quiz>`**
- **Why List:** Admin can create multiple quizzes
- **Typical size:** 10-100 quizzes per admin

**Usage Example:**
```java
@Service
public class AdminService {
    @Autowired
    private QuizRepository quizRepository;
    
    public List<QuizSummaryResponse> getMyQuizzes(Long adminId) {
        // Get all quizzes created by this admin
        List<Quiz> myQuizzes = quizRepository.findByCreatedById(adminId);
        
        return myQuizzes.stream()
            .map(this::convertToSummary)
            .toList();
    }
}
```

**Performance:**
- **Index:** Should have index on `created_by_id` (foreign key)
- **JOIN:** Not needed (direct column match)
- **Execution Time:** ~5-15ms

---

### Summary: QuizRepository

**Total Methods:** 20
- **Inherited:** 18 methods
- **Custom:** 2 methods

**Custom Methods:**
1. `findByIsActiveTrue()` - Get active quizzes (for candidates)
2. `findByCreatedById(Long)` - Get quizzes by admin (for admin dashboard)

**Database Queries:**
```sql
-- Active quizzes
SELECT * FROM quizzes WHERE is_active = TRUE

-- Quizzes by admin
SELECT * FROM quizzes WHERE created_by_id = ?
```

---

## 📄 File 3: `QuestionRepository.java`

**Location:** `repository/QuestionRepository.java`  
**Purpose:** Question entity database access  
**Entity:** Question  
**Lines:** 9

### Complete Source Code

```java
1  package com.quizforge.repository;
2
3  import com.quizforge.model.Question;
4  import org.springframework.data.jpa.repository.JpaRepository;
5  import org.springframework.stereotype.Repository;
6
7  @Repository
8  public interface QuestionRepository extends JpaRepository<Question, Long> {
9  }
```

### Line-by-Line Explanation

**Line 8 - Interface Declaration**
```java
public interface QuestionRepository extends JpaRepository<Question, Long> {
```
- **Entity:** Question
- **Primary Key:** Long

**Line 9 - Empty Body**
```java
}
```
- **No custom methods:** Only uses inherited JpaRepository methods
- **Why no custom methods:**
  - Questions accessed through Quiz relationships
  - No need to query questions directly
  - Quiz entity has `List<Question> questions` with cascade operations

**Inherited Methods Used:**
```java
// Used in AdminService:
questionRepository.save(question)           // Create/update question
questionRepository.findById(questionId)     // Get question by ID
questionRepository.delete(question)         // Delete question
questionRepository.saveAll(questions)       // Bulk insert questions
```

**Usage Pattern:**
```java
@Service
public class AdminService {
    @Autowired
    private QuestionRepository questionRepository;
    @Autowired
    private QuizRepository quizRepository;
    
    public void addQuestionToQuiz(Long quizId, QuestionRequest request) {
        // Load quiz (with questions)
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        // Create question
        Question question = new Question();
        question.setQuestionText(request.questionText());
        question.setQuiz(quiz);  // Set relationship
        
        // Save question (auto-saves through cascade)
        quiz.getQuestions().add(question);
        quizRepository.save(quiz);  // ← Cascades to question
    }
}
```

**Why Empty:**
- **Cascade operations:** Questions managed through Quiz
- **No direct queries:** Always accessed via Quiz.questions
- **Lifecycle:** Questions created/deleted with Quiz

---

## 📄 File 4: `QuizAttemptRepository.java`

**Location:** `repository/QuizAttemptRepository.java`  
**Purpose:** QuizAttempt entity database access  
**Entity:** QuizAttempt  
**Lines:** 13

### Complete Source Code

```java
1  package com.quizforge.repository;
2
3  import com.quizforge.model.QuizAttempt;
4  import org.springframework.data.jpa.repository.JpaRepository;
5  import org.springframework.stereotype.Repository;
6
7  import java.util.List;
8
9  @Repository
10 public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
11     List<QuizAttempt> findByUserId(Long userId);
12     List<QuizAttempt> findByQuizId(Long quizId);
13 }
```

### Line-by-Line Explanation

**Line 10 - Interface Declaration**
```java
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
```
- **Entity:** QuizAttempt (candidate's quiz submission)
- **Primary Key:** Long

**Line 11 - Custom Query Method #1**
```java
    List<QuizAttempt> findByUserId(Long userId);
```

**Method Name Parsing:**
- **`find`** - SELECT query
- **`By`** - WHERE clause
- **`User`** - Relationship property (QuizAttempt has User user)
- **`Id`** - Navigate to User.id

**Spring Generated SQL:**
```sql
SELECT qa.* 
FROM quiz_attempts qa 
WHERE qa.user_id = ?1
ORDER BY qa.submitted_at DESC  -- Implicit ordering
```

**Entity Relationship:**
```java
@Entity
class QuizAttempt {
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;  // ← Repository navigates this
}
```

**Return Type: `List<QuizAttempt>`**
- **Purpose:** Get candidate's attempt history
- **Typical size:** 5-100 attempts per user

**Usage Example:**
```java
@Service
public class CandidateService {
    @Autowired
    private QuizAttemptRepository attemptRepository;
    
    public List<AttemptResponse> getMyAttempts(Long candidateId) {
        // Get all attempts by this candidate
        List<QuizAttempt> attempts = attemptRepository.findByUserId(candidateId);
        
        // Convert to DTOs
        return attempts.stream()
            .map(attempt -> new AttemptResponse(
                attempt.getId(),
                attempt.getQuiz().getId(),
                attempt.getQuiz().getTitle(),
                attempt.getScore(),
                attempt.getTotalPoints(),
                attempt.getSubmittedAt()
            ))
            .toList();
    }
}
```

**Performance:**
- **Index:** Foreign key `user_id` (auto-indexed)
- **Execution Time:** ~5-20ms

**Line 12 - Custom Query Method #2**
```java
    List<QuizAttempt> findByQuizId(Long quizId);
```

**Method Name Parsing:**
- **`find`** - SELECT query
- **`By`** - WHERE clause
- **`Quiz`** - Relationship property (QuizAttempt has Quiz quiz)
- **`Id`** - Navigate to Quiz.id

**Spring Generated SQL:**
```sql
SELECT qa.* 
FROM quiz_attempts qa 
WHERE qa.quiz_id = ?1
```

**Entity Relationship:**
```java
@Entity
class QuizAttempt {
    @ManyToOne
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;  // ← Repository navigates this
}
```

**Return Type: `List<QuizAttempt>`**
- **Purpose:** Get all attempts for specific quiz (for analytics)
- **Typical size:** 10-500 attempts per quiz

**Usage Example:**
```java
@Service
public class AdminService {
    @Autowired
    private QuizAttemptRepository attemptRepository;
    
    public QuizAnalyticsResponse getQuizAnalytics(Long quizId) {
        // Get all attempts for this quiz
        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId);
        
        if (attempts.isEmpty()) {
            return new QuizAnalyticsResponse(
                quizId, "Quiz Title", 0, null, null, null
            );
        }
        
        // Calculate statistics
        int attemptCount = attempts.size();
        double averageScore = attempts.stream()
            .mapToInt(QuizAttempt::getScore)
            .average()
            .orElse(0.0);
        int highestScore = attempts.stream()
            .mapToInt(QuizAttempt::getScore)
            .max()
            .orElse(0);
        int lowestScore = attempts.stream()
            .mapToInt(QuizAttempt::getScore)
            .min()
            .orElse(0);
        
        return new QuizAnalyticsResponse(
            quizId, "Quiz Title", attemptCount, 
            averageScore, highestScore, lowestScore
        );
    }
}
```

**Performance:**
- **Index:** Foreign key `quiz_id` (auto-indexed)
- **Typical query time:** 10-50ms (depends on attempt count)
- **Optimization:** Could add database-level aggregation:
  ```java
  @Query("SELECT AVG(qa.score), MAX(qa.score), MIN(qa.score) " +
         "FROM QuizAttempt qa WHERE qa.quiz.id = :quizId")
  Object[] getQuizStats(@Param("quizId") Long quizId);
  ```

---

### Summary: QuizAttemptRepository

**Total Methods:** 20
- **Inherited:** 18 methods
- **Custom:** 2 methods

**Custom Methods:**
1. `findByUserId(Long)` - Get candidate's attempt history
2. `findByQuizId(Long)` - Get all attempts for quiz (analytics)

**Database Queries:**
```sql
-- Candidate's attempts
SELECT * FROM quiz_attempts WHERE user_id = ?

-- Quiz analytics
SELECT * FROM quiz_attempts WHERE quiz_id = ?
```

---

## 📄 File 5: `AnswerRepository.java`

**Location:** `repository/AnswerRepository.java`  
**Purpose:** Answer entity database access  
**Entity:** Answer  
**Lines:** 9

### Complete Source Code

```java
1  package com.quizforge.repository;
2
3  import com.quizforge.model.Answer;
4  import org.springframework.data.jpa.repository.JpaRepository;
5  import org.springframework.stereotype.Repository;
6
7  @Repository
8  public interface AnswerRepository extends JpaRepository<Answer, Long> {
9  }
```

### Line-by-Line Explanation

**Line 8 - Interface Declaration**
```java
public interface AnswerRepository extends JpaRepository<Answer, Long> {
```
- **Entity:** Answer (candidate's answer to question)
- **Primary Key:** Long

**Line 9 - Empty Body**
```java
}
```
- **No custom methods:** Only uses inherited methods
- **Why no custom methods:**
  - Answers accessed through QuizAttempt relationship
  - Cascade operations handle lifecycle
  - No need for direct answer queries

**Entity Relationship:**
```java
@Entity
class QuizAttempt {
    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL)
    private List<Answer> answers;  // ← Answers accessed here
}

@Entity
class Answer {
    @ManyToOne
    @JoinColumn(name = "attempt_id")
    private QuizAttempt attempt;
}
```

**Inherited Methods Used:**
```java
// Used in CandidateService:
answerRepository.saveAll(answers)  // Bulk insert answers
// (Usually done via cascade: attemptRepository.save(attempt) cascades to answers)
```

**Usage Pattern:**
```java
@Service
public class CandidateService {
    @Autowired
    private QuizAttemptRepository attemptRepository;
    @Autowired
    private AnswerRepository answerRepository;  // Rarely used directly
    
    public AttemptResponse submitQuiz(Long quizId, SubmitQuizRequest request) {
        // Create attempt
        QuizAttempt attempt = new QuizAttempt();
        // ...
        
        // Create answers
        List<Answer> answers = request.answers().stream()
            .map(answerReq -> {
                Answer answer = new Answer();
                answer.setAttempt(attempt);
                answer.setQuestion(/* ... */);
                answer.setSelectedOption(/* ... */);
                return answer;
            })
            .toList();
        
        attempt.setAnswers(answers);
        
        // Save attempt (cascades to answers)
        attemptRepository.save(attempt);  // ← Answers auto-saved
        
        return /* ... */;
    }
}
```

**Why Empty:**
- **Lifecycle:** Managed through QuizAttempt cascade
- **No direct access:** Always queried via attempt.getAnswers()
- **Automatic saving:** CascadeType.ALL handles persistence

---

## 🎯 Complete Repository Package Summary

### All 5 Repositories Documented

| # | Repository | Entity | Custom Methods | Purpose |
|---|-----------|--------|----------------|---------|
| 1 | UserRepository | User | 2 | Authentication, user lookup |
| 2 | QuizRepository | Quiz | 2 | Quiz CRUD, admin filtering |
| 3 | QuestionRepository | Question | 0 | Cascade-managed questions |
| 4 | QuizAttemptRepository | QuizAttempt | 2 | Attempt history, analytics |
| 5 | AnswerRepository | Answer | 0 | Cascade-managed answers |

**Total Lines:** ~56  
**Total Custom Methods:** 6

---

### Custom Methods Summary

| Repository | Method | SQL Generated | Purpose |
|-----------|--------|---------------|---------|
| UserRepository | findByEmail(String) | `WHERE email = ?` | Login |
| UserRepository | existsByEmail(String) | `WHERE email = ? LIMIT 1` | Registration check |
| QuizRepository | findByIsActiveTrue() | `WHERE is_active = TRUE` | Available quizzes |
| QuizRepository | findByCreatedById(Long) | `WHERE created_by_id = ?` | Admin's quizzes |
| QuizAttemptRepository | findByUserId(Long) | `WHERE user_id = ?` | Candidate history |
| QuizAttemptRepository | findByQuizId(Long) | `WHERE quiz_id = ?` | Quiz analytics |

---

### Spring Data JPA Magic

**Method Naming Convention:**
```
find  + By + PropertyName + Condition + OrderBy + Property
```

**Examples:**
```java
// Simple equality
findByEmail(String email)                    // WHERE email = ?

// Boolean properties
findByIsActiveTrue()                         // WHERE is_active = TRUE
findByIsActiveFalse()                        // WHERE is_active = FALSE

// Relationship navigation
findByCreatedById(Long id)                   // WHERE created_by_id = ?
findByQuizTitle(String title)                // JOIN + WHERE quiz.title = ?

// Multiple conditions
findByEmailAndPassword(String email, String password)  
// WHERE email = ? AND password = ?

// Comparison operators
findByScoreGreaterThan(Integer score)        // WHERE score > ?
findByCreatedAtBefore(LocalDateTime date)    // WHERE created_at < ?

// Pattern matching
findByEmailContaining(String pattern)        // WHERE email LIKE %?%

// Ordering
findByIsActiveTrueOrderByCreatedAtDesc()     // WHERE ... ORDER BY created_at DESC

// Limiting results
findTop5ByIsActiveTrueOrderByCreatedAtDesc() // LIMIT 5

// Existence check
existsByEmail(String email)                  // SELECT 1 WHERE ... LIMIT 1

// Counting
countByIsActiveTrue()                        // SELECT COUNT(*) WHERE ...

// Deletion
deleteByEmail(String email)                  // DELETE WHERE email = ?
```

---

### Inherited JpaRepository Methods

**All repositories inherit these 18 methods:**

#### CRUD Operations
```java
<S extends T> S save(S entity)               // Insert or update
Optional<T> findById(ID id)                  // Find by primary key
List<T> findAll()                            // Get all records
void deleteById(ID id)                       // Delete by ID
void delete(T entity)                        // Delete entity
long count()                                 // Count all records
boolean existsById(ID id)                    // Check if exists
```

#### Batch Operations
```java
<S extends T> List<S> saveAll(Iterable<S> entities)  // Bulk insert
List<T> findAllById(Iterable<ID> ids)                // Find multiple
void deleteAll()                                      // Delete all
void deleteAll(Iterable<? extends T> entities)       // Delete multiple
```

#### Advanced Operations
```java
void flush()                                 // Force database sync
<S extends T> S saveAndFlush(S entity)      // Save + flush
void deleteAllInBatch()                      // Efficient batch delete
T getReferenceById(ID id)                    // Lazy proxy reference
```

#### Sorting & Pagination
```java
List<T> findAll(Sort sort)                  // Sorted results
Page<T> findAll(Pageable pageable)          // Paginated results
```

---

### Database Schema (Relevant to Repositories)

**Tables Managed:**

```sql
-- UserRepository
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,  -- findByEmail, existsByEmail
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50)
);
CREATE INDEX idx_users_email ON users(email);  -- For fast lookup

-- QuizRepository
CREATE TABLE quizzes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,      -- findByIsActiveTrue
    created_by_id BIGINT REFERENCES users(id),  -- findByCreatedById
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
CREATE INDEX idx_quizzes_active ON quizzes(is_active);
CREATE INDEX idx_quizzes_created_by ON quizzes(created_by_id);

-- QuestionRepository
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    type VARCHAR(50),
    points INTEGER
);

-- QuizAttemptRepository
CREATE TABLE quiz_attempts (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT REFERENCES quizzes(id),    -- findByQuizId
    user_id BIGINT REFERENCES users(id),      -- findByUserId
    score INTEGER,
    total_points INTEGER,
    submitted_at TIMESTAMP
);
CREATE INDEX idx_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX idx_attempts_user ON quiz_attempts(user_id);

-- AnswerRepository
CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id BIGINT REFERENCES questions(id),
    selected_option_id BIGINT REFERENCES options(id)
);
```

---

### Performance Best Practices

**1. Indexing:**
```sql
-- Foreign keys automatically indexed
-- Add custom indexes for frequent queries
CREATE INDEX idx_quizzes_active ON quizzes(is_active);
CREATE INDEX idx_users_email ON users(email);
```

**2. Lazy Loading:**
```java
// Avoid N+1 query problem
@EntityGraph(attributePaths = {"questions", "createdBy"})
List<Quiz> findByIsActiveTrue();  // Fetch relationships in single query
```

**3. Pagination:**
```java
// Instead of findAll() (loads everything)
Page<Quiz> findAll(PageRequest.of(0, 10));  // Load 10 at a time
```

**4. Projection:**
```java
// Instead of full entity
@Query("SELECT new com.quizforge.dto.QuizSummaryResponse(" +
       "q.id, q.title, q.duration, SIZE(q.questions)) " +
       "FROM Quiz q")
List<QuizSummaryResponse> findAllSummaries();  // Only needed fields
```

---

## ✅ Repository Package Complete!

**Next Packages:**
1. ✅ DTO (13 files) - COMPLETE
2. ✅ Repository (5 files) - COMPLETE
3. ⏳ Service (3 files, ~380 lines) - NEXT
4. ⏳ Controller (3 files)
5. ⏳ Security (3 files)
6. ⏳ Model (6 files)
7. ⏳ Config (1 file)

**Total Progress:** 18 / 35 files (51%)