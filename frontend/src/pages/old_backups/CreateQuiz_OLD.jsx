import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateQuiz = () => {
  const navigate = useNavigate();
  
  // State management
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Quiz state
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    duration: 60,
    isActive: true
  });

  // Questions state
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      questionText: '',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      options: [
        { id: Date.now() + 1, optionText: '', isCorrect: false },
        { id: Date.now() + 2, optionText: '', isCorrect: false },
        { id: Date.now() + 3, optionText: '', isCorrect: false }
      ]
    }
  ]);

  // Check authentication on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  // Handle quiz field changes
  const handleQuizChange = (field, value) => {
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle question text change
  const handleQuestionTextChange = (questionId, value) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, questionText: value } : q
    ));
  };

  // Handle question type change
  const handleQuestionTypeChange = (questionId, type) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        // If changing to TRUE_FALSE, create default options
        if (type === 'TRUE_FALSE') {
          return {
            ...q,
            type,
            options: [
              { id: Date.now() + 1, optionText: 'True', isCorrect: false },
              { id: Date.now() + 2, optionText: 'False', isCorrect: false }
            ]
          };
        }
        // If changing to SHORT_ANSWER, clear options
        if (type === 'SHORT_ANSWER') {
          return {
            ...q,
            type,
            options: []
          };
        }
        return { ...q, type };
      }
      return q;
    }));
  };

  // Handle question points change
  const handleQuestionPointsChange = (questionId, points) => {
    setQuestions(prev => prev.map(q =>
      q.id === questionId ? { ...q, points: parseInt(points) || 1 } : q
    ));
  };

  // Handle option text change
  const handleOptionTextChange = (questionId, optionId, value) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(opt =>
            opt.id === optionId ? { ...opt, optionText: value } : opt
          )
        };
      }
      return q;
    }));
  };

  // Handle correct answer selection
  const handleCorrectAnswerChange = (questionId, optionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(opt =>
            opt.id === optionId 
              ? { ...opt, isCorrect: true }
              : { ...opt, isCorrect: false }
          )
        };
      }
      return q;
    }));
  };

  // Add new option to question
  const handleAddOption = (questionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: [
            ...q.options,
            { id: Date.now(), optionText: '', isCorrect: false }
          ]
        };
      }
      return q;
    }));
  };

  // Remove option from question
  const handleRemoveOption = (questionId, optionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        return {
          ...q,
          options: q.options.filter(opt => opt.id !== optionId)
        };
      }
      return q;
    }));
  };

  // Add new question
  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      questionText: '',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      options: [
        { id: Date.now() + 1, optionText: '', isCorrect: false },
        { id: Date.now() + 2, optionText: '', isCorrect: false },
        { id: Date.now() + 3, optionText: '', isCorrect: false }
      ]
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  // Remove question
  const handleRemoveQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
    } else {
      alert('Quiz must have at least one question');
    }
  };

  // Validate quiz data
  const validateQuiz = () => {
    if (!quizData.title.trim()) {
      alert('Please enter a quiz title');
      return false;
    }

    if (!quizData.description.trim()) {
      alert('Please enter a quiz description');
      return false;
    }

    if (quizData.duration < 1) {
      alert('Duration must be at least 1 minute');
      return false;
    }

    if (questions.length === 0) {
      alert('Quiz must have at least one question');
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      if (!question.questionText.trim()) {
        alert(`Question ${i + 1} is empty`);
        return false;
      }

      if (question.type !== 'SHORT_ANSWER') {
        if (question.options.length < 2) {
          alert(`Question ${i + 1} must have at least 2 options`);
          return false;
        }

        const hasEmptyOption = question.options.some(opt => !opt.optionText.trim());
        if (hasEmptyOption) {
          alert(`Question ${i + 1} has empty options`);
          return false;
        }

        const hasCorrectAnswer = question.options.some(opt => opt.isCorrect);
        if (!hasCorrectAnswer) {
          alert(`Question ${i + 1} must have a correct answer marked`);
          return false;
        }
      }
    }

    return true;
  };

  // Save quiz
  const handleSaveQuiz = async () => {
    if (!validateQuiz()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Prepare quiz request
      const quizRequest = {
        title: quizData.title.trim(),
        description: quizData.description.trim(),
        duration: quizData.duration,
        isActive: quizData.isActive,
        questions: questions.map(q => ({
          questionText: q.questionText.trim(),
          type: q.type,
          points: q.points,
          options: q.type !== 'SHORT_ANSWER' ? q.options.map(opt => ({
            optionText: opt.optionText.trim(),
            isCorrect: opt.isCorrect
          })) : []
        }))
      };

      const response = await fetch('http://localhost:8080/api/admin/quizzes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }

      const result = await response.json();
      alert('Quiz created successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.');
    if (confirmCancel) {
      navigate('/admin');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light font-display">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="flex flex-col border-r border-slate-200 bg-white w-64 p-4 shrink-0">
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="bg-primary rounded-full size-10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">school</span>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-slate-900 text-base font-semibold leading-normal">Admin Panel</h1>
                  <p className="text-slate-500 text-sm font-normal leading-normal">Quiz Platform</p>
                </div>
              </div>

              <nav className="flex flex-col gap-2 pt-4">
                <a
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">dashboard</span>
                  <span className="text-sm font-medium leading-normal">Dashboard</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary text-white cursor-pointer">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>quiz</span>
                  <span className="text-sm font-semibold leading-normal">Quiz Management</span>
                </a>
                <a className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">bar_chart</span>
                  <span className="text-sm font-medium leading-normal">Reports</span>
                </a>
              </nav>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
              <a className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors cursor-pointer">
                <span className="material-symbols-outlined">settings</span>
                <span className="text-sm font-medium leading-normal">Settings</span>
              </a>
              <a
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="text-sm font-medium leading-normal">Logout</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-between gap-3 pb-6">
              <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-[-0.033em]">Create New Quiz</h1>
            </div>

            {/* Quiz Details Section */}
            <div className="bg-white rounded-xl border border-slate-200 mb-8">
              <h2 className="text-slate-900 text-[22px] font-bold leading-tight tracking-[-0.015em] px-6 pt-6 pb-2">
                Quiz Details
              </h2>
              <div className="p-6 grid grid-cols-1 gap-6">
                <div>
                  <label className="flex flex-col">
                    <p className="text-slate-800 text-base font-medium leading-normal pb-2">Quiz Title *</p>
                    <input
                      type="text"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white h-14 placeholder:text-slate-400 p-[15px] text-base font-normal leading-normal"
                      placeholder="Enter the title for the quiz"
                      value={quizData.title}
                      onChange={(e) => handleQuizChange('title', e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <label className="flex flex-col">
                    <p className="text-slate-800 text-base font-medium leading-normal pb-2">Quiz Description *</p>
                    <textarea
                      className="form-textarea w-full min-h-32 resize-y rounded-lg border border-slate-300 bg-white p-4 text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50"
                      placeholder="Provide a detailed description of the quiz..."
                      value={quizData.description}
                      onChange={(e) => handleQuizChange('description', e.target.value)}
                      rows="4"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex flex-col">
                      <p className="text-slate-800 text-base font-medium leading-normal pb-2">Duration (minutes) *</p>
                      <input
                        type="number"
                        className="form-input rounded-lg text-slate-900 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white h-14 p-[15px]"
                        placeholder="60"
                        value={quizData.duration}
                        onChange={(e) => handleQuizChange('duration', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex flex-col">
                      <p className="text-slate-800 text-base font-medium leading-normal pb-2">Status</p>
                      <select
                        className="form-select rounded-lg text-slate-900 focus:ring-2 focus:ring-primary/50 border border-slate-300 bg-white h-14 p-[15px]"
                        value={quizData.isActive}
                        onChange={(e) => handleQuizChange('isActive', e.target.value === 'true')}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="bg-white rounded-xl border border-slate-200 mb-8">
              <h2 className="text-slate-900 text-[22px] font-bold leading-tight tracking-[-0.015em] px-6 pt-6 pb-2">
                Questions
              </h2>
              <div className="p-6 flex flex-col gap-6">
                {questions.map((question, qIndex) => (
                  <div key={question.id} className="border border-slate-200 rounded-lg">
                    {/* Question Header */}
                    <div className="p-4 flex justify-between items-center border-b border-slate-200 bg-slate-50">
                      <p className="font-bold text-slate-800">Question {qIndex + 1}</p>
                      <div className="flex items-center gap-2">
                        {questions.length > 1 && (
                          <button
                            onClick={() => handleRemoveQuestion(question.id)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Question Body */}
                    <div className="p-4 space-y-4">
                      {/* Question Text */}
                      <textarea
                        className="form-textarea w-full rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-primary/50 focus:border-primary"
                        placeholder="Enter the question text here..."
                        rows="3"
                        value={question.questionText}
                        onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                      />

                      {/* Question Type and Points */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="flex flex-col">
                            <p className="text-slate-700 text-sm font-medium pb-2">Question Type</p>
                            <select
                              className="form-select rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-primary/50"
                              value={question.type}
                              onChange={(e) => handleQuestionTypeChange(question.id, e.target.value)}
                            >
                              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                              <option value="TRUE_FALSE">True/False</option>
                              <option value="SHORT_ANSWER">Short Answer</option>
                            </select>
                          </label>
                        </div>

                        <div>
                          <label className="flex flex-col">
                            <p className="text-slate-700 text-sm font-medium pb-2">Points</p>
                            <input
                              type="number"
                              className="form-input rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-primary/50"
                              value={question.points}
                              onChange={(e) => handleQuestionPointsChange(question.id, e.target.value)}
                              min="1"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Options (for MULTIPLE_CHOICE and TRUE_FALSE) */}
                      {question.type !== 'SHORT_ANSWER' && (
                        <div className="flex flex-col gap-3">
                          <p className="text-slate-700 text-sm font-medium">Options (select the correct answer)</p>
                          {question.options.map((option) => (
                            <div key={option.id} className="flex items-center gap-3">
                              <input
                                type="radio"
                                className="form-radio text-primary focus:ring-primary/50"
                                name={`q${question.id}_correct`}
                                checked={option.isCorrect}
                                onChange={() => handleCorrectAnswerChange(question.id, option.id)}
                              />
                              <input
                                type="text"
                                className="form-input flex-1 rounded-lg border-slate-300 bg-white text-slate-900 focus:ring-primary/50 focus:border-primary"
                                placeholder={`Option ${String.fromCharCode(65 + question.options.indexOf(option))}`}
                                value={option.optionText}
                                onChange={(e) => handleOptionTextChange(question.id, option.id, e.target.value)}
                                disabled={question.type === 'TRUE_FALSE'}
                              />
                              {question.type !== 'TRUE_FALSE' && question.options.length > 2 && (
                                <button
                                  onClick={() => handleRemoveOption(question.id, option.id)}
                                  className="p-2 text-slate-500 hover:text-red-500"
                                >
                                  <span className="material-symbols-outlined text-xl">remove_circle_outline</span>
                                </button>
                              )}
                            </div>
                          ))}

                          {question.type === 'MULTIPLE_CHOICE' && (
                            <button
                              onClick={() => handleAddOption(question.id)}
                              className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                            >
                              <span className="material-symbols-outlined text-xl">add_circle_outline</span>
                              Add Option
                            </button>
                          )}
                        </div>
                      )}

                      {question.type === 'SHORT_ANSWER' && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <span className="material-symbols-outlined text-base align-middle mr-1">info</span>
                            Short answer questions will be manually graded by the admin.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Question Button */}
                <button
                  onClick={handleAddQuestion}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-primary hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">add</span>
                  <span className="font-semibold">Add Question</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pb-8">
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg text-slate-800 bg-slate-200/60 hover:bg-slate-200 font-semibold"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuiz}
                className="px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Quiz'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateQuiz;
