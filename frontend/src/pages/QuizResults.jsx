import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function QuizResults() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/candidate/quizzes/attempts/${attemptId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) setAttempt(await response.json());
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No results found</p>
          <button onClick={() => navigate('/candidate')} className="px-4 py-2 bg-blue-600 text-white rounded">Back</button>
        </div>
      </div>
    );
  }

  const percentage = attempt.totalPoints > 0 ? Math.round((attempt.score / attempt.totalPoints) * 100) : 0;
  const passed = percentage >= 70;
  const color = passed ? 'green' : percentage >= 50 ? 'yellow' : 'red';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quiz Results</h1>
          <button onClick={() => navigate('/candidate')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Back to Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <h2 className="text-3xl font-bold mb-2">{attempt.quiz?.title || 'Quiz'}</h2>
          <p className="text-gray-600 mb-6">{new Date(attempt.submittedAt).toLocaleString()}</p>

          {/* Score Circle */}
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle
                  cx="96" cy="96" r="88"
                  stroke={color === 'green' ? '#10b981' : color === 'yellow' ? '#f59e0b' : '#ef4444'}
                  strokeWidth="12" fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold text-${color}-600`}>{percentage}%</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">Your Score</p>
              <p className="text-2xl font-bold">{attempt.score}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">Total Points</p>
              <p className="text-2xl font-bold">{attempt.totalPoints}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600 text-sm">Status</p>
              <p className={`text-2xl font-bold text-${color}-600`}>{passed ? 'Passed' : 'Failed'}</p>
            </div>
          </div>

          {/* Message */}
          <div className={`p-4 rounded-lg bg-${color}-50 border border-${color}-200`}>
            <p className={`font-semibold text-${color}-800`}>
              {passed ? '🎉 Excellent! You passed!' : percentage >= 50 ? '👍 Good effort!' : '💪 Keep practicing!'}
            </p>
          </div>
        </div>

        {/* Questions */}
        {attempt.quiz?.questions && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Question Review ({attempt.quiz.questions.length} questions)</h3>
            <div className="space-y-4">
              {attempt.quiz.questions.map((q, idx) => {
                const userAns = attempt.candidateAnswers?.find(a => a.question?.id === q.id);
                const isCorrect = userAns?.correct;
                return (
                  <div key={q.id} className={`border rounded-lg p-4 ${isCorrect ? 'border-green-200 bg-green-50' : isCorrect === false ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start">
                      <span className={`mr-3 material-symbols-outlined ${isCorrect ? 'text-green-600' : isCorrect === false ? 'text-red-600' : 'text-gray-400'}`}>
                        {isCorrect ? 'check_circle' : isCorrect === false ? 'cancel' : 'help'}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold mb-2">{idx + 1}. {q.questionText}</p>
                        
                        {/* MCQ/TF Options */}
                        {(q.questionType === 'MCQ' || q.questionType === 'TRUE_FALSE') && (
                          <div className="space-y-2 mt-3">
                            {q.options?.map((opt) => {
                              const isUserChoice = userAns?.selectedOption?.id === opt.id;
                              const isCorrectOpt = opt.correct;
                              return (
                                <div key={opt.id} className={`p-2 rounded ${isCorrectOpt ? 'bg-green-100 border border-green-300' : isUserChoice ? 'bg-red-100 border border-red-300' : 'bg-white border'}`}>
                                  <div className="flex items-center">
                                    {isCorrectOpt && <span className="material-symbols-outlined text-green-600 mr-2 text-sm">check</span>}
                                    {isUserChoice && !isCorrectOpt && <span className="material-symbols-outlined text-red-600 mr-2 text-sm">close</span>}
                                    <span className={isCorrectOpt || isUserChoice ? 'font-semibold' : ''}>{opt.optionText}</span>
                                    {isUserChoice && <span className="ml-2 text-sm text-gray-600">(Your answer)</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Short Answer */}
                        {q.questionType === 'SHORT_ANSWER' && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-600 mb-1">Your Answer:</p>
                            <p className="p-2 bg-white border rounded">{userAns?.textAnswer || '(No answer)'}</p>
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

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/candidate')} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

export default QuizResults;
