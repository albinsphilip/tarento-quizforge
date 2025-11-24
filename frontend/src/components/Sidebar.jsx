import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logoSvg from '../assets/Quizforge-nobg.svg';

const Sidebar = ({ role, currentPath, userName }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close sidebar on mobile after navigation
  };

  const adminItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin' },
    { icon: 'analytics', label: 'Analytics', path: '/admin/analytics' }
  ];

  const candidateItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/candidate' },
    { icon: 'person', label: 'Profile', path: '/candidate/profile' },
    {icon:'history', label:'Attempts', path:'/candidate/history'}
  ];

  const menuItems = role === 'ADMIN' ? adminItems : candidateItems;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-gray-700">menu</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg lg:shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Logo */}
      <div className="px-6 pt-4 pb-4 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center flex-1">
            <img 
              src={logoSvg} 
              alt="QuizForge Logo" 
              className="scale-75"
            />
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
            {userName?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userName?.split(" ")[0]}</p>
            <p className="text-xs text-gray-500">{role === 'ADMIN' ? 'Administrator' : 'Candidate'}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Logout</span>
        </button>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
