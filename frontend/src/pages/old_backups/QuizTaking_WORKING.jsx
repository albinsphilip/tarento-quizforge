import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

  // Timer countdown - separated and fixed
  useEffect(() => {
    if (!quiz || timeLeft <= 0 || submitting) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - auto submit
          autoSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quiz, submitting]);

  // Auto submit when time runs out
  const autoSubmitQuiz = useCallback(() => {
    if (submitting) return;
    
    setSubmitting(true);
    submitQuizToBackend(false); // false = auto submit, no confirmation
  }, [submitting]);

  // Start quiz attempt
  const startQuizAttempt = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch quiz details first
      const quizResponse = await fetch(`http://localhost:8080/api/candidate/quizzes/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!quizResponse.ok) {
        throw new Error('Failed to fetch quiz details');
      }

      const quizData = await quizResponse.json();
      
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
      const startResponse = await fetch(`http://localhost:8080/api/candidate/quizzes/${quizId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!startResponse.ok) {
        const errorText = await startResponse.text();
        throw new Error(errorText || 'Failed to start quiz');
      }

      const attemptData = await startResponse.json();
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
      const token = localStorage.getItem('token');
      
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

      const response = await fetch('http://localhost:8080/api/candidate/quizzes/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit quiz');
      }

      const result = await response.json();
      
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
      <div className="flex items-center justify-center h-screen bg-background-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-text-secondary-light">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // No quiz data
  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light">
        <div className="text-center">
          <p className="text-lg text-red-500">Quiz not found</p>
          <button
            onClick={() => navigate('/candidate')}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg"
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
    <div className="flex flex-col h-screen bg-background-light">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-gray-600">Candidate: {user?.name}</p>
        </div>
        <div className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg">
          <span className="material-symbols-outlined text-3xl text-primary">timer</span>
          <div>
            <p className="text-sm text-gray-600 font-medium">Time Left:</p>
            <p className={`text-2xl font-bold tracking-wider ${timeLeft < 300 ? 'text-red-500' : 'text-gray-900'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 flex flex-col p-6 lg:p-8 overflow-y-auto">
          {/* Question Card */}
          <div className="flex-1 bg-white rounded-lg shadow p-6 lg:p-8">
            <div className="mb-6">
              <span className="inline-block bg-gray-100 text-gray-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
              <span className="ml-4 inline-block bg-blue-100 text-primary text-sm font-semibold px-4 py-1.5 rounded-full">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
              </span>
            </div>

            <h2 className="text-lg font-semibold mb-6 text-gray-900">{currentQuestion.questionText}</h2>

            {/* Multiple Choice / True False */}
            {(currentQuestion.type === 'MULTIPLE_CHOICE' || currentQuestion.type === 'TRUE_FALSE') && (
              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                      currentAnswer?.selectedOptionId === option.id 
                        ? 'border-primary bg-blue-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      className="form-radio h-5 w-5 text-primary focus:ring-primary focus:ring-offset-0"
                      checked={currentAnswer?.selectedOptionId === option.id}
                      onChange={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    />
                    <span className="ml-4 text-base text-gray-900">{option.optionText}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Short Answer */}
            {currentQuestion.type === 'SHORT_ANSWER' && (
              <div>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows="6"
                  placeholder="Type your answer here..."
                  value={currentAnswer?.textAnswer || ''}
                  onChange={(e) => handleTextAnswer(currentQuestion.id, e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSaveAndNext}
              disabled={submitting}
              className="bg-primary text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:bg-blue-800 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">save</span>
              {currentQuestionIndex < quiz.questions.length - 1 ? 'Save & Next' : 'Save'}
            </button>

            <button
              onClick={handleClearResponse}
              disabled={submitting}
              className="bg-white border border-gray-300 text-gray-700 font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
            >
              Clear Response
            </button>

            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="ml-auto bg-green-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </main>

        {/* Sidebar - Question Navigator */}
        <aside className="w-80 bg-white border-l border-gray-200 p-6 flex-shrink-0 flex flex-col overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Questions</h3>
          
          <div className="grid grid-cols-4 gap-3 mb-8">
            {quiz.questions.map((question, index) => {
              const status = getQuestionStatus(question);
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={question.id}
                  onClick={() => handleQuestionNavigation(index)}
                  disabled={submitting}
                  className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold shadow-sm ${getStatusColor(status)} ${
                    isCurrent ? 'ring-2 ring-offset-2 ring-primary' : ''
                  } disabled:opacity-50`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Progress Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Progress</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Answered:</span>
                <span className="font-semibold text-green-600">
                  {Object.values(answers).filter(a => a.selectedOptionId || a.textAnswer).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered:</span>
                <span className="font-semibold text-red-600">
                  {Object.values(answers).filter(a => a.visited && !a.selectedOptionId && !a.textAnswer).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Not Visited:</span>
                <span className="font-semibold text-yellow-600">
                  {Object.values(answers).filter(a => !a.visited).length}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-4">Legend</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-green-500 mr-3"></span>
                <span className="text-sm">Answered</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-red-500 mr-3"></span>
                <span className="text-sm">Unanswered</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 rounded-full bg-yellow-400 mr-3"></span>
                <span className="text-sm">Not Visited</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-3 flex items-center justify-center border-2 border-primary"></div>
                <span className="text-sm">Current Question</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuizTaking;
