import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      navigate('/candidate');
      return;
    }
    setUser(parsedUser);
    fetchQuizzes();
  }, [navigate]);

  const fetchQuizzes = async () => {
    try {
      setError('');
      const data = await adminAPI.getQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    
    try {
      await adminAPI.deleteQuiz(id);
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (err) {
      alert('Failed to delete quiz: ' + err.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  const activeCount = quizzes.filter(q => q.isActive).length;
  const inactiveCount = quizzes.length - activeCount;
  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="ADMIN" currentPath={location.pathname} userName={user?.name} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Welcome back, {user?.name || 'Admin'}! 👋
            </h1>
            <p className="text-gray-600">Manage your quizzes and monitor performance</p>
          </div>
        </div>

        <div className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">error</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Quizzes</p>
                  <p className="text-4xl font-bold">{quizzes.length}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">assignment</span>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Active Quizzes</p>
                  <p className="text-4xl font-bold">{activeCount}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-amber-500 to-orange-500 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium mb-1">Inactive Quizzes</p>
                  <p className="text-4xl font-bold">{inactiveCount}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">pending</span>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Total Questions</p>
                  <p className="text-4xl font-bold">{totalQuestions}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">list</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quizzes Section */}
          <div className="card animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quiz Management</h2>
            </div>

            {quizzes.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">assignment</span>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quizzes Yet</h3>
                <p className="text-gray-500 mb-6">Create your first quiz to get started!</p>
                <button 
                  onClick={() => navigate('/admin/quiz/create')} 
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Create Quiz
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Quiz Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quizzes.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{quiz.title}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {quiz.description ? (
                              quiz.description.length > 60 
                                ? quiz.description.substring(0, 60) + '...' 
                                : quiz.description
                            ) : 'No description'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-gray-400">schedule</span>
                            {quiz.duration} min
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg text-gray-400">list</span>
                            {quiz.questions?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`badge ${quiz.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {quiz.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => navigate(`/admin/quiz/edit/${quiz.id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(quiz.id, quiz.title)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
