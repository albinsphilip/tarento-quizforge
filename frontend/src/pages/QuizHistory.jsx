import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { quizAPI } from '../utils/api';

function QuizHistory() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
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
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const attempts = await quizAPI.getAttempts();

      // Sort attempts by submittedAt (latest to oldest, null values at end)
      const sortedAttempts = attempts.sort((a, b) => {
        if (!a.submittedAt && !b.submittedAt) return 0;
        if (!a.submittedAt) return 1;
        if (!b.submittedAt) return -1;
        return new Date(b.submittedAt) - new Date(a.submittedAt);
      });

      setMyAttempts(sortedAttempts);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading quiz history..." />;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar role="CANDIDATE" currentPath="/candidate/history" userName={user?.name} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Quiz Attempt History</h1>
          {myAttempts.length === 0 ? (
            <div className="card text-center py-16 border-slate-200">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">history</span>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Quiz History</h3>
              <p className="text-slate-500 text-sm">You haven't completed any quizzes yet.</p>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Quiz</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Percentage</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {myAttempts.map((attempt) => {
                      const percentage = attempt.totalPoints > 0
                        ? Math.round((attempt.score / attempt.totalPoints) * 100)
                        : 0;

                      return (
                        <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900">{attempt.quizTitle || 'Quiz'}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {attempt.submittedAt
                              ? new Date(attempt.submittedAt).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Not submitted'}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            {attempt.submittedAt ? `${attempt.score}/${attempt.totalPoints}` : '-'}
                          </td>
                          <td className="px-6 py-4">
                            {attempt.submittedAt ? (
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all ${percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold min-w-[3rem]">{percentage}%</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {attempt.submittedAt ? (
                              <span className={`badge ${percentage >= 70 ? 'badge-success' : 'badge-danger'}`}>
                                {percentage >= 70 ? 'Passed' : 'Failed'}
                              </span>
                            ) : (
                              <span className="badge bg-red-100 text-red-800">Aborted</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default QuizHistory;