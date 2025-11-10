import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userData || !token || JSON.parse(userData).role !== 'ADMIN') {
      navigate(JSON.parse(userData)?.role === 'CANDIDATE' ? '/candidate' : '/');
      return;
    }
    setUser(JSON.parse(userData));
    fetchQuizzes(token);
  }, [navigate]);

  const fetchQuizzes = async (token) => {
    try {
      const response = await fetch('/api/admin/quizzes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setQuizzes(await response.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this quiz?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/quizzes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (error) {
      alert('Failed to delete quiz');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeCount = quizzes.filter(q => q.isActive).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-2xl font-bold text-blue-600 mb-8">QuizForge Admin</h1>
        <nav className="space-y-2">
          <div className="flex items-center p-3 rounded-lg bg-blue-600 text-white font-semibold">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            Dashboard
          </div>
          <div onClick={() => navigate('/admin/quiz/create')} className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
            <span className="material-symbols-outlined mr-3">add</span>
            Create Quiz
          </div>
          <div onClick={handleLogout} className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer mt-auto">
            <span className="material-symbols-outlined mr-3">logout</span>
            Logout
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Admin'}</h2>
          <p className="text-gray-600">Manage your quizzes and track performance</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Quizzes</p>
                <p className="text-3xl font-bold mt-1">{quizzes.length}</p>
              </div>
              <span className="material-symbols-outlined text-4xl text-blue-600">quiz</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Quizzes</p>
                <p className="text-3xl font-bold mt-1">{activeCount}</p>
              </div>
              <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
            </div>
          </div>
        </div>

        {/* Quizzes Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold">All Quizzes</h3>
            <button onClick={() => navigate('/admin/quiz/create')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Create New Quiz
            </button>
          </div>
          
          {quizzes.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">No quizzes yet. Create your first quiz!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Questions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{quiz.title}</div>
                        <div className="text-sm text-gray-500">{quiz.description?.substring(0, 50)}{quiz.description?.length > 50 ? '...' : ''}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{quiz.duration} mins</td>
                      <td className="px-6 py-4 text-sm">{quiz.questionCount || quiz.questions?.length || 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${quiz.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {quiz.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => navigate(`/admin/quiz/edit/${quiz.id}`)} className="text-blue-600 hover:text-blue-800">
                            <span className="material-symbols-outlined text-xl">edit</span>
                          </button>
                          <button onClick={() => handleDelete(quiz.id)} className="text-red-600 hover:text-red-800">
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
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
