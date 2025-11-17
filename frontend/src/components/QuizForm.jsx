import { useState } from 'react';

const QuizForm = ({ initialData, onSubmit, submitLabel }) => {
  const [quizData, setQuizData] = useState(initialData.quizData);
  const [questions, setQuestions] = useState(initialData.questions);
  const [loading, setLoading] = useState(false);

  const updateQuiz = (field, value) => setQuizData(prev => ({ ...prev, [field]: value }));
  
  const updateQuestion = (id, field, value) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const updateOption = (qId, optId, field, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === qId ? { ...q, options: q.options.map(o => o.id === optId ? { ...o, [field]: value } : o) } : q
    ));
  };

  const changeQuestionType = (id, type) => {
    const opts = type === 'TRUE_FALSE' 
      ? [{ id: Date.now() + 1, optionText: 'True', isCorrect: false }, { id: Date.now() + 2, optionText: 'False', isCorrect: false }]
      : type === 'SHORT_ANSWER' ? [] : [{ id: Date.now(), optionText: '', isCorrect: false }];
    updateQuestion(id, 'type', type);
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, options: opts } : q));
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: Date.now(),
      questionText: '',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      options: [{ id: Date.now() + 1, optionText: '', isCorrect: false }]
    }]);
  };

  const removeQuestion = (id) => setQuestions(prev => prev.filter(q => q.id !== id));
  
  const addOption = (qId) => {
    setQuestions(prev => prev.map(q => 
      q.id === qId ? { ...q, options: [...q.options, { id: Date.now(), optionText: '', isCorrect: false }] } : q
    ));
  };

  const removeOption = (qId, optId) => {
    setQuestions(prev => prev.map(q => 
      q.id === qId ? { ...q, options: q.options.filter(o => o.id !== optId) } : q
    ));
  };

  const setCorrect = (qId, optId) => {
    setQuestions(prev => prev.map(q => 
      q.id === qId ? { ...q, options: q.options.map(o => ({ ...o, isCorrect: o.id === optId })) } : q
    ));
  };

  const validate = () => {
    if (!quizData.title.trim()) return 'Quiz title is required';
    if (quizData.duration < 1) return 'Duration must be at least 1 minute';
    if (questions.length === 0) return 'At least one question is required';
    
    for (let q of questions) {
      if (!q.questionText.trim()) return 'All questions must have text';
      if (q.type !== 'SHORT_ANSWER') {
        if (q.options.length === 0) return 'All MCQ/True-False questions need options';
        if (!q.options.some(o => o.optionText.trim())) return 'All options must have text';
        if (!q.options.some(o => o.isCorrect)) return 'Each question must have a correct answer';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return alert(error);
    
    setLoading(true);
    try {
      await onSubmit({ ...quizData, questions });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quiz Details */}
      <div className="card animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-600">info</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Details</h2>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quiz Title <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={quizData.title} 
              onChange={(e) => updateQuiz('title', e.target.value)} 
              className="input-field" 
              placeholder="e.g., JavaScript Fundamentals Quiz"
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea 
              value={quizData.description} 
              onChange={(e) => updateQuiz('description', e.target.value)} 
              className="input-field resize-none" 
              rows="3"
              placeholder="Provide a brief description of the quiz..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={quizData.duration} 
                onChange={(e) => updateQuiz('duration', parseInt(e.target.value) || 1)} 
                className="input-field" 
                min="1" 
                max="180"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                <input 
                  type="checkbox" 
                  checked={quizData.isActive} 
                  onChange={(e) => updateQuiz('isActive', e.target.checked)} 
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
                />
                <span className="text-sm font-medium text-gray-700">Make this quiz active</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 animate-slide-up">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600">quiz</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Questions</h2>
          </div>
          <button 
            type="button" 
            onClick={addQuestion} 
            className="btn-primary flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add Question
          </button>
        </div>
        
        {questions.map((q, idx) => (
          <div key={q.id} className="card border-l-4 border-l-blue-500">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="badge badge-info">Q{idx + 1}</span>
                <h3 className="text-lg font-bold text-gray-900">Question {idx + 1}</h3>
              </div>
              {questions.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeQuestion(q.id)} 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Question"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              )}
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question Text <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={q.questionText} 
                  onChange={(e) => updateQuestion(q.id, 'questionText', e.target.value)} 
                  className="input-field" 
                  placeholder="Enter your question here..."
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Question Type</label>
                  <select 
                    value={q.type} 
                    onChange={(e) => changeQuestionType(q.id, e.target.value)} 
                    className="input-field"
                  >
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="TRUE_FALSE">True/False</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Points</label>
                  <input 
                    type="number" 
                    value={q.points} 
                    onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value) || 1)} 
                    className="input-field" 
                    min="1" 
                    max="10"
                  />
                </div>
              </div>

              {/* Options */}
              {q.type !== 'SHORT_ANSWER' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Answer Options <span className="text-xs text-gray-500">(Select the correct answer)</span>
                  </label>
                  <div className="space-y-3">
                    {q.options.map((opt, optIdx) => (
                      <div key={opt.id} className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${opt.isCorrect ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-blue-300'}`}>
                        <input 
                          type="radio" 
                          checked={opt.isCorrect} 
                          onChange={() => setCorrect(q.id, opt.id)} 
                          name={`correct-${q.id}`}
                          className="w-5 h-5 text-green-600 focus:ring-green-500"
                        />
                        <input 
                          type="text" 
                          value={opt.optionText} 
                          onChange={(e) => updateOption(q.id, opt.id, 'optionText', e.target.value)} 
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                        />
                        {q.type !== 'TRUE_FALSE' && q.options.length > 2 && (
                          <button 
                            type="button" 
                            onClick={() => removeOption(q.id, opt.id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove Option"
                          >
                            <span className="material-symbols-outlined text-xl">close</span>
                          </button>
                        )}
                      </div>
                    ))}
                    {q.type === 'MULTIPLE_CHOICE' && (
                      <button 
                        type="button" 
                        onClick={() => addOption(q.id)} 
                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined">add</span>
                        Add Option
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex gap-4 sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200 -mx-6 px-6 -mb-6">
        <button 
          type="submit" 
          disabled={loading} 
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
              Saving...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">save</span>
              {submitLabel}
            </>
          )}
        </button>
        <button 
          type="button" 
          onClick={() => window.history.back()} 
          className="btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default QuizForm;
