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
    String status,
    Long timeTakenMinutes,
    Boolean exceededTimeLimit
) {}
```

### Key Features
- **Candidate Information**: Includes `candidateName` and `candidateEmail` (not available in regular `AttemptResponse`)
- **Quiz Details**: Contains `quizId` and `quizTitle` for easy filtering
- **Timing Data**: Tracks `startedAt` and `submittedAt` timestamps
- **Score Metrics**: Full score and total points for percentage calculations
- **Status Tracking**: Current attempt status (IN_PROGRESS, SUBMITTED, EVALUATED)
- **Timer Tracking**: `timeTakenMinutes` records actual time spent on quiz
- **Time Limit Validation**: `exceededTimeLimit` flag indicates if quiz was submitted after time expired

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
            attempt.getStatus().name(),
            attempt.getTimeTakenMinutes(),
            attempt.getExceededTimeLimit()
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
            attempt.getStatus().name(),
            attempt.getTimeTakenMinutes(),
            attempt.getExceededTimeLimit()
        );
    }

    // ... existing helper methods (toSummaryResponse, toDetailedResponse) ...
}
```

---

## 4. Timer Tracking Implementation

### QuizAttempt Entity Changes
**File:** `backend/src/main/java/com/quizforge/model/QuizAttempt.java`

**New Fields Added:**
```java
@Column(name = "time_taken_minutes")
private Long timeTakenMinutes;

@Column(name = "exceeded_time_limit")
private Boolean exceededTimeLimit = false;
```

**Purpose:**
- `timeTakenMinutes`: Stores the actual duration from quiz start to submission
- `exceededTimeLimit`: Boolean flag indicating if the candidate exceeded the allowed quiz duration

### CandidateService Timer Logic
**File:** `backend/src/main/java/com/quizforge/service/CandidateService.java`

**Implementation in submitQuiz() method:**
```java
@Transactional
public AttemptResponse submitQuiz(SubmitQuizRequest request, String candidateEmail) {
    QuizAttempt attempt = attemptRepository.findById(request.attemptId())
            .orElseThrow(() -> new ResourceNotFoundException("QuizAttempt", request.attemptId()));

    // ... authorization and status checks ...

    // Calculate time taken and validate time limit
    Quiz quiz = attempt.getQuiz();
    LocalDateTime now = LocalDateTime.now();
    long elapsedMinutes = java.time.Duration.between(attempt.getStartedAt(), now).toMinutes();
    
    attempt.setTimeTakenMinutes(elapsedMinutes);
    
    if (elapsedMinutes > quiz.getDuration()) {
        attempt.setExceededTimeLimit(true);
        System.out.println("Warning: Quiz submitted after time limit. Elapsed: " + elapsedMinutes + " minutes, Allowed: " + quiz.getDuration() + " minutes");
    } else {
        attempt.setExceededTimeLimit(false);
    }

    // ... rest of submission logic ...
}
```

**Key Logic:**
1. **Time Calculation**: Uses `Duration.between()` to calculate elapsed minutes from `startedAt` to submission time
2. **Validation**: Compares elapsed time against quiz duration limit
3. **Flagging**: Sets `exceededTimeLimit` to true if candidate took longer than allowed
4. **Logging**: Outputs warning to console for monitoring purposes
5. **Persistence**: Saves both fields to database for analytics

### AttemptResponse DTO Update
**File:** `backend/src/main/java/com/quizforge/dto/AttemptResponse.java`

```java
public record AttemptResponse(
    Long id,
    Long quizId,
    String quizTitle,
    LocalDateTime startedAt,
    LocalDateTime submittedAt,
    Integer score,
    Integer totalPoints,
    String status,
    Long timeTakenMinutes,      // NEW
    Boolean exceededTimeLimit   // NEW
) {}
```

**Impact:**
- All candidate-facing API endpoints now include timer data
- QuizResults page can display time taken
- Frontend can show warnings for exceeded time limits

### Mapper Update
**File:** `backend/src/main/java/com/quizforge/service/CandidateService.java`

```java
private AttemptResponse toAttemptResponse(QuizAttempt attempt) {
    return new AttemptResponse(
            attempt.getId(),
            attempt.getQuiz().getId(),
            attempt.getQuiz().getTitle(),
            attempt.getStartedAt(),
            attempt.getSubmittedAt(),
            attempt.getScore(),
            attempt.getTotalPoints(),
            attempt.getStatus().name(),
            attempt.getTimeTakenMinutes(),      // NEW
            attempt.getExceededTimeLimit()      // NEW
    );
}
```

---

## 5. Entity Relationships### QuizAttempt Model Reference
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

    @Column(name = "time_taken_minutes")
    private Long timeTakenMinutes;

    @Column(name = "exceeded_time_limit")
    private Boolean exceededTimeLimit = false;

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
    "status": "EVALUATED",
    "timeTakenMinutes": 15,
    "exceededTimeLimit": false
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
    "status": "EVALUATED",
    "timeTakenMinutes": 20,
    "exceededTimeLimit": false
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
| `dto/AdminAttemptResponse.java` | **NEW** | Created DTO with candidate info and timer fields |
| `dto/AttemptResponse.java` | **MODIFIED** | Added `timeTakenMinutes` and `exceededTimeLimit` fields |
| `model/QuizAttempt.java` | **MODIFIED** | Added timer tracking fields to entity |
| `controller/AdminController.java` | **MODIFIED** | Added `/attempts/all` endpoint |
| `service/AdminService.java` | **MODIFIED** | Added `getAllAttempts()` and updated mapper with timer fields |
| `service/CandidateService.java` | **MODIFIED** | Added timer calculation logic in `submitQuiz()`, updated mappers |
| `frontend/src/utils/api.js` | **MODIFIED** | Added `getAllAttempts()` to adminAPI |
| `frontend/src/pages/Analytics.jsx` | **MODIFIED** | Updated to use new API endpoint and display timer data |
| `frontend/src/pages/QuizResults.jsx` | **MODIFIED** | Display time taken with exceeded warning |

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

## 13. Timer Implementation Benefits

### For Administrators
1. **Performance Insights**: Track how long candidates take on average for each quiz
2. **Time Limit Enforcement**: Identify candidates who exceeded allowed time
3. **Quiz Difficulty Assessment**: Long completion times may indicate difficult questions
4. **Cheating Detection**: Unusual timing patterns can flag suspicious behavior

### For Candidates
1. **Transparency**: See exactly how long they took on each quiz
2. **Feedback**: Understand if time management affected their performance
3. **Warnings**: Clear indication if they exceeded the time limit
4. **Historical Data**: Compare timing across multiple attempts

### Technical Benefits
1. **Data Integrity**: Actual time measured server-side (not client-side timer)
2. **No Manipulation**: Frontend timer countdown is for UX only; backend validates
3. **Audit Trail**: Complete timing data stored for compliance/analytics
4. **Backward Compatible**: Null values for old attempts (show as "N/A" in frontend)

---

## 14. Database Schema Updates

### Migration Notes
The new fields in `quiz_attempts` table:

```sql
ALTER TABLE quiz_attempts 
ADD COLUMN time_taken_minutes BIGINT,
ADD COLUMN exceeded_time_limit BOOLEAN DEFAULT FALSE;
```

**Important:**
- Existing attempts will have `NULL` for `timeTakenMinutes` (expected behavior)
- Frontend displays "N/A" for null values
- Only new quiz submissions after this update will have timer data
- No data migration needed for historical data

---

## Conclusion

These backend changes enable a comprehensive analytics dashboard for administrators, providing visibility into all quiz attempts across the platform with detailed candidate and performance metrics, including accurate timer tracking and time limit validation. The implementation follows RESTful best practices, maintains proper security controls, and provides valuable insights for both admins and candidates.
