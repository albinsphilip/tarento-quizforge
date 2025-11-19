import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI } from '../utils/api';

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
      const data = await candidateAPI.getAttempt(attemptId);
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
    if (percentage >= 70) return 'Passed';
    if (percentage >= 50) return 'Average';
    return 'Failed';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading results...</p>
        </div>
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
            <button
              onClick={() => navigate('/candidate')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-sm"
            >
              Back to Dashboard
            </button>
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
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${getStatusColor()}`}>
                    {percentage}%
                  </span>
                  <span className="text-gray-600 text-sm mt-1">Score</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1 font-medium">Your Score</p>
                <p className="text-2xl font-bold text-slate-900">
                  {attempt.score}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1 font-medium">Total Points</p>
                <p className="text-2xl font-bold text-slate-900">
                  {attempt.totalPoints}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-slate-600 text-sm mb-1 font-medium">Status</p>
                <p className={`text-2xl font-bold ${getStatusColor()}`}>
                  {getStatusText()}
                </p>
              </div>
            </div>

            {/* Performance Message */}
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
                  ? '🎉 Excellent! You passed with flying colors!' 
                  : percentage >= 50 
                  ? '👍 Good effort! Keep practicing to improve.' 
                  : '💪 Don\'t give up! Review the material and try again.'}
              </p>
            </div>
          </div>
        </div>

        {/* Question Review (if available) */}
        {attempt.quiz?.questions && attempt.quiz.questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Question Review
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Total Questions: {attempt.quiz.questions.length}
            </p>
            
            {/* Question list */}
            <div className="space-y-4">
              {attempt.quiz.questions.map((question, index) => {
                // Find the user's answer for this question
                const userAnswer = attempt.candidateAnswers?.find(
                  ans => ans.question?.id === question.id
                );
                
                // Determine if answer is correct
                const isCorrect = userAnswer?.correct;

                return (
                  <div
                    key={question.id}
                    className={`border-2 rounded-lg p-4 ${
                      isCorrect === true
                        ? 'border-emerald-200 bg-emerald-50'
                        : isCorrect === false
                        ? 'border-rose-200 bg-rose-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start">
                      <span className={`mr-3 mt-0.5 material-symbols-outlined text-xl ${
                        isCorrect === true
                          ? 'text-emerald-600'
                          : isCorrect === false
                          ? 'text-rose-600'
                          : 'text-slate-400'
                      }`}>
                        {isCorrect === true
                          ? 'check_circle'
                          : isCorrect === false
                          ? 'cancel'
                          : 'help'}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 mb-2 text-sm">
                          {index + 1}. {question.questionText}
                        </p>
                        
                        {/* MCQ/True-False Options */}
                        {(question.questionType === 'MCQ' || question.questionType === 'TRUE_FALSE') && (
                          <div className="space-y-2 mt-3">
                            {question.options?.map((option) => {
                              const isUserSelection = userAnswer?.selectedOption?.id === option.id;
                              const isCorrectOption = option.correct;

                              return (
                                <div
                                  key={option.id}
                                  className={`p-2 rounded ${
                                    isCorrectOption
                                      ? 'bg-green-100 border border-green-300'
                                      : isUserSelection && !isCorrectOption
                                      ? 'bg-red-100 border border-red-300'
                                      : 'bg-white border border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center">
                                    {isCorrectOption && (
                                      <span className="material-symbols-outlined text-green-600 mr-2 text-sm">
                                        check
                                      </span>
                                    )}
                                    {isUserSelection && !isCorrectOption && (
                                      <span className="material-symbols-outlined text-red-600 mr-2 text-sm">
                                        close
                                      </span>
                                    )}
                                    <span className={
                                      isCorrectOption || isUserSelection
                                        ? 'font-semibold'
                                        : ''
                                    }>
                                      {option.optionText}
                                    </span>
                                    {isUserSelection && (
                                      <span className="ml-2 text-sm text-gray-600">
                                        (Your answer)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Short Answer */}
                        {question.questionType === 'SHORT_ANSWER' && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                            <p className="p-2 bg-white border border-gray-200 rounded">
                              {userAnswer?.textAnswer || '(No answer provided)'}
                            </p>
                            {userAnswer?.textAnswer && (
                              <p className="text-sm text-gray-500 mt-2">
                                * Short answer questions require manual grading
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => navigate('/candidate')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default QuizResults;
