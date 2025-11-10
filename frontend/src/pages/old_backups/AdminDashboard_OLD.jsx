import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalAttempts: 0,
    averageScore: 0
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);

  useEffect(() => {
    // Check if user is logged in and is admin
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
    fetchDashboardData(token);
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const response = await fetch('/api/admin/quizzes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
        
        // Calculate statistics
        const activeCount = data.filter(q => q.isActive).length;
        
        setStats({
          totalQuizzes: data.length,
          activeQuizzes: activeCount,
          totalAttempts: data.length * 12, // Placeholder
          averageScore: 78 // Placeholder
        });
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCreateQuiz = () => {
    navigate('/admin/quiz/create');
  };

  const handleEditQuiz = (quizId) => {
    navigate(`/admin/quiz/edit/${quizId}`);
  };

  const handleViewAnalytics = (quizId) => {
    navigate(`/admin/quiz/analytics/${quizId}`);
  };

  const confirmDeleteQuiz = (quiz) => {
    setQuizToDelete(quiz);
    setShowDeleteModal(true);
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/quizzes/${quizToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Refresh quiz list
        setQuizzes(quizzes.filter(q => q.id !== quizToDelete.id));
        setStats(prev => ({
          ...prev,
          totalQuizzes: prev.totalQuizzes - 1,
          activeQuizzes: quizToDelete.isActive ? prev.activeQuizzes - 1 : prev.activeQuizzes
        }));
        setShowDeleteModal(false);
        setQuizToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz. Please try again.');
    }
  };

  const toggleQuizStatus = async (quiz) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/quizzes/${quiz.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...quiz,
          isActive: !quiz.isActive
        })
      });

      if (response.ok) {
        // Update local state
        setQuizzes(quizzes.map(q => 
          q.id === quiz.id ? { ...q, isActive: !q.isActive } : q
        ));
        setStats(prev => ({
          ...prev,
          activeQuizzes: quiz.isActive ? prev.activeQuizzes - 1 : prev.activeQuizzes + 1
        }));
      }
    } catch (error) {
      console.error('Error toggling quiz status:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
            <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
          </div>
          <nav className="flex-grow">
            <ul>
              <li className="mb-4">
                <a
                  className="flex items-center p-3 rounded-lg text-white bg-primary font-semibold cursor-pointer"
                  onClick={() => navigate('/admin')}
                >
                  <span className="material-symbols-outlined mr-3">dashboard</span>
                  Dashboard
                </a>
              </li>
              <li className="mb-4">
                <a
                  className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
                  onClick={() => navigate('/admin/quiz/create')}
                >
                  <span className="material-symbols-outlined mr-3">add_circle</span>
                  Create Quiz
                </a>
              </li>
            </ul>
          </nav>
          <div className="mt-auto">
            <div className="p-3 mb-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Logged in as</p>
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
            </div>
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
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h2>
              <p className="text-gray-500">
                Manage quizzes and monitor platform activity
              </p>
            </div>
            <button
              onClick={handleCreateQuiz}
              className="flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
            >
              <span className="material-symbols-outlined mr-2">add</span>
              Create Quiz
            </button>
          </header>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm text-gray-500">Total Quizzes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="material-symbols-outlined text-blue-500">quiz</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm text-gray-500">Active Quizzes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeQuizzes}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="material-symbols-outlined text-green-500">check_circle</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm text-gray-500">Total Attempts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="material-symbols-outlined text-purple-500">assignment_turned_in</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-sm text-gray-500">Avg. Score</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <span className="material-symbols-outlined text-indigo-500">trending_up</span>
              </div>
            </div>
          </section>

          {/* Quizzes Table */}
          <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Quiz Management</h3>
              <p className="text-sm text-gray-500 mt-1">View, edit, and manage all quizzes</p>
            </div>
            
            {quizzes.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">quiz</span>
                <p className="text-gray-500 mb-4">No quizzes created yet</p>
                <button
                  onClick={handleCreateQuiz}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create Your First Quiz
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quiz Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quizzes.map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {quiz.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{quiz.questionCount || 0}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{quiz.duration} min</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleQuizStatus(quiz)}
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              quiz.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } transition-colors cursor-pointer`}
                          >
                            {quiz.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(quiz.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewAnalytics(quiz.id)}
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="View Analytics"
                            >
                              <span className="material-symbols-outlined text-xl">analytics</span>
                            </button>
                            <button
                              onClick={() => handleEditQuiz(quiz.id)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              title="Edit Quiz"
                            >
                              <span className="material-symbols-outlined text-xl">edit</span>
                            </button>
                            <button
                              onClick={() => confirmDeleteQuiz(quiz)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete Quiz"
                            >
                              <span className="material-symbols-outlined text-xl">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <span className="material-symbols-outlined text-red-500 text-3xl mr-3">warning</span>
              <h3 className="text-xl font-semibold text-gray-900">Delete Quiz</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{quizToDelete?.title}</strong>"? 
              This action cannot be undone and will also delete all associated attempts and answers.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setQuizToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteQuiz}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
