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
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold mb-4">Quiz Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input type="text" value={quizData.title} onChange={(e) => updateQuiz('title', e.target.value)} className="w-full px-3 py-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={quizData.description} onChange={(e) => updateQuiz('description', e.target.value)} className="w-full px-3 py-2 border rounded" rows="3" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes) *</label>
              <input type="number" value={quizData.duration} onChange={(e) => updateQuiz('duration', parseInt(e.target.value))} className="w-full px-3 py-2 border rounded" min="1" required />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={quizData.isActive} onChange={(e) => updateQuiz('isActive', e.target.checked)} className="rounded" />
                <span className="text-sm font-medium">Active</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Questions</h2>
          <button type="button" onClick={addQuestion} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">+ Add Question</button>
        </div>
        
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Question {idx + 1}</h3>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(q.id)} className="text-red-600 hover:text-red-800">Remove</button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Question Text *</label>
                <input type="text" value={q.questionText} onChange={(e) => updateQuestion(q.id, 'questionText', e.target.value)} className="w-full px-3 py-2 border rounded" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={q.type} onChange={(e) => changeQuestionType(q.id, e.target.value)} className="w-full px-3 py-2 border rounded">
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="TRUE_FALSE">True/False</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Points</label>
                  <input type="number" value={q.points} onChange={(e) => updateQuestion(q.id, 'points', parseInt(e.target.value) || 1)} className="w-full px-3 py-2 border rounded" min="1" />
                </div>
              </div>

              {/* Options */}
              {q.type !== 'SHORT_ANSWER' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Options</label>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <input type="radio" checked={opt.isCorrect} onChange={() => setCorrect(q.id, opt.id)} name={`correct-${q.id}`} />
                        <input type="text" value={opt.optionText} onChange={(e) => updateOption(q.id, opt.id, 'optionText', e.target.value)} className="flex-1 px-3 py-2 border rounded" placeholder="Option text" />
                        {q.type !== 'TRUE_FALSE' && q.options.length > 2 && (
                          <button type="button" onClick={() => removeOption(q.id, opt.id)} className="text-red-600 hover:text-red-800">×</button>
                        )}
                      </div>
                    ))}
                    {q.type === 'MULTIPLE_CHOICE' && (
                      <button type="button" onClick={() => addOption(q.id)} className="text-blue-600 hover:text-blue-800 text-sm">+ Add Option</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={() => window.history.back()} className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
      </div>
    </form>
  );
};

export default QuizForm;
