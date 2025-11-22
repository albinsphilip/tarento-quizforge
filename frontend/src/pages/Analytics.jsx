import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { quizAPI } from '../utils/api';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

function Analytics() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalAttempts: 0,
    totalCandidates: 0,
    averageScore: 0,
    passRate: 0,
    completionRate: 0,
    averageTime: 0
  });

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
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [quizzesData, attemptsData] = await Promise.all([
        quizAPI.getQuizzes(),
        quizAPI.getAttempts()
      ]);
      
      setQuizzes(quizzesData);
      setAttempts(attemptsData);
      
      // Set default to first quiz if available
      if (quizzesData.length > 0) {
        const firstQuizId = quizzesData[0].id;
        setSelectedQuiz(firstQuizId);
        calculateAnalytics(attemptsData, firstQuizId);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (attemptsData, quizFilter) => {
    const filteredAttempts = attemptsData.filter(a => a.quizId === parseInt(quizFilter));

    const totalAttempts = filteredAttempts.length;
    const uniqueCandidates = new Set(filteredAttempts.map(a => a.candidateEmail)).size;
    
    const scores = filteredAttempts.map(a => 
      a.totalPoints > 0 ? (a.score / a.totalPoints) * 100 : 0
    );
    
    const averageScore = scores.length > 0
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;
    
    const passedAttempts = scores.filter(score => score >= 70).length;
    const passRate = totalAttempts > 0 
      ? Math.round((passedAttempts / totalAttempts) * 100)
      : 0;

    // Calculate average completion time
    const completionTimes = filteredAttempts
      .filter(a => a.submittedAt && a.startedAt)
      .map(a => {
        const start = new Date(a.startedAt);
        const end = new Date(a.submittedAt);
        return (end - start) / 1000 / 60; // minutes
      });
    
    const averageTime = completionTimes.length > 0
      ? Math.round(completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length)
      : 0;

    setAnalytics({
      totalAttempts,
      totalCandidates: uniqueCandidates,
      averageScore,
      passRate,
      completionRate: 100,
      averageTime
    });
  };

  const handleQuizFilter = (quizId) => {
    setSelectedQuiz(quizId);
    calculateAnalytics(attempts, quizId);
  };

  const getScoreDistribution = () => {
    let filteredAttempts = attempts;
    if (selectedQuiz !== 'all') {
      filteredAttempts = attempts.filter(a => a.quizId === parseInt(selectedQuiz));
    }

    const ranges = [
      { label: '0-20%', min: 0, max: 20, count: 0 },
      { label: '21-40%', min: 21, max: 40, count: 0 },
      { label: '41-60%', min: 41, max: 60, count: 0 },
      { label: '61-80%', min: 61, max: 80, count: 0 },
      { label: '81-100%', min: 81, max: 100, count: 0 }
    ];

    filteredAttempts.forEach(a => {
      const percentage = a.totalPoints > 0 ? (a.score / a.totalPoints) * 100 : 0;
      const range = ranges.find(r => percentage >= r.min && percentage <= r.max);
      if (range) range.count++;
    });

    return ranges;
  };

  const getTopPerformers = () => {
    let filteredAttempts = attempts;
    if (selectedQuiz !== 'all') {
      filteredAttempts = attempts.filter(a => a.quizId === parseInt(selectedQuiz));
    }

    const candidateScores = {};
    
    filteredAttempts.forEach(a => {
      const email = a.candidateEmail;
      const percentage = a.totalPoints > 0 ? (a.score / a.totalPoints) * 100 : 0;
      
      if (!candidateScores[email]) {
        candidateScores[email] = {
          email,
          name: a.candidateName || email.split('@')[0],
          scores: [],
          attempts: 0
        };
      }
      
      candidateScores[email].scores.push(percentage);
      candidateScores[email].attempts++;
    });

    const performers = Object.values(candidateScores).map(candidate => ({
      ...candidate,
      averageScore: Math.round(
        candidate.scores.reduce((sum, s) => sum + s, 0) / candidate.scores.length
      ),
      bestScore: Math.round(Math.max(...candidate.scores))
    }));

    return performers.sort((a, b) => b.averageScore - a.averageScore).slice(0, 5);
  };

  if (loading) return <LoadingSpinner message="Loading analytics..." />;

  const scoreDistribution = getScoreDistribution();
  const topPerformers = getTopPerformers();
  const maxDistributionCount = Math.max(...scoreDistribution.map(r => r.count), 1);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="ADMIN" currentPath={location.pathname} userName={user?.name} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-5">
            <h1 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">Performance insights and statistics</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quiz Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Filter by Quiz
            </label>
            <select
              value={selectedQuiz}
              onChange={(e) => handleQuizFilter(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {quizzes.map(quiz => (
                <option key={quiz.id} value={quiz.id}>{quiz.title}</option>
              ))}
            </select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Attempts</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalAttempts}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-xl">assignment</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Quiz Takers</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.totalCandidates}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-xl">group</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Average Score</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-xl">trending_up</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pass Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.passRate}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-xl">workspace_premium</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score Distribution */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-lg">bar_chart</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Score Distribution</h2>
              </div>
              
              <div className="space-y-4">
                {scoreDistribution.map((range, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{range.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{range.count} attempts</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(range.count / maxDistributionCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-white text-lg">emoji_events</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Top Performers</h2>
              </div>
              
              {topPerformers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No attempts yet</p>
              ) : (
                <div className="space-y-3">
                  {topPerformers.map((performer, idx) => (
                    <div key={performer.email} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                        idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                        idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                        'bg-gradient-to-br from-indigo-500 to-indigo-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{performer.name}</p>
                        <p className="text-xs text-gray-500">{performer.attempts} attempt{performer.attempts > 1 ? 's' : ''}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-indigo-600">{performer.averageScore}%</p>
                        <p className="text-xs text-gray-500">avg score</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Attempts Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">Recent Attempts</h2>
            </div>
            
            {attempts.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">assignment</span>
                <p className="text-gray-500">No attempts recorded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Quiz
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Time Taken
                      </th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attempts
                      .filter(a => a.quizId === parseInt(selectedQuiz))
                      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                      .slice(0, 10)
                      .map((attempt) => {
                        const percentage = attempt.totalPoints > 0 
                          ? Math.round((attempt.score / attempt.totalPoints) * 100)
                          : 0;
                        const isPassed = percentage >= 70;
                        
                        return (
                          <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900 text-sm">
                                {attempt.candidateName || 'Unknown'}
                              </div>
                              <div className="text-xs text-gray-500">{attempt.candidateEmail}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {attempt.quizTitle || 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                              {attempt.score} / {attempt.totalPoints}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                                percentage >= 90 ? 'bg-green-100 text-green-800' :
                                percentage >= 70 ? 'bg-blue-100 text-blue-800' :
                                percentage >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`}>
                                {isPassed ? 'Passed' : 'Failed'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                              {attempt.timeTakenMinutes != null ? (
                                <div>
                                  <span>{Math.floor(attempt.timeTakenMinutes / 60)}:{(attempt.timeTakenMinutes % 60).toString().padStart(2, '0')}</span>
                                  {attempt.exceededTimeLimit && (
                                    <span className="ml-2 text-xs text-red-600">⚠️</span>
                                  )}
                                </div>
                              ) : (
                                'N/A'
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {new Date(attempt.submittedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })}
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

export default Analytics;
