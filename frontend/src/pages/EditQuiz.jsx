import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import QuizForm from '../components/QuizForm';
import LoadingSpinner from '../components/LoadingSpinner';

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
      const data = await adminAPI.getQuiz(quizId);
      
      setInitialData({
        quizData: { 
          title: data.title, 
          description: data.description, 
          duration: data.duration, 
          isActive: data.isActive 
        },
        questions: data.questions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          type: q.type,
          points: q.points,
          options: q.options.map(o => ({ 
            id: o.id, 
            optionText: o.optionText, 
            isCorrect: o.isCorrect 
          })),
          isNew: false
        }))
      });
      setLoading(false);
    } catch (error) {
      alert('Failed to load quiz: ' + error.message);
      navigate('/admin');
    }
  };

  const handleSubmit = async (data) => {
    try {
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

      await adminAPI.updateQuiz(quizId, payload);
      alert('✅ Quiz updated successfully!');
      navigate('/admin');
    } catch (error) {
      alert('❌ Failed to update quiz: ' + error.message);
    }
  };

  if (loading) return <LoadingSpinner message="Loading quiz..." />;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin')} 
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Edit Quiz</h1>
            <p className="text-sm text-slate-600 mt-1">Update quiz details and questions</p>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <QuizForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Update Quiz" />
      </main>
    </div>
  );
};

export default EditQuiz;
