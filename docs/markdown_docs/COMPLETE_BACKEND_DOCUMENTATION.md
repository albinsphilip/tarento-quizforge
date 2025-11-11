# QuizForge Backend - Complete Documentation

> **Version:** 1.0.0  
> **Date:** November 10, 2025  
> **Framework:** Spring Boot 3.2.0  
> **Language:** Java 21  
> **Database:** PostgreSQL  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Data Models](#3-data-models)
4. [Repositories](#4-repositories)
5. [Services](#5-services)
6. [Controllers & API](#6-controllers--api)
7. [Security](#7-security)
8. [Configuration](#8-configuration)
9. [Database Design](#9-database-design)
10. [API Reference](#10-api-reference)
11. [Dependencies](#11-dependencies)

---

## 1. Project Overview

### 1.1 Introduction

QuizForge is a comprehensive online quiz management system built with Spring Boot. It provides a complete solution for creating, managing, and taking quizzes with role-based access control.

### 1.2 Key Features

- **Role-Based Access Control** (ADMIN, CANDIDATE)
- **JWT Authentication** (Stateless, secure)
- **Quiz Management** (CRUD operations for admins)
- **Question Types** (Multiple choice, True/False, Short answer)
- **Real-time Quiz Taking** (Timed quizzes with auto-submission)
- **Automated Grading** (Instant results for objective questions)
- **Attempt Tracking** (Complete history of quiz attempts)
- **RESTful API** (OpenAPI 3.0 documented)

### 1.3 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Backend Framework** | Spring Boot | 3.2.0 |
| **Language** | Java | 21 |
| **Build Tool** | Maven | 3.9+ |
| **Database** | PostgreSQL | Latest |
| **ORM** | Hibernate (JPA) | 6.3.1 |
| **Security** | Spring Security | 6.x |
| **Authentication** | JWT (JJWT) | 0.11.5 |
| **API Documentation** | SpringDoc OpenAPI | 2.6.0 |
| **Utilities** | Lombok | 1.18.30 |

### 1.4 Project Structure

```
quizforge/backend/
├── src/main/java/com/quizforge/
│   ├── QuizForgeApplication.java       # Main application class
│   ├── config/                          # Configuration classes
│   │   ├── OpenApiConfig.java          # OpenAPI/Swagger configuration
│   │   └── SecurityConfig.java         # Security configuration
│   ├── controller/                      # REST endpoints
│   │   ├── AuthController.java         # Authentication endpoints
│   │   ├── AdminController.java        # Admin operations
│   │   └── CandidateController.java    # Candidate operations
│   ├── dto/                             # Data Transfer Objects
│   ├── model/                           # JPA Entities
│   │   ├── User.java                   # User entity
│   │   ├── Quiz.java                   # Quiz entity
│   │   ├── Question.java               # Question entity
│   │   ├── Option.java                 # Option entity
│   │   ├── QuizAttempt.java            # Quiz attempt entity
│   │   └── Answer.java                 # Answer entity
│   ├── repository/                      # Data access layer
│   │   ├── UserRepository.java
│   │   ├── QuizRepository.java
│   │   ├── QuestionRepository.java
│   │   ├── QuizAttemptRepository.java
│   │   └── AnswerRepository.java
│   ├── security/                        # Security components
│   │   ├── JwtUtil.java                # JWT utility class
│   │   └── JwtRequestFilter.java       # JWT authentication filter
│   └── service/                         # Business logic
│       ├── AuthService.java            # Authentication logic
│       ├── AdminService.java           # Admin business logic
│       └── CandidateService.java       # Candidate business logic
├── src/main/resources/
│   └── application.properties          # Application configuration
└── pom.xml                             # Maven dependencies

```

### 1.5 Design Patterns Used

- **MVC Pattern** (Model-View-Controller)
- **Repository Pattern** (Data access abstraction)
- **Service Layer Pattern** (Business logic separation)
- **DTO Pattern** (Data transfer objects)
- **Filter Pattern** (JWT authentication filter)
- **Singleton Pattern** (Spring beans)
- **Dependency Injection** (Constructor injection)

---

## 2. Architecture

### 2.1 Layered Architecture

```
┌─────────────────────────────────────┐
│     Presentation Layer              │
│  (REST Controllers + DTOs)          │
├─────────────────────────────────────┤
│     Business Logic Layer            │
│        (Services)                   │
├─────────────────────────────────────┤
│     Data Access Layer               │
│      (Repositories)                 │
├─────────────────────────────────────┤
│     Persistence Layer               │
│  (JPA Entities + Database)          │
└─────────────────────────────────────┘
```

### 2.2 Request Flow

```
Client Request
    ↓
JWT Filter (Authentication)
    ↓
Controller (Endpoint mapping)
    ↓
Service (Business logic)
    ↓
Repository (Data access)
    ↓
Database (PostgreSQL)
    ↓
Response (JSON)
```

### 2.3 Security Flow

```
1. User Login → AuthController
2. Credentials validated → AuthService
3. JWT Token generated → JwtUtil
4. Token returned to client
5. Subsequent requests include token in header
6. JwtRequestFilter validates token
7. SecurityContext populated with user details
8. Access granted/denied based on role
```

---

## 3. Data Models

### 3.1 User Entity

**Purpose:** Represents system users (admins and candidates)

**File:** `com.quizforge.model.User`

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;  // BCrypt hashed

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;  // ADMIN or CANDIDATE

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum Role {
        ADMIN, CANDIDATE
    }
}
```

**Key Annotations:**
- `@Entity` - Marks as JPA entity
- `@Table(name = "users")` - Maps to "users" table
- `@Id` - Primary key
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` - Auto-increment ID
- `@Column(unique = true)` - Unique email constraint
- `@Enumerated(EnumType.STRING)` - Stores enum as string in DB
- `@PrePersist` - Sets createdAt before insert

**Business Rules:**
- Email must be unique
- Password must be BCrypt hashed before saving
- Role cannot be null
- CreatedAt is immutable (set only once)

---

### 3.2 Quiz Entity

**Purpose:** Represents a quiz created by an admin

**File:** `com.quizforge.model.Quiz`

```java
@Entity
@Table(name = "quizzes")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer duration;  // in minutes

    @Column(nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;  // Admin who created it

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

**Key Relationships:**
- **Many-to-One with User** (`createdBy`) - Each quiz created by one admin
- **One-to-Many with Question** - Quiz contains multiple questions

**Cascade Operations:**
- `CascadeType.ALL` - All operations (persist, merge, remove, etc.) cascade to questions
- `orphanRemoval = true` - Questions deleted if removed from list

**Business Rules:**
- Title is required
- Duration in minutes (e.g., 30, 60, 90)
- isActive flag to enable/disable quiz
- Questions deleted when quiz is deleted

---

### 3.3 Question Entity

**Purpose:** Represents a question within a quiz

**File:** `com.quizforge.model.Question`

```java
@Entity
@Table(name = "questions")
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

**Question Types:**
1. **MULTIPLE_CHOICE** - Multiple options, one correct
2. **TRUE_FALSE** - Two options (True/False)
3. **SHORT_ANSWER** - Text-based answer

**Key Relationships:**
- **Many-to-One with Quiz** - Each question belongs to one quiz
- **One-to-Many with Option** - Question has multiple options (for MCQ/T-F)

**Business Rules:**
- QuestionText stored as TEXT (unlimited length)
- Points default to 1, can be customized
- Options cascade delete with question

---

### 3.4 Option Entity

**Purpose:** Represents answer options for multiple choice and true/false questions

**File:** `com.quizforge.model.Option`

```java
@Entity
@Table(name = "options")
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

**Key Relationships:**
- **Many-to-One with Question** - Each option belongs to one question

**Business Rules:**
- Only one option should have `isCorrect = true` for multiple choice
- For TRUE_FALSE questions, create 2 options (True and False)
- optionText is required

---

### 3.5 QuizAttempt Entity

**Purpose:** Tracks a candidate's attempt at taking a quiz

**File:** `com.quizforge.model.QuizAttempt`

```java
@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Candidate taking the quiz

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

    public enum AttemptStatus {
        IN_PROGRESS,  // Quiz started, not yet submitted
        SUBMITTED,    // Quiz submitted, awaiting evaluation
        EVALUATED     // Quiz graded, results available
    }
}
```

**Key Relationships:**
- **Many-to-One with Quiz** - Attempt is for one specific quiz
- **Many-to-One with User** - Attempt by one candidate
- **One-to-Many with Answer** - Attempt contains multiple answers

**Status Flow:**
```
IN_PROGRESS → SUBMITTED → EVALUATED
```

**Business Rules:**
- startedAt set automatically on creation
- submittedAt set when quiz is submitted
- Score calculated after submission
- Answers cascade delete with attempt

---

### 3.6 Answer Entity

**Purpose:** Stores a candidate's answer to a specific question

**File:** `com.quizforge.model.Answer`

```java
@Entity
@Table(name = "answers")
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
    private Option selectedOption;  // For MCQ/T-F questions

    @Column(columnDefinition = "TEXT")
    private String textAnswer;  // For short answer questions

    @Column(nullable = false)
    private Boolean isCorrect = false;

    @Column
    private Integer pointsEarned = 0;
}
```

**Key Relationships:**
- **Many-to-One with QuizAttempt** - Answer belongs to one attempt
- **Many-to-One with Question** - Answer is for one question
- **Many-to-One with Option** - References selected option (if MCQ/T-F)

**Answer Types:**
- **Multiple Choice / True-False:** Use `selectedOption`, `textAnswer` is null
- **Short Answer:** Use `textAnswer`, `selectedOption` is null

**Grading:**
- `isCorrect` - Whether answer is correct
- `pointsEarned` - Points awarded (0 to question.points)

---

## 4. Repositories

### 4.1 Overview

Repositories provide data access abstraction using Spring Data JPA. They extend `JpaRepository` which provides CRUD operations out of the box.

### 4.2 UserRepository

**File:** `com.quizforge.repository.UserRepository`

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

**Methods:**
- `findByEmail(String email)` - Find user by email for authentication
- `existsByEmail(String email)` - Check if email already exists (registration)

---

### 4.3 QuizRepository

**File:** `com.quizforge.repository.QuizRepository`

```java
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByIsActiveTrue();
    List<Quiz> findByCreatedBy(User user);
}
```

**Methods:**
- `findByIsActiveTrue()` - Get all active quizzes (for candidates)
- `findByCreatedBy(User user)` - Get quizzes created by specific admin

---

### 4.4 QuestionRepository

**File:** `com.quizforge.repository.QuestionRepository`

```java
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByQuizId(Long quizId);
}
```

**Methods:**
- `findByQuizId(Long quizId)` - Get all questions for a quiz

---

### 4.5 QuizAttemptRepository

**File:** `com.quizforge.repository.QuizAttemptRepository`

```java
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserId(Long userId);
    List<QuizAttempt> findByQuizId(Long quizId);
    List<QuizAttempt> findByUserIdAndStatus(Long userId, QuizAttempt.AttemptStatus status);
}
```

**Methods:**
- `findByUserId(Long userId)` - Get all attempts by a candidate
- `findByQuizId(Long quizId)` - Get all attempts for a quiz (analytics)
- `findByUserIdAndStatus()` - Filter attempts by status

---

### 4.6 AnswerRepository

**File:** `com.quizforge.repository.AnswerRepository`

```java
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByAttemptId(Long attemptId);
}
```

**Methods:**
- `findByAttemptId(Long attemptId)` - Get all answers for an attempt

---

## 5. Services

### 5.1 AuthService

**Purpose:** Handles user authentication and registration

**File:** `com.quizforge.service.AuthService`

**Key Methods:**

#### `registerUser(UserDTO userDTO)`
```java
public User registerUser(UserDTO userDTO) {
    // 1. Check if email already exists
    if (userRepository.existsByEmail(userDTO.getEmail())) {
        throw new RuntimeException("Email already registered");
    }
    
    // 2. Hash password using BCrypt
    String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
    
    // 3. Create and save user
    User user = new User();
    user.setEmail(userDTO.getEmail());
    user.setPassword(hashedPassword);
    user.setName(userDTO.getName());
    user.setRole(userDTO.getRole());
    
    return userRepository.save(user);
}
```

#### `authenticateUser(LoginDTO loginDTO)`
```java
public String authenticateUser(LoginDTO loginDTO) {
    // 1. Find user by email
    User user = userRepository.findByEmail(loginDTO.getEmail())
        .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    
    // 2. Verify password
    if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
        throw new RuntimeException("Invalid credentials");
    }
    
    // 3. Generate JWT token
    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().toString());
    
    return token;
}
```

**Security Features:**
- Password hashing with BCrypt (strength 10)
- JWT token generation
- Email uniqueness validation
- Credential validation

---

### 5.2 AdminService

**Purpose:** Business logic for admin operations (quiz management)

**File:** `com.quizforge.service.AdminService`

**Key Methods:**

#### `createQuiz(QuizDTO quizDTO, String adminEmail)`
```java
public Quiz createQuiz(QuizDTO quizDTO, String adminEmail) {
    // 1. Find admin user
    User admin = userRepository.findByEmail(adminEmail)
        .orElseThrow(() -> new RuntimeException("Admin not found"));
    
    // 2. Create quiz
    Quiz quiz = new Quiz();
    quiz.setTitle(quizDTO.getTitle());
    quiz.setDescription(quizDTO.getDescription());
    quiz.setDuration(quizDTO.getDuration());
    quiz.setCreatedBy(admin);
    
    // 3. Add questions
    for (QuestionDTO qDTO : quizDTO.getQuestions()) {
        Question question = new Question();
        question.setQuestionText(qDTO.getText());
        question.setType(qDTO.getType());
        question.setPoints(qDTO.getPoints());
        question.setQuiz(quiz);
        
        // Add options
        for (OptionDTO oDTO : qDTO.getOptions()) {
            Option option = new Option();
            option.setOptionText(oDTO.getText());
            option.setIsCorrect(oDTO.getIsCorrect());
            option.setQuestion(question);
            question.getOptions().add(option);
        }
        
        quiz.getQuestions().add(question);
    }
    
    return quizRepository.save(quiz);
}
```

#### `updateQuiz(Long quizId, QuizDTO quizDTO)`
```java
public Quiz updateQuiz(Long quizId, QuizDTO quizDTO) {
    Quiz quiz = quizRepository.findById(quizId)
        .orElseThrow(() -> new RuntimeException("Quiz not found"));
    
    quiz.setTitle(quizDTO.getTitle());
    quiz.setDescription(quizDTO.getDescription());
    quiz.setDuration(quizDTO.getDuration());
    quiz.setIsActive(quizDTO.getIsActive());
    
    return quizRepository.save(quiz);
}
```

#### `deleteQuiz(Long quizId)`
```java
public void deleteQuiz(Long quizId) {
    if (!quizRepository.existsById(quizId)) {
        throw new RuntimeException("Quiz not found");
    }
    quizRepository.deleteById(quizId);
    // Cascade delete handles questions, options
}
```

#### `getQuizResults(Long quizId)`
```java
public List<AttemptResultDTO> getQuizResults(Long quizId) {
    List<QuizAttempt> attempts = quizAttemptRepository.findByQuizId(quizId);
    
    return attempts.stream()
        .filter(a -> a.getStatus() == AttemptStatus.EVALUATED)
        .map(attempt -> {
            AttemptResultDTO dto = new AttemptResultDTO();
            dto.setCandidateName(attempt.getUser().getName());
            dto.setScore(attempt.getScore());
            dto.setTotalPoints(attempt.getTotalPoints());
            dto.setPercentage((double) attempt.getScore() / attempt.getTotalPoints() * 100);
            dto.setSubmittedAt(attempt.getSubmittedAt());
            return dto;
        })
        .collect(Collectors.toList());
}
```

---

### 5.3 CandidateService

**Purpose:** Business logic for candidate operations (quiz taking)

**File:** `com.quizforge.service.CandidateService`

**Key Methods:**

#### `getAvailableQuizzes()`
```java
public List<QuizDTO> getAvailableQuizzes() {
    List<Quiz> activeQuizzes = quizRepository.findByIsActiveTrue();
    
    return activeQuizzes.stream()
        .map(quiz -> {
            QuizDTO dto = new QuizDTO();
            dto.setId(quiz.getId());
            dto.setTitle(quiz.getTitle());
            dto.setDescription(quiz.getDescription());
            dto.setDuration(quiz.getDuration());
            dto.setQuestionCount(quiz.getQuestions().size());
            return dto;
        })
        .collect(Collectors.toList());
}
```

#### `startQuizAttempt(Long quizId, String candidateEmail)`
```java
public QuizAttempt startQuizAttempt(Long quizId, String candidateEmail) {
    // 1. Validate quiz exists and is active
    Quiz quiz = quizRepository.findById(quizId)
        .orElseThrow(() -> new RuntimeException("Quiz not found"));
    
    if (!quiz.getIsActive()) {
        throw new RuntimeException("Quiz is not active");
    }
    
    // 2. Find candidate
    User candidate = userRepository.findByEmail(candidateEmail)
        .orElseThrow(() -> new RuntimeException("Candidate not found"));
    
    // 3. Create attempt
    QuizAttempt attempt = new QuizAttempt();
    attempt.setQuiz(quiz);
    attempt.setUser(candidate);
    attempt.setStatus(AttemptStatus.IN_PROGRESS);
    attempt.setTotalPoints(quiz.getQuestions().stream()
        .mapToInt(Question::getPoints)
        .sum());
    
    return quizAttemptRepository.save(attempt);
}
```

#### `submitAnswer(Long attemptId, AnswerDTO answerDTO)`
```java
public Answer submitAnswer(Long attemptId, AnswerDTO answerDTO) {
    QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
        .orElseThrow(() -> new RuntimeException("Attempt not found"));
    
    if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
        throw new RuntimeException("Cannot submit answer for completed attempt");
    }
    
    Question question = questionRepository.findById(answerDTO.getQuestionId())
        .orElseThrow(() -> new RuntimeException("Question not found"));
    
    Answer answer = new Answer();
    answer.setAttempt(attempt);
    answer.setQuestion(question);
    
    // Handle different question types
    if (question.getType() == QuestionType.MULTIPLE_CHOICE || 
        question.getType() == QuestionType.TRUE_FALSE) {
        
        Option selectedOption = optionRepository.findById(answerDTO.getSelectedOptionId())
            .orElseThrow(() -> new RuntimeException("Option not found"));
        
        answer.setSelectedOption(selectedOption);
        answer.setIsCorrect(selectedOption.getIsCorrect());
        answer.setPointsEarned(selectedOption.getIsCorrect() ? question.getPoints() : 0);
        
    } else if (question.getType() == QuestionType.SHORT_ANSWER) {
        answer.setTextAnswer(answerDTO.getTextAnswer());
        // Short answers require manual grading
        answer.setIsCorrect(false);
        answer.setPointsEarned(0);
    }
    
    return answerRepository.save(answer);
}
```

#### `submitQuizAttempt(Long attemptId)`
```java
public QuizAttempt submitQuizAttempt(Long attemptId) {
    QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
        .orElseThrow(() -> new RuntimeException("Attempt not found"));
    
    if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
        throw new RuntimeException("Attempt already submitted");
    }
    
    // 1. Mark as submitted
    attempt.setSubmittedAt(LocalDateTime.now());
    attempt.setStatus(AttemptStatus.SUBMITTED);
    
    // 2. Calculate score (auto-gradable questions only)
    int score = answerRepository.findByAttemptId(attemptId).stream()
        .filter(Answer::getIsCorrect)
        .mapToInt(Answer::getPointsEarned)
        .sum();
    
    attempt.setScore(score);
    attempt.setStatus(AttemptStatus.EVALUATED);
    
    return quizAttemptRepository.save(attempt);
}
```

#### `getAttemptResults(Long attemptId, String candidateEmail)`
```java
public AttemptDetailDTO getAttemptResults(Long attemptId, String candidateEmail) {
    QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
        .orElseThrow(() -> new RuntimeException("Attempt not found"));
    
    // Verify ownership
    if (!attempt.getUser().getEmail().equals(candidateEmail)) {
        throw new RuntimeException("Unauthorized access");
    }
    
    if (attempt.getStatus() != AttemptStatus.EVALUATED) {
        throw new RuntimeException("Results not yet available");
    }
    
    AttemptDetailDTO dto = new AttemptDetailDTO();
    dto.setQuizTitle(attempt.getQuiz().getTitle());
    dto.setScore(attempt.getScore());
    dto.setTotalPoints(attempt.getTotalPoints());
    dto.setPercentage((double) attempt.getScore() / attempt.getTotalPoints() * 100);
    dto.setSubmittedAt(attempt.getSubmittedAt());
    
    // Add answer details
    List<Answer> answers = answerRepository.findByAttemptId(attemptId);
    dto.setAnswers(answers.stream()
        .map(this::mapToAnswerDetailDTO)
        .collect(Collectors.toList()));
    
    return dto;
}
```

---

## 6. Controllers & API

### 6.1 AuthController

**Base Path:** `/api/auth`

**Purpose:** Authentication and registration endpoints

**File:** `com.quizforge.controller.AuthController`

#### POST `/api/auth/register`
**Description:** Register a new user (admin or candidate)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "role": "CANDIDATE"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "role": "CANDIDATE",
  "createdAt": "2025-11-10T10:30:00"
}
```

**Errors:**
- `400 Bad Request` - Email already exists
- `400 Bad Request` - Validation errors

---

#### POST `/api/auth/login`
**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "email": "user@example.com",
  "role": "CANDIDATE"
}
```

**Errors:**
- `401 Unauthorized` - Invalid credentials

---

### 6.2 AdminController

**Base Path:** `/api/admin`

**Security:** Requires JWT token with ADMIN role

**Purpose:** Quiz management endpoints for admins

**File:** `com.quizforge.controller.AdminController`

#### POST `/api/admin/quizzes`
**Description:** Create a new quiz

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "title": "Java Fundamentals Quiz",
  "description": "Test your Java knowledge",
  "duration": 30,
  "questions": [
    {
      "questionText": "What is JVM?",
      "type": "MULTIPLE_CHOICE",
      "points": 2,
      "options": [
        { "optionText": "Java Virtual Machine", "isCorrect": true },
        { "optionText": "Java Variable Method", "isCorrect": false },
        { "optionText": "Java Version Manager", "isCorrect": false }
      ]
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "title": "Java Fundamentals Quiz",
  "description": "Test your Java knowledge",
  "duration": 30,
  "isActive": true,
  "createdBy": "admin@example.com",
  "createdAt": "2025-11-10T10:30:00",
  "questionCount": 1
}
```

---

#### GET `/api/admin/quizzes`
**Description:** Get all quizzes created by the admin

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Java Fundamentals Quiz",
    "description": "Test your Java knowledge",
    "duration": 30,
    "isActive": true,
    "questionCount": 10,
    "createdAt": "2025-11-10T10:30:00"
  }
]
```

---

#### GET `/api/admin/quizzes/{id}`
**Description:** Get quiz details with all questions

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Java Fundamentals Quiz",
  "description": "Test your Java knowledge",
  "duration": 30,
  "isActive": true,
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

#### PUT `/api/admin/quizzes/{id}`
**Description:** Update quiz details

**Request Body:**
```json
{
  "title": "Updated Quiz Title",
  "description": "Updated description",
  "duration": 45,
  "isActive": true
}
```

**Response:** `200 OK`

---

#### DELETE `/api/admin/quizzes/{id}`
**Description:** Delete a quiz (cascades to questions and options)

**Response:** `204 No Content`

---

#### GET `/api/admin/quizzes/{id}/results`
**Description:** Get all attempt results for a quiz

**Response:** `200 OK`
```json
[
  {
    "attemptId": 1,
    "candidateName": "John Doe",
    "candidateEmail": "john@example.com",
    "score": 18,
    "totalPoints": 20,
    "percentage": 90.0,
    "submittedAt": "2025-11-10T11:00:00"
  }
]
```

---

### 6.3 CandidateController

**Base Path:** `/api/candidate`

**Security:** Requires JWT token with CANDIDATE role

**Purpose:** Quiz taking endpoints for candidates

**File:** `com.quizforge.controller.CandidateController`

#### GET `/api/candidate/quizzes`
**Description:** Get all available (active) quizzes

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Java Fundamentals Quiz",
    "description": "Test your Java knowledge",
    "duration": 30,
    "questionCount": 10
  }
]
```

---

#### POST `/api/candidate/quizzes/{quizId}/start`
**Description:** Start a quiz attempt

**Response:** `200 OK`
```json
{
  "attemptId": 1,
  "quizId": 1,
  "quizTitle": "Java Fundamentals Quiz",
  "duration": 30,
  "totalPoints": 20,
  "status": "IN_PROGRESS",
  "startedAt": "2025-11-10T11:00:00",
  "questions": [
    {
      "id": 1,
      "questionText": "What is JVM?",
      "type": "MULTIPLE_CHOICE",
      "points": 2,
      "options": [
        {
          "id": 1,
          "optionText": "Java Virtual Machine"
        },
        {
          "id": 2,
          "optionText": "Java Variable Method"
        }
      ]
    }
  ]
}
```

---

#### POST `/api/candidate/attempts/{attemptId}/answers`
**Description:** Submit an answer to a question

**Request Body:**
```json
{
  "questionId": 1,
  "selectedOptionId": 1,
  "textAnswer": null
}
```

**Response:** `200 OK`
```json
{
  "answerId": 1,
  "questionId": 1,
  "isCorrect": true,
  "pointsEarned": 2
}
```

---

#### POST `/api/candidate/attempts/{attemptId}/submit`
**Description:** Submit the entire quiz attempt

**Response:** `200 OK`
```json
{
  "attemptId": 1,
  "status": "EVALUATED",
  "score": 18,
  "totalPoints": 20,
  "percentage": 90.0,
  "submittedAt": "2025-11-10T11:30:00"
}
```

---

#### GET `/api/candidate/attempts/{attemptId}/results`
**Description:** Get detailed results of a completed attempt

**Response:** `200 OK`
```json
{
  "attemptId": 1,
  "quizTitle": "Java Fundamentals Quiz",
  "score": 18,
  "totalPoints": 20,
  "percentage": 90.0,
  "submittedAt": "2025-11-10T11:30:00",
  "answers": [
    {
      "questionText": "What is JVM?",
      "selectedOption": "Java Virtual Machine",
      "correctOption": "Java Virtual Machine",
      "isCorrect": true,
      "pointsEarned": 2
    }
  ]
}
```

---

#### GET `/api/candidate/my-attempts`
**Description:** Get all quiz attempts by the authenticated candidate

**Response:** `200 OK`
```json
[
  {
    "attemptId": 1,
    "quizTitle": "Java Fundamentals Quiz",
    "status": "EVALUATED",
    "score": 18,
    "totalPoints": 20,
    "percentage": 90.0,
    "startedAt": "2025-11-10T11:00:00",
    "submittedAt": "2025-11-10T11:30:00"
  }
]
```

---

## 7. Security

### 7.1 Security Architecture

QuizForge uses JWT (JSON Web Token) based stateless authentication with Spring Security.

**Flow:**
1. User logs in with credentials
2. Server validates and generates JWT token
3. Client stores token (localStorage/sessionStorage)
4. Client includes token in Authorization header for subsequent requests
5. JwtRequestFilter validates token on each request
6. SecurityContext is populated with authentication details
7. Role-based access control enforced

---

### 7.2 SecurityConfig

**File:** `com.quizforge.config.SecurityConfig`

**Key Configuration:**

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())  // Disabled for stateless API
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()  // Public endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Admin only
                .requestMatchers("/api/candidate/**").hasRole("CANDIDATE")  // Candidate only
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()  // Swagger
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);  // Strength 10
    }
    
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

**Security Features:**
- **CSRF Disabled** - Not needed for stateless JWT API
- **CORS Enabled** - Allows frontend requests
- **Stateless Sessions** - No server-side session storage
- **Role-Based Access** - ADMIN and CANDIDATE roles
- **BCrypt Password Hashing** - Strength 10 (2^10 rounds)

---

### 7.3 JwtUtil

**File:** `com.quizforge.security.JwtUtil`

**Key Methods:**

#### Generate Token
```java
public String generateToken(String email, String role) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION);  // 24 hours
    
    return Jwts.builder()
        .setSubject(email)
        .claim("role", role)
        .setIssuedAt(now)
        .setExpiration(expiryDate)
        .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
        .compact();
}
```

#### Validate Token
```java
public boolean validateToken(String token) {
    try {
        Jwts.parser()
            .setSigningKey(SECRET_KEY)
            .parseClaimsJws(token);
        return true;
    } catch (JwtException | IllegalArgumentException e) {
        return false;
    }
}
```

#### Extract Email
```java
public String getEmailFromToken(String token) {
    Claims claims = Jwts.parser()
        .setSigningKey(SECRET_KEY)
        .parseClaimsJws(token)
        .getBody();
    return claims.getSubject();
}
```

**JWT Configuration:**
- **Algorithm:** HS512 (HMAC with SHA-512)
- **Expiration:** 24 hours (86400000 ms)
- **Secret Key:** Stored in application.properties (should be environment variable in production)

---

### 7.4 JwtRequestFilter

**File:** `com.quizforge.security.JwtRequestFilter`

**Purpose:** Intercepts every HTTP request to validate JWT token

```java
@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain chain) 
            throws ServletException, IOException {
        
        // 1. Extract token from Authorization header
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);  // Remove "Bearer " prefix
            try {
                email = jwtUtil.getEmailFromToken(token);
            } catch (Exception e) {
                logger.error("JWT parsing error", e);
            }
        }
        
        // 2. Validate token and set authentication
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(token)) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                
                authToken.setDetails(new WebAuthenticationDetailsSource()
                    .buildDetails(request));
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        chain.doFilter(request, response);
    }
}
```

**Filter Steps:**
1. Extract token from `Authorization: Bearer <token>` header
2. Parse token to get email
3. Validate token signature and expiration
4. Load user details from database
5. Create authentication object
6. Set authentication in SecurityContext
7. Continue filter chain

---

### 7.5 Password Security

**Hashing Algorithm:** BCrypt with strength 10

**Why BCrypt?**
- Adaptive hash function
- Built-in salt (random data)
- Configurable work factor (strength)
- Resistant to rainbow table attacks
- Slow by design (prevents brute force)

**Example:**
```
Plain password: "SecurePass123"
BCrypt hash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```

**Password Requirements (Recommended):**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## 8. Configuration

### 8.1 application.properties

**File:** `src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8080
spring.application.name=quizforge

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/quizforge_db
spring.datasource.username=postgres
spring.datasource.password=your_password_here
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true

# JWT Configuration
jwt.secret=your_secret_key_here_change_in_production
jwt.expiration=86400000

# Logging Configuration
logging.level.root=INFO
logging.level.com.quizforge=DEBUG
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Swagger/OpenAPI Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
```

**Key Settings:**

#### Database
- **URL:** PostgreSQL on localhost, port 5432
- **DDL Auto:** `update` - Auto-create/update tables (use `validate` in production)
- **Show SQL:** Enabled for debugging

#### JWT
- **Secret:** Change in production! Use environment variable
- **Expiration:** 24 hours (86400000 milliseconds)

#### Logging
- Root level: INFO
- Application level: DEBUG
- SQL logging: Enabled

---

### 8.2 Environment-Specific Configuration

**Development:**
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
logging.level.com.quizforge=DEBUG
```

**Production:**
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.com.quizforge=WARN
jwt.secret=${JWT_SECRET}  # Environment variable
spring.datasource.password=${DB_PASSWORD}  # Environment variable
```

---

## 9. Database Design

### 9.1 Entity-Relationship Diagram

```
┌─────────────┐
│    USERS    │
│─────────────│
│ id (PK)     │
│ email       │◄──────┐
│ password    │       │
│ name        │       │ created_by (FK)
│ role        │       │
│ created_at  │       │
└─────────────┘       │
       △              │
       │              │
       │ user_id (FK) │
       │              │
┌──────┴───────┐      │
│QUIZ_ATTEMPTS │      │
│──────────────│      │
│ id (PK)      │      │      ┌──────────────┐
│ quiz_id (FK) ├──────┼─────►│   QUIZZES    │
│ user_id (FK) │      │      │──────────────│
│ started_at   │      │      │ id (PK)      │
│ submitted_at │      └──────┤ created_by   │
│ score        │             │ title        │
│ total_points │             │ description  │
│ status       │             │ duration     │
└──────┬───────┘             │ is_active    │
       │                     │ created_at   │
       │                     │ updated_at   │
       │                     └──────┬───────┘
       │ attempt_id (FK)            │ quiz_id (FK)
       │                            │
       │                     ┌──────▼───────┐
       │                     │  QUESTIONS   │
       │                     │──────────────│
       │                     │ id (PK)      │
┌──────▼───────┐     ┌──────┤ quiz_id (FK) │
│   ANSWERS    │     │      │ question_text│
│──────────────│     │      │ type         │
│ id (PK)      │     │      │ points       │
│ attempt_id   │     │      └──────┬───────┘
│ question_id  ├─────┘             │ question_id (FK)
│ selected_opt │                   │
│ text_answer  │             ┌─────▼────────┐
│ is_correct   │             │   OPTIONS    │
│ points_earned│             │──────────────│
└──────┬───────┘             │ id (PK)      │
       │                     │ question_id  │
       │ selected_option_id  │ option_text  │
       └────────────────────►│ is_correct   │
                             └──────────────┘
```

### 9.2 Relationships Explained

#### 1. Users ↔ Quizzes (created_by)
- **Type:** One-to-Many
- **Description:** One admin user can create many quizzes
- **Cardinality:** 1:N
- **Foreign Key:** quizzes.created_by → users.id
- **On Delete:** RESTRICT (cannot delete user with quizzes)

#### 2. Quizzes ↔ Questions
- **Type:** One-to-Many (Bidirectional)
- **Description:** One quiz contains many questions
- **Cardinality:** 1:N
- **Foreign Key:** questions.quiz_id → quizzes.id
- **Cascade:** ALL (delete questions when quiz deleted)
- **Orphan Removal:** true

#### 3. Questions ↔ Options
- **Type:** One-to-Many (Bidirectional)
- **Description:** One question has multiple options
- **Cardinality:** 1:N (typically 4-5 for MCQ, 2 for T/F)
- **Foreign Key:** options.question_id → questions.id
- **Cascade:** ALL
- **Orphan Removal:** true

#### 4. Users ↔ QuizAttempts
- **Type:** One-to-Many
- **Description:** One candidate can have multiple quiz attempts
- **Cardinality:** 1:N
- **Foreign Key:** quiz_attempts.user_id → users.id

#### 5. Quizzes ↔ QuizAttempts
- **Type:** One-to-Many
- **Description:** One quiz can have many attempts by different candidates
- **Cardinality:** 1:N
- **Foreign Key:** quiz_attempts.quiz_id → quizzes.id

#### 6. QuizAttempts ↔ Answers
- **Type:** One-to-Many (Bidirectional)
- **Description:** One attempt contains multiple answers (one per question)
- **Cardinality:** 1:N
- **Foreign Key:** answers.attempt_id → quiz_attempts.id
- **Cascade:** ALL
- **Orphan Removal:** true

#### 7. Questions ↔ Answers
- **Type:** One-to-Many
- **Description:** One question can have many answers across different attempts
- **Cardinality:** 1:N
- **Foreign Key:** answers.question_id → questions.id

#### 8. Options ↔ Answers
- **Type:** One-to-Many (Optional)
- **Description:** One option can be selected by multiple candidates
- **Cardinality:** 1:N
- **Foreign Key:** answers.selected_option_id → options.id (NULLABLE)
- **Note:** NULL for short answer questions

---

### 9.3 Database Indexes

**Recommended indexes for performance:**

```sql
-- Email lookup (authentication)
CREATE INDEX idx_users_email ON users(email);

-- Active quiz queries
CREATE INDEX idx_quizzes_is_active ON quizzes(is_active);

-- User attempt history
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);

-- Quiz analytics
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);

-- Attempt status filtering
CREATE INDEX idx_quiz_attempts_status ON quiz_attempts(status);

-- Question lookup by quiz
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);

-- Answer lookup by attempt
CREATE INDEX idx_answers_attempt_id ON answers(attempt_id);
```

---

### 9.4 Constraints

**Primary Keys:**
- All tables use auto-incrementing BIGINT

**Unique Constraints:**
- `users.email` - Email must be unique

**Not Null Constraints:**
- All foreign keys (except answers.selected_option_id)
- User: email, password, name, role, created_at
- Quiz: title, duration, is_active, created_by
- Question: quiz_id, question_text, type, points
- Option: question_id, option_text, is_correct
- QuizAttempt: quiz_id, user_id, started_at, status
- Answer: attempt_id, question_id, is_correct

---

## 10. API Reference

### 10.1 Authentication

All authenticated endpoints require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

### 10.2 Response Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, POST (update) |
| 201 | Created | Successful POST (create) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions (wrong role) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

### 10.3 Error Response Format

```json
{
  "timestamp": "2025-11-10T11:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Email already registered",
  "path": "/api/auth/register"
}
```

### 10.4 Pagination (Future Enhancement)

For endpoints returning lists, add pagination:

```
GET /api/admin/quizzes?page=0&size=10&sort=createdAt,desc
```

Response:
```json
{
  "content": [ /* quiz objects */ ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "totalPages": 5,
    "totalElements": 50
  }
}
```

---

## 11. Dependencies

### 11.1 Core Dependencies

**pom.xml:**

```xml
<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>3.2.0</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
        <version>3.2.0</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
        <version>3.2.0</version>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
        <version>3.2.0</version>
    </dependency>
    
    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
        <scope>runtime</scope>
    </dependency>
    
    <!-- OpenAPI/Swagger -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.6.0</version>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.30</version>
        <scope>provided</scope>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 11.2 Dependency Purposes

| Dependency | Purpose |
|------------|---------|
| spring-boot-starter-web | REST API, embedded Tomcat |
| spring-boot-starter-data-jpa | JPA, Hibernate, database access |
| spring-boot-starter-security | Authentication, authorization |
| spring-boot-starter-validation | Bean validation (JSR-380) |
| postgresql | PostgreSQL JDBC driver |
| jjwt | JWT token generation/validation |
| springdoc-openapi | OpenAPI 3.0 documentation |
| lombok | Reduce boilerplate code |

### 11.3 Build Configuration

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

### 11.4 Maven Commands

```bash
# Clean and build
mvn clean install

# Run application
mvn spring-boot:run

# Package as JAR
mvn clean package

# Skip tests
mvn clean package -DskipTests

# Run tests
mvn test
```

---

## Appendix A: Quick Reference

### A.1 Common Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login and get JWT |
| POST | /api/admin/quizzes | Create quiz |
| GET | /api/admin/quizzes | List admin's quizzes |
| GET | /api/candidate/quizzes | List available quizzes |
| POST | /api/candidate/quizzes/{id}/start | Start quiz |
| POST | /api/candidate/attempts/{id}/submit | Submit quiz |
| GET | /api/candidate/attempts/{id}/results | View results |

### A.2 Entity Summary

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| User | System users | email, password, role |
| Quiz | Quiz definition | title, duration, isActive |
| Question | Quiz question | questionText, type, points |
| Option | Answer option | optionText, isCorrect |
| QuizAttempt | Quiz taking session | status, score, startedAt |
| Answer | Candidate's answer | selectedOption, isCorrect |

### A.3 Enum Values

**User.Role:**
- ADMIN
- CANDIDATE

**Question.QuestionType:**
- MULTIPLE_CHOICE
- TRUE_FALSE
- SHORT_ANSWER

**QuizAttempt.AttemptStatus:**
- IN_PROGRESS
- SUBMITTED
- EVALUATED

---

**End of Documentation**

For questions or issues, refer to the source code at: `/home/albinsphilip/Desktop/proj/quizforge/backend/`
