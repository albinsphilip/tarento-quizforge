# QuizForge API Quick Reference Card

## 🔐 Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@quizforge.com",
  "password": "any"
}

Response:
{
  "token": "eyJhbGc...",
  "email": "admin@quizforge.com",
  "name": "Admin User",
  "role": "ADMIN"
}
```

**Credentials:**
- **Admin**: `admin@quizforge.com`
- **Candidate**: Any other email

---

## 👨‍💼 Admin APIs (Requires ADMIN role)

### 1. Get All Quizzes
```http
GET /api/admin/quizzes
Authorization: Bearer {token}
```

### 2. Get Quiz by ID
```http
GET /api/admin/quizzes/{id}
Authorization: Bearer {token}
```

### 3. Create Quiz
```http
POST /api/admin/quizzes
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Java Basics Quiz",
  "description": "Test your Java knowledge",
  "duration": 30,
  "isActive": true,
  "questions": [
    {
      "questionText": "What is JVM?",
      "type": "MULTIPLE_CHOICE",
      "points": 2,
      "options": [
        {"optionText": "Java Virtual Machine", "isCorrect": true},
        {"optionText": "Java Variable Method", "isCorrect": false}
      ]
    }
  ]
}
```

**Question Types**: `MULTIPLE_CHOICE`, `TRUE_FALSE`, `SHORT_ANSWER`

### 4. Update Quiz
```http
PUT /api/admin/quizzes/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated Description",
  "duration": 45,
  "isActive": true,
  "questions": [...]
}
```

### 5. Delete Quiz
```http
DELETE /api/admin/quizzes/{id}
Authorization: Bearer {token}
```

### 6. Get Quiz Analytics
```http
GET /api/admin/quizzes/{id}/analytics
Authorization: Bearer {token}

Response:
{
  "quizId": 1,
  "quizTitle": "Java Basics",
  "totalAttempts": 5,
  "averageScore": 7.4,
  "highestScore": 10,
  "lowestScore": 4
}
```

---

## 👨‍🎓 Candidate APIs (Requires CANDIDATE role)

### 1. Get Available Quizzes
```http
GET /api/candidate/quizzes
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "title": "Java Basics Quiz",
    "description": "Test your Java knowledge",
    "duration": 30,
    "isActive": true,
    "createdBy": "Admin",
    "createdAt": "2025-11-11T10:00:00",
    "totalQuestions": 5
  }
]
```

### 2. Get Quiz Questions
```http
GET /api/candidate/quizzes/{quizId}
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "title": "Java Basics Quiz",
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
          "isCorrect": null  // Hidden from candidate
        }
      ]
    }
  ]
}
```

**Note**: `isCorrect` is `null` for candidates

### 3. Start Quiz Attempt
```http
POST /api/candidate/quizzes/{quizId}/start
Authorization: Bearer {token}

Response:
{
  "id": 1,
  "quizId": 1,
  "quizTitle": "Java Basics Quiz",
  "startedAt": "2025-11-11T10:30:00",
  "submittedAt": null,
  "score": null,
  "totalPoints": 10,
  "status": "IN_PROGRESS"
}
```

**Save the attemptId for submission!**

### 4. Submit Quiz Answers
```http
POST /api/candidate/quizzes/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "attemptId": 1,
  "answers": [
    {
      "questionId": 1,
      "selectedOptionId": 1,
      "textAnswer": null
    },
    {
      "questionId": 2,
      "selectedOptionId": 3,
      "textAnswer": null
    }
  ]
}

Response:
{
  "id": 1,
  "quizId": 1,
  "quizTitle": "Java Basics Quiz",
  "startedAt": "2025-11-11T10:30:00",
  "submittedAt": "2025-11-11T10:45:00",
  "score": 8,
  "totalPoints": 10,
  "status": "EVALUATED"
}
```

**Automatic grading happens instantly!**

### 5. Get My Attempts
```http
GET /api/candidate/quizzes/my-attempts
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "quizId": 1,
    "quizTitle": "Java Basics Quiz",
    "startedAt": "2025-11-11T10:30:00",
    "submittedAt": "2025-11-11T10:45:00",
    "score": 8,
    "totalPoints": 10,
    "status": "EVALUATED"
  }
]
```

### 6. Get Attempt Result
```http
GET /api/candidate/quizzes/attempts/{attemptId}
Authorization: Bearer {token}
```

---

## 🔒 Security & Authorization

### Header Format
```http
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiQURNSU4i...
```

### Role-Based Access
| Endpoint Pattern | Required Role |
|-----------------|---------------|
| `/api/auth/**` | None (Public) |
| `/api/admin/**` | ADMIN |
| `/api/candidate/**` | CANDIDATE |
| `/swagger-ui/**` | None (Public) |

### Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Deletion success
- `400 Bad Request` - Validation error
- `401 Unauthorized` - No token or invalid token
- `403 Forbidden` - Wrong role
- `404 Not Found` - Resource not found

---

## 🎯 Common Workflows

### **Admin: Create & Analyze Quiz**
1. Login as Admin → Get token
2. POST `/api/admin/quizzes` → Create quiz
3. GET `/api/admin/quizzes/{id}` → Verify quiz
4. (Wait for candidates to take quiz)
5. GET `/api/admin/quizzes/{id}/analytics` → View stats

### **Candidate: Take Quiz**
1. Login as Candidate → Get token
2. GET `/api/candidate/quizzes` → Browse quizzes
3. POST `/api/candidate/quizzes/{id}/start` → Start attempt
4. GET `/api/candidate/quizzes/{id}` → Get questions
5. POST `/api/candidate/quizzes/submit` → Submit answers
6. GET `/api/candidate/quizzes/my-attempts` → View history

---

## 📝 Request Body Examples

### Create Quiz (Minimal)
```json
{
  "title": "Quick Quiz",
  "duration": 15,
  "questions": [
    {
      "questionText": "Java is platform independent?",
      "type": "TRUE_FALSE",
      "points": 1,
      "options": [
        {"optionText": "True", "isCorrect": true},
        {"optionText": "False", "isCorrect": false}
      ]
    }
  ]
}
```

### Create Quiz (Complete)
```json
{
  "title": "Comprehensive Java Quiz",
  "description": "Advanced Java concepts",
  "duration": 60,
  "isActive": true,
  "questions": [
    {
      "questionText": "Which collection allows duplicates?",
      "type": "MULTIPLE_CHOICE",
      "points": 3,
      "options": [
        {"optionText": "Set", "isCorrect": false},
        {"optionText": "List", "isCorrect": true},
        {"optionText": "Map", "isCorrect": false},
        {"optionText": "Queue", "isCorrect": true}
      ]
    },
    {
      "questionText": "Explain garbage collection",
      "type": "SHORT_ANSWER",
      "points": 5,
      "options": []
    }
  ]
}
```

### Submit Answers
```json
{
  "attemptId": 1,
  "answers": [
    {
      "questionId": 1,
      "selectedOptionId": 2,
      "textAnswer": null
    },
    {
      "questionId": 2,
      "selectedOptionId": null,
      "textAnswer": "Garbage collection automatically frees memory..."
    }
  ]
}
```

---

## 🌐 Swagger UI

**URL**: `http://localhost:8080/swagger-ui.html`

**Features**:
- Interactive API documentation
- Test APIs in browser
- See request/response schemas
- Authentication support

**How to Use**:
1. Click "Authorize" button
2. Enter: `Bearer {your-jwt-token}`
3. Click "Authorize"
4. Try any endpoint

---

## 🔍 Validation Rules

### Quiz
- `title`: Required, not blank
- `duration`: Required, minimum 1 minute
- `questions`: Can be empty or contain questions

### Question
- `questionText`: Required, not blank
- `type`: Required, one of: MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER
- `points`: Optional, default 1
- `options`: Required for MCQ/True-False

### Option
- `optionText`: Required, not blank
- `isCorrect`: Required boolean

### Login
- `email`: Required, valid email format
- `password`: Required, not blank

---

## 🎨 Response Examples

### Success Response (Quiz Created)
```json
{
  "id": 1,
  "title": "Java Basics Quiz",
  "description": "Test your Java knowledge",
  "duration": 30,
  "isActive": true,
  "createdBy": "Admin",
  "createdAt": "2025-11-11T10:00:00",
  "updatedAt": "2025-11-11T10:00:00",
  "questions": [...]
}
```

### Error Response (Validation)
```json
{
  "timestamp": "2025-11-11T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": [
    "title: Title is required",
    "duration: Duration must be at least 1 minute"
  ]
}
```

### Error Response (Authorization)
```json
{
  "timestamp": "2025-11-11T10:00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

---

## 🛠️ Configuration

### Base URL
```
http://localhost:8080
```

### Database
```
URL: jdbc:postgresql://localhost:5432/quizforge_db
Username: quizforge_user
Password: quizforge_pass
```

### JWT
```
Expiration: 24 hours (86400000 ms)
Algorithm: HS512
```

---

## 📱 Postman Tips

1. **Import Collection**: File → Import → `QuizForge_Postman_Collection.json`
2. **Set Environment**: Collection variables are pre-configured
3. **Auto Token**: Login requests automatically save token
4. **Token Reuse**: Token is used in all authenticated requests
5. **Test Scripts**: Responses are validated automatically

---

## 🎓 For Presentation

**Key Demo Points**:
1. ✅ Show Swagger UI first - visual appeal
2. ✅ Login as Admin - demonstrate JWT
3. ✅ Create quiz - show validation, complex nested objects
4. ✅ Switch to Candidate - different perspective
5. ✅ Take quiz - show real-time grading
6. ✅ View analytics - data aggregation
7. ✅ Test security - show 403 Forbidden

**Time**: 12-15 minutes total

---

## 📊 API Summary

| Category | Endpoints | Auth Required | Role |
|----------|-----------|---------------|------|
| Authentication | 1 | No | None |
| Admin Quiz Management | 6 | Yes | ADMIN |
| Candidate Quiz Taking | 6 | Yes | CANDIDATE |
| **Total** | **13** | - | - |

---

**🚀 Ready to impress! Good luck with your presentation!**
