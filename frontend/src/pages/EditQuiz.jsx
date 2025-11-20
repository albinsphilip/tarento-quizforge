import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { quizAPI } from '../utils/api';
import QuizForm from '../components/QuizForm';
import LoadingSpinner from '../components/LoadingSpinner';

const EditQuiz = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(true);
  const [hasAttempts, setHasAttempts] = useState(false);

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
        const data = await quizAPI.getQuiz(quizId);
        
        // Check if quiz is editable (no attempts)
        const editable = await quizAPI.isQuizEditable(quizId);
        setIsEditable(editable);
        setHasAttempts(!editable);
        
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
      // Build payload based on whether quiz has attempts
      let payload;
      
      if (hasAttempts) {
        // Only send metadata - no questions/options
        const confirmMsg = 
          '⚠️ This quiz has already been attempted by candidates.\n\n' +
          'You can only update:\n' +
          '• Title\n' +
          '• Description\n' +
          '• Duration\n' +
          '• Active Status\n\n' +
          'Do you want to continue?';
        
        if (!confirm(confirmMsg)) {
          return;
        }
        
        // Metadata-only payload (no questions)
        payload = {
          title: data.title,
          description: data.description,
          duration: data.duration,
          isActive: data.isActive,
          questions: initialData.questions.map(q => ({
            id: q.id,
            questionText: q.questionText,
            type: q.type,
            points: q.points,
            options: q.options.map(o => ({
              id: o.id,
              optionText: o.optionText,
              isCorrect: o.isCorrect
            }))
          }))
        };
      } else {
        // Full payload with questions/options
        payload = {
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
      }

      await quizAPI.updateQuiz(quizId, payload);
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
            <p className="text-sm text-slate-600 mt-1">
              {hasAttempts 
                ? '⚠️ Quiz has attempts - only metadata can be updated' 
                : 'Update quiz details and questions'
              }
            </p>
          </div>
        </div>
      </header>
      
      {hasAttempts && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-amber-600">warning</span>
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Limited Editing Mode</h3>
                <p className="text-sm text-amber-800">
                  This quiz has already been attempted by candidates. You can only update the 
                  <strong> title, description, duration, and active status</strong>. 
                  Questions and options cannot be modified to preserve data integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <QuizForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          submitLabel="Update Quiz"
          disabled={hasAttempts}
        />
      </main>
    </div>
  );
};

export default EditQuiz;
