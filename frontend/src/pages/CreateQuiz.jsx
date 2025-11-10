import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const token = localStorage.getItem('token');
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

    const response = await fetch('http://localhost:8080/api/admin/quizzes', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Quiz created successfully!');
      navigate('/admin');
    } else {
      alert('Failed to create quiz');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Create New Quiz</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <QuizForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Create Quiz" />
      </main>
    </div>
  );
};

export default CreateQuiz;
