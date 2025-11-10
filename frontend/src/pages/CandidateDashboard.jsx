import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CandidateDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check authentication and fetch data on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      navigate('/');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'CANDIDATE') {
      navigate('/admin');
      return;
    }

    setUser(parsedUser);
    fetchData(token);
  }, [navigate]);

  // Fetch available quizzes and attempt history
  const fetchData = async (token) => {
    try {
      // Fetch available quizzes
      const quizzesResponse = await fetch('http://localhost:8080/api/candidate/quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (quizzesResponse.ok) {
        const quizzes = await quizzesResponse.json();
        setAvailableQuizzes(quizzes);
      }

      // Fetch my attempts
      const attemptsResponse = await fetch('http://localhost:8080/api/candidate/quizzes/my-attempts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (attemptsResponse.ok) {
        const attempts = await attemptsResponse.json();
        // Sort by submittedAt descending (most recent first)
        attempts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        setMyAttempts(attempts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light text-gray-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white flex flex-col p-4 border-r border-gray-200">
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-primary">QuizForge</h1>
          </div>
          
          <nav className="flex-grow">
            <ul>
              <li className="mb-4">
                <a
                  className="flex items-center p-3 rounded-lg text-white bg-primary font-semibold cursor-pointer"
                  onClick={() => navigate('/candidate')}
                >
                  <span className="material-symbols-outlined mr-3">dashboard</span>
                  Dashboard
                </a>
              </li>
              <li className="mb-4">
                <a
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate('/candidate/profile')}
                >
                  <span className="material-symbols-outlined mr-3">person</span>
                  Profile
                </a>
              </li>
            </ul>
          </nav>
          
          <div className="mt-auto">
            <a
              className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              onClick={handleLogout}
            >
              <span className="material-symbols-outlined mr-3">logout</span>
              Logout
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <header className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.name || 'Candidate'}!
            </h2>
            <p className="text-gray-500">
              Select a quiz below to start your assessment.
            </p>
          </header>

          {/* Available Quizzes */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Assessments</h3>
            
            {availableQuizzes.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">assignment</span>
                <p className="text-gray-500 text-lg">No assessments available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableQuizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{quiz.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
                    
                    <div className="flex items-center justify-between text-sm mb-4 text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">help</span>
                        {quiz.questionCount || 0} Questions
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        {quiz.duration} mins
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/candidate/quiz/${quiz.id}`)}
                      className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                    >
                      Start Quiz
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* My Quiz History */}
          {myAttempts.length > 0 && (
            <section className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">My Quiz History</h3>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {myAttempts.map((attempt) => {
                      const percentage = attempt.totalPoints > 0 ? Math.round((attempt.score / attempt.totalPoints) * 100) : 0;
                      const passed = percentage >= 70;
                      return (
                        <tr key={attempt.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{attempt.quiz?.title || 'Unknown'}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{new Date(attempt.submittedAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{attempt.score}/{attempt.totalPoints}</td>
                          <td className="px-6 py-4 text-sm font-semibold">{percentage}%</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {passed ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button onClick={() => navigate(`/candidate/results/${attempt.id}`)} className="text-primary hover:text-blue-700 font-medium">
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default CandidateDashboard;
