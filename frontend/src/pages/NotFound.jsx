import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user?.role;

  const handleGoBack = () => {
    if (role === 'ADMIN') {
      navigate('/admin');
    } else if (role === 'CANDIDATE') {
      navigate('/candidate');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-indigo-600">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mt-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mt-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
