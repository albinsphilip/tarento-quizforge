# QuizForge Backend Documentation - Complete Index

## 📚 Documentation Package Contents

### 🎯 Quick Access
- **Main Document:** `quizforge_main.tex` (compile this)
- **Output:** `quizforge_main.pdf` (generated after compilation)
- **Quick Start:** `QUICKSTART.md`
- **Complete Guide:** `README.md`
- **This File:** `INDEX.md`

---

## 📖 Chapter Index

### Chapter 1: Introduction (01_introduction.tex)
**Pages:** ~10-15

**Contents:**
- Project overview
- Key features
- Technology stack table
- Project structure
- Design patterns
- API architecture
- Database schema overview
- Document organization
- Conventions used

**Key Topics:**
- Spring Boot 3.2.0
- Java 21
- PostgreSQL
- JWT authentication
- RESTful API design

---

### Chapter 2: System Architecture (02_architecture.tex)
**Pages:** ~20-25

**Contents:**
- Layered architecture diagram
- Layer responsibilities
- Request flow diagram
- Component interaction
- Authentication flow
- Quiz creation flow
- Quiz taking flow
- Design decisions
- Scalability considerations
- Error handling strategy
- Transaction management

**Key Topics:**
- MVC pattern
- Service layer pattern
- Repository pattern
- Stateless architecture
- JWT workflow

---

### Chapter 3: Data Models (03_models.tex + 03_models_continued.tex)
**Pages:** ~35-40

**Contents:**

#### Part 1 (03_models.tex):
- User entity (complete)
- Quiz entity (complete)
- Line-by-line explanations
- Database table structures
- JPA annotations
- Cascade operations

#### Part 2 (03_models_continued.tex):
- Question entity
- Option entity
- QuizAttempt entity
- Answer entity
- All with complete explanations

**Entities Covered:**
1. **User** - Authentication, roles, timestamps
2. **Quiz** - Title, duration, questions, creator
3. **Question** - Types, points, options
4. **Option** - Choices, correct answers
5. **QuizAttempt** - Attempts, scoring, status
6. **Answer** - Responses, grading, points

**Key Topics:**
- JPA entity mapping
- @OneToMany relationships
- @ManyToOne relationships
- Cascade types
- Orphan removal
- Lazy vs eager loading
- @PrePersist callbacks
- Enum types

---

### Chapter 4: Repository Layer (04_repositories.tex)
**Pages:** ~15-18

**Contents:**
- Repository pattern overview
- All 5 repositories:
  - UserRepository
  - QuizRepository
  - QuestionRepository
  - QuizAttemptRepository
  - AnswerRepository
- Custom query methods
- Spring Data JPA conventions
- Method naming patterns
- Transaction management
- Performance considerations
- N+1 query problem
- Pagination examples

**Key Topics:**
- JpaRepository interface
- Query method generation
- findBy conventions
- existsBy methods
- Custom queries
- Performance optimization

---

### Chapter 5: Service Layer (05_services.tex + 05_services_continued.tex)
**Pages:** ~30-35

**Contents:**

#### Part 1 (05_services.tex):
- Service layer overview
- AuthService (complete)
- AdminService (methods 1-5):
  - getAllQuizzes
  - getQuizById
  - createQuiz (parts 1-5)
  - updateQuiz
  - deleteQuiz
  - getQuizAnalytics

#### Part 2 (05_services_continued.tex):
- CandidateService (complete):
  - getAvailableQuizzes
  - startQuiz
  - getQuizForAttempt
  - submitQuiz
  - getMyAttempts
  - getAttemptResult
- DTO conversion methods
- Helper methods

**Key Topics:**
- @Service annotation
- @Transactional
- Business logic
- DTO conversion
- Cascade operations
- Stream API usage
- Quiz grading logic
- Answer hiding for candidates

---

### Chapter 6: REST Controllers (06_controllers.tex)
**Pages:** ~20-22

**Contents:**
- Controllers overview
- AuthController:
  - POST /api/auth/login
- AdminController (6 endpoints):
  - GET /api/admin/quizzes
  - GET /api/admin/quizzes/{id}
  - POST /api/admin/quizzes
  - PUT /api/admin/quizzes/{id}
  - DELETE /api/admin/quizzes/{id}
  - GET /api/admin/quizzes/{id}/analytics
- CandidateController (6 endpoints):
  - GET /api/candidate/quizzes
  - POST /api/candidate/quizzes/{quizId}/start
  - GET /api/candidate/quizzes/{quizId}
  - POST /api/candidate/quizzes/submit
  - GET /api/candidate/quizzes/my-attempts
  - GET /api/candidate/quizzes/attempts/{attemptId}
- HTTP status codes
- Annotation explanations

**Key Topics:**
- @RestController
- @RequestMapping
- @GetMapping, @PostMapping, @PutMapping, @DeleteMapping
- @PathVariable
- @RequestBody
- @Valid validation
- Authentication object
- OpenAPI annotations
- Response entities

---

### Chapter 7: Security Layer (07_security.tex)
**Pages:** ~25-28

**Contents:**
- Security overview
- SecurityConfig:
  - SecurityFilterChain
  - CORS configuration
  - Authorization rules
  - Session management
- JwtUtil:
  - Token generation
  - Token validation
  - Claims extraction
  - Expiration handling
- JwtRequestFilter:
  - Request interception
  - Token extraction
  - Authentication setup
- Authentication flow diagram
- JWT token structure

**Key Topics:**
- Spring Security 6.x
- JWT Bearer authentication
- HMAC-SHA512 signing
- Stateless sessions
- Role-based access control
- CSRF disabled
- Filter chain
- Security context

---

### Chapter 8: API Documentation (08_api_documentation.tex)
**Pages:** ~20-25

**Contents:**
- OpenAPI configuration
- Complete endpoint reference:
  - Authentication (1 endpoint)
  - Admin endpoints (6 endpoints)
  - Candidate endpoints (6 endpoints)
- Request/response examples
- OpenAPI JSON specification
- Swagger UI access
- All endpoints with:
  - URL and method
  - Request body schema
  - Response schema
  - Status codes
  - Security requirements
  - Path parameters
  - Query parameters

**Key Topics:**
- OpenAPI 3.0 specification
- SpringDoc configuration
- Swagger UI
- API testing
- JSON examples
- Bearer authentication
- HTTP methods
- Status codes

---

### Chapter 9: ER Diagram (09_er_diagram.tex)
**Pages:** ~15-18

**Contents:**
- Complete ER diagram (TikZ)
- All 6 entities
- All 8 relationships
- Detailed relationship explanations:
  - User → Quiz (created_by)
  - Quiz ↔ Question
  - Question ↔ Option
  - Quiz → QuizAttempt
  - User → QuizAttempt
  - QuizAttempt ↔ Answer
  - Question → Answer
  - Option → Answer
- Database constraints:
  - Primary keys
  - Foreign keys
  - Unique constraints
  - Not null constraints
  - Indexes
- SQL constraint examples

**Key Topics:**
- Entity relationships
- Cardinality
- Foreign key constraints
- Cascade rules
- Bidirectional relationships
- Orphan removal
- Database indexes
- Referential integrity

---

### Chapter 10: Configuration (10_configuration.tex)
**Pages:** ~15-18

**Contents:**
- Complete application.properties
- Section-by-section breakdown:
  - Server configuration
  - Database configuration
  - JPA configuration
  - JWT configuration
  - Swagger/OpenAPI configuration
  - CORS configuration
  - Logging configuration
- Maven pom.xml analysis
- Environment-specific configuration
- Profile-based configuration
- External configuration
- Database migration tools
- Production recommendations

**Key Topics:**
- Spring Boot properties
- PostgreSQL connection
- Hibernate DDL-auto
- JWT secret management
- CORS origins
- Property placeholders
- Environment variables
- Configuration profiles

---

### Appendix A: Dependencies (appendix_a_dependencies.tex)
**Pages:** ~12-15

**Contents:**
- Complete dependency list:
  - Spring Boot starters
  - JWT libraries (JJWT)
  - PostgreSQL driver
  - SpringDoc OpenAPI
  - Lombok
  - Validation
  - DevTools
- Dependency tree
- Version compatibility matrix
- Maven plugins
- Maven commands
- Build instructions
- Deployment guide
- Production dependencies

**Key Topics:**
- Maven dependencies
- Version management
- Dependency scopes
- Build plugins
- spring-boot-maven-plugin
- Dockerfile example
- Production deployment

---

## 🔍 Quick Reference by Topic

### Authentication & Security
- Chapter 7: Security Layer (complete JWT implementation)
- Chapter 5: AuthService
- Chapter 6: AuthController
- Chapter 10: JWT configuration

### Database Design
- Chapter 3: All 6 entities
- Chapter 9: Complete ER diagram
- Chapter 4: Repository layer

### API Reference
- Chapter 8: Complete OpenAPI documentation
- Chapter 6: All controllers

### Business Logic
- Chapter 5: All service classes
- AdminService and CandidateService

### Configuration
- Chapter 10: Complete configuration guide
- Appendix A: All dependencies

---

## 📊 Code Coverage

### Java Classes Documented (100%):
✅ QuizForgeApplication.java
✅ OpenApiConfig.java
✅ User.java
✅ Quiz.java
✅ Question.java
✅ Option.java
✅ QuizAttempt.java
✅ Answer.java
✅ UserRepository.java
✅ QuizRepository.java
✅ QuestionRepository.java
✅ QuizAttemptRepository.java
✅ AnswerRepository.java
✅ AuthService.java
✅ AdminService.java
✅ CandidateService.java
✅ AuthController.java
✅ AdminController.java
✅ CandidateController.java
✅ SecurityConfig.java
✅ JwtUtil.java
✅ JwtRequestFilter.java

### DTOs Documented:
✅ LoginRequest
✅ LoginResponse
✅ QuizRequest
✅ QuizResponse
✅ QuizSummaryResponse
✅ QuestionRequest
✅ QuestionResponse
✅ OptionRequest
✅ OptionResponse
✅ AnswerRequest
✅ AttemptResponse
✅ SubmitQuizRequest
✅ QuizAnalyticsResponse

---

## 🎯 How to Find Specific Topics

| Topic | Location |
|-------|----------|
| How JWT works | Chapter 7, pages on JwtUtil |
| How to create a quiz | Chapter 5, AdminService.createQuiz |
| Database relationships | Chapter 9, Complete ER diagram |
| API endpoints list | Chapter 8, All endpoints table |
| Entity field meanings | Chapter 3, respective entity section |
| Security configuration | Chapter 7, SecurityConfig |
| CORS setup | Chapter 7 & Chapter 10 |
| Database connection | Chapter 10, Database configuration |
| Quiz taking flow | Chapter 5, CandidateService |
| Answer grading logic | Chapter 5, submitQuiz method |
| Role-based access | Chapter 7, Authorization rules |
| OpenAPI setup | Chapter 8, OpenApiConfig |
| Maven dependencies | Appendix A |
| Configuration profiles | Chapter 10, Environment-specific |

---

## 📝 Document Statistics

- **Total Chapters:** 10 + 1 appendix
- **Total Pages:** ~200-250 pages
- **Total Code Listings:** 100+
- **Total Diagrams:** 10+
- **Total Tables:** 50+
- **Lines of LaTeX:** 3,500+
- **Java Classes Covered:** 22
- **API Endpoints:** 13
- **Database Entities:** 6
- **Repositories:** 5
- **Services:** 3
- **Controllers:** 3

---

## 🚀 Compilation Instructions

See `QUICKSTART.md` or `README.md` for detailed instructions.

**Quick compile:**
```bash
cd documentation
make
```

---

**Document Version:** 1.0.0  
**Last Updated:** November 2025  
**Format:** LaTeX → PDF  
**Author:** Technical Documentation Team
