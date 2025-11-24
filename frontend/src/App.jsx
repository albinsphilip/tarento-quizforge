import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CandidateDashboard from './pages/CandidateDashboard'
import AdminDashboard from './pages/AdminDashboard'
import QuizTaking from './pages/QuizTaking'
import QuizResults from './pages/QuizResults'
import CreateQuiz from './pages/CreateQuiz'
import EditQuiz from './pages/EditQuiz'
import CandidateProfile from './pages/CandidateProfile'
import QuizHistory from './pages/QuizHistory'
import Analytics from './pages/Analytics'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/candidate" element={<CandidateDashboard />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/quiz/:quizId" element={<QuizTaking />} />
        <Route path="/candidate/results/:attemptId" element={<QuizResults />} />
        <Route path="/candidate/*" element={<CandidateDashboard />} />
        <Route path="/candidate/history" element={<QuizHistory/>}/>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/quiz/create" element={<CreateQuiz />} />
        <Route path="/admin/quiz/edit/:quizId" element={<EditQuiz />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
