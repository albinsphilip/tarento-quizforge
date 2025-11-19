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
  const [stats, setStats] = useState({ completed: 0, avgScore: 0, passed: 0 });
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
      
      // Calculate stats from attempts
      const completed = attempts.length;
      const avgScore = attempts.length > 0 
        ? Math.round(attempts.reduce((sum, a) => sum + (a.totalPoints > 0 ? (a.score / a.totalPoints) * 100 : 0), 0) / attempts.length)
        : 0;
      const passed = attempts.filter(a => a.totalPoints > 0 && (a.score / a.totalPoints) * 100 >= 70).length;
      
      setStats({ completed, avgScore, passed });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="CANDIDATE" currentPath={location.pathname} userName={user?.name} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-5">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name || 'Candidate'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">Ready to take on a new challenge?</p>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Grid */}
          {stats.completed > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="card bg-white border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Quizzes Completed</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
                  </div>
                  <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-600 text-xl">task_alt</span>
                  </div>
                </div>
              </div>

              <div className="card bg-white border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Average Score</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.avgScore}%</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-green-600 text-xl">trending_up</span>
                  </div>
                </div>
              </div>

              <div className="card bg-white border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Quizzes Passed</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.passed}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600 text-xl">workspace_premium</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Quizzes */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Available Assessments</h2>
            
            {availableQuizzes.length === 0 ? (
              <div className="card text-center py-12 border-gray-200">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">assignment</span>
                <h3 className="text-base font-medium text-gray-700 mb-2">No Quizzes Available</h3>
                <p className="text-gray-500 text-sm">Check back later for new assessments</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {availableQuizzes.map((quiz) => (
                  <div key={quiz.id} className="card border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-md flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">assignment</span>
                      </div>
                    </div>
                    
                    <h3 className="text-base font-medium text-gray-900 mb-2 min-h-[2.5rem]">
                      {quiz.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 h-10 overflow-hidden">
                      {quiz.description || 'No description available'}
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">list</span>
                      <span>{quiz.totalQuestions||0} questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-lg">timer</span>
                      <span>{quiz.duration || 0} min</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/candidate/quiz/${quiz.id}`)}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">play_arrow</span>
                      Start Assessment
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>


        </div>
      </main>
    </div>
  );
}

export default CandidateDashboard;
