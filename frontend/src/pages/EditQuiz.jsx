import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizForm from '../components/QuizForm';

const EditQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData || JSON.parse(userData).role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchQuiz();
  }, [navigate, quizId]);

  const fetchQuiz = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/quizzes/${quizId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch quiz');

      const data = await response.json();
      setInitialData({
        quizData: { title: data.title, description: data.description, duration: data.duration, isActive: data.isActive },
        questions: data.questions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          type: q.type,
          points: q.points,
          options: q.options.map(o => ({ id: o.id, optionText: o.optionText, isCorrect: o.isCorrect })),
          isNew: false
        }))
      });
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load quiz');
      navigate('/admin');
    }
  };

  const handleSubmit = async (data) => {
    const token = localStorage.getItem('token');
    const payload = {
      title: data.title,
      description: data.description,
      duration: data.duration,
      isActive: data.isActive,
      questions: data.questions.map(q => ({
        id: q.isNew ? null : q.id,
        questionText: q.questionText,
        type: q.type,
        points: q.points,
        options: q.options.map(o => ({
          id: o.id > 1000000000000 ? null : o.id,
          optionText: o.optionText,
          isCorrect: o.isCorrect
        }))
      }))
    };

    const response = await fetch(`http://localhost:8080/api/admin/quizzes/${quizId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert('Quiz updated successfully!');
      navigate('/admin');
    } else {
      alert('Failed to update quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Edit Quiz</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <QuizForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Quiz" />
      </main>
    </div>
  );
};

export default EditQuiz;
