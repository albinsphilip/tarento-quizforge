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
  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0); //remove this line

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="ADMIN" currentPath={location.pathname} userName={user?.name} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-5">
            <h1 className="text-xl font-semibold text-gray-900">
              Welcome back, {user?.name || 'Admin'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage quizzes and monitor performance</p>
          </div>
        </div>

        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-lg">error</span>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{quizzes.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-white text-xl">quiz</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{activeCount}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Inactive Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{inactiveCount}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-xl">pending</span>
                </div>
              </div>
            </div>

            {/*<div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalQuestions}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-xl">list</span>
                </div>
              </div>
            </div>*/}
          </div>

          {/* Quizzes Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">Quiz Management</h2>
              <button 
                onClick={() => navigate('/admin/quiz/create')} 
                className="btn-primary inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Create Quiz
              </button>
            </div>

            {quizzes.length === 0 ? (
              <div className="text-center py-12 px-6">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">assignment</span>
                <h3 className="text-base font-medium text-gray-700 mb-2">No Quizzes Yet</h3>
                <p className="text-gray-500 text-sm">Create your first quiz to get started!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Quiz Details
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {quizzes.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 text-sm">{quiz.title}</div>
                          <div className="text-xs text-gray-500 mt-1">
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
                            {quiz.totalQuestions || 0}
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
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
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
