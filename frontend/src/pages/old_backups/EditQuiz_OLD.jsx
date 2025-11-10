import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  
  // State management
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Quiz state
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    duration: 60,
    isActive: true
  });

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);

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
    fetchQuizData();
  }, [navigate, quizId]);

  // Fetch quiz data
  const fetchQuizData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/quizzes/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }

      const data = await response.json();
      
      setQuizData({
        title: data.title,
        description: data.description,
        duration: data.duration,
        isActive: data.isActive
      });

      // Transform questions and options to include client-side IDs
      const transformedQuestions = data.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        type: q.type,
        points: q.points,
        options: q.options.map(opt => ({
          id: opt.id,
          optionText: opt.optionText,
          isCorrect: opt.isCorrect
        })),
        isNew: false
      }));

      setQuestions(transformedQuestions);
      setOriginalQuestions(JSON.parse(JSON.stringify(transformedQuestions)));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Failed to load quiz. Please try again.');
      navigate('/admin');
    }
  };

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
        if (type === 'TRUE_FALSE') {
          return {
            ...q,
            type,
            options: [
              { id: `new_${Date.now()}_1`, optionText: 'True', isCorrect: false, isNew: true },
              { id: `new_${Date.now()}_2`, optionText: 'False', isCorrect: false, isNew: true }
            ]
          };
        }
        if (type === 'SHORT_ANSWER') {
          return { ...q, type, options: [] };
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
            { id: `new_${Date.now()}`, optionText: '', isCorrect: false, isNew: true }
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
      id: `new_${Date.now()}`,
      questionText: '',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      options: [
        { id: `new_${Date.now()}_1`, optionText: '', isCorrect: false, isNew: true },
        { id: `new_${Date.now()}_2`, optionText: '', isCorrect: false, isNew: true },
        { id: `new_${Date.now()}_3`, optionText: '', isCorrect: false, isNew: true }
      ],
      isNew: true
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  // Remove question
  const handleRemoveQuestion = (questionId) => {
    if (questions.length > 1) {
      const confirmDelete = window.confirm('Are you sure you want to delete this question?');
      if (confirmDelete) {
        setQuestions(prev => prev.filter(q => q.id !== questionId));
      }
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

  // Save quiz changes
  const handleSaveQuiz = async () => {
    if (!validateQuiz()) {
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');

      // Prepare quiz request - backend expects complete quiz data
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

      const response = await fetch(`http://localhost:8080/api/admin/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizRequest)
      });

      if (!response.ok) {
        throw new Error('Failed to update quiz');
      }

      alert('Quiz updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Failed to update quiz. Please try again.');
    } finally {
      setSaving(false);
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

  if (!user) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen w-full bg-background-light font-display">
      <div className="flex min-h-screen w-full">
        {/* Sidebar */}
        <aside className="flex flex-col w-64 p-4 bg-white border-r border-gray-200">
          <div className="flex flex-col gap-4 sticky top-4">
            <div className="flex gap-3 items-center px-3">
              <div className="bg-primary rounded-full size-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white">school</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[#111418] text-base font-medium leading-normal">Admin Panel</h1>
                <p className="text-[#617589] text-sm font-normal leading-normal">Technical Test</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2 mt-4">
              <a
                onClick={() => navigate('/admin')}
                className="flex items-center gap-3 px-3 py-2 text-[#617589] hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">dashboard</span>
                <p className="text-sm font-medium leading-normal">Dashboard</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary cursor-pointer">
                <span className="material-symbols-outlined text-2xl">quiz</span>
                <p className="text-sm font-medium leading-normal">Quizzes</p>
              </a>
              <a className="flex items-center gap-3 px-3 py-2 text-[#617589] hover:bg-gray-100 rounded-lg cursor-pointer">
                <span className="material-symbols-outlined text-2xl">settings</span>
                <p className="text-sm font-medium leading-normal">Settings</p>
              </a>
              <a
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-[#617589] hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-2xl">logout</span>
                <p className="text-sm font-medium leading-normal">Logout</p>
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="w-full max-w-4xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <a onClick={() => navigate('/admin')} className="text-[#617589] text-sm font-medium leading-normal hover:underline cursor-pointer">
                Quizzes
              </a>
              <span className="text-[#617589] text-sm font-medium leading-normal">/</span>
              <span className="text-[#617589] text-sm font-medium leading-normal">{quizData.title}</span>
              <span className="text-[#617589] text-sm font-medium leading-normal">/</span>
              <span className="text-[#111418] text-sm font-medium leading-normal">Edit</span>
            </div>

            {/* Page Heading */}
            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <h1 className="text-[#111418] text-3xl font-bold tracking-tight">Editing Quiz: {quizData.title}</h1>
              <button
                onClick={handleAddQuestion}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                Add New Question
              </button>
            </header>

            {/* Quiz Details Section */}
            <div className="bg-white rounded-xl border border-gray-200 mb-8 p-6">
              <h2 className="text-[#111418] text-xl font-bold mb-4">Quiz Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="flex flex-col">
                    <p className="text-[#111418] text-sm font-medium leading-normal pb-2">Quiz Title *</p>
                    <input
                      type="text"
                      className="form-input w-full rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] bg-white focus:border-primary placeholder:text-[#617589] p-3 text-base leading-normal"
                      value={quizData.title}
                      onChange={(e) => handleQuizChange('title', e.target.value)}
                    />
                  </label>
                </div>

                <div>
                  <label className="flex flex-col">
                    <p className="text-[#111418] text-sm font-medium leading-normal pb-2">Quiz Description *</p>
                    <textarea
                      className="form-textarea w-full resize-none rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] bg-white focus:border-primary min-h-24 placeholder:text-[#617589] p-3 text-base leading-normal"
                      value={quizData.description}
                      onChange={(e) => handleQuizChange('description', e.target.value)}
                      rows="3"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex flex-col">
                      <p className="text-[#111418] text-sm font-medium leading-normal pb-2">Duration (minutes) *</p>
                      <input
                        type="number"
                        className="form-input rounded-lg text-[#111418] focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] bg-white p-3"
                        value={quizData.duration}
                        onChange={(e) => handleQuizChange('duration', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="flex flex-col">
                      <p className="text-[#111418] text-sm font-medium leading-normal pb-2">Status</p>
                      <select
                        className="form-select rounded-lg text-[#111418] focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] bg-white p-3"
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
            <div className="flex flex-col gap-6 mb-8">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="bg-white p-6 border border-[#E0E6ED] rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-[#111418] text-lg font-bold">Question {qIndex + 1}</h2>
                    <button
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <span className="material-symbols-outlined text-2xl">delete</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Question Text */}
                    <label className="flex flex-col">
                      <p className="text-[#111418] text-sm font-medium leading-normal pb-2">Question Text</p>
                      <textarea
                        className="form-textarea w-full resize-none rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] bg-white focus:border-primary min-h-24 placeholder:text-[#617589] p-3 text-base leading-normal"
                        placeholder="Enter the question text..."
                        value={question.questionText}
                        onChange={(e) => handleQuestionTextChange(question.id, e.target.value)}
                      />
                    </label>

                    {/* Question Type and Points */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex flex-col">
                          <p className="text-[#111418] text-sm font-medium pb-2">Question Type</p>
                          <select
                            className="form-select rounded-lg border-[#dbe0e6] bg-white text-[#111418] focus:ring-primary/50 p-3"
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
                          <p className="text-[#111418] text-sm font-medium pb-2">Points</p>
                          <input
                            type="number"
                            className="form-input rounded-lg border-[#dbe0e6] bg-white text-[#111418] focus:ring-primary/50 p-3"
                            value={question.points}
                            onChange={(e) => handleQuestionPointsChange(question.id, e.target.value)}
                            min="1"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Options */}
                    {question.type !== 'SHORT_ANSWER' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {question.options.map((option) => (
                          <div key={option.id} className="flex items-center gap-3">
                            <input
                              type="radio"
                              className="form-radio h-5 w-5 text-primary focus:ring-primary/50 border-gray-300"
                              name={`correct_answer_${question.id}`}
                              checked={option.isCorrect}
                              onChange={() => handleCorrectAnswerChange(question.id, option.id)}
                            />
                            <input
                              type="text"
                              className="form-input flex-1 rounded-lg text-[#111418] focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dbe0e6] bg-white focus:border-primary placeholder:text-[#617589] p-3 text-base leading-normal"
                              placeholder={`Option ${String.fromCharCode(65 + question.options.indexOf(option))}`}
                              value={option.optionText}
                              onChange={(e) => handleOptionTextChange(question.id, option.id, e.target.value)}
                              disabled={question.type === 'TRUE_FALSE'}
                            />
                            {question.type !== 'TRUE_FALSE' && question.options.length > 2 && (
                              <button
                                onClick={() => handleRemoveOption(question.id, option.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <span className="material-symbols-outlined">close</span>
                              </button>
                            )}
                          </div>
                        ))}

                        {question.type === 'MULTIPLE_CHOICE' && (
                          <button
                            onClick={() => handleAddOption(question.id)}
                            className="col-span-2 flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary hover:text-primary/80"
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

              {/* Add New Question Placeholder */}
              <div className="bg-white p-6 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                <button
                  onClick={handleAddQuestion}
                  className="flex flex-col items-center gap-2 text-[#617589] hover:text-primary"
                >
                  <span className="material-symbols-outlined text-4xl">add_box</span>
                  <span className="text-sm font-semibold">Add New Question</span>
                </button>
              </div>
            </div>

            {/* Global Actions */}
            <footer className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={handleCancel}
                className="px-6 py-3 text-base font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuiz}
                className="flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                <span className="material-symbols-outlined text-xl">save</span>
                {saving ? 'Saving...' : 'Save Quiz Changes'}
              </button>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditQuiz;
