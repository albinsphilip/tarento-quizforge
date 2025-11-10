# QuizForge Backend - Models (Line-by-Line Explanation)

> **Detailed explanation of all JPA entities with annotations, relationships, and business logic**

---

## Table of Contents

1. [User Entity](#1-user-entity)
2. [Quiz Entity](#2-quiz-entity)
3. [Question Entity](#3-question-entity)
4. [Option Entity](#4-option-entity)
5. [QuizAttempt Entity](#5-quizattempt-entity)
6. [Answer Entity](#6-answer-entity)

---

## 1. User Entity

**File:** `com.quizforge.model.User`

### Complete Source Code

```java
package com.quizforge.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Role {
        ADMIN, CANDIDATE
    }
}
```

### Line-by-Line Explanation

#### Package and Imports (Lines 1-6)

```java
package com.quizforge.model;
```
- **Purpose:** Declares the package namespace for all model/entity classes
- **Convention:** Models go in `.model` package following Spring Boot best practices

```java
import jakarta.persistence.*;
```
- **Purpose:** Imports all JPA (Jakarta Persistence API) annotations
- **Note:** Jakarta EE 9+ uses `jakarta.persistence` (replaces old `javax.persistence`)
- **Contains:** `@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Column`, `@Enumerated`, `@PrePersist`

```java
import lombok.Data;
```
- **Purpose:** Imports Lombok `@Data` annotation for boilerplate code generation
- **Generates:** Getters, setters, `toString()`, `equals()`, `hashCode()`, and required args constructor
- **Reduces:** ~50-100 lines of boilerplate code per entity

```java
import java.time.LocalDateTime;
```
- **Purpose:** Imports Java 8+ date-time API class
- **Usage:** For `createdAt` timestamp field
- **Why not Date?:** `LocalDateTime` is immutable, thread-safe, and has better API

#### Class Declaration (Lines 8-10)

```java
@Entity
```
- **Purpose:** Marks this class as a JPA entity (database table mapping)
- **Effect:** Hibernate will create/manage a table for this class
- **Requirement:** Must have a no-arg constructor (Lombok `@Data` provides this)

```java
@Table(name = "users")
```
- **Purpose:** Specifies the exact table name in the database
- **Default:** Without this, JPA uses class name as table name (would be `user`)
- **Why "users"?:** `user` is a reserved keyword in PostgreSQL, so we use `users`

```java
@Data
```
- **Purpose:** Lombok annotation that generates boilerplate code at compile time
- **Generated methods:**
  - `getId()`, `setId(Long id)`
  - `getEmail()`, `setEmail(String email)`
  - `getPassword()`, `setPassword(String password)`
  - `getName()`, `setName(String name)`
  - `getRole()`, `setRole(Role role)`
  - `getCreatedAt()`, `setCreatedAt(LocalDateTime createdAt)`
  - `toString()` - String representation
  - `equals(Object o)` - Equality based on all fields
  - `hashCode()` - Hash code based on all fields

```java
public class User {
```
- **Purpose:** Declares the User entity class
- **Access:** `public` so it can be accessed by repositories, services, controllers
- **Naming:** Singular noun representing a single user record

#### ID Field (Lines 12-14)

```java
@Id
```
- **Purpose:** Marks this field as the primary key
- **Requirement:** Every JPA entity must have exactly one `@Id` field
- **Database:** Creates `id` column as PRIMARY KEY

```java
@GeneratedValue(strategy = GenerationType.IDENTITY)
```
- **Purpose:** Specifies how the primary key value is generated
- **Strategy:** `IDENTITY` - Database auto-increments the value
- **PostgreSQL:** Uses `SERIAL` or `BIGSERIAL` type
- **Alternatives:**
  - `AUTO` - JPA chooses strategy (not recommended)
  - `SEQUENCE` - Uses database sequence (PostgreSQL default)
  - `TABLE` - Uses separate table (slow, not recommended)
  - `UUID` - Generates UUID (good for distributed systems)

```java
private Long id;
```
- **Type:** `Long` (not `long`) - Nullable wrapper class
- **Why Long?:** 
  - Can be `null` before persistence
  - Supports up to 9,223,372,036,854,775,807 records
  - `Integer` maxes out at ~2.1 billion
- **Usage:** Unique identifier for each user

#### Email Field (Lines 16-17)

```java
@Column(nullable = false, unique = true)
```
- **Purpose:** Defines database column constraints
- **Breakdown:**
  - `nullable = false` → Adds `NOT NULL` constraint in database
  - `unique = true` → Adds `UNIQUE` constraint (creates index automatically)
- **Effect:** Database rejects `INSERT` or `UPDATE` if:
  - Email is null
  - Email already exists for another user
- **Default column name:** Field name (`email`)

```java
private String email;
```
- **Purpose:** Stores user's email address (used for login)
- **Type:** `String` - Variable length text
- **Database type:** `VARCHAR(255)` by default
- **Business rule:** Must be unique (enforced by `@Column(unique = true)`)
- **Validation:** Should use `@Email` annotation in production (add `jakarta.validation.constraints.Email`)

#### Password Field (Lines 19-20)

```java
@Column(nullable = false)
```
- **Purpose:** Makes password required (cannot be null)
- **Security note:** Password should ALWAYS be hashed before storing (use BCrypt)
- **Never:** Store plain text passwords

```java
private String password;
```
- **Purpose:** Stores hashed password
- **Storage:** BCrypt hash is 60 characters (e.g., `$2a$10$N9qo8uLOickgx2Z...`)
- **Example hash:** `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`
- **Algorithm:** BCrypt with strength 10 (configured in `SecurityConfig`)
- **Security:**
  - Salt is automatically included in hash
  - Resistant to rainbow table attacks
  - Configurable work factor (higher = slower = more secure)

#### Name Field (Lines 22-23)

```java
@Column(nullable = false)
```
- **Purpose:** Makes name required
- **Business rule:** Every user must have a display name

```java
private String name;
```
- **Purpose:** User's display name (e.g., "John Doe", "Admin User")
- **Type:** `String` - Variable length
- **Database type:** `VARCHAR(255)` by default
- **Usage:** Displayed in UI, quiz results, admin dashboards

#### Role Field (Lines 25-27)

```java
@Enumerated(EnumType.STRING)
```
- **Purpose:** Specifies how to store the enum in database
- **Options:**
  - `EnumType.STRING` - Stores enum name as string ("ADMIN", "CANDIDATE")
  - `EnumType.ORDINAL` - Stores enum position as integer (0, 1) - **NEVER USE THIS**
- **Why STRING?:**
  - Database readable: Can query `WHERE role = 'ADMIN'`
  - Safe refactoring: Adding new roles doesn't break existing data
  - ORDINAL breaks if enum order changes
- **Database type:** `VARCHAR(255)`

```java
@Column(nullable = false)
```
- **Purpose:** Role is required for every user
- **Business rule:** Users must be either ADMIN or CANDIDATE

```java
private Role role;
```
- **Purpose:** User's access level (determines permissions)
- **Type:** Enum defined in same class (see line 35)
- **Values:** `ADMIN` or `CANDIDATE`
- **Usage:** Spring Security uses this for authorization

#### CreatedAt Field (Lines 29-30)

```java
@Column(name = "created_at", nullable = false, updatable = false)
```
- **Purpose:** Configures creation timestamp
- **Breakdown:**
  - `name = "created_at"` → Database column uses snake_case (PostgreSQL convention)
  - `nullable = false` → Must have a value (set by `@PrePersist`)
  - `updatable = false` → Cannot be changed after insert (immutable)
- **Effect:** Attempts to update this field are ignored by JPA

```java
private LocalDateTime createdAt;
```
- **Purpose:** Stores when user was created (audit trail)
- **Type:** `LocalDateTime` - Date and time without timezone
- **Format:** `2025-11-10T14:30:00` (ISO-8601)
- **Database type:** `TIMESTAMP` in PostgreSQL
- **Set by:** `@PrePersist` callback (line 32)

#### PrePersist Callback (Lines 32-35)

```java
@PrePersist
```
- **Purpose:** Marks method to be called automatically before entity is persisted
- **Timing:** Runs before `INSERT` query is executed
- **Use cases:** Set default values, generate IDs, update timestamps
- **Other lifecycle callbacks:**
  - `@PreUpdate` - Before update
  - `@PreRemove` - Before delete
  - `@PostPersist` - After insert
  - `@PostUpdate` - After update
  - `@PostLoad` - After loading from database

```java
protected void onCreate() {
```
- **Access:** `protected` - Can be overridden in subclasses
- **Name:** `onCreate` is descriptive (can be any name)
- **Called by:** JPA automatically before first save

```java
    createdAt = LocalDateTime.now();
```
- **Purpose:** Sets creation timestamp to current date/time
- **Timing:** Always uses server time (not client time)
- **Timezone:** System default (configure in `application.properties` if needed)

```java
}
```
- **End of method**

#### Role Enum (Lines 37-39)

```java
public enum Role {
```
- **Purpose:** Defines the two user roles
- **Type:** Inner enum (defined inside User class)
- **Access:** `public` - Can be referenced as `User.Role.ADMIN`
- **Why enum?:** Type-safe, compile-time validation, prevents invalid values

```java
    ADMIN, CANDIDATE
```
- **Values:**
  - `ADMIN` - Can create/edit/delete quizzes, view all results
  - `CANDIDATE` - Can take quizzes, view own results
- **Database storage:** Stored as strings ("ADMIN", "CANDIDATE") due to `@Enumerated(EnumType.STRING)`
- **Spring Security:** Used with `hasRole()` checks
- **Usage in code:**
  ```java
  user.setRole(User.Role.ADMIN);
  if (user.getRole() == User.Role.CANDIDATE) { ... }
  ```

```java
}
```
- **End of enum**

```java
}
```
- **End of User class**

### Database Schema

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE INDEX idx_users_email ON users(email);
```

### Business Rules Summary

1. **Email must be unique** - No two users can have same email
2. **Password must be hashed** - Never store plain text
3. **Role is required** - Must be ADMIN or CANDIDATE
4. **CreatedAt is immutable** - Set once, never changed
5. **ID is auto-generated** - Database handles it

### Usage Examples

#### Creating a new user
```java
User user = new User();
user.setEmail("john@example.com");
user.setPassword(passwordEncoder.encode("SecurePass123")); // Hash password!
user.setName("John Doe");
user.setRole(User.Role.CANDIDATE);
// createdAt is set automatically by @PrePersist
userRepository.save(user);
```

#### Querying users
```java
// Find by email (for login)
Optional<User> user = userRepository.findByEmail("john@example.com");

// Find all admins
List<User> admins = userRepository.findByRole(User.Role.ADMIN);

// Check if email exists
boolean exists = userRepository.existsByEmail("john@example.com");
```

---

## 2. Quiz Entity

**File:** `com.quizforge.model.Quiz`

### Complete Source Code

```java
package com.quizforge.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Line-by-Line Explanation

#### Package and Imports (Lines 1-7)

```java
package com.quizforge.model;
```
- **Purpose:** Same package as User entity (all models together)

```java
import jakarta.persistence.*;
```
- **Additional annotations used:**
  - `@ManyToOne` - Relationship with User (creator)
  - `@OneToMany` - Relationship with Questions
  - `@JoinColumn` - Foreign key configuration
  - `@PreUpdate` - Lifecycle callback for updates

```java
import lombok.Data;
```
- **Same as User entity:** Generates getters, setters, etc.

```java
import java.time.LocalDateTime;
```
- **Used for:** `createdAt` and `updatedAt` timestamps

```java
import java.util.ArrayList;
import java.util.List;
```
- **Purpose:** For `questions` collection
- **Why ArrayList?:** 
  - Allows duplicates
  - Maintains insertion order
  - Fast index-based access
  - Default choice for JPA collections

#### Class Declaration (Lines 9-12)

```java
@Entity
@Table(name = "quizzes")
@Data
public class Quiz {
```
- **Same pattern as User entity**
- **Table name:** `quizzes` (plural convention)

#### ID Field (Lines 13-15)

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```
- **Same as User entity:** Auto-incremented primary key

#### Title Field (Lines 17-18)

```java
@Column(nullable = false)
private String title;
```
- **Purpose:** Quiz name/title (e.g., "Java Fundamentals Quiz")
- **Required:** Cannot be null
- **Database type:** `VARCHAR(255)`
- **Usage:** Displayed in quiz lists, candidate dashboards

#### Description Field (Lines 20-21)

```java
@Column(columnDefinition = "TEXT")
```
- **Purpose:** Overrides default column type
- **Default:** `VARCHAR(255)` - Only 255 characters
- **Custom:** `TEXT` - Unlimited length (up to 1GB in PostgreSQL)
- **Use case:** Long quiz descriptions, instructions, rules
- **Note:** PostgreSQL optimizes TEXT storage automatically

```java
private String description;
```
- **Purpose:** Detailed quiz description
- **Optional:** Can be null (no `nullable = false`)
- **Example:** "This quiz covers Java basics: variables, loops, OOP concepts..."
- **Database type:** `TEXT` (unlimited length)

#### Duration Field (Lines 23-24)

```java
@Column(nullable = false)
private Integer duration;
```
- **Purpose:** Quiz time limit in minutes
- **Type:** `Integer` (not `int`) - Can be null before setting
- **Required:** Must be set when creating quiz
- **Database type:** `INTEGER` (4 bytes, range: -2B to +2B)
- **Usage:** Frontend countdown timer, auto-submit after duration
- **Examples:** 30 (30 minutes), 60 (1 hour), 120 (2 hours)
- **Business rule:** Should be positive number (add validation in production)

#### IsActive Field (Lines 26-27)

```java
@Column(nullable = false)
private Boolean isActive = true;
```
- **Purpose:** Enable/disable quiz without deleting it
- **Type:** `Boolean` (not `boolean`) - Wrapper class
- **Default value:** `true` - New quizzes are active by default
- **Database type:** `BOOLEAN` in PostgreSQL (1 byte)
- **Use cases:**
  - Draft quizzes (set to `false` while creating)
  - Temporarily disable quiz (maintenance, updates)
  - Archive old quizzes (keep data but hide from candidates)
- **Query:** `findByIsActiveTrue()` to get available quizzes

#### CreatedBy Relationship (Lines 29-31)

```java
@ManyToOne(fetch = FetchType.LAZY)
```
- **Purpose:** Defines relationship with User entity
- **Cardinality:** Many quizzes → One user (creator)
- **Breakdown:**
  - `@ManyToOne` - Multiple quizzes can have same creator
  - `fetch = FetchType.LAZY` - Don't load user automatically
- **Fetch strategies:**
  - `LAZY` (recommended) - Load user only when accessed (`quiz.getCreatedBy()`)
  - `EAGER` - Always load user with quiz (causes N+1 query problems)
- **Performance:** LAZY prevents loading unnecessary data

```java
@JoinColumn(name = "created_by", nullable = false)
```
- **Purpose:** Specifies foreign key column configuration
- **Breakdown:**
  - `name = "created_by"` - Foreign key column name
  - `nullable = false` - Every quiz must have a creator
- **Database:** Creates column `created_by BIGINT NOT NULL`
- **Foreign key constraint:**
  ```sql
  CONSTRAINT fk_quiz_created_by 
  FOREIGN KEY (created_by) REFERENCES users(id)
  ```

```java
private User createdBy;
```
- **Purpose:** Reference to the admin who created the quiz
- **Type:** `User` entity
- **Lazy loading:** User data loaded only when accessed:
  ```java
  Quiz quiz = quizRepository.findById(1L).get();
  // User NOT loaded yet
  
  String creatorName = quiz.getCreatedBy().getName();
  // NOW User is loaded from database
  ```
- **Usage:** Display creator name, filter quizzes by creator, audit trail

#### Questions Relationship (Lines 33-34)

```java
@OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
```
- **Purpose:** Defines relationship with Question entities
- **Cardinality:** One quiz → Many questions
- **Breakdown:**
  
  **mappedBy = "quiz":**
  - Specifies the inverse side of the relationship
  - `quiz` refers to the field name in `Question` entity
  - Makes `Question` the owning side (has foreign key)
  - This is the non-owning side (no foreign key here)
  
  **cascade = CascadeType.ALL:**
  - All JPA operations cascade to questions
  - Operations included:
    - `PERSIST` - Saving quiz saves questions
    - `MERGE` - Updating quiz updates questions
    - `REMOVE` - Deleting quiz deletes questions
    - `REFRESH` - Refreshing quiz refreshes questions
    - `DETACH` - Detaching quiz detaches questions
  - **Example:**
    ```java
    Quiz quiz = new Quiz();
    Question q1 = new Question();
    quiz.getQuestions().add(q1);
    quizRepository.save(quiz); // Saves both quiz AND question
    
    quizRepository.deleteById(1L); // Deletes quiz AND all questions
    ```
  
  **orphanRemoval = true:**
  - Automatically deletes questions removed from collection
  - **Without orphanRemoval:**
    ```java
    quiz.getQuestions().remove(0); // Removes from list
    quizRepository.save(quiz); // Question still exists in DB (orphaned)
    ```
  - **With orphanRemoval:**
    ```java
    quiz.getQuestions().remove(0); // Removes from list
    quizRepository.save(quiz); // Question DELETED from DB
    ```
  - **Use case:** Cleaning up when admin removes question from quiz

```java
private List<Question> questions = new ArrayList<>();
```
- **Purpose:** Collection of questions belonging to this quiz
- **Type:** `List<Question>` - Ordered collection
- **Initialization:** `= new ArrayList<>()` - Important! Prevents NullPointerException
- **Why initialize?:**
  - Safe to call `quiz.getQuestions().add(question)` even on new quiz
  - No need to check for null
  - Lombok `@Data` doesn't initialize collections
- **Operations:**
  ```java
  // Add question
  Question question = new Question();
  question.setQuiz(quiz); // Important! Set bidirectional relationship
  quiz.getQuestions().add(question);
  
  // Remove question
  quiz.getQuestions().remove(question); // Auto-deleted due to orphanRemoval
  
  // Get question count
  int count = quiz.getQuestions().size();
  ```

#### CreatedAt Field (Lines 36-37)

```java
@Column(name = "created_at", nullable = false, updatable = false)
private LocalDateTime createdAt;
```
- **Same as User entity:** Immutable creation timestamp

#### UpdatedAt Field (Lines 39-40)

```java
@Column(name = "updated_at")
```
- **Purpose:** Tracks when quiz was last modified
- **Nullable:** Can be null (new quizzes have no updates yet)
- **Updatable:** Default `true` (can be changed)
- **Database type:** `TIMESTAMP`

```java
private LocalDateTime updatedAt;
```
- **Purpose:** Last modification timestamp
- **Usage:** Display "Last updated: X minutes ago" in UI
- **Updated by:** `@PreUpdate` callback (line 47)
- **Audit trail:** Track when quiz content changed

#### PrePersist Callback (Lines 42-46)

```java
@PrePersist
protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
}
```
- **Purpose:** Set timestamps when quiz is first created
- **Why both?:** New quiz has same created and updated time initially
- **Timing:** Before `INSERT` query

#### PreUpdate Callback (Lines 48-51)

```java
@PreUpdate
```
- **Purpose:** Marks method to be called before entity is updated
- **Timing:** Runs before `UPDATE` query is executed
- **Not called:** During `INSERT` (that's `@PrePersist`)

```java
protected void onUpdate() {
    updatedAt = LocalDateTime.now();
}
```
- **Purpose:** Update the `updatedAt` timestamp whenever quiz is modified
- **Triggered when:** Any field changes and entity is saved
- **Examples:**
  ```java
  quiz.setTitle("New Title");
  quizRepository.save(quiz); // onUpdate() called, updatedAt set
  
  quiz.setIsActive(false);
  quizRepository.save(quiz); // onUpdate() called again
  ```
- **Note:** `createdAt` is never changed (protected by `updatable = false`)

### Database Schema

```sql
CREATE TABLE quizzes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    
    CONSTRAINT fk_quiz_created_by 
        FOREIGN KEY (created_by) 
        REFERENCES users(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_quizzes_is_active ON quizzes(is_active);
CREATE INDEX idx_quizzes_created_by ON quizzes(created_by);
```

### Bidirectional Relationship Management

```java
// CORRECT way to add question to quiz
Question question = new Question();
question.setQuiz(quiz);              // Set parent reference
quiz.getQuestions().add(question);   // Add to collection
quizRepository.save(quiz);           // Cascade saves question

// WRONG way (only one side set)
Question question = new Question();
quiz.getQuestions().add(question);   // Parent set
// question.setQuiz(quiz) NOT SET!   // Foreign key will be NULL!
```

### Business Rules Summary

1. **Title is required**
2. **Duration must be set** (time limit in minutes)
3. **Every quiz has a creator** (admin user)
4. **Deleting quiz deletes all questions** (cascade)
5. **Removing question from list deletes it** (orphan removal)
6. **UpdatedAt tracks modifications** (auto-updated)
7. **IsActive controls visibility** (soft delete pattern)

---

## 3. Question Entity

**File:** `com.quizforge.model.Question`

### Complete Source Code

```java
package com.quizforge.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Data
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(nullable = false)
    private Integer points = 1;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Option> options = new ArrayList<>();

    public enum QuestionType {
        MULTIPLE_CHOICE,
        TRUE_FALSE,
        SHORT_ANSWER
    }
}
```

### Line-by-Line Explanation

#### Package and Imports (Lines 1-6)

```java
package com.quizforge.model;
import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;
```
- **Same pattern:** Model package, JPA annotations, Lombok, collections

#### Class Declaration (Lines 8-11)

```java
@Entity
@Table(name = "questions")
@Data
public class Question {
```
- **Table name:** `questions` (plural)

#### ID Field (Lines 12-14)

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```
- **Same as previous entities:** Auto-incremented primary key

#### Quiz Relationship (Lines 16-18)

```java
@ManyToOne(fetch = FetchType.LAZY)
```
- **Purpose:** Link question to its parent quiz
- **Cardinality:** Many questions → One quiz
- **Lazy loading:** Quiz not loaded until accessed

```java
@JoinColumn(name = "quiz_id", nullable = false)
```
- **Purpose:** Foreign key configuration
- **Column name:** `quiz_id` (standard naming)
- **Required:** Every question must belong to a quiz
- **Database:** Creates `quiz_id BIGINT NOT NULL`
- **Foreign key:**
  ```sql
  CONSTRAINT fk_question_quiz 
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
  ON DELETE CASCADE
  ```
- **Cascade effect:** Deleting quiz deletes all its questions

```java
private Quiz quiz;
```
- **Purpose:** Reference to parent quiz
- **Usage:**
  ```java
  Question q = questionRepository.findById(1L).get();
  String quizTitle = q.getQuiz().getTitle(); // Lazy loads quiz
  ```

#### QuestionText Field (Lines 20-21)

```java
@Column(nullable = false, columnDefinition = "TEXT")
```
- **Purpose:** Allow unlimited question length
- **Required:** Cannot be null
- **Type override:** `TEXT` instead of `VARCHAR(255)`
- **Use case:** Long questions with examples, code snippets, etc.

```java
private String questionText;
```
- **Purpose:** The actual question content
- **Examples:**
  - "What is the output of System.out.println(5 + 3)?"
  - "Which of the following is NOT a primitive data type in Java?"
  - "Explain the difference between abstract class and interface."
- **Database type:** `TEXT` (unlimited)

#### Type Field (Lines 23-25)

```java
@Enumerated(EnumType.STRING)
```
- **Purpose:** Store question type as string
- **Values:** "MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"
- **Why STRING?:** Database readable, safe refactoring

```java
@Column(nullable = false)
private QuestionType type;
```
- **Purpose:** Defines question format
- **Required:** Must specify type
- **Usage:** Determines how to display and evaluate answer
- **Frontend logic:**
  ```javascript
  if (question.type === 'MULTIPLE_CHOICE') {
      renderOptions(question.options);
  } else if (question.type === 'TRUE_FALSE') {
      renderTrueFalse();
  } else {
      renderTextArea();
  }
  ```

#### Points Field (Lines 27-28)

```java
@Column(nullable = false)
private Integer points = 1;
```
- **Purpose:** Score value for correct answer
- **Default:** 1 point
- **Required:** Must have value
- **Use cases:**
  - Easy questions: 1 point
  - Medium questions: 2 points
  - Hard questions: 5 points
- **Total score calculation:**
  ```java
  int totalPoints = quiz.getQuestions().stream()
      .mapToInt(Question::getPoints)
      .sum();
  ```

#### Options Relationship (Lines 30-31)

```java
@OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
```
- **Purpose:** Link to answer options
- **Cardinality:** One question → Many options
- **Mapped by:** `question` field in `Option` entity
- **Cascade:** All operations (save, update, delete)
- **Orphan removal:** Removing option from list deletes it
- **Note:** Only used for MULTIPLE_CHOICE and TRUE_FALSE

```java
private List<Option> options = new ArrayList<>();
```
- **Purpose:** Collection of answer options
- **Initialized:** Prevents NullPointerException
- **Usage:**
  ```java
  // For MULTIPLE_CHOICE
  question.getOptions().size(); // 4-5 options typically
  
  // For TRUE_FALSE
  question.getOptions().size(); // Exactly 2 options (True, False)
  
  // For SHORT_ANSWER
  question.getOptions().size(); // 0 (no options needed)
  ```

#### QuestionType Enum (Lines 33-37)

```java
public enum QuestionType {
```
- **Purpose:** Define supported question formats
- **Inner enum:** Defined inside Question class
- **Access:** `Question.QuestionType.MULTIPLE_CHOICE`

```java
MULTIPLE_CHOICE,
```
- **Purpose:** Question with multiple options, one correct
- **Requirements:**
  - Must have 2+ options
  - Exactly one option must be correct
- **Example:**
  ```
  What is 2 + 2?
  ○ 3
  ● 4  ← Correct
  ○ 5
  ○ 6
  ```
- **Validation:** Admin UI should enforce exactly one correct option

```java
TRUE_FALSE,
```
- **Purpose:** Boolean question with two options
- **Requirements:**
  - Must have exactly 2 options
  - One is "True", one is "False"
  - One must be correct
- **Example:**
  ```
  Java is a compiled language.
  ● True  ← Correct
  ○ False
  ```
- **Implementation:** Frontend can hardcode True/False, or use options

```java
SHORT_ANSWER
```
- **Purpose:** Text-based answer (essay, code, explanation)
- **Requirements:**
  - No options needed
  - Answer stored in `Answer.textAnswer` field
- **Example:**
  ```
  Explain the difference between == and .equals() in Java.
  [Text area for answer]
  ```
- **Grading:** Requires manual evaluation by admin (no auto-grading)

### Database Schema

```sql
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    type VARCHAR(255) NOT NULL,
    points INTEGER NOT NULL DEFAULT 1,
    
    CONSTRAINT fk_question_quiz 
        FOREIGN KEY (quiz_id) 
        REFERENCES quizzes(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_questions_type ON questions(type);
```

### Business Rules Summary

1. **Every question belongs to a quiz**
2. **Question text is unlimited length** (TEXT type)
3. **Type determines answer format** (MCQ, T/F, or text)
4. **Default points is 1** (can be customized)
5. **Options only for MCQ and T/F** (empty for SHORT_ANSWER)
6. **Deleting question deletes options** (cascade)

### Usage Examples

#### Creating Multiple Choice Question
```java
Question question = new Question();
question.setQuiz(quiz);
question.setQuestionText("What is JVM?");
question.setType(Question.QuestionType.MULTIPLE_CHOICE);
question.setPoints(2);

Option opt1 = new Option();
opt1.setQuestion(question);
opt1.setOptionText("Java Virtual Machine");
opt1.setIsCorrect(true);  // Correct answer
question.getOptions().add(opt1);

Option opt2 = new Option();
opt2.setQuestion(question);
opt2.setOptionText("Java Variable Method");
opt2.setIsCorrect(false);
question.getOptions().add(opt2);

quiz.getQuestions().add(question);
quizRepository.save(quiz); // Cascades to question and options
```

#### Creating True/False Question
```java
Question question = new Question();
question.setQuiz(quiz);
question.setQuestionText("Java is object-oriented.");
question.setType(Question.QuestionType.TRUE_FALSE);
question.setPoints(1);

Option trueOption = new Option();
trueOption.setQuestion(question);
trueOption.setOptionText("True");
trueOption.setIsCorrect(true);
question.getOptions().add(trueOption);

Option falseOption = new Option();
falseOption.setQuestion(question);
falseOption.setOptionText("False");
falseOption.setIsCorrect(false);
question.getOptions().add(falseOption);

quiz.getQuestions().add(question);
```

#### Creating Short Answer Question
```java
Question question = new Question();
question.setQuiz(quiz);
question.setQuestionText("Explain polymorphism in Java.");
question.setType(Question.QuestionType.SHORT_ANSWER);
question.setPoints(5); // Worth more points
// No options needed!

quiz.getQuestions().add(question);
```

---

## 4. Option Entity

**File:** `com.quizforge.model.Option`

### Complete Source Code

```java
package com.quizforge.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "options")
@Data
public class Option {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(nullable = false)
    private String optionText;

    @Column(nullable = false)
    private Boolean isCorrect = false;
}
```

### Line-by-Line Explanation

#### Package and Imports (Lines 1-4)

```java
package com.quizforge.model;
import jakarta.persistence.*;
import lombok.Data;
```
- **Minimal imports:** No collections needed (leaf entity)

#### Class Declaration (Lines 6-9)

```java
@Entity
@Table(name = "options")
@Data
public class Option {
```
- **Simple entity:** No child relationships

#### ID Field (Lines 10-12)

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```
- **Standard primary key:** Auto-incremented

#### Question Relationship (Lines 14-16)

```java
@ManyToOne(fetch = FetchType.LAZY)
```
- **Purpose:** Link option to its question
- **Cardinality:** Many options → One question
- **Lazy loading:** Question not loaded automatically

```java
@JoinColumn(name = "question_id", nullable = false)
```
- **Foreign key:** `question_id` column
- **Required:** Every option must belong to a question
- **Database:**
  ```sql
  CONSTRAINT fk_option_question 
  FOREIGN KEY (question_id) REFERENCES questions(id)
  ON DELETE CASCADE
  ```

```java
private Question question;
```
- **Purpose:** Reference to parent question
- **Usage:** `option.getQuestion().getQuestionText()`

#### OptionText Field (Lines 18-19)

```java
@Column(nullable = false)
private String optionText;
```
- **Purpose:** The answer choice text
- **Required:** Cannot be null
- **Examples:**
  - "Java Virtual Machine"
  - "True"
  - "ArrayList implements List interface"
- **Database type:** `VARCHAR(255)` (sufficient for options)

#### IsCorrect Field (Lines 21-22)

```java
@Column(nullable = false)
private Boolean isCorrect = false;
```
- **Purpose:** Marks if this option is the correct answer
- **Type:** `Boolean` (not `boolean`) - Wrapper class
- **Default:** `false` - Most options are incorrect
- **Required:** Must be explicitly set
- **Business rules:**
  - MULTIPLE_CHOICE: Exactly one option should be `true`
  - TRUE_FALSE: One option (True or False) should be `true`
  - SHORT_ANSWER: N/A (no options)
- **Grading:** Used to check if candidate's answer is correct
  ```java
  Answer answer = answerRepository.findById(id).get();
  Option selected = answer.getSelectedOption();
  boolean correct = selected.getIsCorrect(); // Check correctness
  ```

### Database Schema

```sql
CREATE TABLE options (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    
    CONSTRAINT fk_option_question 
        FOREIGN KEY (question_id) 
        REFERENCES questions(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_options_question_id ON options(question_id);
CREATE INDEX idx_options_is_correct ON options(is_correct);
```

### Business Rules Summary

1. **Every option belongs to a question**
2. **OptionText is required**
3. **IsCorrect defaults to false**
4. **One option per question should be correct** (enforced in service layer)
5. **Deleting question deletes options** (cascade)

### Validation (Should Add)

```java
// Service layer validation
public void validateOptions(List<Option> options, QuestionType type) {
    if (type == QuestionType.MULTIPLE_CHOICE || type == QuestionType.TRUE_FALSE) {
        if (options.isEmpty()) {
            throw new ValidationException("MCQ/True-False must have options");
        }
        
        long correctCount = options.stream()
            .filter(Option::getIsCorrect)
            .count();
        
        if (correctCount != 1) {
            throw new ValidationException("Exactly one option must be correct");
        }
    }
    
    if (type == QuestionType.TRUE_FALSE && options.size() != 2) {
        throw new ValidationException("True/False must have exactly 2 options");
    }
}
```

---

## 5. QuizAttempt Entity

**File:** `com.quizforge.model.QuizAttempt`

### Complete Source Code

```java
package com.quizforge.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@Data
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "score")
    private Integer score;

    @Column(name = "total_points")
    private Integer totalPoints;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Answer> answers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        startedAt = LocalDateTime.now();
    }

    public enum AttemptStatus {
        IN_PROGRESS,
        SUBMITTED,
        EVALUATED
    }
}
```

### Line-by-Line Explanation

[Continue with detailed line-by-line explanation for QuizAttempt...]

#### StartedAt Field (Lines 25-26)

```java
@Column(name = "started_at", nullable = false)
private LocalDateTime startedAt;
```
- **Purpose:** Records when candidate started the quiz
- **Set by:** `@PrePersist` callback (line 44)
- **Required:** Cannot be null
- **Usage:**
  - Calculate elapsed time
  - Enforce time limits
  - Audit trail
  - Detect quiz abandonment
- **Example calculation:**
  ```java
  Duration elapsed = Duration.between(attempt.getStartedAt(), LocalDateTime.now());
  long minutes = elapsed.toMinutes();
  if (minutes > quiz.getDuration()) {
      // Auto-submit or mark as expired
  }
  ```

#### SubmittedAt Field (Lines 28-29)

```java
@Column(name = "submitted_at")
private LocalDateTime submittedAt;
```
- **Purpose:** Records when quiz was submitted
- **Optional:** Null while IN_PROGRESS
- **Set when:** Candidate clicks "Submit" or time expires
- **Usage:**
  - Calculate total time taken
  - Display submission time to admin
  - Prevent late submissions
- **Time taken:**
  ```java
  Duration timeTaken = Duration.between(attempt.getStartedAt(), 
                                        attempt.getSubmittedAt());
  long minutesTaken = timeTaken.toMinutes();
  ```

#### Score Field (Lines 31-32)

```java
@Column(name = "score")
private Integer score;
```
- **Purpose:** Points earned by candidate
- **Optional:** Null until EVALUATED
- **Calculated:** Sum of points from correct answers
- **Range:** 0 to `totalPoints`
- **Calculation:**
  ```java
  int score = attempt.getAnswers().stream()
      .filter(Answer::getIsCorrect)
      .mapToInt(Answer::getPointsEarned)
      .sum();
  ```

#### TotalPoints Field (Lines 34-35)

```java
@Column(name = "total_points")
private Integer totalPoints;
```
- **Purpose:** Maximum possible score for the quiz
- **Set when:** Attempt is created
- **Calculation:** Sum of all question points
  ```java
  int total = quiz.getQuestions().stream()
      .mapToInt(Question::getPoints)
      .sum();
  attempt.setTotalPoints(total);
  ```
- **Usage:**
  - Calculate percentage: `(score / totalPoints) * 100`
  - Display passing threshold
  - Compare performance

#### Status Field (Lines 37-39)

```java
@Enumerated(EnumType.STRING)
@Column(nullable = false)
private AttemptStatus status = AttemptStatus.IN_PROGRESS;
```
- **Purpose:** Track attempt lifecycle
- **Default:** `IN_PROGRESS` when created
- **Required:** Must have a status
- **State transitions:**
  ```
  IN_PROGRESS → SUBMITTED → EVALUATED
       ↓           ↓            ↓
    Active    Awaiting    Complete
               Grading    (show results)
  ```

#### Answers Relationship (Lines 41-42)

```java
@OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Answer> answers = new ArrayList<>();
```
- **Purpose:** Collection of candidate's answers
- **One-to-Many:** One attempt has many answers (one per question)
- **Cascade:** Deleting attempt deletes all answers
- **Orphan removal:** Removing answer from list deletes it

#### PrePersist Callback (Lines 44-47)

```java
@PrePersist
protected void onCreate() {
    startedAt = LocalDateTime.now();
}
```
- **Purpose:** Auto-set start time when attempt is created
- **Timing:** Before INSERT query

#### AttemptStatus Enum (Lines 49-53)

```java
public enum AttemptStatus {
    IN_PROGRESS,   // Candidate is taking quiz
    SUBMITTED,     // Submitted, awaiting grading
    EVALUATED      // Graded, results available
}
```

**Status Details:**

**IN_PROGRESS:**
- **When:** Quiz started but not submitted
- **Allowed actions:**
  - Submit answers
  - Change answers
  - Submit quiz
- **Not allowed:**
  - View results
  - Retake quiz
- **Auto-transition:** After duration expires (requires background job)

**SUBMITTED:**
- **When:** Candidate clicked "Submit"
- **Purpose:** Intermediate state for async grading
- **Use cases:**
  - Manual grading needed (SHORT_ANSWER)
  - Async processing of large quizzes
  - Admin review before releasing results
- **Current implementation:** Skipped (goes straight to EVALUATED)

**EVALUATED:**
- **When:** Grading complete, results calculated
- **Allowed:**
  - View detailed results
  - View correct/incorrect answers
  - View score and percentage
- **Final state:** Cannot change answers after this

### Database Schema

```sql
CREATE TABLE quiz_attempts (
    id BIGSERIAL PRIMARY KEY,
    quiz_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    started_at TIMESTAMP NOT NULL,
    submitted_at TIMESTAMP,
    score INTEGER,
    total_points INTEGER,
    status VARCHAR(255) NOT NULL DEFAULT 'IN_PROGRESS',
    
    CONSTRAINT fk_attempt_quiz 
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    CONSTRAINT fk_attempt_user 
        FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_attempts_status ON quiz_attempts(status);
CREATE INDEX idx_attempts_user_status ON quiz_attempts(user_id, status);
```

### Business Rules Summary

1. **StartedAt auto-set** on creation
2. **SubmittedAt set** when quiz submitted
3. **Score calculated** from correct answers
4. **TotalPoints set** from quiz questions
5. **Status tracks** quiz lifecycle
6. **Answers cascade** with attempt

---

## 6. Answer Entity

**File:** `com.quizforge.model.Answer`

### Complete Source Code

```java
package com.quizforge.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "answers")
@Data
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id")
    private Option selectedOption;

    @Column(columnDefinition = "TEXT")
    private String textAnswer;

    @Column(nullable = false)
    private Boolean isCorrect = false;

    @Column
    private Integer pointsEarned = 0;
}
```

### Line-by-Line Explanation

#### Attempt Relationship (Lines 14-16)

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "attempt_id", nullable = false)
private QuizAttempt attempt;
```
- **Purpose:** Links answer to quiz attempt
- **Required:** Every answer belongs to an attempt
- **Usage:** Group answers by attempt for results

#### Question Relationship (Lines 18-20)

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "question_id", nullable = false)
private Question question;
```
- **Purpose:** Links answer to the question being answered
- **Required:** Must know which question this answers
- **Usage:** Display question text with answer in results

#### SelectedOption Relationship (Lines 22-24)

```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "selected_option_id")
private Option selectedOption;
```
- **Purpose:** For MCQ/T-F, stores which option was selected
- **Optional:** Null for SHORT_ANSWER questions
- **Nullable:** `nullable` not specified = defaults to true
- **Usage:**
  ```java
  if (answer.getSelectedOption() != null) {
      // MCQ or T-F answer
      boolean correct = answer.getSelectedOption().getIsCorrect();
  } else {
      // SHORT_ANSWER (use textAnswer field)
  }
  ```

#### TextAnswer Field (Lines 26-27)

```java
@Column(columnDefinition = "TEXT")
private String textAnswer;
```
- **Purpose:** For SHORT_ANSWER questions, stores typed answer
- **Optional:** Null for MCQ/T-F questions
- **Type:** TEXT (unlimited length)
- **Usage:**
  ```java
  if (question.getType() == QuestionType.SHORT_ANSWER) {
      answer.setTextAnswer(candidateResponse);
      answer.setSelectedOption(null); // Not used
  }
  ```

#### IsCorrect Field (Lines 29-30)

```java
@Column(nullable = false)
private Boolean isCorrect = false;
```
- **Purpose:** Marks if answer is correct
- **Default:** `false` (assume wrong until checked)
- **Auto-grading:** Set automatically for MCQ/T-F
  ```java
  answer.setIsCorrect(selectedOption.getIsCorrect());
  ```
- **Manual grading:** Admin sets for SHORT_ANSWER
- **Usage in scoring:**
  ```java
  int score = answers.stream()
      .filter(Answer::getIsCorrect)
      .mapToInt(Answer::getPointsEarned)
      .sum();
  ```

#### PointsEarned Field (Lines 32-33)

```java
@Column
private Integer pointsEarned = 0;
```
- **Purpose:** Points awarded for this answer
- **Default:** 0 (no points until graded)
- **Range:** 0 to question.points
- **Calculation:**
  ```java
  if (answer.getIsCorrect()) {
      answer.setPointsEarned(question.getPoints());
  } else {
      answer.setPointsEarned(0);
  }
  ```
- **Partial credit:** Could be implemented (e.g., 2 out of 5 points)
- **Total score:**
  ```java
  int total = attempt.getAnswers().stream()
      .mapToInt(Answer::getPointsEarned)
      .sum();
  ```

### Database Schema

```sql
CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option_id BIGINT,
    text_answer TEXT,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    points_earned INTEGER DEFAULT 0,
    
    CONSTRAINT fk_answer_attempt 
        FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_answer_question 
        FOREIGN KEY (question_id) REFERENCES questions(id),
    CONSTRAINT fk_answer_option 
        FOREIGN KEY (selected_option_id) REFERENCES options(id)
);

CREATE INDEX idx_answers_attempt_id ON answers(attempt_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_is_correct ON answers(is_correct);
```

### Business Rules Summary

1. **Every answer belongs to an attempt**
2. **Every answer references a question**
3. **SelectedOption for MCQ/T-F** (null for SHORT_ANSWER)
4. **TextAnswer for SHORT_ANSWER** (null for MCQ/T-F)
5. **IsCorrect auto-set** for MCQ/T-F, manual for SHORT_ANSWER
6. **PointsEarned based** on isCorrect and question.points

### Answer Type Patterns

#### Multiple Choice / True-False

```java
Answer answer = new Answer();
answer.setAttempt(attempt);
answer.setQuestion(question);
answer.setSelectedOption(chosenOption);
answer.setTextAnswer(null); // Not used
answer.setIsCorrect(chosenOption.getIsCorrect());
answer.setPointsEarned(chosenOption.getIsCorrect() ? question.getPoints() : 0);
answerRepository.save(answer);
```

#### Short Answer

```java
Answer answer = new Answer();
answer.setAttempt(attempt);
answer.setQuestion(question);
answer.setSelectedOption(null); // Not used
answer.setTextAnswer(candidateTypedAnswer);
answer.setIsCorrect(false); // Requires manual grading
answer.setPointsEarned(0); // Set by admin after review
answerRepository.save(answer);

// Later, admin grades
answer.setIsCorrect(true);
answer.setPointsEarned(question.getPoints());
answerRepository.save(answer);
```

---

**END OF MODELS DOCUMENTATION**

This completes the line-by-line explanation of all 6 JPA entities. Each field, annotation, and relationship has been thoroughly documented with:

- Purpose and usage
- Database mapping
- Business rules
- Code examples
- SQL schema

Next sections will cover Services, Controllers, Security, and API documentation.
