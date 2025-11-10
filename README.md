# QuizForge - Online Quiz Platform

A full-stack online quiz platform built with **Spring Boot** (backend) and **React + Vite** (frontend).

## 🎯 Features

### Admin Role
- Create, edit, and delete quizzes
- Add multiple choice, true/false, and short answer questions
- View quiz analytics (attempts, average scores, etc.)
- Manage quiz availability

### Candidate Role
- View available quizzes
- Start quiz attempts
- Submit answers
- View results and scores

## 🏗️ Tech Stack

**Backend:**
- Spring Boot 3.2.0
- Spring Security with JWT authentication
- Spring Data JPA
- PostgreSQL
- Swagger/OpenAPI for API documentation
- Lombok
- Maven

**Frontend:**
- React 18
- Vite
- Pure CSS (no frameworks)

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+
- Node.js 16+ and npm

## 🚀 Quick Start

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE quizforge;
```

Update database credentials in `backend/src/main/resources/application.properties` if needed.

### 2. Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on: http://localhost:8080

Swagger UI: http://localhost:8080/swagger-ui/index.html

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on: http://localhost:5173

## 🔐 Authentication

### Login Endpoints

**POST** `/api/auth/login`

**For Admin Access:**
```json
{
  "email": "admin@quizforge.com",
  "password": "any_password"
}
```

**For Candidate Access:**
```json
{
  "email": "candidate@example.com",
  "password": "any_password"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "email": "admin@quizforge.com",
  "name": "Admin User",
  "role": "ADMIN"
}
```

Copy the token and use it in Swagger UI by clicking the "Authorize" button.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Get JWT token

### Admin Endpoints (Requires ADMIN role)
- `GET /api/admin/quizzes` - Get all quizzes
- `GET /api/admin/quizzes/{id}` - Get quiz details
- `POST /api/admin/quizzes` - Create new quiz
- `PUT /api/admin/quizzes/{id}` - Update quiz
- `DELETE /api/admin/quizzes/{id}` - Delete quiz
- `GET /api/admin/quizzes/{id}/analytics` - Get quiz analytics

### Candidate Endpoints (Requires CANDIDATE role)
- `GET /api/candidate/quizzes` - Get available quizzes
- `GET /api/candidate/quizzes/{id}` - Get quiz questions
- `POST /api/candidate/quizzes/{id}/start` - Start quiz attempt
- `POST /api/candidate/quizzes/submit` - Submit quiz answers
- `GET /api/candidate/quizzes/my-attempts` - Get my attempts
- `GET /api/candidate/quizzes/attempts/{id}` - Get attempt result

## 📝 Sample Quiz Creation

```json
{
  "title": "JavaScript Basics",
  "description": "Test your JavaScript knowledge",
  "duration": 30,
  "isActive": true,
  "questions": [
    {
      "questionText": "What is the output of: typeof null",
      "type": "MULTIPLE_CHOICE",
      "points": 1,
      "options": [
        { "optionText": "null", "isCorrect": false },
        { "optionText": "object", "isCorrect": true },
        { "optionText": "undefined", "isCorrect": false }
      ]
    },
    {
      "questionText": "JavaScript is a compiled language",
      "type": "TRUE_FALSE",
      "points": 1,
      "options": [
        { "optionText": "True", "isCorrect": false },
        { "optionText": "False", "isCorrect": true }
      ]
    }
  ]
}
```

## 🗄️ Database Schema

**Entities:**
- `User` - Stores admin and candidate users
- `Quiz` - Quiz metadata and settings
- `Question` - Quiz questions with types
- `Option` - Answer options for questions
- `QuizAttempt` - Candidate quiz attempts
- `Answer` - Candidate answers to questions

## 🔧 Configuration

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/quizforge
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT
jwt.secret=YourSuperSecretKey
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:5173
```

### Frontend Configuration
Edit `frontend/vite.config.js` for API proxy:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

## 📦 Project Structure

```
quizforge/
├── backend/
│   ├── src/main/java/com/quizforge/
│   │   ├── QuizForgeApplication.java
│   │   ├── config/
│   │   │   └── OpenApiConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── AdminController.java
│   │   │   └── CandidateController.java
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   └── service/
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🧪 Testing the API

1. Start the backend
2. Open Swagger UI at http://localhost:8080/swagger-ui/index.html
3. Login via `/api/auth/login` to get JWT token
4. Click "Authorize" button in Swagger UI
5. Enter: `Bearer <your-token>`
6. Test the endpoints!

## 🛣️ Development Roadmap

### Week 1 Plan
- ✅ Backend API with JWT auth
- ✅ Swagger documentation
- ✅ Minimal React frontend
- ⬜ Database migrations
- ⬜ Complete frontend UI
- ⬜ User registration
- ⬜ Quiz timer functionality
- ⬜ Rich text editor for questions
- ⬜ File upload for images
- ⬜ Email notifications
- ⬜ Detailed analytics dashboard

## 🤝 Contributing

This is a development project. Contributions welcome!

## 📄 License

MIT License

---

**QuizForge** - Built with ❤️ using Spring Boot & React
