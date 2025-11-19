import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import QuizForm from '../components/QuizForm';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData || JSON.parse(userData).role !== 'ADMIN') {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const initialData = {
    quizData: { title: '', description: '', duration: 60, isActive: true },
    questions: [{
      id: Date.now(),
      questionText: '',
      type: 'MULTIPLE_CHOICE',
      points: 1,
      options: [{ id: Date.now() + 1, optionText: '', isCorrect: false }]
    }]
  };

  const handleSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        duration: data.duration,
        isActive: data.isActive,
        questions: data.questions.map(q => ({
          questionText: q.questionText,
          type: q.type,
          points: q.points,
          options: q.options.map(o => ({ optionText: o.optionText, isCorrect: o.isCorrect }))
        }))
      };

      await adminAPI.createQuiz(payload);
      alert('✅ Quiz created successfully!');
      navigate('/admin');
    } catch (error) {
      alert('❌ Failed to create quiz: ' + error.message);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin')} 
            className="text-gray-600 hover:text-gray-900"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Create New Quiz</h1>
            <p className="text-sm text-gray-600 mt-0.5">Design and configure your quiz</p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-6">
        <QuizForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Create Quiz" />
      </main>
    </div>
  );
};

export default CreateQuiz;
