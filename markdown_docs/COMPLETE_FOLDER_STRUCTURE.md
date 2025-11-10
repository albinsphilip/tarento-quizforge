# QuizForge Backend - Complete Line-by-Line Documentation (Folder Structure)

> **Every file, every line explained following the actual project folder structure**

---

## 📁 Project Structure Overview

```
backend/src/main/java/com/quizforge/
├── QuizForgeApplication.java           # ← Main entry point (12 lines)
├── config/                             # ← Configuration classes
│   └── OpenApiConfig.java             # ← Swagger/OpenAPI setup (27 lines)
├── model/                              # ← JPA Entities (database tables)
│   ├── User.java                      # ← User entity (41 lines)
│   ├── Quiz.java                      # ← Quiz entity (55 lines)
│   ├── Question.java                  # ← Question entity (39 lines)
│   ├── Option.java                    # ← Option entity (24 lines)
│   ├── QuizAttempt.java               # ← QuizAttempt entity (53 lines)
│   └── Answer.java                    # ← Answer entity (35 lines)
├── dto/                                # ← Data Transfer Objects (API contracts)
│   ├── LoginRequest.java              # ← Login input (13 lines)
│   ├── LoginResponse.java             # ← Login output (8 lines)
│   ├── QuizRequest.java               # ← Create/update quiz input (21 lines)
│   ├── QuizResponse.java              # ← Full quiz output (14 lines)
│   ├── QuizSummaryResponse.java       # ← Quiz list item (11 lines)
│   ├── QuestionRequest.java           # ← Question input (17 lines)
│   ├── QuestionResponse.java          # ← Question output (9 lines)
│   ├── OptionRequest.java             # ← Option input (12 lines)
│   ├── OptionResponse.java            # ← Option output (6 lines)
│   ├── AnswerRequest.java             # ← Single answer input (7 lines)
│   ├── SubmitQuizRequest.java         # ← Submit quiz input (6 lines)
│   ├── AttemptResponse.java           # ← Attempt status output (11 lines)
│   └── QuizAnalyticsResponse.java     # ← Quiz stats output (9 lines)
├── repository/                         # ← Data access layer (Spring Data JPA)
│   ├── UserRepository.java            # ← User data access (12 lines)
│   ├── QuizRepository.java            # ← Quiz data access (13 lines)
│   ├── QuestionRepository.java        # ← Question data access (9 lines)
│   ├── QuizAttemptRepository.java     # ← Attempt data access (13 lines)
│   └── AnswerRepository.java          # ← Answer data access (9 lines)
├── service/                            # ← Business logic layer
│   ├── AuthService.java               # ← Authentication (47 lines)
│   ├── AdminService.java              # ← Admin operations (176 lines)
│   └── CandidateService.java          # ← Candidate operations (157 lines)
├── controller/                         # ← REST API endpoints
│   ├── AuthController.java            # ← /api/auth/** (22 lines)
│   ├── AdminController.java           # ← /api/admin/** (63 lines)
│   └── CandidateController.java       # ← /api/candidate/** (70 lines)
└── security/                           # ← Authentication & authorization
    ├── SecurityConfig.java            # ← Spring Security config (66 lines)
    ├── JwtUtil.java                   # ← JWT token utility (78 lines)
    └── JwtRequestFilter.java          # ← JWT request filter (55 lines)

Total Java Files: 35
Total Lines of Code: ~1,200
```

---

## 📂 ROOT LEVEL

### File: `QuizForgeApplication.java`

**Location:** `backend/src/main/java/com/quizforge/QuizForgeApplication.java`  
**Purpose:** Main entry point of the Spring Boot application  
**Lines:** 12

#### Complete Source Code with Line-by-Line Explanation

```java
1  package com.quizforge;
```
**Line 1 - Package Declaration**
- Declares root package for the entire application
- All other classes are in sub-packages: `.model`, `.service`, `.controller`, etc.
- Convention: Company/project name in lowercase
- This package becomes the base for component scanning

```java
2
3  import org.springframework.boot.SpringApplication;
```
**Line 3 - Import SpringApplication**
- Core Spring Boot class that launches the application
- Provides static `run()` method to bootstrap Spring context
- Handles:
  - Classpath scanning for @Component, @Service, @Controller
  - Auto-configuration based on dependencies
  - Embedded web server startup (Tomcat)
  - Application lifecycle management

```java
4  import org.springframework.boot.autoconfigure.SpringBootApplication;
```
**Line 4 - Import @SpringBootApplication**
- Composite annotation that combines three annotations:
  1. `@Configuration` - Marks as configuration class
  2. `@EnableAutoConfiguration` - Enables Spring Boot's auto-configuration
  3. `@ComponentScan` - Scans current package and sub-packages
- Scans: `com.quizforge.*` (all sub-packages)
- Finds: Controllers, Services, Repositories, Components

```java
5
6  @SpringBootApplication
```
**Line 6 - Main Application Annotation**
- Enables all Spring Boot features
- **Auto-configuration triggers:**
  - Detects `spring-boot-starter-web` → Configures embedded Tomcat, REST support
  - Detects `spring-boot-starter-data-jpa` → Configures Hibernate, DataSource
  - Detects `spring-boot-starter-security` → Configures security filters
  - Detects PostgreSQL driver → Configures PostgreSQL dialect
- **Component scanning:**
  - Finds all classes annotated with:
    - `@Controller`, `@RestController` in `.controller` package
    - `@Service` in `.service` package
    - `@Repository` in `.repository` package
    - `@Component` in `.security` package
    - `@Configuration` in `.config` package
- **Base package:** `com.quizforge` (this package and below)

```java
7  public class QuizForgeApplication {
```
**Line 7 - Main Class Declaration**
- **public:** Must be public for Spring Boot to access
- **class:** Standard Java class (not interface or enum)
- **QuizForgeApplication:** Convention: `<ProjectName>Application`
- **Contains:** Only the main method (no other logic)
- **Purpose:** Bootstrap Spring container and run application

```java
8      public static void main(String[] args) {
```
**Line 8 - Main Method**
- **public:** JVM requires public main
- **static:** Called without creating instance
- **void:** Doesn't return value
- **main:** Required method name for JVM entry point
- **String[] args:** Command-line arguments
  - Example: `java -jar app.jar --server.port=9090`
  - Spring Boot parses these as properties

```java
9          SpringApplication.run(QuizForgeApplication.class, args);
```
**Line 9 - Application Launch**

**Full Breakdown:**

**`SpringApplication.run(...)`**
- Static method that does ALL the heavy lifting
- **Steps performed:**

**1. Create Application Context:**
```
- Instantiates Spring ApplicationContext
- Loads all configuration classes
- Registers all beans (Services, Controllers, Repositories)
```

**2. Auto-Configuration:**
```
- Reads application.properties
- Configures database connection (DataSource)
- Sets up JPA/Hibernate (EntityManagerFactory)
- Configures Spring Security (SecurityFilterChain)
- Sets up embedded Tomcat server
- Registers REST controllers
```

**3. Component Scanning:**
```
Scans com.quizforge package:
  ├── Finds @RestController classes
  │   ├── AuthController
  │   ├── AdminController
  │   └── CandidateController
  ├── Finds @Service classes
  │   ├── AuthService
  │   ├── AdminService
  │   └── CandidateService
  ├── Finds @Repository interfaces
  │   ├── UserRepository
  │   ├── QuizRepository
  │   ├── QuestionRepository
  │   ├── QuizAttemptRepository
  │   └── AnswerRepository
  ├── Finds @Component classes
  │   ├── JwtUtil
  │   └── JwtRequestFilter
  └── Finds @Configuration classes
      ├── SecurityConfig
      └── OpenApiConfig
```

**4. Dependency Injection:**
```
Resolves dependencies:
  - Controllers need Services → Inject them
  - Services need Repositories → Inject them
  - Services need JwtUtil → Inject it
  - Filters need JwtUtil → Inject it
```

**5. Database Initialization:**
```
- Connects to PostgreSQL
- Runs DDL (CREATE TABLE statements) if ddl-auto=update
- Creates tables for all @Entity classes
```

**6. Server Startup:**
```
- Starts embedded Tomcat on port 8080
- Registers all @RequestMapping endpoints
- Starts listening for HTTP requests
```

**Parameters:**

**`QuizForgeApplication.class`**
- Tells Spring Boot which class is the main application class
- Used to determine base package for scanning
- Spring scans this package and all sub-packages

**`args`**
- Command-line arguments passed to application
- Can override properties:
  ```bash
  java -jar quizforge.jar --server.port=9090
  java -jar quizforge.jar --spring.profiles.active=prod
  ```

**What happens after this line:**
```
1. Application context fully initialized
2. All beans created and wired
3. Database connected and ready
4. Tomcat started on port 8080
5. Security filters active
6. API endpoints registered:
   - http://localhost:8080/api/auth/login
   - http://localhost:8080/api/admin/quizzes
   - http://localhost:8080/api/candidate/quizzes
   - http://localhost:8080/swagger-ui.html
7. Application ready to handle requests
```

```java
10     }
```
**Line 10 - End of main method**

```java
11 }
```
**Line 11 - End of class**

```java
12 
```
**Line 12 - End of file**

---

### Startup Sequence Diagram

```
JVM starts
    ↓
main() method called
    ↓
SpringApplication.run()
    ↓
┌─────────────────────────────────────┐
│ 1. Load Configuration               │
│    - application.properties         │
│    - @Configuration classes         │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 2. Component Scanning               │
│    - Scan com.quizforge.*           │
│    - Find all annotated classes     │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 3. Bean Creation                    │
│    - Create all Spring beans        │
│    - Resolve dependencies           │
│    - Inject dependencies            │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 4. Database Setup                   │
│    - Connect to PostgreSQL          │
│    - Create/update tables           │
│    - Validate schema                │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 5. Security Initialization          │
│    - Configure SecurityFilterChain  │
│    - Register JwtRequestFilter      │
│    - Set up CORS                    │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ 6. Tomcat Startup                   │
│    - Start embedded server          │
│    - Bind to port 8080              │
│    - Register all endpoints         │
└─────────────┬───────────────────────┘
              ↓
    Application Running!
    Ready to accept requests
```

---

### Console Output on Startup

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2025-11-10T14:30:00.123  INFO 1234 --- [main] c.q.QuizForgeApplication : Starting QuizForgeApplication
2025-11-10T14:30:00.456  INFO 1234 --- [main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories
2025-11-10T14:30:00.789  INFO 1234 --- [main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning. Found 5 JPA repositories.
2025-11-10T14:30:01.234  INFO 1234 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2025-11-10T14:30:01.567  INFO 1234 --- [main] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo [name: default]
2025-11-10T14:30:01.890  INFO 1234 --- [main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 6.3.1.Final
2025-11-10T14:30:02.123  INFO 1234 --- [main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]
2025-11-10T14:30:02.456  INFO 1234 --- [main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2025-11-10T14:30:03.789  INFO 1234 --- [main] o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with filters
2025-11-10T14:30:04.123  INFO 1234 --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2025-11-10T14:30:04.456  INFO 1234 --- [main] c.q.QuizForgeApplication                 : Started QuizForgeApplication in 4.333 seconds

Application is ready!
Swagger UI: http://localhost:8080/swagger-ui.html
API Docs: http://localhost:8080/v3/api-docs
```

---

### Key Takeaways

**This 12-line file:**
1. ✅ Bootstraps entire Spring Boot application
2. ✅ Scans and loads 35 Java classes
3. ✅ Creates 50+ Spring beans
4. ✅ Connects to PostgreSQL database
5. ✅ Creates 6 database tables
6. ✅ Configures security with JWT
7. ✅ Starts Tomcat web server
8. ✅ Registers 13 API endpoints
9. ✅ Sets up Swagger UI
10. ✅ Ready to handle requests in ~4 seconds

**All from:**
```java
SpringApplication.run(QuizForgeApplication.class, args);
```

**That's the power of Spring Boot auto-configuration!**

---

[CONTINUED IN NEXT FILE: FOLDER-BY-FOLDER BREAKDOWN]
