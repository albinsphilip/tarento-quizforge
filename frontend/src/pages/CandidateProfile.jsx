import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { quizAPI } from '../utils/api';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData || JSON.parse(userData).role !== 'CANDIDATE') {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const data = await quizAPI.getAttempts();
      setAttempts(data);
    } catch (error) {
      console.error('Error fetching attempts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;

  const totalQuizzes = attempts.length;
  const avgScore = totalQuizzes > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + (a.totalPoints > 0 ? (a.score / a.totalPoints) * 100 : 0), 0) / totalQuizzes)
    : 0;
  const passedQuizzes = attempts.filter(a => a.totalPoints > 0 && (a.score / a.totalPoints) * 100 >= 50).length;
  const totalPoints = attempts.reduce((sum, a) => sum + a.score, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="CANDIDATE" currentPath={location.pathname} userName={user?.name} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-5">
            <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
            <p className="text-gray-600 text-sm mt-1">View your account details and statistics</p>
          </div>
        </div>

        <div className="p-8">
          {/* Profile Info Card */}
          <div className="card mb-8 animate-fade-in border-slate-200">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
                <span className="text-4xl font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'C'}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user?.name?.split(' ')[0] || 'Candidate'}</h2>
                {/* <p className="text-slate-600 text-sm">{user?.email}</p> */}
                {/*<span className="inline-block mt-2 badge badge-info">Candidate</span>*/}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-600 mb-1">Full Name</p>
                <p className="text-base font-semibold text-slate-900">{user?.name || 'N/A'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-600 mb-1">Email Address</p>
                <p className="text-base font-semibold text-slate-900">{user?.email || 'N/A'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-600 mb-1">Account Type</p>
                <p className="text-base font-semibold text-slate-900">Candidate</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          {totalQuizzes > 0 && (
            <div className="card animate-slide-up border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Performance Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined text-3xl text-blue-600">quiz</span>
                  </div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Quizzes</p>
                  <p className="text-2xl font-bold text-blue-900">{totalQuizzes}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined text-3xl text-emerald-600">check_circle</span>
                  </div>
                  <p className="text-sm font-medium text-emerald-700 mb-1">Quizzes Passed</p>
                  <p className="text-2xl font-bold text-emerald-900">{passedQuizzes}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg border border-violet-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined text-3xl text-violet-600">trending_up</span>
                  </div>
                  <p className="text-sm font-medium text-violet-700 mb-1">Average Score</p>
                  <p className="text-2xl font-bold text-violet-900">{avgScore}%</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="material-symbols-outlined text-3xl text-amber-600">star</span>
                  </div>
                  <p className="text-sm font-medium text-amber-700 mb-1">Total Points</p>
                  <p className="text-2xl font-bold text-amber-900">{totalPoints}</p>
                </div>
              </div>

              {/* 
              // Recent Activity
              {attempts.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {attempts.slice(0, 5).map((attempt) => {
                      const percentage = attempt.totalPoints > 0 
                        ? Math.round((attempt.score / attempt.totalPoints) * 100) 
                        : 0;
                      const passed = percentage >= 70;
                      
                      return (
                        <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className={`material-symbols-outlined ${passed ? 'text-green-600' : 'text-red-600'}`}>
                              {passed ? 'check_circle' : 'cancel'}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900">{attempt.quiz?.title || 'Quiz'}</p>
                              <p className="text-sm text-gray-600">
                                {attempt.submittedAt ? (
                                  new Date(attempt.submittedAt).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric', 
                                    year: 'numeric' 
                                  })
                                ) : (
                                  'Not submitted'
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{percentage}%</p>
                            <span className={`badge ${passed ? 'badge-success' : 'badge-danger'}`}>
                              {passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}*/}
            </div>
          )}

          {totalQuizzes === 0 && (
            <div className="card text-center py-16">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">assignment</span>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quiz History Yet</h3>
              <p className="text-gray-600 mb-6">Start taking quizzes to see your statistics here!</p>
              <button onClick={() => navigate('/candidate')} className="btn-primary inline-flex items-center gap-2">
                <span className="material-symbols-outlined">arrow_forward</span>
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CandidateProfile;
