import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData || JSON.parse(userData).role !== 'CANDIDATE') {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    if (confirm('Logout?')) {
      localStorage.clear();
      navigate('/');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/candidate')} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Dashboard
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Candidate Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border divide-y">
          <div className="p-6 grid grid-cols-3 gap-6">
            <span className="text-sm font-medium text-gray-500">Name</span>
            <span className="col-span-2 text-gray-900">{user.name || 'N/A'}</span>
          </div>
          <div className="p-6 grid grid-cols-3 gap-6">
            <span className="text-sm font-medium text-gray-500">Email</span>
            <span className="col-span-2 text-gray-900">{user.email || 'N/A'}</span>
          </div>
          <div className="p-6 grid grid-cols-3 gap-6">
            <span className="text-sm font-medium text-gray-500">Role</span>
            <span className="col-span-2 text-gray-900">Candidate</span>
          </div>
        </div>

        <button onClick={() => navigate('/candidate')} className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
          Back to Dashboard
        </button>
      </main>
    </div>
  );
};

export default CandidateProfile;
