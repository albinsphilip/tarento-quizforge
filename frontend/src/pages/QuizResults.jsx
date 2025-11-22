import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

function QuizResults() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttemptResults();
  }, [attemptId]);

  const fetchAttemptResults = async () => {
    try {
      const data = await quizAPI.getAttempt(attemptId);
      console.log('Attempt data received:', data);
      console.log('timeTakenMinutes:', data.timeTakenMinutes);
      setAttempt(data);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScorePercentage = () => {
    if (!attempt || attempt.totalPoints === 0) return 0;
    return Math.round((attempt.score / attempt.totalPoints) * 100);
  };

  const getStatusColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = () => {
    const percentage = getScorePercentage();
    if (percentage >= 70) return 'Good';
    if (percentage >= 50) return 'Needs Improvement';
    return 'Failed';
  };

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-slate-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
  //         <p className="mt-4 text-slate-600">Loading results...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if(loading){
    return(
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner message="Loading results..."/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-600 mb-4">Error: {error}</p>
          <button
            onClick={() => navigate('/candidate')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">No results found</p>
          <button
            onClick={() => navigate('/candidate')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const percentage = getScorePercentage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/candidate')}
                className="text-gray-600 hover:text-gray-900"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Quiz Results</h1>
            </div>
            {/* <button
              onClick={() => navigate('/candidate')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm"
            >
              Back to Dashboard
            </button> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
        {/* Score Card */}
        <div className="bg-white rounded-md border border-gray-200 p-6 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {attempt.quiz?.title || 'Quiz'}
            </h2>
            <p className="text-gray-600 text-sm mb-5">
              Submitted on {new Date(attempt.submittedAt).toLocaleString()}
            </p>

            {/* Score Circle */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <svg className="w-48 h-48 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={percentage >= 70 ? '#10b981' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold leading-none ${getStatusColor()}`}>
                    {percentage}%
                  </span>
                  <span className="text-gray-600 text-sm mt-2">Score</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1 font-medium">Your Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {attempt.score} / {attempt.totalPoints}
                </p>
              </div>
              {/* <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1 font-medium">Percentage</p>
                <p className={`text-2xl font-bold ${getStatusColor()}`}>
                  {percentage}%
                </p>
              </div> */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1 font-medium">Time Taken</p>
                <p className="text-2xl font-bold text-slate-900">
                  {attempt.timeTakenMinutes != null ? (() => {
                    const totalSeconds = attempt.timeTakenMinutes;
                    const mins = Math.floor(totalSeconds / 60);
                    const secs = totalSeconds % 60;
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                  })() : 'N/A'}
                </p>
                {attempt.exceededTimeLimit && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Exceeded time limit</p>
                )}
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1 font-medium">Status</p>
                <p className={`text-2xl font-bold ${getStatusColor()}`}>
                  {getStatusText()}
                </p>
              </div>
            </div>            {/* Performance Message */}
            <div className={`p-4 rounded-lg ${
              percentage >= 70 
                ? 'bg-emerald-50 border border-emerald-200' 
                : percentage >= 50 
                ? 'bg-amber-50 border border-amber-200' 
                : 'bg-rose-50 border border-rose-200'
            }`}>
              <p className={`font-semibold text-sm ${
                percentage >= 70 
                  ? 'text-emerald-800' 
                  : percentage >= 50 
                  ? 'text-amber-800' 
                  : 'text-rose-800'
              }`}>
                {percentage >= 70 
                  ? '🎉 Excellent! Keep going!' 
                  : percentage >= 50 
                  ? '👍 Good effort! Keep practicing to improve.' 
                  : '💪 Don\'t give up! Review the material and try again.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {/* <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/candidate')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Back to Dashboard
          </button>
        </div> */}
      </main>
    </div>
  );
}

export default QuizResults;
