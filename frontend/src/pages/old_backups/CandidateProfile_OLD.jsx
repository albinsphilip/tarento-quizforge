import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'CANDIDATE') {
      navigate('/');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light font-display text-slate-800 antialiased">
      {/* Header */}
      <header className="bg-white backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/candidate')}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              <span className="material-icons-outlined text-xl">arrow_back</span>
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              <span className="material-icons-outlined text-xl">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
              Candidate Profile
            </h1>

            {/* Profile Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 divide-y divide-slate-200 mb-8">
              {/* Name */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-6 items-center">
                <h2 className="text-sm font-medium text-slate-500">Name</h2>
                <p className="md:col-span-2 text-base text-slate-900">{user.name || 'N/A'}</p>
              </div>

              {/* Candidate ID */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-6 items-center">
                <h2 className="text-sm font-medium text-slate-500">Candidate ID</h2>
                <p className="md:col-span-2 text-base text-slate-900">{user.id || 'N/A'}</p>
              </div>

              {/* Email */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-6 items-center">
                <h2 className="text-sm font-medium text-slate-500">Email</h2>
                <p className="md:col-span-2 text-base text-slate-900">{user.email || 'N/A'}</p>
              </div>

              {/* Role */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-6 items-center">
                <h2 className="text-sm font-medium text-slate-500">Role</h2>
                <p className="md:col-span-2 text-base text-slate-900">Candidate</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
              <button
                onClick={() => navigate('/candidate')}
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm text-slate-500">
            © 2025 QuizForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CandidateProfile;
