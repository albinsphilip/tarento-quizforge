import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { candidateAPI } from '../utils/api';

const QuizTaking = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  
  // State management
  const [user, setUser] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Use ref to track if quiz has been started
  const quizStartedRef = useRef(false);
  const timerRef = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'CANDIDATE') {
      navigate('/');
      return;
    }
    setUser(parsedUser);
    
    // Start quiz only once
    if (!quizStartedRef.current) {
      quizStartedRef.current = true;
      startQuizAttempt();
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    // Only start timer if quiz is loaded and not submitting
    if (!quiz || submitting) {
      return;
    }

    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto submit
          clearInterval(timer);
          if (!submitting) {
            setSubmitting(true);
            submitQuizToBackend(false);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Store timer reference
    timerRef.current = timer;

    // Cleanup function
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [quiz, submitting]); // Only re-run when quiz or submitting status changes

  // Start quiz attempt
  const startQuizAttempt = async () => {
    try {
      // Fetch quiz details first
      const quizData = await candidateAPI.getQuiz(quizId);
      
      // Initialize answers object BEFORE starting attempt
      const initialAnswers = {};
      quizData.questions.forEach(q => {
        initialAnswers[q.id] = {
          questionId: q.id,
          selectedOptionId: null,
          textAnswer: '',
          visited: false
        };
      });
      setAnswers(initialAnswers);
      setQuiz(quizData);
      
      // Now start the attempt
      const attemptData = await candidateAPI.startQuiz(quizId);
      setAttemptId(attemptData.id);
      setTimeLeft(quizData.duration * 60); // Convert minutes to seconds
      setLoading(false);
      
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to start quiz: ' + error.message);
      navigate('/candidate');
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        selectedOptionId: optionId,
        visited: true
      }
    }));
  };

  // Handle text answer
  const handleTextAnswer = (questionId, text) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        textAnswer: text,
        visited: true
      }
    }));
  };

  // Clear current answer
  const handleClearResponse = () => {
    if (!quiz) return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOptionId: null,
        textAnswer: ''
      }
    }));
  };

  // Save and go to next question
  const handleSaveAndNext = () => {
    if (!quiz) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id];
    
    // Check if answer is provided
    if (!currentAnswer?.selectedOptionId && !currentAnswer?.textAnswer?.trim()) {
      alert('Please provide an answer before saving.');
      return;
    }
    
    // Mark as visited (answer is already saved in state from handleAnswerSelect/handleTextAnswer)
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        visited: true
      }
    }));

    // Move to next question if available
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      alert('This is the last question. You can now submit the quiz.');
    }
  };

  // Navigate to specific question
  const handleQuestionNavigation = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Submit quiz (user initiated)
  const handleSubmitQuiz = () => {
    if (submitting) return;

    const confirmSubmit = window.confirm(
      'Are you sure you want to submit the quiz? You cannot change your answers after submission.'
    );
    
    if (!confirmSubmit) return;

    setSubmitting(true);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    submitQuizToBackend(true);
  };

  // Actual submission logic
  const submitQuizToBackend = async (showAlerts = true) => {
    try {
      // Prepare answers for submission
      const answerRequests = Object.values(answers)
        .filter(answer => answer.selectedOptionId || answer.textAnswer)
        .map(answer => ({
          questionId: answer.questionId,
          selectedOptionId: answer.selectedOptionId,
          textAnswer: answer.textAnswer || null
        }));

      const submitData = {
        attemptId: attemptId,
        answers: answerRequests
      };

      const result = await candidateAPI.submitQuiz(submitData);
      
      // Show success message and navigate to results
      if (showAlerts) {
        alert('Quiz submitted successfully!');
      }
      
      // Navigate to results page
      navigate(`/candidate/results/${result.id}`);
      
    } catch (error) {
      console.error('Error submitting quiz:', error);
      if (showAlerts) {
        alert('Failed to submit quiz: ' + error.message);
      }
      setSubmitting(false);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Get question status
  const getQuestionStatus = (question) => {
    const answer = answers[question.id];
    if (!answer) return 'not-visited';
    
    if (answer.selectedOptionId || answer.textAnswer) {
      return 'answered';
    } else if (answer.visited) {
      return 'unanswered';
    }
    return 'not-visited';
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white';
      case 'unanswered': return 'bg-red-500 text-white';
      case 'not-visited': return 'bg-yellow-400 text-gray-800';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // No quiz data
  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-lg text-rose-500">Quiz not found</p>
          <button
            onClick={() => navigate('/candidate')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div>
          <h1 className="text-base font-semibold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-600">Candidate: {user?.name}</p>
        </div>
        <div className="flex items-center gap-3 bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-200 shadow-sm">
          <span className="material-symbols-outlined text-xl text-indigo-600">timer</span>
          <div>
            <p className="text-xs text-gray-600 font-medium">Time Left</p>
            <p className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-indigo-900'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-5 overflow-y-auto">
          {/* Question Card */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="mb-5">
              <span className="inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-md">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="ml-3 inline-block bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-md border border-indigo-200">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'pt' : 'pts'}
              </span>
            </div>

            <h2 className="text-base font-semibold mb-6 text-slate-900 leading-relaxed">{currentQuestion.questionText}</h2>

            {/* Multiple Choice / True False */}
            {(currentQuestion.type === 'MULTIPLE_CHOICE' || currentQuestion.type === 'TRUE_FALSE') && (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-all duration-200 ${
                      currentAnswer?.selectedOptionId === option.id 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-slate-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      checked={currentAnswer?.selectedOptionId === option.id}
                      onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    />
                    <span className="ml-4 text-sm text-slate-900">{option.optionText}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Short Answer */}
            {currentQuestion.type === 'SHORT_ANSWER' && (
              <div>
                <textarea
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="6"
                  placeholder="Type your answer here..."
                  value={currentAnswer?.textAnswer || ''}
                  onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSaveAndNext}
              disabled={submitting}
              className="bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              <span className="material-symbols-outlined text-base">save</span>
              {currentQuestionIndex < quiz.questions.length - 1 ? 'Save & Next' : 'Save'}
            </button>

            <button
              onClick={handleClearResponse}
              disabled={submitting}
              className="bg-white border border-slate-300 text-slate-700 font-medium py-2.5 px-5 rounded-lg shadow-sm hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 text-sm"
            >
              Clear Response
            </button>

            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="ml-auto bg-emerald-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </main>

        {/* Sidebar - Question Navigator */}
        <aside className="w-80 bg-white border-l border-slate-200 p-6 flex-shrink-0 flex flex-col overflow-y-auto shadow-sm">
          <h3 className="text-base font-semibold mb-4 text-slate-900">Questions</h3>
          
          <div className="grid grid-cols-4 gap-2.5 mb-8">
            {quiz.questions.map((question, index) => {
              const status = getQuestionStatus(question);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={question.id}
                  onClick={() => handleQuestionNavigation(index)}
                  disabled={submitting}
                  className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold shadow-sm text-sm ${getStatusColor(status)} ${
                    isCurrent ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  } disabled:opacity-50 transition-all`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold mb-3 text-sm text-slate-900">Progress</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Answered:</span>
                <span className="font-semibold text-emerald-600">
                  {Object.values(answers).filter(a => a.selectedOptionId || a.textAnswer).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Unanswered:</span>
                <span className="font-semibold text-rose-600">
                  {Object.values(answers).filter(a => a.visited && !a.selectedOptionId && !a.textAnswer).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Not Visited:</span>
                <span className="font-semibold text-amber-600">
                  {Object.values(answers).filter(a => !a.visited).length}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-auto pt-6 border-t border-slate-200">
            <h4 className="font-semibold mb-4 text-sm text-slate-900">Legend</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-md bg-emerald-500 mr-3"></span>
                <span className="text-sm text-slate-700">Answered</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-md bg-rose-500 mr-3"></span>
                <span className="text-sm text-slate-700">Unanswered</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-md bg-amber-400 mr-3"></span>
                <span className="text-sm text-slate-700">Not Visited</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-md mr-3 flex items-center justify-center border-2 border-blue-500"></div>
                <span className="text-sm text-slate-700">Current Question</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuizTaking;
