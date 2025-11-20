# QuizForge Frontend Workflow Diagram - Technical Deep Dive

> **Complete operational flow documentation for the QuizForge platform**  
> **Generated:** November 20, 2025  
> **Version:** 2.0 - Enhanced Technical Details

---

## 🎯 Overview

This document provides a comprehensive technical diagrammatic representation of all user operations, automated workflows, state management, API interactions, and implementation details in the QuizForge platform, covering both Admin and Candidate roles with deep technical insights into React component lifecycle, Spring Boot service layer, JWT security, and database transactions.

---

## 📊 System Architecture Flow - Technical Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        QUIZFORGE PLATFORM                               │
│              Full Stack: React 18 + Spring Boot 3 + MySQL 8             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                   ┌────────────────┴───────────────┐
                   │                                │
        ┌──────────▼─────────┐           ┌─────────▼──────────┐
        │    FRONTEND        │           │     BACKEND        │
        │                    │◄─────────►│                    │
        │  React 18.2.0      │  REST API │  Spring Boot 3.x   │
        │  Vite 5.x          │  JWT Auth │  Java 17           │
        │  React Router 6.x  │           │  Maven             │
        │  Axios 1.x         │           │  JPA/Hibernate     │
        │  Tailwind CSS 3.x  │           │                    │
        │  Port: 5173        │           │  Port: 8080        │
        └────────────────────┘           └─────────┬──────────┘
                                                   │
                      ┌────────────────────────────┴─────────────┐
                      │                                          │
           ┌──────────▼──────────┐                  ┌───────────▼───────────┐
           │  SECURITY LAYER     │                  │   DATA PERSISTENCE    │
           │  ═══════════════     │                  │   ═══════════════     │
           │  Spring Security    │                  │   MySQL 8.0           │
           │  JWT (HS512)        │                  │   JDBC Driver         │
           │  BCrypt Password    │                  │   HikariCP Pool       │
           │  CORS Enabled       │                  │   Tables:             │
           │  @PreAuthorize      │                  │   - users             │
           └─────────────────────┘                  │   - quizzes           │
                                                    │   - questions         │
                                                    │   - options           │
                                                    │   - quiz_attempts     │
                                                    │   - answers           │
                                                    └───────────────────────┘

TECH STACK DETAILS:
═══════════════════

Frontend Dependencies:
├── react: ^18.2.0
├── react-router-dom: ^6.x
├── axios: ^1.x
├── tailwindcss: ^3.x
└── vite: ^5.x

Backend Dependencies:
├── spring-boot-starter-web: 3.x
├── spring-boot-starter-data-jpa: 3.x
├── spring-boot-starter-security: 3.x
├── jjwt-api: 0.12.x
├── jjwt-impl: 0.12.x
├── jjwt-jackson: 0.12.x
├── mysql-connector-j: 8.x
├── springdoc-openapi-starter-webmvc-ui: 2.x
└── lombok: 1.18.x

Build Tools:
├── Frontend: Vite (ES Modules, HMR, Fast Refresh)
└── Backend: Maven (pom.xml, dependency management)
```

---

## 🔐 Authentication Flow - Technical Deep Dive

```
┌────────────────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION WORKFLOW (JWT-Based)                   │
└────────────────────────────────────────────────────────────────────────┘

    User Access Browser
        │
        ▼
   ┌─────────────────────────────────────┐
   │  Login.jsx Component                │
   │  ════════════════════                │
   │  State: useState()                  │
   │  • email: string                    │
   │  • password: string                 │
   │  • error: string                    │
   │  • loading: boolean                 │
   │  • showPassword: boolean            │
   └────┬────────────────────────────────┘
        │
        │ User submits form (handleSubmit)
        │ e.preventDefault()
        │ setLoading(true)
        ▼
   ┌────────────────────────────────────────┐
   │ Frontend: authAPI.login()              │
   │ ═══════════════════════════            │
   │ axios.post('/api/auth/login', {        │
   │   email, password                      │
   │ })                                     │
   │                                        │
   │ Axios Interceptor Chain:               │
   │ 1. Request interceptor (adds headers)  │
   │ 2. Send HTTP POST                      │
   │ 3. Response interceptor (error handle) │
   └────┬───────────────────────────────────┘
        │
        │ HTTP Request Over Network
        ▼
   ┌────────────────────────────────────────┐
   │ Backend: AuthController.java           │
   │ ════════════════════════                │
   │ @PostMapping("/api/auth/login")        │
   │ @Valid @RequestBody LoginRequest req   │
   │                                        │
   │ Validation: @NotBlank, @Email          │
   └────┬───────────────────────────────────┘
        │
        ▼
   ┌────────────────────────────────────────┐
   │ AuthService.java                       │
   │ ════════════════                       │
   │ public LoginResponse login(            │
   │     LoginRequest request)              │
   │                                        │
   │ Step 1: Find User                      │
   │ ─────────────────                      │
   │ User user = userRepository             │
   │   .findByEmail(email)                  │
   │   .orElseThrow(                        │
   │     UnauthorizedException)             │
   └────┬───────────────────────────────────┘
        │
        ▼
   ┌────────────────────────────────────────┐
   │ Step 2: Verify Password                │
   │ ═══════════════════════                │
   │ BCryptPasswordEncoder                  │
   │   .matches(rawPassword,                │
   │            encodedPassword)            │
   │                                        │
   │ If false → throw                       │
   │   UnauthorizedException                │
   └────┬───────────────────────────────────┘
        │
        ▼
   ┌────────────────────────────────────────┐
   │ Step 3: Generate JWT Token             │
   │ ═══════════════════════                │
   │ JwtUtil.generateToken(email, role)     │
   │                                        │
   │ Token Structure:                       │
   │ ────────────────                       │
   │ Header:                                │
   │   { "alg": "HS512",                    │
   │     "typ": "JWT" }                     │
   │                                        │
   │ Payload:                               │
   │   { "sub": "user@email.com",           │
   │     "role": "ADMIN|CANDIDATE",         │
   │     "iat": 1700000000,                 │
   │     "exp": 1700086400 }                │
   │                                        │
   │ Signature:                             │
   │   HMACSHA512(                          │
   │     base64(header) + "." +             │
   │     base64(payload),                   │
   │     secret_key                         │
   │   )                                    │
   │                                        │
   │ Expiration: 24 hours                   │
   │ Algorithm: HS512                       │
   │ Secret: From application.properties    │
   └────┬───────────────────────────────────┘
        │
        ▼
   ┌────────────────────────────────────────┐
   │ Step 4: Build Response                 │
   │ ═══════════════════                    │
   │ return new LoginResponse(              │
   │   token,                               │
   │   user.getEmail(),                     │
   │   user.getName(),                      │
   │   user.getRole().name()                │
   │ );                                     │
   └────┬───────────────────────────────────┘
        │
        │ HTTP Response 200 OK
        ▼
   ┌────────────────────────────────────────┐
   │ Frontend: Process Response             │
   │ ═══════════════════════                │
   │ const data = await authAPI.login(...); │
   │                                        │
   │ Step 1: Store Token                    │
   │ localStorage.setItem('token',          │
   │   data.token);                         │
   │                                        │
   │ Step 2: Store User Object              │
   │ localStorage.setItem('user',           │
   │   JSON.stringify({                     │
   │     email: data.email,                 │
   │     name: data.name,                   │
   │     role: data.role                    │
   │   })                                   │
   │ );                                     │
   │                                        │
   │ Step 3: Role-Based Routing             │
   │ const navigate = useNavigate();        │
   │ navigate(                              │
   │   data.role === 'ADMIN'                │
   │     ? '/admin'                         │
   │     : '/candidate'                     │
   │ );                                     │
   └────┬───────────────────────────────────┘
        │
        ├──────────────┬──────────────┐
        │ ADMIN        │ CANDIDATE    │
        ▼              ▼              │
   /admin        /candidate           │
        │              │              │
   AdminDashboard CandidateDashboard  │
   .jsx           .jsx                │
        │              │              │
   useEffect(() => {                  │
     const userData =                 │
       localStorage.getItem('user');  │
     const token =                    │
       localStorage.getItem('token'); │
     if (!userData || !token) {       │
       navigate('/');                 │
       return;                        │
     }                                │
     const parsedUser =               │
       JSON.parse(userData);          │
     if (parsedUser.role !== 'ADMIN') │
       navigate('/candidate');        │
     setUser(parsedUser);             │
     fetchData();                     │
   }, [navigate]);                    │
                                      │
   All subsequent API calls ◄─────────┘
   include JWT in Authorization header
```

### JWT Token Technical Details

**Token Generation (Backend - JwtUtil.java):**
```java
public String generateToken(String email, String role) {
    Map<String, Object> claims = new HashMap<>();
    claims.put("role", role);
    
    return Jwts.builder()
        .setClaims(claims)
        .setSubject(email)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expiration))
        .signWith(getSigningKey(), SignatureAlgorithm.HS512)
        .compact();
}

private Key getSigningKey() {
    return Keys.hmacShaKeyFor(secret.getBytes());
}
```

**Token Validation (Backend - JwtUtil.java):**
```java
public Boolean validateToken(String token, String email) {
    final String extractedEmail = extractEmail(token);
    return (extractedEmail.equals(email) && !isTokenExpired(token));
}

public Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
}

private Claims extractClaims(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
}
```

**Request Filter (Backend - JwtRequestFilter.java):**
```java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain chain) {
    final String authorizationHeader = request.getHeader("Authorization");
    
    String email = null;
    String jwt = null;
    
    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
        jwt = authorizationHeader.substring(7);
        email = jwtUtil.extractEmail(jwt);
    }
    
    if (email != null && SecurityContextHolder.getContext()
            .getAuthentication() == null) {
        
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        
        if (jwtUtil.validateToken(jwt, userDetails.getUsername())) {
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
```

**Axios Interceptor (Frontend - api.js):**
```javascript
// Request interceptor to add auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    const message = error.response?.data?.message || 
                    error.message || 
                    'An error occurred';
    throw new Error(message);
  }
);
```

**Security Configuration (Backend):**
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/candidate/**").hasRole("CANDIDATE")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtRequestFilter, 
                UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

**Password Encryption:**
- Algorithm: BCrypt
- Strength: 12 rounds (default)
- Salt: Randomly generated per password
- Stored in DB as hashed value

---

## 👨‍💼 Admin Workflows

### 1. Admin Dashboard Overview

```
┌───────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                            │
│                   Route: /admin                               │
└───────────────────────────────────────────────────────────────┘

    Page Load
        │
        ├──► Auth Check (ADMIN role required)
        │
        ▼
   ┌─────────────────┐
   │ GET /api/admin/ │
   │    quizzes      │
   └────┬────────────┘
        │
        │ Returns Quiz List
        ▼
   ┌──────────────────────────┐
   │  Display Statistics:     │
   │  • Total Quizzes         │
   │  • Active Quizzes        │
   │  • Inactive Quizzes      │
   └──────────────────────────┘
        │
        ▼
   ┌──────────────────────────┐
   │  Quiz Table with:        │
   │  • Title & Description   │
   │  • Duration & Questions  │
   │  • Status (Active/Inactive)│
   │  • Actions (Edit/Delete) │
   └──────────────────────────┘
        │
        │ Available Actions:
        ├────────┬─────────┬──────────┐
        │        │         │          │
        ▼        ▼         ▼          ▼
    [Create] [Edit]   [Delete] [Analytics]
```

### 2. Create Quiz Flow

```
┌───────────────────────────────────────────────────────────────┐
│                  CREATE QUIZ WORKFLOW                         │
│                Route: /admin/quiz/create                      │
└───────────────────────────────────────────────────────────────┘

   Click "Create Quiz"
        │
        ▼
   ┌──────────────────┐
   │  QuizForm Page   │
   │  (Empty Form)    │
   └────┬─────────────┘
        │
        │ 1. Enter Quiz Details
        ├──────────────────────────┐
        │  • Title (required)       │
        │  • Description            │
        │  • Duration (minutes)     │
        │  • Active Status          │
        └──────────────────────────┘
        │
        │ 2. Add Questions
        ▼
   ┌──────────────────────────────┐
   │  For Each Question:          │
   ├──────────────────────────────┤
   │  • Question Text (required)  │
   │  • Type (Multiple Choice/    │
   │    True-False/Text)          │
   │  • Points (default: 1)       │
   │                              │
   │  3. Add Options:             │
   │  • Option Text               │
   │  • Mark Correct Answer       │
   │  • Add/Remove Options        │
   └────┬─────────────────────────┘
        │
        │ 4. Validation
        ├──────────────────────────┐
        │  ✓ All required fields    │
        │  ✓ At least 1 question    │
        │  ✓ Each question has      │
        │    at least 1 option      │
        │  ✓ At least 1 correct     │
        │    answer per question    │
        └──────────────────────────┘
        │
        │ 5. Submit
        ▼
   ┌──────────────────────┐
   │ POST /api/admin/     │
   │     quizzes          │
   └────┬─────────────────┘
        │
        │ Success Response
        ▼
   ┌────────────────────┐
   │  Show Success      │
   │  Message           │
   └────┬───────────────┘
        │
        ▼
   Navigate to /admin
```

**API Request Structure:**
```json
{
  "title": "Quiz Title",
  "description": "Description",
  "duration": 60,
  "isActive": true,
  "questions": [
    {
      "questionText": "Question text?",
      "type": "MULTIPLE_CHOICE",
      "points": 1,
      "options": [
        {"optionText": "Option A", "isCorrect": true},
        {"optionText": "Option B", "isCorrect": false}
      ]
    }
  ]
}
```

### 3. Edit Quiz Flow

```
┌───────────────────────────────────────────────────────────────┐
│                   EDIT QUIZ WORKFLOW                          │
│               Route: /admin/quiz/edit/:quizId                 │
└───────────────────────────────────────────────────────────────┘

   Click "Edit" on Quiz
        │
        ▼
   ┌──────────────────────┐
   │ GET /api/admin/      │
   │   quizzes/:id        │
   └────┬─────────────────┘
        │
        │ Returns Full Quiz with
        │ Questions & Correct Answers
        ▼
   ┌──────────────────────┐
   │  QuizForm Page       │
   │  (Pre-filled)        │
   └────┬─────────────────┘
        │
        │ Modify any field:
        ├─────────────────────────┐
        │  • Quiz metadata         │
        │  • Question text/points  │
        │  • Options/correct ans   │
        │  • Add/Remove questions  │
        └─────────────────────────┘
        │
        │ Submit Changes
        ▼
   ┌──────────────────────┐
   │ PUT /api/admin/      │
   │   quizzes/:id        │
   └────┬─────────────────┘
        │
        ▼
   ┌─────────────────────┐
   │  Success Message    │
   └────┬────────────────┘
        │
        ▼
   Navigate to /admin
```

### 4. Delete Quiz Flow

```
┌───────────────────────────────────────────────────────────────┐
│                  DELETE QUIZ WORKFLOW                         │
└───────────────────────────────────────────────────────────────┘

   Click "Delete" on Quiz
        │
        ▼
   ┌──────────────────────┐
   │  Confirmation Dialog │
   │  "Are you sure?"     │
   └────┬─────────────────┘
        │
        ├─────────┬──────────┐
        │         │          │
        ▼         ▼          ▼
    [Cancel]  [Confirm]  [Close]
                  │
                  ▼
   ┌───────────────────────┐
   │ DELETE /api/admin/    │
   │    quizzes/:id        │
   └────┬──────────────────┘
        │
        │ Success Response
        ▼
   ┌────────────────────────┐
   │ Remove from UI         │
   │ (No page refresh)      │
   └────────────────────────┘
```

### 5. Analytics Dashboard Flow

```
┌───────────────────────────────────────────────────────────────┐
│                 ANALYTICS DASHBOARD                           │
│                 Route: /admin/analytics                       │
└───────────────────────────────────────────────────────────────┘

    Navigate to Analytics
        │
        ├──► Parallel API Calls
        │
        ├─────────────┬──────────────┐
        │             │              │
        ▼             ▼              ▼
   GET /admin/  GET /admin/    Process Data
    quizzes     quizzes/attempts/all
        │             │
        └──────┬──────┘
               │
               ▼
   ┌────────────────────────────────┐
   │  Calculate Analytics:          │
   ├────────────────────────────────┤
   │  • Total Attempts              │
   │  • Unique Candidates           │
   │  • Average Score               │
   │  • Pass Rate (≥70%)            │
   │  • Average Completion Time     │
   └────┬───────────────────────────┘
        │
        ▼
   ┌────────────────────────────────┐
   │  Display Visualizations:       │
   ├────────────────────────────────┤
   │  1. Key Metrics Cards          │
   │  2. Score Distribution Chart   │
   │  3. Top 5 Performers List      │
   │  4. Recent Attempts Table      │
   └────┬───────────────────────────┘
        │
        │ Filter by Quiz
        ▼
   ┌────────────────────────────────┐
   │  Quiz Dropdown Selection       │
   └────┬───────────────────────────┘
        │
        │ Recalculate for Selected Quiz
        ▼
   Update All Visualizations
```

**Analytics Calculations:**
```javascript
// Average Score
avgScore = Σ(score/totalPoints * 100) / totalAttempts

// Pass Rate
passRate = (attempts with ≥70%) / totalAttempts * 100

// Score Distribution Ranges
0-20%, 21-40%, 41-60%, 61-80%, 81-100%

// Top Performers
Sort by average score across all attempts
```

---

## 👨‍🎓 Candidate Workflows

### 1. Candidate Dashboard Overview

```
┌───────────────────────────────────────────────────────────────┐
│                 CANDIDATE DASHBOARD                           │
│                   Route: /candidate                           │
└───────────────────────────────────────────────────────────────┘

    Page Load
        │
        ├──► Auth Check (CANDIDATE role required)
        │
        ▼
   ┌─────────────────────────┐
   │  Parallel API Calls:    │
   ├─────────────────────────┤
   │  1. GET /api/candidate/ │
   │     quizzes (available) │
   │                         │
   │  2. GET /api/candidate/ │
   │     quizzes/my-attempts │
   └────┬────────────────────┘
        │
        ▼
   ┌──────────────────────────┐
   │  Calculate Statistics:   │
   ├──────────────────────────┤
   │  • Quizzes Completed     │
   │  • Average Score         │
   │  • Quizzes Passed        │
   └────┬─────────────────────┘
        │
        ▼
   ┌──────────────────────────┐
   │  Display Stats Cards     │
   │  (if attempts exist)     │
   └──────────────────────────┘
        │
        ▼
   ┌──────────────────────────┐
   │  Available Quizzes Grid  │
   ├──────────────────────────┤
   │  Each Quiz Card Shows:   │
   │  • Title & Description   │
   │  • Questions Count       │
   │  • Duration              │
   │  • "Start Assessment"    │
   └────┬─────────────────────┘
        │
        │ Actions:
        ├───────────┬──────────┬──────────┐
        │           │          │          │
        ▼           ▼          ▼          ▼
   [Start Quiz] [Profile] [History] [Logout]
```

### 2. Quiz Taking Flow (Core Workflow) - Technical Implementation

```
┌──────────────────────────────────────────────────────────────────────┐
│            QUIZ TAKING WORKFLOW - TECHNICAL DEEP DIVE                │
│            Route: /candidate/quiz/:quizId                            │
│            Component: QuizTaking.jsx                                 │
└──────────────────────────────────────────────────────────────────────┘

   Click "Start Assessment" from CandidateDashboard
        │
        │ onClick={() => navigate(`/candidate/quiz/${quiz.id}`)}
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ React Router Navigation                                  │
   │ ══════════════════════                                   │
   │ <Route path="/candidate/quiz/:quizId"                    │
   │        element={<QuizTaking />} />                       │
   │                                                          │
   │ useParams() → { quizId: "5" }                            │
   └────┬─────────────────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ QuizTaking Component Mount                               │
   │ ════════════════════════════                             │
   │ State Initialization (useState):                         │
   │ ────────────────────────────────                         │
   │ const [user, setUser] = useState(null);                  │
   │ const [quiz, setQuiz] = useState(null);                  │
   │ const [attemptId, setAttemptId] = useState(null);        │
   │ const [currentQuestionIndex, setCurrentQuestionIndex]    │
   │       = useState(0);                                     │
   │ const [answers, setAnswers] = useState({});              │
   │ const [timeLeft, setTimeLeft] = useState(0);             │
   │ const [loading, setLoading] = useState(true);            │
   │ const [submitting, setSubmitting] = useState(false);     │
   │                                                          │
   │ Refs (useRef):                                           │
   │ ─────────────                                            │
   │ const quizStartedRef = useRef(false);                    │
   │   // Prevents double API call in StrictMode              │
   │ const timerRef = useRef(null);                           │
   │   // Store interval ID for cleanup                       │
   └────┬─────────────────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ useEffect #1: Authentication & Initialization            │
   │ ═══════════════════════════════════════════              │
   │ useEffect(() => {                                        │
   │   const userData = localStorage.getItem('user');         │
   │   if (!userData) {                                       │
   │     navigate('/');                                       │
   │     return;                                              │
   │   }                                                      │
   │   const parsedUser = JSON.parse(userData);               │
   │   if (parsedUser.role !== 'CANDIDATE') {                 │
   │     navigate('/');                                       │
   │     return;                                              │
   │   }                                                      │
   │   setUser(parsedUser);                                   │
   │                                                          │
   │   // Prevent double start in React StrictMode            │
   │   if (!quizStartedRef.current) {                         │
   │     quizStartedRef.current = true;                       │
   │     startQuizAttempt();                                  │
   │   }                                                      │
   │ }, []);                                                  │
   └────┬─────────────────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ PHASE 1: Fetch Quiz Details                             │
   │ ══════════════════════════                               │
   │ const startQuizAttempt = async () => {                   │
   │   try {                                                  │
   │     // Step 1: GET quiz structure                        │
   │     const quizData = await candidateAPI.getQuiz(quizId); │
   └────┬─────────────────────────────────────────────────────┘
        │
        │ HTTP GET /api/candidate/quizzes/5
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Backend: CandidateController.getQuizForAttempt()         │
   │ ══════════════════════════════════════════               │
   │ @GetMapping("/{quizId}")                                 │
   │ public QuizResponse getQuizForAttempt(@PathVariable      │
   │                                       Long quizId) {     │
   │   return candidateService.getQuizForAttempt(quizId);     │
   │ }                                                        │
   └────┬─────────────────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Backend: CandidateService.getQuizForAttempt()            │
   │ ═══════════════════════════════════════════              │
   │ public QuizResponse getQuizForAttempt(Long quizId) {     │
   │   Quiz quiz = quizRepository.findById(quizId)            │
   │     .orElseThrow(() -> new ResourceNotFoundException()); │
   │   return toQuizResponseForCandidate(quiz);               │
   │ }                                                        │
   │                                                          │
   │ CRITICAL: toQuizResponseForCandidate()                   │
   │ ────────────────────────────────────                     │
   │ // Maps quiz but EXCLUDES correct answers                │
   │ private QuizResponse toQuizResponseForCandidate(         │
   │                                         Quiz quiz) {     │
   │   return new QuizResponse(                               │
   │     quiz.getId(),                                        │
   │     quiz.getTitle(),                                     │
   │     quiz.getDescription(),                               │
   │     quiz.getDuration(),                                  │
   │     quiz.isActive(),                                     │
   │     quiz.getQuestions().stream()                         │
   │       .map(q -> new QuestionResponse(                    │
   │         q.getId(),                                       │
   │         q.getQuestionText(),                             │
   │         q.getType().name(),                              │
   │         q.getPoints(),                                   │
   │         q.getOptions().stream()                          │
   │           .map(o -> new OptionResponse(                  │
   │             o.getId(),                                   │
   │             o.getOptionText(),                           │
   │             null  // ← CORRECT ANSWER HIDDEN!            │
   │           ))                                             │
   │           .collect(Collectors.toList())                  │
   │       ))                                                 │
   │       .collect(Collectors.toList())                      │
   │   );                                                     │
   │ }                                                        │
   └────┬─────────────────────────────────────────────────────┘
        │
        │ Response: Quiz with questions (no correct answers)
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Frontend: Initialize Answer State                        │
   │ ════════════════════════════════                         │
   │ // Pre-allocate answer objects for all questions         │
   │ const initialAnswers = {};                               │
   │ quizData.questions.forEach(q => {                        │
   │   initialAnswers[q.id] = {                               │
   │     questionId: q.id,                                    │
   │     selectedOptionId: null,                              │
   │     textAnswer: '',                                      │
   │     visited: false                                       │
   │   };                                                     │
   │ });                                                      │
   │ setAnswers(initialAnswers);                              │
   │ setQuiz(quizData);                                       │
   │                                                          │
   │ Example State Structure:                                 │
   │ {                                                        │
   │   1: { questionId: 1, selectedOptionId: null,            │
   │        textAnswer: '', visited: false },                 │
   │   2: { questionId: 2, selectedOptionId: null,            │
   │        textAnswer: '', visited: false },                 │
   │   3: { questionId: 3, selectedOptionId: null,            │
   │        textAnswer: '', visited: false }                  │
   │ }                                                        │
   └────┬─────────────────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ PHASE 2: Create Quiz Attempt                             │
   │ ══════════════════════════                               │
   │ const attemptData = await candidateAPI                   │
   │                         .startQuiz(quizId);              │
   └────┬─────────────────────────────────────────────────────┘
        │
        │ HTTP POST /api/candidate/quizzes/5/start
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Backend: CandidateController.startQuiz()                 │
   │ ══════════════════════════════════════                   │
   │ @PostMapping("/{quizId}/start")                          │
   │ public AttemptResponse startQuiz(                        │
   │     @PathVariable Long quizId,                           │
   │     Authentication authentication) {                     │
   │   String email = authentication.getName();               │
   │   return candidateService.startQuiz(quizId, email);      │
   │ }                                                        │
   └────┬─────────────────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Backend: CandidateService.startQuiz()                    │
   │ ═══════════════════════════════════                      │
   │ @Transactional                                           │
   │ public AttemptResponse startQuiz(Long quizId,            │
   │                                  String email) {         │
   │   Quiz quiz = quizRepository.findById(quizId)            │
   │     .orElseThrow(...);                                   │
   │   User candidate = userRepository.findByEmail(email)     │
   │     .orElseThrow(...);                                   │
   │                                                          │
   │   QuizAttempt attempt = new QuizAttempt();               │
   │   attempt.setQuiz(quiz);                                 │
   │   attempt.setUser(candidate);                            │
   │   attempt.setStartedAt(LocalDateTime.now());             │
   │   attempt.setStatus(                                     │
   │     QuizAttempt.AttemptStatus.IN_PROGRESS);              │
   │   attempt.setTotalPoints(                                │
   │     quiz.getQuestions().stream()                         │
   │       .mapToInt(Question::getPoints)                     │
   │       .sum()                                             │
   │   );                                                     │
   │                                                          │
   │   attempt = attemptRepository.save(attempt);             │
   │   // Database INSERT into quiz_attempts                  │
   │   return toAttemptResponse(attempt);                     │
   │ }                                                        │
   │                                                          │
   │ DB Transaction:                                          │
   │ ──────────────                                           │
   │ INSERT INTO quiz_attempts (                              │
   │   quiz_id, user_id, started_at, status,                  │
   │   total_points, created_at                               │
   │ ) VALUES (5, 2, NOW(), 'IN_PROGRESS', 10, NOW());        │
   │                                                          │
   │ Returns attempt ID: 123                                  │
   └────┬─────────────────────────────────────────────────────┘
        │
        │ Response: { id: 123, status: 'IN_PROGRESS', ... }
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Frontend: Start Timer                                    │
   │ ═══════════════════                                      │
   │ setAttemptId(attemptData.id);  // Store attempt ID       │
   │ setTimeLeft(quizData.duration * 60); // Minutes → Sec    │
   │ setLoading(false);                                       │
   │                                                          │
   │ Example: duration = 30 minutes → timeLeft = 1800 sec     │
   └────┬─────────────────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ useEffect #2: Timer Management                           │
   │ ═════════════════════════                                │
   │ useEffect(() => {                                        │
   │   if (!quiz || submitting) return;                       │
   │                                                          │
   │   const timer = setInterval(() => {                      │
   │     setTimeLeft((prev) => {                              │
   │       if (prev <= 1) {                                   │
   │         clearInterval(timer);                            │
   │         if (!submitting) {                               │
   │           setSubmitting(true);                           │
   │           submitQuizToBackend(false);                    │
   │         }                                                │
   │         return 0;                                        │
   │       }                                                  │
   │       return prev - 1;                                   │
   │     });                                                  │
   │   }, 1000); // Execute every 1 second                    │
   │                                                          │
   │   timerRef.current = timer;                              │
   │                                                          │
   │   return () => {                                         │
   │     if (timer) clearInterval(timer);                     │
   │   };                                                     │
   │ }, [quiz, submitting]);                                  │
   │                                                          │
   │ Dependencies: Only re-create timer when quiz loaded      │
   │               or submission status changes               │
   └────┬─────────────────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ QUIZ INTERFACE RENDERED                                  │
   │ ═════════════════════                                    │
   │ Layout Structure:                                        │
   │ ┌────────────────────────────────────────────────┐       │
   │ │ Header: Quiz Title, Timer Display             │       │
   │ ├────────────┬───────────────────────────────────┤       │
   │ │ Sidebar    │ Main Content Area                │       │
   │ │ (Left)     │ (Right)                          │       │
   │ │            │                                  │       │
   │ │ Q1 [●]     │ Question #1 Display              │       │
   │ │ Q2 [ ]     │ ────────────────────             │       │
   │ │ Q3 [ ]     │ "What is React?"                 │       │
   │ │ Q4 [ ]     │                                  │       │
   │ │ Q5 [ ]     │ ○ A library (selected)           │       │
   │ │ ...        │ ○ A framework                    │       │
   │ │            │ ○ A language                     │       │
   │ │ [Submit]   │ ○ A database                     │       │
   │ │            │                                  │       │
   │ │            │ [Clear] [Save & Next]            │       │
   │ └────────────┴───────────────────────────────────┘       │
   │                                                          │
   │ Timer Display Format:                                    │
   │ ──────────────────                                       │
   │ const formatTime = (seconds) => {                        │
   │   const hours = Math.floor(seconds / 3600);              │
   │   const minutes = Math.floor((seconds % 3600) / 60);     │
   │   const secs = seconds % 60;                             │
   │   return `${String(hours).padStart(2, '0')}:             │
   │            ${String(minutes).padStart(2, '0')}:          │
   │            ${String(secs).padStart(2, '0')}`;            │
   │ };                                                       │
   │ // Example: 1800 → "00:30:00"                            │
   │ //          299  → "00:04:59"                            │
   │ //          59   → "00:00:59" (Red color warning)        │
   │                                                          │
   │ Question Status Colors:                                  │
   │ ─────────────────────                                    │
   │ const getQuestionStatus = (question) => {                │
   │   const answer = answers[question.id];                   │
   │   if (!answer) return 'not-visited';                     │
   │   if (answer.selectedOptionId || answer.textAnswer)      │
   │     return 'answered';                                   │
   │   if (answer.visited) return 'visited';                  │
   │   return 'not-visited';                                  │
   │ };                                                       │
   │                                                          │
   │ CSS Classes:                                             │
   │ • answered: bg-green-500 (green circle)                  │
   │ • visited: bg-yellow-500 (yellow circle)                 │
   │ • not-visited: bg-gray-300 (gray circle)                 │
   │ • current: ring-2 ring-blue-500 (blue border)            │
   └────┬─────────────────────────────────────────────────────┘
        │
        │ USER INTERACTIONS
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Action 1: Answer Selection                               │
   │ ═══════════════════════                                  │
   │ const handleAnswerSelect = (questionId, optionId) => {   │
   │   setAnswers(prev => ({                                  │
   │     ...prev,  // Preserve other questions' answers       │
   │     [questionId]: {                                      │
   │       ...prev[questionId],  // Preserve other fields     │
   │       selectedOptionId: optionId,                        │
   │       visited: true                                      │
   │     }                                                    │
   │   }));                                                   │
   │ };                                                       │
   │                                                          │
   │ State Update Example:                                    │
   │ Before: { 1: { questionId: 1, selectedOptionId: null }}  │
   │ After:  { 1: { questionId: 1, selectedOptionId: 42 }}    │
   │                                                          │
   │ NO API CALL - Pure client-side state management!         │
   └──────────────────────────────────────────────────────────┘
   │
   ├──────────────────────────────────────────────────────────┐
   │ Action 2: Text Answer Input                              │
   │ ═══════════════════════                                  │
   │ const handleTextAnswer = (questionId, text) => {         │
   │   setAnswers(prev => ({                                  │
   │     ...prev,                                             │
   │     [questionId]: {                                      │
   │       ...prev[questionId],                               │
   │       textAnswer: text,                                  │
   │       visited: true                                      │
   │     }                                                    │
   │   }));                                                   │
   │ };                                                       │
   │                                                          │
   │ <textarea                                                │
   │   value={answers[currentQuestion.id]?.textAnswer || ''}  │
   │   onChange={(e) => handleTextAnswer(                     │
   │     currentQuestion.id,                                  │
   │     e.target.value                                       │
   │   )}                                                     │
   │   className="w-full p-3 border rounded-lg"               │
   │ />                                                       │
   └──────────────────────────────────────────────────────────┘
   │
   ├──────────────────────────────────────────────────────────┐
   │ Action 3: Question Navigation                            │
   │ ═══════════════════════                                  │
   │ const handleQuestionNavigation = (index) => {            │
   │   setCurrentQuestionIndex(index);                        │
   │ };                                                       │
   │                                                          │
   │ // Sidebar: Click any question number                    │
   │ {quiz.questions.map((q, idx) => (                        │
   │   <button                                                │
   │     key={q.id}                                           │
   │     onClick={() => handleQuestionNavigation(idx)}        │
   │     className={`                                         │
   │       ${idx === currentQuestionIndex                     │
   │         ? 'bg-blue-500'                                  │
   │         : getQuestionStatusClass(q)}                     │
   │     `}                                                   │
   │   >                                                      │
   │     {idx + 1}                                            │
   │   </button>                                              │
   │ ))}                                                      │
   │                                                          │
   │ Instant navigation - no loading or API calls             │
   └──────────────────────────────────────────────────────────┘
        │
        │ Timer countdown continues (every 1 second)
        │ When timeLeft reaches 0 OR user clicks Submit
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ SUBMISSION TRIGGER                                       │
   │ ═════════════════                                        │
   │ Manual Submit:                                           │
   │ ────────────                                             │
   │ const handleSubmitQuiz = () => {                         │
   │   if (submitting) return;                                │
   │   const confirmSubmit = window.confirm(                  │
   │     'Are you sure you want to submit?'                   │
   │   );                                                     │
   │   if (!confirmSubmit) return;                            │
   │   setSubmitting(true);                                   │
   │   if (timerRef.current) {                                │
   │     clearInterval(timerRef.current);                     │
   │   }                                                      │
   │   submitQuizToBackend(true);                             │
   │ };                                                       │
   │                                                          │
   │ Auto Submit (Timer Expired):                             │
   │ ──────────────────────────                               │
   │ // Inside setInterval callback                           │
   │ if (prev <= 1) {                                         │
   │   clearInterval(timer);                                  │
   │   if (!submitting) {                                     │
   │     setSubmitting(true);                                 │
   │     submitQuizToBackend(false); // No alert              │
   │   }                                                      │
   │   return 0;                                              │
   │ }                                                        │
   └────┬─────────────────────────────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Build Submission Payload                                 │
   │ ══════════════════════                                   │
   │ const submitQuizToBackend = async (showAlerts) => {      │
   │   try {                                                  │
   │     // Filter and map answers                            │
   │     const answerRequests = Object.values(answers)        │
   │       .filter(answer =>                                  │
   │         answer.selectedOptionId ||                       │
   │         answer.textAnswer                                │
   │       )                                                  │
   │       .map(answer => ({                                  │
   │         questionId: answer.questionId,                   │
   │         selectedOptionId: answer.selectedOptionId,       │
   │         textAnswer: answer.textAnswer || null            │
   │       }));                                               │
   │                                                          │
   │     const submitData = {                                 │
   │       attemptId: attemptId,                              │
   │       answers: answerRequests                            │
   │     };                                                   │
   │                                                          │
   │     const result = await candidateAPI                    │
   │                           .submitQuiz(submitData);       │
   └────┬─────────────────────────────────────────────────────┘
        │
        │ HTTP POST /api/candidate/quizzes/submit
        │ Payload Example:
        │ {
        │   "attemptId": 123,
        │   "answers": [
        │     { "questionId": 1, "selectedOptionId": 42, "textAnswer": null },
        │     { "questionId": 2, "selectedOptionId": 45, "textAnswer": null },
        │     { "questionId": 3, "selectedOptionId": null, "textAnswer": "React is..." }
        │   ]
        │ }
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Backend: CandidateService.submitQuiz()                   │
   │ ════════════════════════════════════                     │
   │ @Transactional                                           │
   │ public AttemptResponse submitQuiz(                       │
   │         SubmitQuizRequest request,                       │
   │         String candidateEmail) {                         │
   │                                                          │
   │   // 1. Fetch and validate attempt                       │
   │   QuizAttempt attempt = attemptRepository                │
   │     .findById(request.attemptId())                       │
   │     .orElseThrow(...);                                   │
   │                                                          │
   │   if (!attempt.getUser().getEmail()                      │
   │              .equals(candidateEmail)) {                  │
   │     throw new RuntimeException("Unauthorized");          │
   │   }                                                      │
   │                                                          │
   │   if (attempt.getStatus() !=                             │
   │       QuizAttempt.AttemptStatus.IN_PROGRESS) {           │
   │     throw new RuntimeException("Already submitted");     │
   │   }                                                      │
   │                                                          │
   │   // 2. Calculate time taken                             │
   │   Quiz quiz = attempt.getQuiz();                         │
   │   LocalDateTime now = LocalDateTime.now();               │
   │   long elapsedMinutes = Duration                         │
   │     .between(attempt.getStartedAt(), now)                │
   │     .toMinutes();                                        │
   │   attempt.setTimeTakenMinutes(elapsedMinutes);           │
   │   attempt.setExceededTimeLimit(                          │
   │     elapsedMinutes > quiz.getDuration());                │
   │                                                          │
   │   // 3. Evaluate each answer                             │
   │   int totalScore = 0;                                    │
   │   for (AnswerRequest ansReq : request.answers()) {       │
   │     Question question = questionRepository               │
   │       .findById(ansReq.questionId())                     │
   │       .orElseThrow(...);                                 │
   │                                                          │
   │     Answer answer = new Answer();                        │
   │     answer.setAttempt(attempt);                          │
   │     answer.setQuestion(question);                        │
   │                                                          │
   │     if (ansReq.selectedOptionId() != null) {             │
   │       Option selectedOption = question.getOptions()      │
   │         .stream()                                        │
   │         .filter(o -> o.getId().equals(                   │
   │                  ansReq.selectedOptionId()))             │
   │         .findFirst()                                     │
   │         .orElseThrow(...);                               │
   │                                                          │
   │       answer.setSelectedOption(selectedOption);          │
   │       answer.setIsCorrect(selectedOption.getIsCorrect());│
   │                                                          │
   │       // Award points if correct                         │
   │       if (selectedOption.getIsCorrect()) {               │
   │         answer.setPointsEarned(question.getPoints());    │
   │         totalScore += question.getPoints();              │
   │       }                                                  │
   │     }                                                    │
   │                                                          │
   │     if (ansReq.textAnswer() != null) {                   │
   │       answer.setTextAnswer(ansReq.textAnswer());         │
   │       // Text answers require manual grading             │
   │     }                                                    │
   │                                                          │
   │     attempt.getAnswers().add(answer);                    │
   │     answerRepository.save(answer);                       │
   │     // DB INSERT into answers table                      │
   │   }                                                      │
   │                                                          │
   │   // 4. Update attempt record                            │
   │   attempt.setSubmittedAt(LocalDateTime.now());           │
   │   attempt.setScore(totalScore);                          │
   │   attempt.setStatus(                                     │
   │     QuizAttempt.AttemptStatus.EVALUATED);                │
   │   attempt = attemptRepository.save(attempt);             │
   │   // DB UPDATE quiz_attempts                             │
   │                                                          │
   │   return toAttemptResponse(attempt);                     │
   │ }                                                        │
   │                                                          │
   │ Database Transactions:                                   │
   │ ────────────────────                                     │
   │ 1. INSERT INTO answers (attempt_id, question_id,         │
   │    selected_option_id, text_answer, is_correct,          │
   │    points_earned) VALUES (...) × N questions             │
   │                                                          │
   │ 2. UPDATE quiz_attempts SET                              │
   │    score = 8,                                            │
   │    submitted_at = NOW(),                                 │
   │    status = 'EVALUATED',                                 │
   │    time_taken_minutes = 28,                              │
   │    exceeded_time_limit = false                           │
   │    WHERE id = 123;                                       │
   │                                                          │
   │ All operations wrapped in @Transactional                 │
   │ → Rollback on error, commit on success                   │
   └────┬─────────────────────────────────────────────────────┘
        │
        │ Response: AttemptResponse with id, score, status
        ▼
   ┌──────────────────────────────────────────────────────────┐
   │ Frontend: Navigate to Results                            │
   │ ═══════════════════════════                              │
   │     const result = await candidateAPI                    │
   │                         .submitQuiz(submitData);         │
   │     if (showAlerts) {                                    │
   │       alert('Quiz submitted successfully!');             │
   │     }                                                    │
   │     navigate(`/candidate/results/${result.id}`);         │
   │   } catch (error) {                                      │
   │     console.error('Error submitting:', error);           │
   │     if (showAlerts) {                                    │
   │       alert('Failed to submit: ' + error.message);       │
   │     }                                                    │
   │     setSubmitting(false);                                │
   │   }                                                      │
   │ };                                                       │
   └──────────────────────────────────────────────────────────┘
        │
        ▼
   React Router navigates to /candidate/results/123
   (QuizResults component loads)
```

### Technical State Management Details

**Answer State Object Structure:**
```typescript
interface AnswerState {
  [questionId: number]: {
    questionId: number;
    selectedOptionId: number | null;
    textAnswer: string;
    visited: boolean;
  }
}

// Example populated state:
{
  1: { questionId: 1, selectedOptionId: 42, textAnswer: '', visited: true },
  2: { questionId: 2, selectedOptionId: null, textAnswer: '', visited: true },
  3: { questionId: 3, selectedOptionId: 48, textAnswer: '', visited: true }
}
```

**Timer Implementation Details:**
```javascript
// Timer Lifecycle
useEffect(() => {
  if (!quiz || submitting) return;
  
  // setInterval returns interval ID
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      // Functional update prevents stale closure
      if (prev <= 1) {
        clearInterval(timer);
        if (!submitting) {
          setSubmitting(true);
          submitQuizToBackend(false);
        }
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  // Store in ref for manual cleanup
  timerRef.current = timer;
  
  // Cleanup function (component unmount or deps change)
  return () => {
    if (timer) clearInterval(timer);
  };
}, [quiz, submitting]); // Dependencies

// Timer Display
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Visual Warning
<div className={`${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
  {formatTime(timeLeft)}
</div>
// Red text when < 5 minutes (300 seconds)
```

**React StrictMode Double Render Prevention:**
```javascript
const quizStartedRef = useRef(false);

useEffect(() => {
  // ... auth checks ...
  
  if (!quizStartedRef.current) {
    quizStartedRef.current = true;
    startQuizAttempt(); // Only runs once
  }
}, []);

// In development, React StrictMode mounts components twice
// useRef persists across re-renders, preventing duplicate API calls
```

### 3. Quiz Results Flow

```
┌───────────────────────────────────────────────────────────────┐
│                  QUIZ RESULTS WORKFLOW                        │
│           Route: /candidate/results/:attemptId                │
└───────────────────────────────────────────────────────────────┘

   After Quiz Submission
        │
        ▼
   ┌──────────────────────────┐
   │ GET /api/candidate/      │
   │   quizzes/attempts/:id   │
   └────┬─────────────────────┘
        │
        │ Returns Complete Results:
        ├────────────────────────────┐
        │  • attemptId               │
        │  • quizTitle               │
        │  • candidateName/Email     │
        │  • score / totalPoints     │
        │  • startedAt / submittedAt │
        │  • timeTakenMinutes        │
        │  • exceededTimeLimit       │
        │  • answers[] with:         │
        │    - question              │
        │    - userAnswer            │
        │    - correctAnswer         │
        │    - isCorrect             │
        │    - points earned         │
        └────────────────────────────┘
        │
        ▼
   ┌──────────────────────────────┐
   │  RESULTS DISPLAY             │
   ├──────────────────────────────┤
   │  1. Overall Summary Card     │
   │     • Score & Percentage     │
   │     • Pass/Fail Status       │
   │     • Time Taken             │
   │     • Visual Progress Bar    │
   │                              │
   │  2. Detailed Review          │
   │     For Each Question:       │
   │     • Question text          │
   │     • Your answer            │
   │     • Correct answer         │
   │     • Correctness indicator  │
   │     • Points awarded         │
   │                              │
   │  3. Performance Insights     │
   │     • Correct count          │
   │     • Incorrect count        │
   │     • Score breakdown        │
   └────┬─────────────────────────┘
        │
        │ Actions Available:
        ├──────────────────────────┐
        │  • Back to Dashboard     │
        │  • View History          │
        │  • Take Another Quiz     │
        └──────────────────────────┘
```

**Result Calculations:**
```javascript
// Percentage Score
percentage = (score / totalPoints) * 100

// Pass Status
passed = percentage >= 70

// Time Taken
timeTaken = submittedAt - startedAt (in minutes)

// Time Limit Check
exceededTimeLimit = timeTaken > quiz.duration
```

### 4. Candidate Profile Flow

```
┌───────────────────────────────────────────────────────────────┐
│               CANDIDATE PROFILE WORKFLOW                      │
│               Route: /candidate/profile                       │
└───────────────────────────────────────────────────────────────┘

   Navigate to Profile
        │
        ▼
   ┌──────────────────────┐
   │ GET /api/candidate/  │
   │   quizzes/my-attempts│
   └────┬─────────────────┘
        │
        │ Calculate Statistics
        ▼
   ┌────────────────────────────┐
   │  Profile Information:      │
   ├────────────────────────────┤
   │  • Avatar (first letter)   │
   │  • Name & Email            │
   │  • Role Badge              │
   │  • Account Details         │
   └────┬───────────────────────┘
        │
        ▼
   ┌────────────────────────────┐
   │  Performance Statistics:   │
   ├────────────────────────────┤
   │  • Total Quizzes           │
   │  • Quizzes Passed          │
   │  • Average Score %         │
   │  • Total Points Earned     │
   └────┬───────────────────────┘
        │
        ▼
   ┌────────────────────────────┐
   │  Recent Activity (5 latest)│
   ├────────────────────────────┤
   │  Each Attempt Shows:       │
   │  • Quiz title              │
   │  • Date submitted          │
   │  • Score percentage        │
   │  • Pass/Fail status        │
   └────────────────────────────┘
```

### 5. Quiz History Flow

```
┌───────────────────────────────────────────────────────────────┐
│                QUIZ HISTORY WORKFLOW                          │
│               Route: /candidate/history                       │
└───────────────────────────────────────────────────────────────┘

   Navigate to History
        │
        ▼
   ┌──────────────────────┐
   │ GET /api/candidate/  │
   │   quizzes/my-attempts│
   └────┬─────────────────┘
        │
        │ Sort by Date (Latest first)
        ▼
   ┌──────────────────────────┐
   │  History Table Display   │
   ├──────────────────────────┤
   │  Columns:                │
   │  • Quiz Title            │
   │  • Date & Time           │
   │  • Score (X/Y)           │
   │  • Percentage Bar        │
   │  • Status Badge          │
   ├──────────────────────────┤
   │  Status Types:           │
   │  • Passed (≥70%)         │
   │  • Failed (<70%)         │
   │  • Aborted (no submit)   │
   └──────────────────────────┘
```

---

## 🔄 Automatic Operations

### 1. Timer Auto-Submit

```
┌───────────────────────────────────────────────────────────────┐
│            AUTOMATIC TIMER SUBMISSION                         │
└───────────────────────────────────────────────────────────────┘

   Quiz Active
        │
        │ Timer Running (setInterval)
        ▼
   ┌──────────────────┐
   │  Every 1 Second: │
   │  timeLeft -= 1   │
   └────┬─────────────┘
        │
        │ Check Condition
        ▼
   ┌─────────────────┐
   │ IF timeLeft ≤ 0 │
   └────┬────────────┘
        │ YES
        ▼
   ┌──────────────────────┐
   │  AUTOMATIC ACTIONS:  │
   ├──────────────────────┤
   │  1. Stop timer       │
   │  2. Set submitting   │
   │  3. Submit answers   │
   │  4. Navigate results │
   └──────────────────────┘
```

### 2. Authentication Guards

```
┌───────────────────────────────────────────────────────────────┐
│            ROUTE PROTECTION (AUTOMATIC)                       │
└───────────────────────────────────────────────────────────────┘

   Page Load
        │
        ▼
   ┌─────────────────────┐
   │ Check localStorage: │
   │ • token exists?     │
   │ • user exists?      │
   └────┬────────────────┘
        │
        ├──────────┬───────────┐
        │ NO       │ YES       │
        ▼          ▼           │
   Redirect → Check Role      │
      to /         │           │
               ┌───┴───┐       │
               ▼       ▼       │
           [ADMIN] [CANDIDATE] │
               │       │       │
           Allow   Allow       │
           /admin  /candidate  │
               │       │       │
           Block   Block       │
           /candidate /admin   │
                               │
   All protected routes ◄──────┘
```

### 3. API Request Interceptor

```
┌───────────────────────────────────────────────────────────────┐
│         AUTOMATIC TOKEN INJECTION (axios)                     │
└───────────────────────────────────────────────────────────────┘

   Any API Request
        │
        ▼
   ┌──────────────────────┐
   │ Axios Request        │
   │ Interceptor          │
   └────┬─────────────────┘
        │
        │ AUTOMATIC ACTIONS:
        ├─────────────────────────┐
        │  1. Get token from      │
        │     localStorage        │
        │  2. Add to headers:     │
        │     Authorization:      │
        │     Bearer <token>      │
        └─────────────────────────┘
        │
        ▼
   Send to Backend
```

### 4. API Response Interceptor

```
┌───────────────────────────────────────────────────────────────┐
│        AUTOMATIC ERROR HANDLING (axios)                       │
└───────────────────────────────────────────────────────────────┘

   API Response
        │
        ├─────────┬────────────┐
        │ SUCCESS │ ERROR      │
        ▼         ▼            │
   Return data  Extract msg   │
                     │         │
                     ▼         │
              ┌──────────────┐│
              │ Throw Error  ││
              │ with message ││
              └──────────────┘│
                     │         │
   Caught by Component ◄──────┘
        │
        ▼
   Display Error UI
```

### 5. Real-time Statistics Updates

```
┌───────────────────────────────────────────────────────────────┐
│          AUTOMATIC STAT CALCULATION                           │
└───────────────────────────────────────────────────────────────┘

   Data Received from API
        │
        ▼
   ┌─────────────────────────────┐
   │  AUTOMATIC CALCULATIONS:    │
   ├─────────────────────────────┤
   │  Candidate Dashboard:       │
   │  • completed = attempts.length
   │  • avgScore = Σ(%) / count  │
   │  • passed = filter(≥70%)    │
   │                             │
   │  Admin Analytics:           │
   │  • totalAttempts            │
   │  • uniqueCandidates (Set)   │
   │  • averageScore             │
   │  • passRate                 │
   │  • scoreDistribution        │
   │  • topPerformers (sorted)   │
   └─────────────────────────────┘
        │
        │ No manual refresh needed
        ▼
   Display Updated Stats
```

---

## 🗺️ Complete Navigation Map

```
┌───────────────────────────────────────────────────────────────┐
│                    ROUTING STRUCTURE                          │
└───────────────────────────────────────────────────────────────┘

ROOT (/)
 │
 ├─ / ──────────────────────► Login (Public)
 │
 ├─ /admin ────────────────► Admin Routes (Protected)
 │   │
 │   ├─ /admin ─────────────► Dashboard
 │   ├─ /admin/analytics ───► Analytics
 │   ├─ /admin/quiz/create ► Create Quiz
 │   └─ /admin/quiz/edit/:id ► Edit Quiz
 │
 ├─ /candidate ────────────► Candidate Routes (Protected)
 │   │
 │   ├─ /candidate ────────► Dashboard
 │   ├─ /candidate/profile ► Profile
 │   ├─ /candidate/history ► Quiz History
 │   ├─ /candidate/quiz/:id ► Quiz Taking
 │   └─ /candidate/results/:attemptId ► Results
 │
 └─ * ──────────────────────► Redirect to /
```

### Navigation Components

**Sidebar Component** (Both Roles)
```
┌────────────────────────────┐
│  SIDEBAR NAVIGATION        │
├────────────────────────────┤
│  Logo & User Info          │
│  ─────────────────         │
│  Admin:                    │
│  • 🏠 Dashboard            │
│  • 📊 Analytics            │
│  • 🚪 Logout               │
│                            │
│  Candidate:                │
│  • 🏠 Dashboard            │
│  • 👤 Profile              │
│  • 📜 History              │
│  • 🚪 Logout               │
└────────────────────────────┘
```

---

## 📡 API Endpoint Summary - Technical Specifications

### Authentication Endpoints

| Method | Endpoint | Description | Auth | Request Body | Response | Status Codes |
|--------|----------|-------------|------|--------------|----------|--------------|
| POST | `/api/auth/login` | Login & get JWT token | None | `LoginRequest` | `LoginResponse` | 200, 401 |

**Login Request DTO:**
```java
public record LoginRequest(
    @NotBlank @Email String email,
    @NotBlank String password
) {}
```

**Login Response DTO:**
```java
public record LoginResponse(
    String token,
    String email,
    String name,
    String role  // "ADMIN" or "CANDIDATE"
) {}
```

---

### Admin Endpoints

| Method | Endpoint | Description | Auth | Request/Response | Status Codes |
|--------|----------|-------------|------|------------------|--------------|
| GET | `/api/admin/quizzes` | Get all quizzes | ADMIN | → `List<QuizSummaryResponse>` | 200, 401, 403 |
| GET | `/api/admin/quizzes/:id` | Get quiz by ID (with correct answers) | ADMIN | → `QuizResponse` | 200, 404, 401, 403 |
| POST | `/api/admin/quizzes` | Create new quiz | ADMIN | `QuizRequest` → `QuizResponse` | 201, 400, 401, 403 |
| PUT | `/api/admin/quizzes/:id` | Update quiz | ADMIN | `QuizRequest` → `QuizResponse` | 200, 400, 404, 401, 403 |
| DELETE | `/api/admin/quizzes/:id` | Delete quiz | ADMIN | → `DeleteResponse` | 200, 404, 401, 403 |
| GET | `/api/admin/quizzes/:id/analytics` | Get quiz analytics | ADMIN | → `QuizAnalyticsResponse` | 200, 404, 401, 403 |
| GET | `/api/admin/quizzes/attempts/all` | Get all attempts | ADMIN | → `List<AdminAttemptResponse>` | 200, 401, 403 |

**QuizRequest DTO:**
```java
public record QuizRequest(
    @NotBlank String title,
    String description,
    @Min(1) Integer duration,  // minutes
    Boolean isActive,
    @NotEmpty List<QuestionRequest> questions
) {}

public record QuestionRequest(
    @NotBlank String questionText,
    @NotNull QuestionType type,  // MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER
    @Min(1) Integer points,
    @NotEmpty List<OptionRequest> options
) {}

public record OptionRequest(
    @NotBlank String optionText,
    @NotNull Boolean isCorrect
) {}
```

**QuizResponse DTO:**
```java
public record QuizResponse(
    Long id,
    String title,
    String description,
    Integer duration,
    Boolean isActive,
    List<QuestionResponse> questions,
    Integer totalQuestions,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}

public record QuestionResponse(
    Long id,
    String questionText,
    String type,
    Integer points,
    List<OptionResponse> options
) {}

public record OptionResponse(
    Long id,
    String optionText,
    Boolean isCorrect  // NULL for candidate, TRUE/FALSE for admin
) {}
```

---

### Candidate Endpoints

| Method | Endpoint | Description | Auth | Request/Response | Status Codes |
|--------|----------|-------------|------|------------------|--------------|
| GET | `/api/candidate/quizzes` | Get available active quizzes | CANDIDATE | → `List<QuizSummaryResponse>` | 200, 401, 403 |
| GET | `/api/candidate/quizzes/:id` | Get quiz (no correct answers) | CANDIDATE | → `QuizResponse` | 200, 404, 401, 403 |
| POST | `/api/candidate/quizzes/:id/start` | Start quiz attempt | CANDIDATE | → `AttemptResponse` | 201, 404, 401, 403 |
| POST | `/api/candidate/quizzes/submit` | Submit quiz answers | CANDIDATE | `SubmitQuizRequest` → `AttemptResponse` | 200, 400, 401, 403 |
| GET | `/api/candidate/quizzes/my-attempts` | Get my attempts | CANDIDATE | → `List<AttemptResponse>` | 200, 401, 403 |
| GET | `/api/candidate/quizzes/attempts/:id` | Get attempt result | CANDIDATE | → `AttemptResponse` | 200, 404, 401, 403 |

**SubmitQuizRequest DTO:**
```java
public record SubmitQuizRequest(
    @NotNull Long attemptId,
    @NotEmpty List<AnswerRequest> answers
) {}

public record AnswerRequest(
    @NotNull Long questionId,
    Long selectedOptionId,  // For MCQ/True-False
    String textAnswer       // For Short Answer
) {}
```

**AttemptResponse DTO:**
```java
public record AttemptResponse(
    Long id,
    Long quizId,
    String quizTitle,
    String candidateName,
    String candidateEmail,
    Integer score,
    Integer totalPoints,
    LocalDateTime startedAt,
    LocalDateTime submittedAt,
    String status,  // IN_PROGRESS, EVALUATED
    Long timeTakenMinutes,
    Boolean exceededTimeLimit,
    List<AnswerDetailsResponse> answers  // Populated after submission
) {}

public record AnswerDetailsResponse(
    Long questionId,
    String questionText,
    String questionType,
    Integer points,
    String userAnswer,
    String correctAnswer,
    Boolean isCorrect,
    Integer pointsEarned
) {}
```

---

## 🗄️ Database Schema - Technical Details

```sql
-- ============================================
-- QuizForge Database Schema
-- MySQL 8.0
-- ============================================

-- Users Table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- BCrypt hashed
    name VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CANDIDATE') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quizzes Table
CREATE TABLE quizzes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    duration INT NOT NULL,  -- Duration in minutes
    is_active BOOLEAN DEFAULT TRUE,
    created_by_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_active (is_active),
    INDEX idx_created_at (created_at),
    FULLTEXT idx_title_desc (title, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions Table
CREATE TABLE questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiz_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    type ENUM('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER') NOT NULL,
    points INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    INDEX idx_quiz_id (quiz_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Options Table (for MCQ and True/False questions)
CREATE TABLE options (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_id BIGINT NOT NULL,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_question_id (question_id),
    INDEX idx_correct (is_correct)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Quiz Attempts Table
CREATE TABLE quiz_attempts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quiz_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    score INT DEFAULT 0,
    total_points INT NOT NULL,
    status ENUM('IN_PROGRESS', 'EVALUATED') NOT NULL DEFAULT 'IN_PROGRESS',
    time_taken_minutes BIGINT,
    exceeded_time_limit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_quiz_user (quiz_id, user_id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Answers Table (Candidate responses)
CREATE TABLE answers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    attempt_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    selected_option_id BIGINT,  -- NULL for text answers
    text_answer TEXT,  -- NULL for MCQ
    is_correct BOOLEAN DEFAULT FALSE,
    points_earned INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY (selected_option_id) REFERENCES options(id) ON DELETE SET NULL,
    INDEX idx_attempt_id (attempt_id),
    INDEX idx_question_id (question_id),
    INDEX idx_correct (is_correct)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Relationships Summary:
-- ============================================
-- 1. users(1) ←→ (N)quizzes (created_by)
-- 2. quizzes(1) ←→ (N)questions (quiz_id)
-- 3. questions(1) ←→ (N)options (question_id)
-- 4. quizzes(1) ←→ (N)quiz_attempts (quiz_id)
-- 5. users(1) ←→ (N)quiz_attempts (user_id)
-- 6. quiz_attempts(1) ←→ (N)answers (attempt_id)
-- 7. questions(1) ←→ (N)answers (question_id)
-- 8. options(1) ←→ (N)answers (selected_option_id)

-- ============================================
-- Example Data Seeding (DataSeeder.java runs on startup)
-- ============================================
INSERT INTO users (email, password, name, role) VALUES
  ('admin@quizforge.com', '$2a$12$...', 'Admin User', 'ADMIN'),
  ('candidate@example.com', '$2a$12$...', 'John Doe', 'CANDIDATE');

-- Performance Indexes:
-- - idx_email: Fast user lookup during login
-- - idx_quiz_user: Fast attempt queries per user per quiz
-- - idx_active: Filter active quizzes for candidates
-- - idx_status: Track in-progress attempts
-- - idx_submitted_at: Sort attempts by submission time
```

### Entity Relationships (JPA)

```java
// User Entity
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;  // BCrypt hashed
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    private List<Quiz> createdQuizzes = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<QuizAttempt> attempts = new ArrayList<>();
    
    // Getters, setters, timestamps...
}

// Quiz Entity
@Entity
@Table(name = "quizzes")
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private Integer duration;  // minutes
    
    @Column(name = "is_active")
    private boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, 
               orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Question> questions = new ArrayList<>();
    
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private List<QuizAttempt> attempts = new ArrayList<>();
    
    // Getters, setters, timestamps...
}

// Question Entity
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
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Option> options = new ArrayList<>();
    
    // Getters, setters, timestamps...
}

// QuizAttempt Entity
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
    private User user;
    
    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;
    
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    
    @Column(nullable = false)
    private Integer score = 0;
    
    @Column(name = "total_points", nullable = false)
    private Integer totalPoints;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;
    
    @Column(name = "time_taken_minutes")
    private Long timeTakenMinutes;
    
    @Column(name = "exceeded_time_limit")
    private Boolean exceededTimeLimit = false;
    
    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL,
               orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Answer> answers = new ArrayList<>();
    
    public enum AttemptStatus {
        IN_PROGRESS, EVALUATED
    }
    
    // Getters, setters, timestamps...
}
```

### JPA Repository Queries

```java
// QuizRepository.java
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByIsActiveTrue();
    
    @Query("SELECT q FROM Quiz q WHERE q.createdBy.id = :userId")
    List<Quiz> findByCreatedById(@Param("userId") Long userId);
    
    @Query("SELECT q FROM Quiz q LEFT JOIN FETCH q.questions WHERE q.id = :id")
    Optional<Quiz> findByIdWithQuestions(@Param("id") Long id);
}

// QuizAttemptRepository.java
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserId(Long userId);
    
    List<QuizAttempt> findByQuizId(Long quizId);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.user.email = :email " +
           "ORDER BY qa.submittedAt DESC")
    List<QuizAttempt> findByUserEmailOrderBySubmittedAtDesc(
        @Param("email") String email);
    
    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.quiz.id = :quizId " +
           "AND qa.status = 'EVALUATED'")
    Long countEvaluatedAttemptsByQuizId(@Param("quizId") Long quizId);
}
```

---

## 🎨 UI State Indicators

### Quiz Taking Interface

**Question Status Colors:**
```
┌─────────────────────────────────────────┐
│  Question Navigator States:            │
├─────────────────────────────────────────┤
│  🟢 Green  = Answered                   │
│  ⚪ Gray   = Not Answered               │
│  🔵 Blue   = Current Question           │
│  🔴 Red    = Timer Warning (<5 min)     │
└─────────────────────────────────────────┘
```

**Answer Type Displays:**
```
Multiple Choice:
 ○ Option A
 ○ Option B
 ● Option C (selected)
 ○ Option D

True/False:
 ○ True
 ● False (selected)

Text Answer:
 ┌─────────────────────────┐
 │ User types answer here  │
 └─────────────────────────┘
```

### Results Page Indicators

```
Pass Status (≥70%):
 ✅ PASSED - Badge: Green
 
Fail Status (<70%):
 ❌ FAILED - Badge: Red

Answer Correctness:
 ✓ Correct - Green checkmark
 ✗ Incorrect - Red X

Progress Bar:
 ████████████░░░░░░░░ 60%
 (Color: Green if ≥70%, Red if <70%)
```

---

## 🔒 Security Features (Automatic)

### 1. JWT Token Management
```
- Token stored in localStorage
- Auto-attached to all API requests
- Validated on backend for each protected route
- Expired tokens return 401 → Redirect to login
```

### 2. Role-Based Access Control
```
Frontend Guards:
- Check user role in localStorage
- Block unauthorized route access
- Redirect to appropriate dashboard

Backend Authorization:
- @PreAuthorize annotations
- JWT claims validation
- Resource ownership verification
```

### 3. Quiz Integrity
```
- Correct answers never sent to frontend during quiz
- Evaluation performed server-side only
- Attempt IDs prevent answer manipulation
- Timer tracked separately on backend
```

---

## 📊 Data Flow Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                     DATA FLOW SUMMARY                         │
└───────────────────────────────────────────────────────────────┘

USER ACTION → FRONTEND → API CALL → BACKEND → DATABASE
                 ↓           ↓          ↓         ↓
             React      Axios      Spring    MySQL
             Component  Request    Boot      Query
                 ↓           ↓          ↓         ↓
             Update     Response    Return    Data
             State      Data        DTO       Result
                 ↓           ↓          ↓         ↓
             Re-render ← Process ← Format ← Fetch
                         JSON       Entity
```

### Example: Taking a Quiz

```
1. USER: Clicks "Start Assessment"
   ↓
2. FRONTEND: navigate('/candidate/quiz/5')
   ↓
3. FRONTEND: GET /api/candidate/quizzes/5
   ↓
4. BACKEND: Fetch quiz (hide correct answers)
   ↓
5. FRONTEND: Receives questions, initializes state
   ↓
6. FRONTEND: POST /api/candidate/quizzes/5/start
   ↓
7. BACKEND: Create QuizAttempt record, return ID
   ↓
8. FRONTEND: Start timer, enable answering
   ↓
9. USER: Answers questions
   ↓
10. FRONTEND: Update local state (no API call)
    ↓
11. USER: Clicks Submit (or timer expires)
    ↓
12. FRONTEND: POST /api/candidate/quizzes/submit
    ↓
13. BACKEND: Evaluate answers, calculate score
    ↓
14. BACKEND: Update attempt record, save answers
    ↓
15. FRONTEND: Receive results, navigate to results page
    ↓
16. FRONTEND: GET /api/candidate/quizzes/attempts/123
    ↓
17. BACKEND: Return complete results with correct answers
    ↓
18. FRONTEND: Display detailed results
```

---

## 🎯 Key Workflow Characteristics

### Performance Optimizations
- **Parallel API calls** where possible (dashboard data)
- **Local state management** during quiz (no API calls for navigation)
- **Lazy loading** of quiz details (only when needed)
- **Optimistic UI updates** (delete quiz immediately)

### User Experience Features
- **Real-time timer** with visual warnings
- **Auto-save behavior** (answers stored in state)
- **Responsive navigation** (click any question number)
- **Visual feedback** (loading spinners, status badges)
- **Confirmation dialogs** (delete operations)

### Reliability Features
- **Auto-submit on timer expire** (prevent data loss)
- **Authentication checks** on every protected route
- **Error handling** with user-friendly messages
- **Token refresh** via interceptors
- **Browser close handling** (attempt recorded)

---

## 📈 Analytics Workflow Details

### Score Distribution Algorithm
```javascript
// Define ranges
const ranges = [
  { label: '0-20%', min: 0, max: 20 },
  { label: '21-40%', min: 21, max: 40 },
  { label: '41-60%', min: 41, max: 60 },
  { label: '61-80%', min: 61, max: 80 },
  { label: '81-100%', min: 81, max: 100 }
];

// Count attempts in each range
attempts.forEach(attempt => {
  const percentage = (attempt.score / attempt.totalPoints) * 100;
  const range = ranges.find(r => percentage >= r.min && percentage <= r.max);
  if (range) range.count++;
});

// Display as horizontal bar chart
```

### Top Performers Algorithm
```javascript
// Group by candidate
const candidateScores = {};
attempts.forEach(a => {
  if (!candidateScores[a.email]) {
    candidateScores[a.email] = { scores: [], attempts: 0 };
  }
  candidateScores[a.email].scores.push(percentage);
  candidateScores[a.email].attempts++;
});

// Calculate averages and sort
const performers = Object.values(candidateScores)
  .map(c => ({
    ...c,
    averageScore: sum(c.scores) / c.scores.length,
    bestScore: max(c.scores)
  }))
  .sort((a, b) => b.averageScore - a.averageScore)
  .slice(0, 5); // Top 5
```

---

## 🔧 Technical Implementation Notes

### State Management
- **React useState** for local component state
- **localStorage** for persistence (token, user)
- **useEffect** for side effects (API calls, timers)
- **useRef** for preventing duplicate operations

### Routing
- **react-router-dom v6**
- **useNavigate** for programmatic navigation
- **useParams** for route parameters
- **Protected routes** via useEffect checks

### API Communication
- **Axios** with interceptors
- **Base URL**: `/api`
- **Headers**: Auto-injected JWT token
- **Error handling**: Centralized in interceptor

### Styling
- **Tailwind CSS** utility classes
- **Material Symbols** icons
- **Gradient backgrounds** for visual appeal
- **Responsive design** (mobile-friendly)

---

## ✅ Success Criteria

### Quiz Creation Success
- ✓ At least 1 question with 1 correct answer
- ✓ Valid duration (positive number)
- ✓ All required fields filled

### Quiz Submission Success
- ✓ Attempt ID exists
- ✓ All questions processed (even if unanswered)
- ✓ Score calculated correctly
- ✓ Results page accessible

### Analytics Display Success
- ✓ All metrics calculated correctly
- ✓ Charts display accurate data
- ✓ Filtering works properly
- ✓ No division-by-zero errors

---

## 🎓 Workflow Summary

### Admin Complete Workflow
1. **Login** → Role: ADMIN
2. **Dashboard** → View all quizzes
3. **Create Quiz** → Design questions
4. **Edit Quiz** → Modify existing
5. **Delete Quiz** → Remove quiz
6. **Analytics** → View performance data
7. **Logout**

### Candidate Complete Workflow
1. **Login** → Role: CANDIDATE
2. **Dashboard** → View available quizzes
3. **Start Quiz** → Begin attempt
4. **Answer Questions** → Complete quiz
5. **Submit** → Get evaluated
6. **View Results** → See score & review
7. **Check Profile** → View statistics
8. **History** → See past attempts
9. **Logout**

---

## 📝 Notes

- All timestamps use ISO 8601 format
- Passing score threshold: **70%**
- Timer precision: **1 second**
- Score calculation: **Points-based system**
- Default question points: **1**
- Quiz duration: **Minutes** (converted to seconds)

---

**End of Frontend Workflow Documentation**

*For API documentation, see backend Swagger UI at: `http://localhost:8080/swagger-ui.html`*
*For detailed code documentation, see: `/docs/markdown_docs/` directory*
