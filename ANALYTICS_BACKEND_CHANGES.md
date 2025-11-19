# Analytics Backend Changes

## Overview
Added comprehensive analytics functionality for admin users to view all quiz attempts across the platform with detailed candidate information.

---

## 1. New DTO: AdminAttemptResponse

**File:** `backend/src/main/java/com/quizforge/dto/AdminAttemptResponse.java`

### Purpose
A specialized Data Transfer Object for admin analytics that includes both quiz and candidate information.

### Code
```java
package com.quizforge.dto;

import java.time.LocalDateTime;

public record AdminAttemptResponse(
    Long id,
    Long quizId,
    String quizTitle,
    String candidateName,
    String candidateEmail,
    LocalDateTime startedAt,
    LocalDateTime submittedAt,
    Integer score,
    Integer totalPoints,
    String status
) {}
```

### Key Features
- **Candidate Information**: Includes `candidateName` and `candidateEmail` (not available in regular `AttemptResponse`)
- **Quiz Details**: Contains `quizId` and `quizTitle` for easy filtering
- **Timing Data**: Tracks `startedAt` and `submittedAt` timestamps
- **Score Metrics**: Full score and total points for percentage calculations
- **Status Tracking**: Current attempt status (IN_PROGRESS, SUBMITTED, EVALUATED)

---

## 2. Updated AdminController

**File:** `backend/src/main/java/com/quizforge/controller/AdminController.java`

### New Endpoint Added

```java
@GetMapping("/attempts/all")
@Operation(summary = "Get all attempts", description = "Retrieve all quiz attempts across all quizzes")
public ResponseEntity<List<com.quizforge.dto.AdminAttemptResponse>> getAllAttempts() {
    return ResponseEntity.ok(adminService.getAllAttempts());
}
```

### Endpoint Details
- **URL**: `GET /api/admin/quizzes/attempts/all`
- **Authorization**: Requires ADMIN role (Bearer token)
- **Returns**: List of all evaluated quiz attempts with candidate information
- **Use Case**: Powers the admin analytics dashboard

### Complete Controller Structure
```java
@RestController
@RequestMapping("/api/admin/quizzes")
@Tag(name = "Admin - Quiz Management", description = "ADMIN role: Create, edit, delete quizzes and view analytics")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    @Operation(summary = "Get all quizzes", description = "Retrieve list of all quizzes")
    public ResponseEntity<List<QuizSummaryResponse>> getAllQuizzes() {
        return ResponseEntity.ok(adminService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get quiz by ID", description = "Retrieve detailed quiz information including questions and correct answers")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getQuizById(id));
    }

    @PostMapping
    @Operation(summary = "Create new quiz", description = "Create a new quiz with questions and options")
    public ResponseEntity<QuizResponse> createQuiz(
            @Valid @RequestBody QuizRequest request,
            Authentication authentication) {
        String adminEmail = authentication.getName();
        QuizResponse response = adminService.createQuiz(request, adminEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update quiz", description = "Update existing quiz with new data")
    public ResponseEntity<QuizResponse> updateQuiz(
            @PathVariable Long id,
            @Valid @RequestBody QuizRequest request) {
        return ResponseEntity.ok(adminService.updateQuiz(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete quiz", description = "Permanently delete a quiz")
    public ResponseEntity<DeleteResponse> deleteQuiz(@PathVariable Long id) {
        DeleteResponse response = adminService.deleteQuiz(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/analytics")
    @Operation(summary = "Get quiz analytics", description = "View statistics for a quiz including attempts, scores, etc.")
    public ResponseEntity<QuizAnalyticsResponse> getQuizAnalytics(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getQuizAnalytics(id));
    }

    @GetMapping("/attempts/all")
    @Operation(summary = "Get all attempts", description = "Retrieve all quiz attempts across all quizzes")
    public ResponseEntity<List<com.quizforge.dto.AdminAttemptResponse>> getAllAttempts() {
        return ResponseEntity.ok(adminService.getAllAttempts());
    }
}
```

---

## 3. Updated AdminService

**File:** `backend/src/main/java/com/quizforge/service/AdminService.java`

### New Methods Added

#### getAllAttempts()
```java
public List<AdminAttemptResponse> getAllAttempts() {
    return attemptRepository.findAll().stream()
            .filter(a -> a.getStatus() == QuizAttempt.AttemptStatus.EVALUATED)
            .map(this::toAdminAttemptResponse)
            .collect(Collectors.toList());
}
```

**Purpose**: Retrieves all evaluated quiz attempts from the database and converts them to admin-specific response format.

**Key Logic**:
- Fetches all attempts from repository
- Filters only EVALUATED attempts (excludes IN_PROGRESS and SUBMITTED)
- Maps each attempt to `AdminAttemptResponse` with candidate info
- Returns as a list for frontend consumption

#### toAdminAttemptResponse()
```java
private AdminAttemptResponse toAdminAttemptResponse(QuizAttempt attempt) {
    return new AdminAttemptResponse(
            attempt.getId(),
            attempt.getQuiz().getId(),
            attempt.getQuiz().getTitle(),
            attempt.getUser().getName(),
            attempt.getUser().getEmail(),
            attempt.getStartedAt(),
            attempt.getSubmittedAt(),
            attempt.getScore(),
            attempt.getTotalPoints(),
            attempt.getStatus().name()
    );
}
```

**Purpose**: Mapper method that transforms a `QuizAttempt` entity into an `AdminAttemptResponse` DTO.

**Data Extraction**:
- **Quiz Details**: Eagerly loads quiz ID and title
- **User Details**: Extracts candidate name and email from the User entity
- **Attempt Metrics**: Includes all scoring and timing information
- **Status**: Converts enum to string representation

### Complete Service Class Structure
```java
@Service
public class AdminService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository attemptRepository;

    // ... existing methods (getAllQuizzes, getQuizById, createQuiz, etc.) ...

    public QuizAnalyticsResponse getQuizAnalytics(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", quizId));

        List<QuizAttempt> attempts = attemptRepository.findByQuizId(quizId).stream()
                .filter(a -> a.getStatus() == QuizAttempt.AttemptStatus.EVALUATED)
                .collect(Collectors.toList());

        if (attempts.isEmpty()) {
            return new QuizAnalyticsResponse(quizId, quiz.getTitle(), 0, 0.0, 0, 0);
        }

        int totalAttempts = attempts.size();
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

        return new QuizAnalyticsResponse(quizId, quiz.getTitle(), totalAttempts, 
                averageScore, highestScore, lowestScore);
    }

    // NEW METHODS
    public List<AdminAttemptResponse> getAllAttempts() {
        return attemptRepository.findAll().stream()
                .filter(a -> a.getStatus() == QuizAttempt.AttemptStatus.EVALUATED)
                .map(this::toAdminAttemptResponse)
                .collect(Collectors.toList());
    }

    private AdminAttemptResponse toAdminAttemptResponse(QuizAttempt attempt) {
        return new AdminAttemptResponse(
                attempt.getId(),
                attempt.getQuiz().getId(),
                attempt.getQuiz().getTitle(),
                attempt.getUser().getName(),
                attempt.getUser().getEmail(),
                attempt.getStartedAt(),
                attempt.getSubmittedAt(),
                attempt.getScore(),
                attempt.getTotalPoints(),
                attempt.getStatus().name()
        );
    }

    // ... existing helper methods (toSummaryResponse, toDetailedResponse) ...
}
```

---

## 4. Entity Relationships

### QuizAttempt Model Reference
**File:** `backend/src/main/java/com/quizforge/model/QuizAttempt.java`

```java
@Entity
@Table(name = "quiz_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // ← This relationship enables candidate info extraction

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
        IN_PROGRESS, SUBMITTED, EVALUATED
    }
}
```

**Key Points**:
- `@ManyToOne` relationship with `User` entity provides access to candidate information
- `@ManyToOne` relationship with `Quiz` entity provides quiz details
- `AttemptStatus.EVALUATED` is the only status returned in analytics (excludes incomplete attempts)

---

## 5. API Endpoint Summary

### New Endpoint
```
GET /api/admin/quizzes/attempts/all
```

**Request Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "quizId": 5,
    "quizTitle": "Java Fundamentals Quiz",
    "candidateName": "John Doe",
    "candidateEmail": "john.doe@example.com",
    "startedAt": "2025-11-19T10:30:00",
    "submittedAt": "2025-11-19T10:45:00",
    "score": 85,
    "totalPoints": 100,
    "status": "EVALUATED"
  },
  {
    "id": 2,
    "quizId": 3,
    "quizTitle": "React Basics",
    "candidateName": "Jane Smith",
    "candidateEmail": "jane.smith@example.com",
    "startedAt": "2025-11-19T11:00:00",
    "submittedAt": "2025-11-19T11:20:00",
    "score": 92,
    "totalPoints": 100,
    "status": "EVALUATED"
  }
]
```

---

## 6. Security Considerations

### Authorization
- Endpoint is protected by `@SecurityRequirement(name = "bearerAuth")`
- Only users with ADMIN role can access this endpoint
- JWT token validation occurs via Spring Security interceptors

### Data Privacy
- Candidate email addresses are exposed (admin-only access justified)
- No sensitive password or personal data included
- Only evaluated attempts are returned (respects data lifecycle)

---

## 7. Database Queries

### Query Optimization
The `getAllAttempts()` method uses:
```java
attemptRepository.findAll()
```

**Considerations**:
- **Lazy Loading**: Quiz and User relationships use `FetchType.LAZY`
- **N+1 Query Problem**: Multiple database hits when accessing related entities
- **Recommendation**: Consider using `@EntityGraph` or JPQL JOIN FETCH for production optimization

**Optimized Alternative** (for future improvement):
```java
@Query("SELECT a FROM QuizAttempt a JOIN FETCH a.quiz JOIN FETCH a.user WHERE a.status = 'EVALUATED'")
List<QuizAttempt> findAllEvaluatedWithDetails();
```

---

## 8. Testing Recommendations

### Unit Tests
```java
@Test
void testGetAllAttempts_ReturnsOnlyEvaluatedAttempts() {
    // Given: Mix of IN_PROGRESS, SUBMITTED, EVALUATED attempts
    // When: Call getAllAttempts()
    // Then: Only EVALUATED attempts are returned
}

@Test
void testToAdminAttemptResponse_MapsCorrectly() {
    // Given: A QuizAttempt entity
    // When: Call toAdminAttemptResponse()
    // Then: All fields are correctly mapped
}
```

### Integration Tests
```java
@Test
@WithMockUser(roles = "ADMIN")
void testGetAllAttemptsEndpoint_ReturnsSuccessfully() {
    // When: GET /api/admin/quizzes/attempts/all
    // Then: Returns 200 OK with list of attempts
}

@Test
@WithMockUser(roles = "CANDIDATE")
void testGetAllAttemptsEndpoint_ForbiddenForCandidates() {
    // When: GET /api/admin/quizzes/attempts/all
    // Then: Returns 403 Forbidden
}
```

---

## 9. Frontend Integration

### API Client Update
**File:** `frontend/src/utils/api.js`

```javascript
// Admin API
export const adminAPI = {
  getQuizzes: () => api.get('/admin/quizzes'),
  getQuiz: (id) => api.get(`/admin/quizzes/${id}`),
  createQuiz: (data) => api.post('/admin/quizzes', data),
  updateQuiz: (id, data) => api.put(`/admin/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),
  getAllAttempts: () => api.get('/admin/quizzes/attempts/all')  // NEW
};
```

### Usage in Analytics Component
```javascript
const fetchData = async () => {
  try {
    const [quizzesData, attemptsData] = await Promise.all([
      adminAPI.getQuizzes(),
      adminAPI.getAllAttempts()  // Uses new endpoint
    ]);
    
    setQuizzes(quizzesData);
    setAttempts(attemptsData);
    calculateAnalytics(attemptsData, 'all');
  } catch (error) {
    console.error('Error fetching analytics:', error);
  }
};
```

---

## 10. Files Modified Summary

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `dto/AdminAttemptResponse.java` | **NEW** | Created DTO with candidate info |
| `controller/AdminController.java` | **MODIFIED** | Added `/attempts/all` endpoint |
| `service/AdminService.java` | **MODIFIED** | Added `getAllAttempts()` and mapper methods |
| `frontend/src/utils/api.js` | **MODIFIED** | Added `getAllAttempts()` to adminAPI |
| `frontend/src/pages/Analytics.jsx` | **MODIFIED** | Updated to use new API endpoint |

---

## 11. Build & Deployment

### Maven Build
```bash
cd backend
mvn clean package -DskipTests
```

### Run Application
```bash
java -jar target/quizforge-1.0.0.jar
```

### Verify Endpoint
```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:8080/api/admin/quizzes/attempts/all
```

---

## 12. Future Enhancements

1. **Pagination**: Add pagination support for large datasets
   ```java
   @GetMapping("/attempts/all")
   public ResponseEntity<Page<AdminAttemptResponse>> getAllAttempts(
       @RequestParam(defaultValue = "0") int page,
       @RequestParam(defaultValue = "20") int size
   )
   ```

2. **Filtering**: Add query parameters for filtering
   ```java
   @GetMapping("/attempts/all")
   public ResponseEntity<List<AdminAttemptResponse>> getAllAttempts(
       @RequestParam(required = false) Long quizId,
       @RequestParam(required = false) String candidateEmail,
       @RequestParam(required = false) LocalDate startDate,
       @RequestParam(required = false) LocalDate endDate
   )
   ```

3. **Caching**: Implement Redis caching for frequently accessed analytics
   ```java
   @Cacheable(value = "analytics", key = "'all-attempts'")
   public List<AdminAttemptResponse> getAllAttempts()
   ```

4. **Real-time Updates**: WebSocket support for live analytics dashboard

---

## Conclusion

These backend changes enable a comprehensive analytics dashboard for administrators, providing visibility into all quiz attempts across the platform with detailed candidate and performance metrics. The implementation follows RESTful best practices and maintains proper security controls.
