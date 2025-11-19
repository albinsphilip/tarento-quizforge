import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { candidateAPI } from '../utils/api';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

function CandidateDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [myAttempts, setMyAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [quizzes, attempts] = await Promise.all([
        candidateAPI.getAvailableQuizzes(),
        candidateAPI.getMyAttempts()
      ]);
      
      setAvailableQuizzes(quizzes);
      
      // Sort by submittedAt, but handle null values (put them at the end)
      setMyAttempts(attempts.sort((a, b) => {
        if (!a.submittedAt && !b.submittedAt) return 0;
        if (!a.submittedAt) return 1;
        if (!b.submittedAt) return -1;
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      }));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const completedQuizzes = myAttempts.length;
  const avgScore = myAttempts.length > 0 
    ? Math.round(myAttempts.reduce((sum, a) => sum + (a.totalPoints > 0 ? (a.score / a.totalPoints) * 100 : 0), 0) / myAttempts.length)
    : 0;
  const passedQuizzes = myAttempts.filter(a => a.totalPoints > 0 && (a.score / a.totalPoints) * 100 >= 70).length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="CANDIDATE" currentPath={location.pathname} userName={user?.name} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome back, {user?.name || 'Candidate'}!
            </h1>
            <p className="text-gray-600">Ready to take on a new challenge? Let's get started!</p>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Grid */}
          {myAttempts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">Quizzes Completed</p>
                    <p className="text-4xl font-bold">{completedQuizzes}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl">task_alt</span>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium mb-1">Average Score</p>
                    <p className="text-4xl font-bold">{avgScore}%</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl">trending_up</span>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-1">Quizzes Passed</p>
                    <p className="text-4xl font-bold">{passedQuizzes}</p>
                  </div>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Quizzes */}
          <section className="mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Assessments</h2>
            
            {availableQuizzes.length === 0 ? (
              <div className="card text-center py-16">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">assignment</span>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quizzes Available</h3>
                <p className="text-gray-500">Check back later for new assessments!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableQuizzes.map((quiz) => (
                  <div key={quiz.id} className="card group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-2xl">assignment</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
                      {quiz.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">list</span>
                      <span>{quiz.totalQuestions||0} question</span>
                      </div>
                      <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-lg">timer</span>
                      <span>{quiz.duration || 0} min</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/candidate/quiz/${quiz.id}`)}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">play_arrow</span>
                      Start Assessment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quiz History */}
          {myAttempts.length > 0 && (
            <section className="animate-slide-up">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Quiz History</h2>
              <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quiz</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Percentage</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {myAttempts.map((attempt) => {
                        const percentage = attempt.totalPoints > 0 
                          ? Math.round((attempt.score / attempt.totalPoints) * 100) 
                          : 0;
                        
                        const isSubmitted = attempt.submittedAt && attempt.submittedAt !== null;
                        const dateToShow = isSubmitted ? attempt.submittedAt : attempt.startedAt;
                        
                        return (
                          <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{attempt.quizTitle || 'Quiz'}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {isSubmitted ? (
                                new Date(dateToShow).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              ) : (
                                <span className="text-amber-600">Not submitted</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                              {isSubmitted ? `${attempt.score}/${attempt.totalPoints}` : '-'}
                            </td>
                            <td className="px-6 py-4">
                              {isSubmitted ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${percentage >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-semibold">{percentage}%</span>
                                </div>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {isSubmitted ? (
                                <span className={`badge ${percentage >= 50 ? 'badge-success' : 'badge-danger'}`}>
                                  {percentage >= 50 ? 'Good' : 'Review'}
                                </span>
                              ) : (
                                <span className="badge badge-warning">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {isSubmitted ? (
                                <button 
                                  onClick={() => navigate(`/candidate/results/${attempt.id}`)} 
                                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                                >
                                  View Details →
                                </button>
                              ) : (
                                <span className="text-gray-400 text-sm">No results</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default CandidateDashboard;
